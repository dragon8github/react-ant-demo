import { routerRedux } from 'dva/router';
import { fakeAccountLogin } from '../services/api';

import { loginAdminUser } from '../services/lmapi';
import { queryMyMenuData } from '../services/user';
import { getMenuData, formatterMenu } from '../common/menu';

import { setAuthority, setAuthorityCloud } from '../utils/authority'; // by hzy
import { reloadAuthorized } from '../utils/Authorized';               // by hzy

const STORE_MENUS = 'antd-menus';

// 路由重定向列表。譬如访问/student，会被重定向到/student/list
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({ from: `${item.path}`, to: `${item.children[0].path}` });
      item.children.forEach(children => {
          getRedirect(children);
      });
    }
  }
};

// 初始化菜单数据
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
      // 云登录
      *cloudLogin({ payload }, { call, put }) {
          // 登录
          const response = yield call(loginAdminUser, payload);
          // 修改登录状态以进行UI交互
          yield put({ type: 'changeCloudLoginStatus', code: response && response.code, loginType: payload.type });
          // 登录成功
          if (response && response.code === 200) {
              // 设置当前登录的账号
              setAuthorityCloud(response.user);
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
      // 官方登录示例
      *login({ payload }, { call, put }) {
          const response = yield call(fakeAccountLogin, payload);
          yield put({ type: 'changeLoginStatus', payload: response });
          // Login successfully
          if (response.status === 'ok') {
            reloadAuthorized();
            // 使用ant-design官方示例菜单数据 by hzy
            yield put({ type: 'useExampleMenus'});
            yield put(routerRedux.push('/'));
          }
      },
      // 退出登录
      *logout(_, { put, select }) {
          try {
            // 创建URL对象
            const urlParams = new URL(window.location.href);
            // 获取当前路径
            const pathname = yield select(state => state.routing.location.pathname);
            // 设置重定向url
            urlParams.searchParams.set('redirect', pathname);
            // 使用H5 history API 修改url
            window.history.replaceState(null, 'login', urlParams.href);
          } finally {
            // 清空一系列登录状态（用户信息/菜单数据/用户权限）
            yield put({ type: 'changeLoginStatus', payload: { status: false, currentAuthority: 'guest' } });
            // 重置用户权限
            reloadAuthorized();
            // 回到登录界面
            yield put(routerRedux.push('/user/cloudlogin'));
          }
      },
    },
    reducers: {
        // 根据登录状态进行UI交互 by hzy
        changeCloudLoginStatus(state, { code, loginType }) {
            const status = code === 200 ? 'ok' : 'error';
            // 更新（合并）state
            return { ...state, status, type: loginType };
        },
        // 【*login官方登录】和【*logou退出】会使用此方法。我们只关注退出逻辑是否正常即可。
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
        // 更新菜单数据
        updateMenus(state, action) {
            const { payload } = action;
            const { code, menus } = payload;
            if (code === 200) {
              // 格式化菜单数据
              menuData = formatterMenu(menus);
              // 缓存菜单数据
              sessionStorage.setItem(STORE_MENUS, JSON.stringify(menuData));
            }
            // 更新 redirectData（路由重定向列表） 数据
            menuData.forEach(getRedirect);
            // 更新（合并）state
            return { ...state, menuData, redirectData };
        },
        // ant-design官方示例菜单
        useExampleMenus(state) {
            sessionStorage.setItem(STORE_MENUS, JSON.stringify(getMenuData()));
            getMenuData().forEach(getRedirect);
            return { ...state, menuData: getMenuData(), redirectData };
        },
    },
};
