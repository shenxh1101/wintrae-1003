import { EventItem } from '@/types';

export const eventList: EventItem[] = [
  {
    id: '1',
    title: '一组灌溉水渠破损',
    type: '基础设施',
    description: '一组东侧灌溉水渠出现破损漏水，影响20亩稻田灌溉用水，需要及时修复。',
    reporter: '张大山',
    reporterPhone: '13800138001',
    location: '幸福村一组东田',
    status: 'processing',
    priority: 'high',
    assignee: '李村主任',
    photos: ['https://picsum.photos/id/1036/400/300', 'https://picsum.photos/id/1039/400/300'],
    createTime: '2024-06-08 09:30',
    updateTime: '2024-06-09 14:20',
    progress: [
      {
        id: 'p1',
        content: '群众反映问题，已登记受理',
        operator: '村委会',
        time: '2024-06-08 09:30'
      },
      {
        id: 'p2',
        content: '已派单给村主任李主任处理',
        operator: '村委会',
        time: '2024-06-08 10:15'
      },
      {
        id: 'p3',
        content: '现场勘察完成，确定修复方案，预计3天内完工',
        operator: '李村主任',
        time: '2024-06-09 14:20',
        photos: ['https://picsum.photos/id/1015/400/300']
      }
    ]
  },
  {
    id: '2',
    title: '村口路灯损坏',
    type: '基础设施',
    description: '村口主路路灯有3盏不亮，晚上出行不便，存在安全隐患。',
    reporter: '王建国',
    reporterPhone: '13800138002',
    location: '幸福村村口主路',
    status: 'pending',
    priority: 'medium',
    photos: [],
    createTime: '2024-06-10 08:00',
    updateTime: '2024-06-10 08:00',
    progress: [
      {
        id: 'p1',
        content: '群众反映问题，已登记受理',
        operator: '村委会',
        time: '2024-06-10 08:00'
      }
    ]
  },
  {
    id: '3',
    title: '贫困户申请医疗救助',
    type: '民生服务',
    description: '五组黄老伯生病住院，医疗费用较高，家庭困难，申请医疗救助。',
    reporter: '郑小军',
    reporterPhone: '13800138009',
    location: '幸福村五组42号',
    status: 'completed',
    priority: 'high',
    assignee: '王文书',
    photos: [],
    createTime: '2024-06-01 11:20',
    updateTime: '2024-06-05 16:30',
    progress: [
      {
        id: 'p1',
        content: '群众反映问题，已登记受理',
        operator: '村委会',
        time: '2024-06-01 11:20'
      },
      {
        id: 'p2',
        content: '已派单给村文书王同志处理',
        operator: '村委会',
        time: '2024-06-01 14:00'
      },
      {
        id: 'p3',
        content: '已上门核实情况，收集相关材料',
        operator: '王文书',
        time: '2024-06-02 09:30'
      },
      {
        id: 'p4',
        content: '已上报镇民政办，救助申请已通过',
        operator: '王文书',
        time: '2024-06-05 16:30'
      }
    ]
  },
  {
    id: '4',
    title: '邻里宅基地纠纷',
    type: '纠纷调解',
    description: '二组刘铁柱和邻居因宅基地边界问题产生纠纷，需要村委会协调处理。',
    reporter: '刘铁柱',
    reporterPhone: '13800138003',
    location: '幸福村二组',
    status: 'processing',
    priority: 'medium',
    assignee: '张支书',
    photos: [],
    createTime: '2024-06-07 15:40',
    updateTime: '2024-06-08 10:00',
    progress: [
      {
        id: 'p1',
        content: '群众反映问题，已登记受理',
        operator: '村委会',
        time: '2024-06-07 15:40'
      },
      {
        id: 'p2',
        content: '已派单给村支书张同志处理',
        operator: '村委会',
        time: '2024-06-07 16:20'
      },
      {
        id: 'p3',
        content: '已分别与双方沟通，约定明天现场调解',
        operator: '张支书',
        time: '2024-06-08 10:00'
      }
    ]
  },
  {
    id: '5',
    title: '生活垃圾清运不及时',
    type: '环境卫生',
    description: '三组生活垃圾收集点清运不及时，垃圾堆积有异味，影响村民生活。',
    reporter: '孙德顺',
    reporterPhone: '13800138006',
    location: '幸福村三组垃圾收集点',
    status: 'completed',
    priority: 'low',
    assignee: '赵保洁',
    photos: ['https://picsum.photos/id/1018/400/300'],
    createTime: '2024-06-05 09:00',
    updateTime: '2024-06-05 15:30',
    progress: [
      {
        id: 'p1',
        content: '群众反映问题，已登记受理',
        operator: '村委会',
        time: '2024-06-05 09:00'
      },
      {
        id: 'p2',
        content: '已联系保洁人员清运',
        operator: '村委会',
        time: '2024-06-05 09:30'
      },
      {
        id: 'p3',
        content: '垃圾已清运完毕，已要求增加清运频次',
        operator: '赵保洁',
        time: '2024-06-05 15:30'
      }
    ]
  },
  {
    id: '6',
    title: '农田病虫害防治咨询',
    type: '技术服务',
    description: '近期水稻出现病虫害，想咨询防治方法和用药指导。',
    reporter: '吴军',
    reporterPhone: '13800138008',
    location: '幸福村四组稻田',
    status: 'pending',
    priority: 'high',
    photos: ['https://picsum.photos/id/401/400/300'],
    createTime: '2024-06-09 16:50',
    updateTime: '2024-06-09 16:50',
    progress: [
      {
        id: 'p1',
        content: '群众反映问题，已登记受理',
        operator: '村委会',
        time: '2024-06-09 16:50'
      }
    ]
  },
  {
    id: '7',
    title: '返乡创业政策咨询',
    type: '政策咨询',
    description: '在外务工多年，想回村创业，咨询相关扶持政策和补贴申请流程。',
    reporter: '赵小亮',
    reporterPhone: '13800138005',
    location: '幸福村村委会',
    status: 'completed',
    priority: 'low',
    assignee: '李村主任',
    photos: [],
    createTime: '2024-06-02 10:00',
    updateTime: '2024-06-02 11:30',
    progress: [
      {
        id: 'p1',
        content: '群众反映问题，已登记受理',
        operator: '村委会',
        time: '2024-06-02 10:00'
      },
      {
        id: 'p2',
        content: '已与村主任沟通，安排当面解答',
        operator: '村委会',
        time: '2024-06-02 10:30'
      },
      {
        id: 'p3',
        content: '已详细解答相关政策，提供了创业建议',
        operator: '李村主任',
        time: '2024-06-02 11:30'
      }
    ]
  },
  {
    id: '8',
    title: '文化活动中心使用申请',
    type: '公共服务',
    description: '计划周末在村文化活动中心举办老年棋牌比赛，申请使用场地。',
    reporter: '周小花',
    reporterPhone: '13800138007',
    location: '幸福村文化活动中心',
    status: 'closed',
    priority: 'low',
    assignee: '王文书',
    photos: [],
    createTime: '2024-05-28 14:00',
    updateTime: '2024-05-29 09:00',
    progress: [
      {
        id: 'p1',
        content: '群众反映问题，已登记受理',
        operator: '村委会',
        time: '2024-05-28 14:00'
      },
      {
        id: 'p2',
        content: '申请已批准，活动如期举办',
        operator: '王文书',
        time: '2024-05-29 09:00'
      }
    ]
  }
];

export const eventTypeList = ['全部', '基础设施', '民生服务', '纠纷调解', '环境卫生', '技术服务', '政策咨询', '公共服务'];
export const eventStatusList = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待处理' },
  { value: 'processing', label: '处理中' },
  { value: 'completed', label: '已完成' },
  { value: 'closed', label: '已关闭' }
];
export const eventPriorityList = [
  { value: 'high', label: '高', color: '#F53F3F' },
  { value: 'medium', label: '中', color: '#FF7D00' },
  { value: 'low', label: '低', color: '#00B42A' }
];
