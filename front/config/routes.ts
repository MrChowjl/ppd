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
                name: '首页',
                icon: 'smile',
                component: './Index',
              },
              {
                path: '/list',
                name: '数据报表',
                icon: 'smile',
                component: './List',
              },
              {
                path: '/account',
                name: '投放账户',
                icon: 'smile',
                // component: './Account/Index',
                routes: [
                  {
                    name: '账户列表',
                    path: '/account/list',
                    component: './Account/List',
                  },
                  {
                    name: '基本概况',
                    path: '/account/basic',
                    component: './Account/Basic',
                  },
                  {
                    name: '广告计划',
                    path: '/account/adplan',
                    component: './Account/Adplan',
                  },
                  {
                    name: '数据报表',
                    path: '/account/datalist',
                    component: './Account/Datalist',
                  },
                  {
                    name: '素材库',
                    path: '/account/trend',
                    component: './Account/Trend',
                  },
                  {
                    name: '人群包',
                    path: '/account/peoplebag',
                    component: './Account/Peoplebag',
                  }
                ],
              },
              {
                path: '/project',
                name: '项目',
                icon: 'smile',
                component: './Project',
              },
              {
                path: '/adowner',
                name: '广告主',
                icon: 'smile',
                component: './Adowner',
              },
              {
                path: '/subuser',
                name: '子用户',
                icon: 'smile',
                component: './Subuser',
              },
              // {
              //   name: 'table-list',
              //   icon: 'table',
              //   path: '/list',
              //   component: './list/index',
              //   routes: [
              //     {
              //       name: 'analysis',
              //       path: '/list/analysis',
              //       component: './list/index',
              //     }
              //   ],
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
