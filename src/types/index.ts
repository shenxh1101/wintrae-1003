// 农户类型
export interface Farmer {
  id: string;
  name: string;
  phone: string;
  group: string;
  familyMembers: FamilyMember[];
  farmlandArea: number;
  helpTags: string[];
  address: string;
  avatar: string;
}

export interface FamilyMember {
  name: string;
  relation: string;
  age: number;
  phone?: string;
}

// 产业项目类型
export interface IndustryProject {
  id: string;
  name: string;
  type: string;
  scale: string;
  output: number;
  outputUnit: string;
  salesChannels: string[];
  subsidyAmount: number;
  cooperative: string;
  description: string;
  createTime: string;
  status: 'active' | 'completed' | 'planning';
  image: string;
}

// 事件办理类型
export interface EventItem {
  id: string;
  title: string;
  type: string;
  description: string;
  reporter: string;
  reporterPhone: string;
  location: string;
  status: 'pending' | 'processing' | 'completed' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  photos: string[];
  createTime: string;
  updateTime: string;
  progress: EventProgress[];
}

export interface EventProgress {
  id: string;
  content: string;
  operator: string;
  time: string;
  photos?: string[];
}

// 公开公示类型
export interface Publication {
  id: string;
  title: string;
  category: 'meeting' | 'fund' | 'notice' | 'policy';
  content: string;
  publisher: string;
  publishTime: string;
  views: number;
}

// 统计数据类型
export interface StatisticsData {
  totalFarmers: number;
  totalPopulation: number;
  totalFarmland: number;
  totalProjects: number;
  pendingEvents: number;
  processingEvents: number;
  completedEvents: number;
}
