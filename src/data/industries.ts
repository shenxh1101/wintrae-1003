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
    image: 'https://picsum.photos/id/292/750/500'
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
    image: 'https://picsum.photos/id/237/750/500'
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
    image: 'https://picsum.photos/id/312/750/500'
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
    image: 'https://picsum.photos/id/326/750/500'
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
    image: 'https://picsum.photos/id/431/750/500'
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
    image: 'https://picsum.photos/id/659/750/500'
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
    image: 'https://picsum.photos/id/570/750/500'
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
    image: 'https://picsum.photos/id/718/750/500'
  }
];

export const industryTypeList = ['全部', '种植业', '养殖业', '乡村旅游'];
export const industryStatusList = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'planning', label: '规划中' }
];
