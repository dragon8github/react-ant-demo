import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

// 路由缓存数据
let routerDataCache;

// 检查模块（namespace）是否存在?
const modelNotExisted = (app, model) => {
  // 从dva的所有models中遍历，如果存在指定的model（根据命名空间namespace判断），那么就返回true，否则返回false
  return !app._models.some(({ namespace }) => {
    // 数组遍历中哪怕一个返回true， Array.prototype.some 就会返回true
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });
}

// 组件动态加载器（不仅加载组件，更重要的是顺便将组件dva models加载进来）
const dynamicWrapper = (app, models, component) => {
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }

  // 组件动态加载：https://dvajs.com/api/#dva-dynamic
  return dynamic({
    // app: dva 实例，加载 models 时需要
    app,
    // models: 返回 Promise 数组的函数，Promise 返回 dva model
    models: () => {
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`))
    },
    // component：返回 Promise 的函数，Promise 返回 React Component
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return (props) => {
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
        }
      });
    }
  });
};

// 将 menus.js 中的自定义 json 格式，转化为路由要求的 json 格式。
// 譬如：'/user/login': {name: "登录", path: "/user/login", authority: "guest"}
function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
    const routerConfig = {
        '/': { component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')), },
        
        // demo1 管道基础信息管理
        '/opm/ogpPipelineFoundation-list': {
          component: dynamicWrapper(app, ['opm/ogpPipelineFoundation', 'dictionary'], () => import('../routes/opm/OgpPipelineFoundationList')),
          authority: [ 'clouduser'],
        },
        '/opm/ogpPipelineFoundation-profile/:pid': {
          component: dynamicWrapper(app, ['opm/ogpPipelineFoundation'], () => import('../routes/opm/OgpPipelineFoundationProfile')),
          authority: ['clouduser'],
        },
        '/opm/ogpPipelineFoundation-form/:opertype/:pid': {
            component: dynamicWrapper(app, ['opm/ogpPipelineFoundation'], () => import('../routes/opm/OgpPipelineFoundationEdit')),
            authority: ['admin', 'clouduser'],
        },
        '/opm/map': {
          component: dynamicWrapper(app, [], () => import('../routes/Map/map')),
          authority: [ 'clouduser'],
        },
        '/opm/mapPipeInfo': {
          component: dynamicWrapper(app, [], () => import('../routes/Map/mapPipeInfo')),
          authority: [ 'clouduser'],
        },

        // demo1 任务管理
        '/opm/ogpPatrolTask-list': {
          component: dynamicWrapper(app, ['opm/ogpPatrolTask', 'dictionary'], () => import('../routes/opm/OgpPatrolTaskList')),
          authority: [ 'clouduser'],
        },
        '/opm/ogpPatrolTask-profile/:pid': {
          component: dynamicWrapper(app, ['opm/ogpPatrolTask'], () => import('../routes/opm/OgpPatrolTaskProfile')),
          authority: ['clouduser'],
        },
        '/opm/ogpPatrolTask-form/:opertype/:pid': {
            component: dynamicWrapper(app, ['opm/ogpPatrolTask'], () => import('../routes/opm/OgpPatrolTaskEdit')),
            authority: ['admin', 'clouduser'],
        },

        // demo1 巡查计划
        '/opm/ogpPatrolPlan-list': {
          component: dynamicWrapper(app, ['opm/ogpPatrolPlan', 'dictionary'], () => import('../routes/opm/OgpPatrolPlanList')),
          authority: [ 'clouduser'],
        },
        '/opm/ogpPatrolPlan-profile/:pid': {
          component: dynamicWrapper(app, ['opm/ogpPatrolPlan'], () => import('../routes/opm/OgpPatrolPlanProfile')),
          authority: ['clouduser'],
        },
        '/opm/ogpPatrolPlan-form/:opertype/:pid': {
            component: dynamicWrapper(app, ['opm/ogpPatrolPlan'], () => import('../routes/opm/OgpPatrolPlanEdit')),
            authority: ['admin', 'clouduser'],
        },

        // demo4 管道数据
        '/risk/ogpPipeInfo-list': {
          component: dynamicWrapper(app, ['risk/ogpPipeInfo', 'dictionary'], () => import('../routes/risk/OgpPipeInfoList')),
          authority: [ 'clouduser'],
        },
        '/risk/ogpPipeInfo-profile/:pid': {
          component: dynamicWrapper(app, ['risk/ogpPipeInfo'], () => import('../routes/risk/OgpPipeInfoProfile')),
          authority: ['clouduser'],
        },
        '/risk/ogpPipeInfo-form/:opertype/:pid': {
            component: dynamicWrapper(app, ['risk/ogpPipeInfo'], () => import('../routes/risk/OgpPipeInfoEdit')),
            authority: ['admin', 'clouduser'],
        },
    

        // demo4 风险库展示
        '/risk/ogpRiskInfo-list': {
          component: dynamicWrapper(app, ['risk/ogpRiskInfo', 'dictionary'], () => import('../routes/risk/OgpRiskInfoList')),
          authority: [ 'clouduser'],
        },
        '/risk/ogpRiskInfo-profile/:pid': {
          component: dynamicWrapper(app, ['risk/ogpRiskInfo'], () => import('../routes/risk/OgpRiskInfoProfile')),
          authority: ['clouduser'],
        },
        '/risk/ogpRiskInfo-form/:opertype/:pid': {
            component: dynamicWrapper(app, ['risk/ogpRiskInfo'], () => import('../routes/risk/OgpRiskInfoEdit')),
            authority: ['admin', 'clouduser'],
        },

        // demo 5 风险评估报告管理
        '/risk/ogpRiskReport-list': {
          component: dynamicWrapper(app, ['risk/ogpRiskReport', 'dictionary'], () => import('../routes/risk/OgpRiskReportList')),
          authority: [ 'clouduser'],
        },
        '/risk/ogpRiskReport-profile/:pid': {
          component: dynamicWrapper(app, ['risk/ogpRiskReport'], () => import('../routes/risk/OgpRiskReportProfile')),
          authority: ['clouduser'],
        },
        '/risk/ogpRiskReport-form/:opertype/:pid': {
            component: dynamicWrapper(app, ['risk/ogpRiskReport'], () => import('../routes/risk/OgpRiskReportEdit')),
            authority: ['admin', 'clouduser'],
        },
    
        // demo6 智能预警配置
        // 预警通知人员 
        '/risk/ogpWarningCallUser-list': {
          component: dynamicWrapper(app, ['risk/ogpWarningCallUser', 'dictionary'], () => import('../routes/risk/OgpWarningCallUserList')),
          authority: [ 'clouduser'],
        },
        '/risk/ogpWarningCallUser-profile/:pid': {
          component: dynamicWrapper(app, ['risk/ogpWarningCallUser'], () => import('../routes/risk/OgpWarningCallUserProfile')),
          authority: ['clouduser'],
        },
        '/risk/ogpWarningCallUser-form/:opertype/:pid': {
            component: dynamicWrapper(app, ['risk/ogpWarningCallUser'], () => import('../routes/risk/OgpWarningCallUserEdit')),
            authority: ['admin', 'clouduser'],
        },
    
        // 预警机制
        '/risk/ogpWarningCall-list': {
          component: dynamicWrapper(app, ['risk/ogpWarningCall', 'dictionary'], () => import('../routes/risk/OgpWarningCallList')),
          authority: [ 'clouduser'],
        },
        '/risk/ogpWarningCall-profile/:pid': {
          component: dynamicWrapper(app, ['risk/ogpWarningCall'], () => import('../routes/risk/OgpWarningCallProfile')),
          authority: ['clouduser'],
        },
        '/risk/ogpWarningCall-form/:opertype/:pid': {
            component: dynamicWrapper(app, ['risk/ogpWarningCall'], () => import('../routes/risk/OgpWarningCallEdit')),
            authority: ['admin', 'clouduser'],
        },
    
        // 预警规则
        '/risk/ogpWarningRule-list': {
          component: dynamicWrapper(app, ['risk/ogpWarningRule', 'dictionary'], () => import('../routes/risk/OgpWarningRuleList')),
          authority: [ 'clouduser'],
        },
        '/risk/ogpWarningRule-profile/:pid': {
          component: dynamicWrapper(app, ['risk/ogpWarningRule'], () => import('../routes/risk/OgpWarningRuleProfile')),
          authority: ['clouduser'],
        },
        '/risk/ogpWarningRule-form/:opertype/:pid': {
            component: dynamicWrapper(app, ['risk/ogpWarningRule'], () => import('../routes/risk/OgpWarningRuleEdit')),
            authority: ['admin', 'clouduser'],
        },
        
        // demo9: 安全管理部门人员待办事项界面
        '/applyWorkList/ogpApplyWorkList-list': {
          component: dynamicWrapper(app, ['applyWorkList/ogpApplyWorkList', 'dictionary'], () => import('../routes/applyWorkList/OgpApplyWorkListList')),
          authority: [ 'clouduser'],
        },
        '/applyWorkList/ogpApplyWorkList-profile/:pid': {
          component: dynamicWrapper(app, ['applyWorkList/ogpApplyWorkList'], () => import('../routes/applyWorkList/OgpApplyWorkListProfile')),
          authority: ['clouduser'],
        },
        '/applyWorkList/ogpApplyWorkList-form/:opertype/:pid': {
            component: dynamicWrapper(app, ['applyWorkList/ogpApplyWorkList'], () => import('../routes/applyWorkList/OgpApplyWorkListEdit')),
            authority: ['admin', 'clouduser'],
        },

    
        '/example/main-list': { component: dynamicWrapper(app, ['example', 'dictionary'], () => import('../routes/Example/MainList')), authority: ['admin', 'clouduser'], },
        '/example/main-profile/:pid': { component: dynamicWrapper(app, ['example'], () => import('../routes/Example/MainProfile')), authority: ['admin', 'clouduser'], },
        '/example/main-form/:opertype/:pid': { component: dynamicWrapper(app, ['example'], () => import('../routes/Example/MainEdit')), authority: ['admin', 'clouduser'], },
        '/example/main-import': { component: dynamicWrapper(app, ['example'], () => import('../routes/Example/MainImport')), authority: ['admin', 'clouduser'], },

        '/dashboard/analysis': { component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')), },
        '/dashboard/monitor': { component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')), },
        '/dashboard/workplace': { component: dynamicWrapper(app, ['project', 'activities', 'chart'], () => import('../routes/Dashboard/Workplace')), },

        '/form/basic-form': { component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')), },
        '/form/step-form': { component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')), },
        '/form/step-form/info': { component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')), name: '分步表单（填写转账信息）', },
        '/form/step-form/confirm': { component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')), name: '分步表单（确认转账信息）', },
        '/form/step-form/result': { component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')), name: '分步表单（完成）', },
        '/form/advanced-form': { component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')), },

        '/list/table-list': { component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')), },
        '/list/basic-list': { component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')), },
        '/list/card-list': { component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')), },
        '/list/search': { component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')), },
        '/list/search/projects': { component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')), },
        '/list/search/applications': { component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')), },
        '/list/search/articles': { component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')), },

        '/profile/basic': { component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')), },
        '/profile/advanced': { component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/AdvancedProfile')), },

        '/result/success': { component: dynamicWrapper(app, [], () => import('../routes/Result/Success')), },
        '/result/fail': { component: dynamicWrapper(app, [], () => import('../routes/Result/Error')), },

        '/exception/403': { component: dynamicWrapper(app, [], () => import('../routes/Exception/403')), },
        '/exception/404': { component: dynamicWrapper(app, [], () => import('../routes/Exception/404')), },
        '/exception/500': { component: dynamicWrapper(app, [], () => import('../routes/Exception/500')), },
        '/exception/trigger': { component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')), },

        '/user': { component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')), },
        '/user/login': { component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')), },
        '/user/register': { component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')), },
        '/user/register-result': { component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')), },
     
        '/user/cloudlogin': { component: dynamicWrapper(app, ['login'], () => import('../routes/User/CloudLogin')), },
        '/test': { component: dynamicWrapper(app, [], () => import('../routes/Example/test')), },
        
    };

    // Get name from ./menu.js or just set it in the router data.
    const menuData = getFlatMenuData(getMenuData());

    // （重要）最终返回的路由对象
    const routerData = {};

    // 遍历路由配置信息，根据 routerConfig 中每一项的key，映射到menuData（./menu.js）中数据
    // 然后将两条路由数据合并为一条完整的路由数据，录入到routerData后返回。
    // 点评：老实说我不知道这样做的意义和作用是什么，为什么不干脆从一开始就直接写在routerConfig中？
    Object.keys(routerConfig).forEach(path => {
        // 根据路由path转化为一个正则表达式对象
        const pathRegexp = pathToRegexp(path);

        // 从menuData（./menu.js）中寻找匹配正则的数据
        const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));

        // menuData中的匹配项
        let menuItem = {};
        if (menuKey) {
            menuItem = menuData[menuKey];
        }

        // 当前遍历项
        let router = routerConfig[path];
        // 合并成为新对象（优先级为当前的routerConfig比较高）
        router = {
            ...router,
            name: router.name || menuItem.name,
            authority: router.authority || menuItem.authority,
            hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
        };

        // 录入
        routerData[path] = router;
    });


    return routerData;
};
