// 兼容低版本浏览器的补丁
import './polyfill';

// dva = React-Router + Redux + Redux-saga
import dva from 'dva';

// 'history/createBrowserHistory'
import createHistory from 'history/createHashHistory';

// 可以自动处理 loading 状态
import createLoading from 'dva-loading';
import dynamic from 'dva/dynamic';

// 加载公共css
import styles from './index.less';
import { Spin } from 'antd';

// 1. 初始化app
const app = dva({
  history: createHistory(),
});

// 2. 加载插件 
app.use(createLoading());
// 设置dva-loading的组件
dynamic.setDefaultLoadingComponent(() => {
    return <Spin size="large" className={styles.globalSpin} />;
});

// 3. 注册全局model
app.model(require('./models/global').default);

// 4. 设置路由配置
app.router(require('./router').default);

// 5. Start
app.start('#root');

export default app._store; 
