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

// 产业项目流水类型
export interface IndustryRecord {
  id: string;
  type: 'output' | 'subsidy';
  amount: number;
  unit?: string;
  description: string;
  operator: string;
  time: string;
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
  records: IndustryRecord[];
}

// 事件回访类型
export interface EventFollowup {
  id: string;
  satisfaction: 'very_satisfied' | 'satisfied' | 'neutral' | 'dissatisfied' | 'very_dissatisfied';
  remark: string;
  operator: string;
  time: string;
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
  followup?: EventFollowup;
}

export interface EventProgress {
  id: string;
  content: string;
  operator: string;
  time: string;
  photos?: string[];
}

export interface PublicationView {
  id: string;
  reader: string;
  time: string;
}

// 公开公示类型
export interface Publication {
  id: string;
  title: string;
  category: 'meeting' | 'fund' | 'notice' | 'policy';
  status: 'draft' | 'published' | 'withdrawn';
  content: string;
  publisher: string;
  publishTime: string;
  views: number;
  viewRecords?: PublicationView[];
}

// 统计筛选条件
export interface StatFilter {
  group?: string;
  type?: string;
  status?: string;
  satisfaction?: string;
  startDate?: string;
  endDate?: string;
}

// 产业月度汇总
export interface MonthlyStat {
  month: string;
  output: number;
  outputUnit: string;
  subsidy: number;
  recordCount: number;
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
  followupRate: number;
  satisfactionRate: number;
}
