import { Farmer } from '@/types';

export const farmerList: Farmer[] = [
  {
    id: '1',
    name: '张大山',
    phone: '13800138001',
    group: '一组',
    familyMembers: [
      { name: '张大山', relation: '户主', age: 45, phone: '13800138001' },
      { name: '李秀英', relation: '配偶', age: 43 },
      { name: '张明', relation: '子女', age: 20 }
    ],
    farmlandArea: 8.5,
    helpTags: ['脱贫户', '低保户'],
    address: '幸福村一组12号',
    avatar: 'https://picsum.photos/id/64/200/200'
  },
  {
    id: '2',
    name: '王建国',
    phone: '13800138002',
    group: '一组',
    familyMembers: [
      { name: '王建国', relation: '户主', age: 52, phone: '13800138002' },
      { name: '张桂芳', relation: '配偶', age: 50 },
      { name: '王强', relation: '子女', age: 26 },
      { name: '王丽', relation: '子女', age: 22 }
    ],
    farmlandArea: 12.3,
    helpTags: ['种粮大户'],
    address: '幸福村一组25号',
    avatar: 'https://picsum.photos/id/91/200/200'
  },
  {
    id: '3',
    name: '刘铁柱',
    phone: '13800138003',
    group: '二组',
    familyMembers: [
      { name: '刘铁柱', relation: '户主', age: 38, phone: '13800138003' },
      { name: '陈美玲', relation: '配偶', age: 36 },
      { name: '刘子轩', relation: '子女', age: 12 },
      { name: '刘子涵', relation: '子女', age: 8 }
    ],
    farmlandArea: 6.8,
    helpTags: ['养殖大户'],
    address: '幸福村二组8号',
    avatar: 'https://picsum.photos/id/177/200/200'
  },
  {
    id: '4',
    name: '陈老根',
    phone: '13800138004',
    group: '二组',
    familyMembers: [
      { name: '陈老根', relation: '户主', age: 68, phone: '13800138004' },
      { name: '王秀兰', relation: '配偶', age: 66 }
    ],
    farmlandArea: 4.2,
    helpTags: ['五保户', '独居老人'],
    address: '幸福村二组33号',
    avatar: 'https://picsum.photos/id/338/200/200'
  },
  {
    id: '5',
    name: '赵小亮',
    phone: '13800138005',
    group: '三组',
    familyMembers: [
      { name: '赵小亮', relation: '户主', age: 32, phone: '13800138005' },
      { name: '孙晓燕', relation: '配偶', age: 30 },
      { name: '赵雨桐', relation: '子女', age: 5 }
    ],
    farmlandArea: 5.5,
    helpTags: ['返乡创业'],
    address: '幸福村三组16号',
    avatar: 'https://picsum.photos/id/1027/200/200'
  },
  {
    id: '6',
    name: '孙德顺',
    phone: '13800138006',
    group: '三组',
    familyMembers: [
      { name: '孙德顺', relation: '户主', age: 55, phone: '13800138006' },
      { name: '李凤英', relation: '配偶', age: 53 },
      { name: '孙伟', relation: '子女', age: 28 }
    ],
    farmlandArea: 9.7,
    helpTags: ['党员户'],
    address: '幸福村三组7号',
    avatar: 'https://picsum.photos/id/64/200/200'
  },
  {
    id: '7',
    name: '周小花',
    phone: '13800138007',
    group: '四组',
    familyMembers: [
      { name: '周小花', relation: '户主', age: 48, phone: '13800138007' },
      { name: '吴大海', relation: '配偶', age: 50 }
    ],
    farmlandArea: 7.3,
    helpTags: ['巾帼示范户'],
    address: '幸福村四组21号',
    avatar: 'https://picsum.photos/id/91/200/200'
  },
  {
    id: '8',
    name: '吴军',
    phone: '13800138008',
    group: '四组',
    familyMembers: [
      { name: '吴军', relation: '户主', age: 41, phone: '13800138008' },
      { name: '郑丽华', relation: '配偶', age: 39 },
      { name: '吴浩然', relation: '子女', age: 15 },
      { name: '吴思琪', relation: '子女', age: 10 },
      { name: '吴老太爷', relation: '父母', age: 72 }
    ],
    farmlandArea: 10.5,
    helpTags: ['普通农户'],
    address: '幸福村四组5号',
    avatar: 'https://picsum.photos/id/177/200/200'
  },
  {
    id: '9',
    name: '郑小军',
    phone: '13800138009',
    group: '五组',
    familyMembers: [
      { name: '郑小军', relation: '户主', age: 35, phone: '13800138009' },
      { name: '黄晓梅', relation: '配偶', age: 33 },
      { name: '郑子墨', relation: '子女', age: 6 }
    ],
    farmlandArea: 6.0,
    helpTags: ['脱贫户'],
    address: '幸福村五组18号',
    avatar: 'https://picsum.photos/id/338/200/200'
  },
  {
    id: '10',
    name: '黄老伯',
    phone: '13800138010',
    group: '五组',
    familyMembers: [
      { name: '黄老伯', relation: '户主', age: 72, phone: '13800138010' }
    ],
    farmlandArea: 3.5,
    helpTags: ['五保户', '独居老人', '脱贫户'],
    address: '幸福村五组42号',
    avatar: 'https://picsum.photos/id/1027/200/200'
  }
];

export const groupList = ['全部', '一组', '二组', '三组', '四组', '五组'];
