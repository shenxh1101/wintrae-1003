import { create } from 'zustand';
import Taro from '@tarojs/taro';
import { Farmer, IndustryProject, EventItem, Publication } from '@/types';
import { farmerList } from '@/data/farmers';
import { industryList } from '@/data/industries';
import { eventList } from '@/data/events';
import { publicationList } from '@/data/publications';

const STORAGE_KEY = 'digital_village_store_v1';

interface AppState {
  farmers: Farmer[];
  industries: IndustryProject[];
  events: EventItem[];
  publications: Publication[];
  initialized: boolean;

  initFromStorage: () => void;
  persist: () => void;

  addFarmer: (farmer: Omit<Farmer, 'id'>) => void;
  updateFarmer: (id: string, farmer: Partial<Farmer>) => void;
  deleteFarmer: (id: string) => void;
  getFarmer: (id: string) => Farmer | undefined;

  addIndustry: (industry: Omit<IndustryProject, 'id'>) => void;
  updateIndustry: (id: string, industry: Partial<IndustryProject>) => void;
  deleteIndustry: (id: string) => void;
  getIndustry: (id: string) => IndustryProject | undefined;

  addEvent: (event: Omit<EventItem, 'id'>) => void;
  updateEvent: (id: string, event: Partial<EventItem>) => void;
  addEventProgress: (eventId: string, progress: Omit<EventItem['progress'][0], 'id'>) => void;
  dispatchEvent: (eventId: string, assignee: string) => void;
  completeEvent: (eventId: string, content?: string) => void;
  getEvent: (id: string) => EventItem | undefined;

  addPublication: (publication: Omit<Publication, 'id'>) => void;
  updatePublication: (id: string, publication: Partial<Publication>) => void;
  deletePublication: (id: string) => void;
  getPublication: (id: string) => Publication | undefined;
}

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

const now = () => {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const useAppStore = create<AppState>((set, get) => ({
  farmers: [],
  industries: [],
  events: [],
  publications: [],
  initialized: false,

  initFromStorage: () => {
    try {
      const raw = Taro.getStorageSync(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        set({
          farmers: parsed.farmers || [],
          industries: parsed.industries || [],
          events: parsed.events || [],
          publications: parsed.publications || [],
          initialized: true
        });
      } else {
        set({
          farmers: [...farmerList],
          industries: [...industryList],
          events: [...eventList],
          publications: [...publicationList],
          initialized: true
        });
        get().persist();
      }
    } catch (e) {
      console.error('initFromStorage error', e);
      set({
        farmers: [...farmerList],
        industries: [...industryList],
        events: [...eventList],
        publications: [...publicationList],
        initialized: true
      });
    }
  },

  persist: () => {
    try {
      const { farmers, industries, events, publications } = get();
      Taro.setStorageSync(STORAGE_KEY, JSON.stringify({
        farmers, industries, events, publications
      }));
    } catch (e) {
      console.error('persist error', e);
    }
  },

  addFarmer: (farmer) => {
    const id = generateId();
    const newFarmer: Farmer = {
      ...farmer,
      id,
      avatar: farmer.avatar || `https://picsum.photos/id/${64 + Math.floor(Math.random() * 100)}/200/200`
    } as Farmer;
    set((s) => ({ farmers: [newFarmer, ...s.farmers] }));
    get().persist();
  },

  updateFarmer: (id, farmer) => {
    set((s) => ({
      farmers: s.farmers.map((f) => (f.id === id ? { ...f, ...farmer } : f))
    }));
    get().persist();
  },

  deleteFarmer: (id) => {
    set((s) => ({ farmers: s.farmers.filter((f) => f.id !== id) }));
    get().persist();
  },

  getFarmer: (id) => get().farmers.find((f) => f.id === id),

  addIndustry: (industry) => {
    const id = generateId();
    const newIndustry: IndustryProject = {
      ...industry,
      id,
      createTime: new Date().toISOString().split('T')[0]
    } as IndustryProject;
    set((s) => ({ industries: [newIndustry, ...s.industries] }));
    get().persist();
  },

  updateIndustry: (id, industry) => {
    set((s) => ({
      industries: s.industries.map((i) => (i.id === id ? { ...i, ...industry } : i))
    }));
    get().persist();
  },

  deleteIndustry: (id) => {
    set((s) => ({ industries: s.industries.filter((i) => i.id !== id) }));
    get().persist();
  },

  getIndustry: (id) => get().industries.find((i) => i.id === id),

  addEvent: (event) => {
    const id = generateId();
    const t = now();
    const newEvent: EventItem = {
      ...event,
      id,
      status: 'pending',
      createTime: t,
      updateTime: t,
      progress: [
        {
          id: generateId(),
          content: '群众反映问题，已登记受理',
          operator: '村委会',
          time: t
        }
      ]
    } as EventItem;
    set((s) => ({ events: [newEvent, ...s.events] }));
    get().persist();
  },

  updateEvent: (id, event) => {
    set((s) => ({
      events: s.events.map((e) =>
        e.id === id ? { ...e, ...event, updateTime: now() } : e
      )
    }));
    get().persist();
  },

  addEventProgress: (eventId, progress) => {
    const t = now();
    set((s) => ({
      events: s.events.map((e) =>
        e.id === eventId
          ? {
              ...e,
              updateTime: t,
              progress: [
                ...e.progress,
                { ...progress, id: generateId(), time: progress.time || t }
              ]
            }
          : e
      )
    }));
    get().persist();
  },

  dispatchEvent: (eventId, assignee) => {
    const t = now();
    set((s) => ({
      events: s.events.map((e) =>
        e.id === eventId
          ? {
              ...e,
              status: 'processing',
              assignee,
              updateTime: t,
              progress: [
                ...e.progress,
                {
                  id: generateId(),
                  content: `已派单给${assignee}处理`,
                  operator: '村委会',
                  time: t
                }
              ]
            }
          : e
      )
    }));
    get().persist();
  },

  completeEvent: (eventId, content) => {
    const t = now();
    const progress = content || '事件处理完成，已确认结案';
    set((s) => ({
      events: s.events.map((e) =>
        e.id === eventId
          ? {
              ...e,
              status: 'completed',
              updateTime: t,
              progress: [
                ...e.progress,
                {
                  id: generateId(),
                  content: progress,
                  operator: e.assignee || '村委会',
                  time: t
                }
              ]
            }
          : e
      )
    }));
    get().persist();
  },

  getEvent: (id) => get().events.find((e) => e.id === id),

  addPublication: (publication) => {
    const id = generateId();
    const newPub: Publication = {
      ...publication,
      id,
      publishTime: new Date().toISOString().split('T')[0],
      views: 0
    } as Publication;
    set((s) => ({ publications: [newPub, ...s.publications] }));
    get().persist();
  },

  updatePublication: (id, publication) => {
    set((s) => ({
      publications: s.publications.map((p) =>
        p.id === id ? { ...p, ...publication } : p
      )
    }));
    get().persist();
  },

  deletePublication: (id) => {
    set((s) => ({ publications: s.publications.filter((p) => p.id !== id) }));
    get().persist();
  },

  getPublication: (id) => get().publications.find((p) => p.id === id)
}));
