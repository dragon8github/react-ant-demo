import { routerRedux } from 'dva/router';
import { fakeAccountLogin } from '../services/api';

import { loginAdminUser } from '../services/lmapi';
import { queryMyMenuData } from '../services/user';
import { getMenuData, formatterMenu } from '../common/menu';

import { setAuthority, setAuthorityCloud } from '../utils/authority'; // by hzy
import { reloadAuthorized } from '../utils/Authorized';   // by hzy

const STORE_MENUS = 'antd-menus';

const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};

let menuData = [];
const initDefaultMenuData = () => {
  const menujson = sessionStorage.getItem(STORE_MENUS);
  if (menujson != null) {
    menuData = JSON.parse(menujson);
    menuData.forEach(getRedirect);
  }
};
initDefaultMenuData();

export default {
    namespace: 'login',
    // by hzy
    state: {
      status: undefined,
      menuData,
      redirectData,
    },

    effects: {
      *login({ payload }, { call, put }) {
          const response = yield call(fakeAccountLogin, payload);
          yield put({
            type: 'changeLoginStatus',
            payload: response,
          });
          // Login successfully
          if (response.status === 'ok') {
            reloadAuthorized();
            // by hzy
            yield put({
              type: 'useExampleMenus',
            });
            yield put(routerRedux.push('/'));
          }
      },
      *logout(_, { put, select }) {
        try {
          // get location pathname
          const urlParams = new URL(window.location.href);
          const pathname = yield select(state => state.routing.location.pathname);
          // add the parameters in the url
          urlParams.searchParams.set('redirect', pathname);
          window.history.replaceState(null, 'login', urlParams.href);
        } finally {
          yield put({
            type: 'changeLoginStatus',
            payload: {
              status: false,
              currentAuthority: 'guest',
            },
          });
          reloadAuthorized();
          yield put(routerRedux.push('/user/cloudlogin')); // by hzy
        }
      },
      // by hzy
      *cloudLogin({ payload }, { call, put }) {
          // 对接ljdp后端登录
          const response = yield call(loginAdminUser, payload);
          // 根据登录状态进行UI交互
          yield put({ type: 'changeCloudLoginStatus', payload: response });
          // 登录成功
          if (response && response.code === 200) {
              // 设置当前登录的账号
              setAuthorityCloud(payload.user);
              // 刷新用户权限
              reloadAuthorized();
              // 删除缓存的菜单数据
              sessionStorage.removeItem(STORE_MENUS);
              // 获取菜单数据
              const menuResult = yield call(queryMyMenuData);
              // 更新菜单数据
              yield put({ type: 'updateMenus', payload: menuResult });
              // 重新跳转首页，重新触发AuthorizedRoute组件的逻辑，然后跳转到第一个路由中去
              yield put(routerRedux.push('/'));
          }
      },
    },

    reducers: {
      changeLoginStatus(state, { payload }) {
        // 清空登录信息，清空sessionStroage（官方演示登录的话，先退出我们的登录 by hzy）
        setAuthorityCloud({ userAccount: '' });
        // 清空缓存的菜单数据
        sessionStorage.removeItem(STORE_MENUS);
        // 设置用户权限
        setAuthority(payload.currentAuthority);
        // 更新（合并）state
        return { ...state, status: payload.status, type: payload.type };
      },
      // 根据登录状态进行UI交互 by hzy
      changeCloudLoginStatus(state, { payload }) {
        const status = payload && payload.code === 200 ? 'ok' : 'error';
        const type = payload && payload.type ? payload.type : "account";
        // 更新（合并）state
        return { ...state, status, type };
      },
      updateMenus(state, action) {
        const { payload } = action;
        const { code, menus } = payload;
        if (code === 200) {
          menuData = formatterMenu(menus);
          sessionStorage.setItem(STORE_MENUS, JSON.stringify(menuData));
        }
        menuData.forEach(getRedirect);
        return {
          ...state,
          menuData,
          redirectData,
        };
      },
      useExampleMenus(state) {
        sessionStorage.setItem(STORE_MENUS, JSON.stringify(getMenuData()));
        getMenuData().forEach(getRedirect);
        return {
          ...state,
          menuData: getMenuData(),
          redirectData,
        };
      },
    },
};
