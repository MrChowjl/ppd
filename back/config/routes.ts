export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/index',
              },
              {
                path: '/index',
                name: '系统参数设置',
                icon: 'SettingOutlined',
                component: './index',
              },
              {
                path: '/media',
                name: '媒体管理',
                icon: 'PicLeftOutlined',
                component: './Media',
              },
              {
                path: '/RATinterface',
                name: 'RAT接口管理',
                icon: 'StrikethroughOutlined',
                component: './RATinterface/index',
              },
              {
                path: '/project',
                name: '账户充值管理',
                icon: 'OneToOneOutlined',
                component: './Project',
              },
              {
                path: '/adowner',
                name: '前台用户管理',
                icon: 'TeamOutlined',
                component: './Adowner',
              },
              {
                path: '/adhostCheck',
                name: '广告主审核',
                icon: 'UserOutlined',
                component: './AdhostCheck',
              },
              {
                path: '/acountCheck',
                name: '广告账户审核',
                icon: 'PicRightOutlined',
                component: './AcountCheck',
              },
              {
                path: '/planCheck',
                name: '计划审核',
                icon: 'BorderHorizontalOutlined',
                component: './PlanCheck',
              },
              // {
              //   path: '/subuser',
              //   name: '广告主审核',
              //   icon: 'ReadOutlined',
              //   component: './Subuser',
              // },
              // {
              //   path: '/subuser',
              //   name: '广告账户审核',
              //   icon: 'ScheduleOutlined',
              //   component: './Subuser',
              // },
              // {
              //   path: '/subuser',
              //   name: '广告计划审核',
              //   icon: 'OneToOneOutlined',
              //   component: './Subuser',
              // },
              // {
              //   path: '/subuser',
              //   name: '广告单元审核',
              //   icon: 'MergeCellsOutlined',
              //   component: './Subuser',
              // },
              // {
              //   path: '/subuser',
              //   name: '广告创意审核',
              //   icon: 'MacCommandOutlined',
              //   component: './Subuser',
              // },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
