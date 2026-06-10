import { create } from 'zustand';
import Taro from '@tarojs/taro';
import { Farmer, IndustryProject, EventItem, Publication, IndustryRecord, EventFollowup, StatFilter, MonthlyStat, PublicationView } from '@/types';
import { farmerList } from '@/data/farmers';
import { industryList } from '@/data/industries';
import { eventList } from '@/data/events';
import { publicationList } from '@/data/publications';

const STORAGE_KEY = 'digital_village_store_v1';

const SATISFACTION_MAP: Record<string, string> = {
  very_satisfied: '非常满意',
  satisfied: '满意',
  neutral: '一般',
  dissatisfied: '不满意',
  very_dissatisfied: '非常不满意'
};

interface AppState {
  farmers: Farmer[];
  industries: IndustryProject[];
  events: EventItem[];
  publications: Publication[];
  statFilter: StatFilter;
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
  addIndustryRecord: (projectId: string, record: Omit<IndustryRecord, 'id'>) => void;
  getMonthlyStats: (projectId?: string, filters?: { type?: string; cooperative?: string }) => MonthlyStat[];

  addEvent: (event: Omit<EventItem, 'id'>) => void;
  updateEvent: (id: string, event: Partial<EventItem>) => void;
  addEventProgress: (eventId: string, progress: Omit<EventItem['progress'][0], 'id'>) => void;
  dispatchEvent: (eventId: string, assignee: string) => void;
  completeEvent: (eventId: string, content?: string) => void;
  getEvent: (id: string) => EventItem | undefined;
  addEventFollowup: (eventId: string, followup: Omit<EventFollowup, 'id'>) => void;

  addPublication: (publication: Omit<Publication, 'id'>) => void;
  updatePublication: (id: string, publication: Partial<Publication>) => void;
  deletePublication: (id: string) => void;
  getPublication: (id: string) => Publication | undefined;
  publishPublication: (id: string) => void;
  withdrawPublication: (id: string) => void;
  savePublishedPublication: (id: string, data: Partial<Publication>) => void;
  incrementPublicationViews: (id: string, reader?: string) => void;

  setStatFilter: (filter: StatFilter) => void;
  getStatFilter: () => StatFilter;
  clearStatFilter: () => void;

  clearAllData: () => void;
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
  statFilter: {},
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
          statFilter: parsed.statFilter || {},
          initialized: true
        });
      } else {
        set({
          farmers: [...farmerList],
          industries: [...industryList],
          events: [...eventList],
          publications: [...publicationList],
          statFilter: {},
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
        statFilter: {},
        initialized: true
      });
    }
  },

  persist: () => {
    try {
      const { farmers, industries, events, publications, statFilter } = get();
      Taro.setStorageSync(STORAGE_KEY, JSON.stringify({
        farmers, industries, events, publications, statFilter
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
      records: [],
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

  addIndustryRecord: (projectId, record) => {
    const id = generateId();
    const newRecord: IndustryRecord = {
      ...record,
      id
    };
    set((s) => ({
      industries: s.industries.map((p) => {
        if (p.id !== projectId) return p;
        const updated = {
          ...p,
          records: [...p.records, newRecord]
        };
        if (record.type === 'output') {
          updated.output = p.output + record.amount;
        } else if (record.type === 'subsidy') {
          updated.subsidyAmount = p.subsidyAmount + record.amount;
        }
        return updated;
      })
    }));
    get().persist();
  },

  getMonthlyStats: (projectId, filters) => {
    const { industries } = get();
    let targetProjects = projectId
      ? industries.filter((p) => p.id === projectId)
      : [...industries];

    if (filters?.type) {
      targetProjects = targetProjects.filter((p) => p.type === filters.type);
    }
    if (filters?.cooperative) {
      targetProjects = targetProjects.filter((p) => p.cooperative === filters.cooperative);
    }

    const monthMap = new Map<string, { output: number; outputUnit: string; subsidy: number; recordCount: number }>();

    targetProjects.forEach((project) => {
      project.records.forEach((record) => {
        const dateStr = record.time.split(' ')[0];
        const month = dateStr.substring(0, 7);

        if (!monthMap.has(month)) {
          monthMap.set(month, {
            output: 0,
            outputUnit: project.outputUnit,
            subsidy: 0,
            recordCount: 0
          });
        }

        const stat = monthMap.get(month)!;
        stat.recordCount += 1;
        if (record.type === 'output') {
          stat.output += record.amount;
        } else if (record.type === 'subsidy') {
          stat.subsidy += record.amount;
        }
      });
    });

    return Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        output: data.output,
        outputUnit: data.outputUnit,
        subsidy: data.subsidy,
        recordCount: data.recordCount
      }))
      .sort((a, b) => b.month.localeCompare(a.month));
  },

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

  addEventFollowup: (eventId, followup) => {
    const id = generateId();
    const newFollowup: EventFollowup = {
      ...followup,
      id
    };
    const satisfactionText = SATISFACTION_MAP[followup.satisfaction] || followup.satisfaction;
    set((s) => ({
      events: s.events.map((e) =>
        e.id === eventId
          ? {
              ...e,
              followup: newFollowup,
              progress: [
                ...e.progress,
                {
                  id: generateId(),
                  content: `回访完成，满意度：${satisfactionText}`,
                  operator: followup.operator,
                  time: followup.time
                }
              ]
            }
          : e
      )
    }));
    get().persist();
  },

  addPublication: (publication) => {
    const id = generateId();
    const newPub: Publication = {
      ...publication,
      id,
      status: 'draft',
      publishTime: '',
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

  getPublication: (id) => get().publications.find((p) => p.id === id),

  publishPublication: (id) => {
    const today = new Date().toISOString().split('T')[0];
    set((s) => ({
      publications: s.publications.map((p) =>
        p.id === id ? { ...p, status: 'published', publishTime: today } : p
      )
    }));
    get().persist();
  },

  withdrawPublication: (id) => {
    set((s) => ({
      publications: s.publications.map((p) =>
        p.id === id ? { ...p, status: 'withdrawn' } : p
      )
    }));
    get().persist();
  },

  savePublishedPublication: (id, data) => {
    set((s) => ({
      publications: s.publications.map((p) =>
        p.id === id ? { ...p, ...data, status: 'published' } : p
      )
    }));
    get().persist();
  },

  incrementPublicationViews: (id, reader) => {
    const t = now();
    const newView: PublicationView = {
      id: generateId(),
      reader: reader || '群众',
      time: t
    };
    set((s) => ({
      publications: s.publications.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          views: p.views + 1,
          viewRecords: [...(p.viewRecords || []), newView]
        };
      })
    }));
    get().persist();
  },

  setStatFilter: (filter) => {
    set((s) => ({ statFilter: { ...s.statFilter, ...filter } }));
    get().persist();
  },

  getStatFilter: () => get().statFilter,

  clearStatFilter: () => {
    set({ statFilter: {} });
    get().persist();
  },

  clearAllData: () => {
    set({
      farmers: [...farmerList],
      industries: [...industryList],
      events: [...eventList],
      publications: [...publicationList],
      statFilter: {},
      initialized: true
    });
    get().persist();
  }
}));
