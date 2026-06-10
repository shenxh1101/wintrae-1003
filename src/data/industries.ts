import { IndustryProject } from '@/types';

export const industryList: IndustryProject[] = [
  {
    id: '1',
    name: '有机水稻种植基地',
    type: '种植业',
    scale: '200亩',
    output: 120000,
    outputUnit: '公斤',
    salesChannels: ['线下批发', '电商平台', '合作社直供'],
    subsidyAmount: 50000,
    cooperative: '幸福村水稻种植专业合作社',
    description: '采用有机种植方式，不使用化学农药和化肥，生产高品质有机大米。项目带动农户30户，每户年均增收约8000元。',
    createTime: '2024-03-15',
    status: 'active',
    image: 'https://picsum.photos/id/292/750/500',
    records: [
      { id: 'r1-1', type: 'output', amount: 50000, unit: '公斤', description: '2024年上半年有机水稻收成，品质优良', operator: '合作社', time: '2024-07-10' },
      { id: 'r1-2', type: 'output', amount: 70000, unit: '公斤', description: '2024年下半年有机水稻收成', operator: '合作社', time: '2024-10-25' },
      { id: 'r1-3', type: 'subsidy', amount: 50000, description: '有机种植产业发展补贴资金拨付', operator: '镇农业办', time: '2024-04-20' }
    ]
  },
  {
    id: '2',
    name: '生态土鸡养殖场',
    type: '养殖业',
    scale: '5000只',
    output: 80000,
    outputUnit: '只/年',
    salesChannels: ['农贸市场', '餐饮合作', '线上商城'],
    subsidyAmount: 30000,
    cooperative: '幸福村生态养殖专业合作社',
    description: '林下散养生态土鸡，以玉米、豆粕、青菜为主食，鸡肉品质优良，鸡蛋营养价值高。',
    createTime: '2024-05-20',
    status: 'active',
    image: 'https://picsum.photos/id/237/750/500',
    records: [
      { id: 'r2-1', type: 'output', amount: 35000, unit: '只', description: '2024年第一批生态土鸡出栏', operator: '合作社', time: '2024-08-15' },
      { id: 'r2-2', type: 'output', amount: 45000, unit: '只', description: '2024年第二批生态土鸡出栏', operator: '合作社', time: '2024-12-20' },
      { id: 'r2-3', type: 'subsidy', amount: 30000, description: '畜禽养殖标准化示范项目补贴', operator: '镇农业办', time: '2024-06-25' }
    ]
  },
  {
    id: '3',
    name: '蔬菜大棚种植项目',
    type: '种植业',
    scale: '50个大棚',
    output: 250000,
    outputUnit: '公斤/年',
    salesChannels: ['蔬菜批发市场', '超市直供', '社区团购'],
    subsidyAmount: 80000,
    cooperative: '幸福村蔬菜种植专业合作社',
    description: '建设标准化蔬菜大棚50个，种植反季节蔬菜，主要品种有西红柿、黄瓜、辣椒、茄子等。',
    createTime: '2023-11-10',
    status: 'active',
    image: 'https://picsum.photos/id/312/750/500',
    records: [
      { id: 'r3-1', type: 'output', amount: 120000, unit: '公斤', description: '2024年春季蔬菜产量，西红柿、黄瓜等喜获丰收', operator: '合作社', time: '2024-04-30' },
      { id: 'r3-2', type: 'output', amount: 130000, unit: '公斤', description: '2024年秋冬季蔬菜产量', operator: '合作社', time: '2024-10-15' },
      { id: 'r3-3', type: 'subsidy', amount: 80000, description: '设施农业大棚建设补贴资金', operator: '镇农业办', time: '2023-12-20' }
    ]
  },
  {
    id: '4',
    name: '中药材种植基地',
    type: '种植业',
    scale: '100亩',
    output: 15000,
    outputUnit: '公斤/年',
    salesChannels: ['中药材市场', '制药企业直供'],
    subsidyAmount: 60000,
    cooperative: '幸福村中药材种植专业合作社',
    description: '主要种植金银花、丹参、桔梗等中药材，与多家制药企业建立了长期合作关系。',
    createTime: '2024-01-08',
    status: 'active',
    image: 'https://picsum.photos/id/326/750/500',
    records: [
      { id: 'r4-1', type: 'output', amount: 6000, unit: '公斤', description: '2024年上半年金银花、丹参采收', operator: '合作社', time: '2024-06-20' },
      { id: 'r4-2', type: 'output', amount: 9000, unit: '公斤', description: '2024年下半年桔梗、金银花采收', operator: '合作社', time: '2024-11-10' },
      { id: 'r4-3', type: 'subsidy', amount: 60000, description: '中药材种植产业化发展补贴', operator: '镇农业办', time: '2024-02-15' }
    ]
  },
  {
    id: '5',
    name: '乡村旅游采摘园',
    type: '乡村旅游',
    scale: '80亩',
    output: 5000,
    outputUnit: '人次/年',
    salesChannels: ['线上预订', '旅行社合作', '自驾游客'],
    subsidyAmount: 100000,
    cooperative: '幸福村乡村旅游专业合作社',
    description: '集水果采摘、农家餐饮、休闲观光于一体的乡村旅游项目。种植草莓、葡萄、樱桃等多种水果。',
    createTime: '2023-06-18',
    status: 'completed',
    image: 'https://picsum.photos/id/431/750/500',
    records: [
      { id: 'r5-1', type: 'output', amount: 2200, unit: '人次', description: '2024年上半年接待游客人次，草莓采摘季人气旺盛', operator: '合作社', time: '2024-06-30' },
      { id: 'r5-2', type: 'output', amount: 2800, unit: '人次', description: '2024年下半年接待游客人次，葡萄、樱桃采摘季', operator: '合作社', time: '2024-11-30' },
      { id: 'r5-3', type: 'subsidy', amount: 100000, description: '乡村旅游示范项目建设补贴', operator: '镇文旅办', time: '2023-08-15' }
    ]
  },
  {
    id: '6',
    name: '蜜蜂养殖项目',
    type: '养殖业',
    scale: '200箱',
    output: 5000,
    outputUnit: '公斤/年',
    salesChannels: ['土特产店', '电商平台', '礼品定制'],
    subsidyAmount: 20000,
    cooperative: '幸福村养蜂专业合作社',
    description: '利用山林资源发展养蜂产业，生产纯天然蜂蜜、蜂花粉、蜂王浆等蜂产品。',
    createTime: '2024-04-22',
    status: 'planning',
    image: 'https://picsum.photos/id/659/750/500',
    records: [
      { id: 'r6-1', type: 'output', amount: 2000, unit: '公斤', description: '2024年春季蜂蜜采收，洋槐蜜丰收', operator: '合作社', time: '2024-06-05' },
      { id: 'r6-2', type: 'output', amount: 3000, unit: '公斤', description: '2024年夏秋季蜂蜜采收，荆条蜜、枣花蜜', operator: '合作社', time: '2024-09-20' },
      { id: 'r6-3', type: 'subsidy', amount: 20000, description: '蜜蜂养殖产业扶持补贴', operator: '镇农业办', time: '2024-05-10' }
    ]
  },
  {
    id: '7',
    name: '食用菌种植项目',
    type: '种植业',
    scale: '10个大棚',
    output: 30000,
    outputUnit: '公斤/年',
    salesChannels: ['批发市场', '餐饮配送', '超市直供'],
    subsidyAmount: 45000,
    cooperative: '幸福村食用菌种植专业合作社',
    description: '主要种植香菇、平菇、金针菇等食用菌，采用立体栽培技术，提高空间利用率。',
    createTime: '2024-02-14',
    status: 'active',
    image: 'https://picsum.photos/id/570/750/500',
    records: [
      { id: 'r7-1', type: 'output', amount: 14000, unit: '公斤', description: '2024年上半年食用菌产量，香菇、平菇为主', operator: '合作社', time: '2024-06-15' },
      { id: 'r7-2', type: 'output', amount: 16000, unit: '公斤', description: '2024年下半年食用菌产量，金针菇、香菇丰收', operator: '合作社', time: '2024-12-10' },
      { id: 'r7-3', type: 'subsidy', amount: 45000, description: '食用菌设施栽培项目补贴', operator: '镇农业办', time: '2024-03-20' }
    ]
  },
  {
    id: '8',
    name: '水产养殖基地',
    type: '养殖业',
    scale: '50亩',
    output: 25000,
    outputUnit: '公斤/年',
    salesChannels: ['水产批发市场', '餐馆直供', '垂钓休闲'],
    subsidyAmount: 35000,
    cooperative: '幸福村水产养殖专业合作社',
    description: '利用村边水塘发展水产养殖，主要养殖草鱼、鲤鱼、鲫鱼等，同时开发休闲垂钓项目。',
    createTime: '2023-09-05',
    status: 'active',
    image: 'https://picsum.photos/id/718/750/500',
    records: [
      { id: 'r8-1', type: 'output', amount: 12000, unit: '公斤', description: '2024年上半年成鱼捕捞上市，草鱼、鲤鱼为主', operator: '合作社', time: '2024-05-20' },
      { id: 'r8-2', type: 'output', amount: 13000, unit: '公斤', description: '2024年下半年成鱼捕捞，鲫鱼、草鱼丰收', operator: '合作社', time: '2024-10-25' },
      { id: 'r8-3', type: 'subsidy', amount: 35000, description: '绿色水产养殖示范基地补贴', operator: '镇农业办', time: '2023-10-15' }
    ]
  }
];

export const industryTypeList = ['全部', '种植业', '养殖业', '乡村旅游'];
export const industryStatusList = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'planning', label: '规划中' }
];

export const cooperativeList = ['全部', '幸福村水稻种植专业合作社', '幸福村生态养殖专业合作社', '幸福村蔬菜种植专业合作社', '幸福村中药材种植专业合作社', '幸福村乡村旅游专业合作社', '幸福村养蜂专业合作社', '幸福村食用菌种植专业合作社', '幸福村水产养殖专业合作社'];
