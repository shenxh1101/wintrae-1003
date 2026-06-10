export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/farmer/index',
    'pages/industry/index',
    'pages/event/index',
    'pages/public/index',
    'pages/farmer-detail/index',
    'pages/farmer-edit/index',
    'pages/industry-edit/index',
    'pages/industry-detail/index',
    'pages/event-detail/index',
    'pages/event-create/index',
    'pages/public-detail/index',
    'pages/public-edit/index',
    'pages/statistics/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#23C343',
    navigationBarTitleText: '数字乡村',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#23C343',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/farmer/index',
        text: '农户'
      },
      {
        pagePath: 'pages/industry/index',
        text: '产业'
      },
      {
        pagePath: 'pages/event/index',
        text: '办理'
      },
      {
        pagePath: 'pages/public/index',
        text: '公示'
      }
    ]
  }
})
