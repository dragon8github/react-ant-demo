// dva = React-Router + Redux + Redux-saga
import dva from 'dva';

// 'history/createBrowserHistory'
import createHistory from 'history/createHashHistory';

// 可以自动处理 loading 状态，不用一遍遍地写 showLoading 和 hideLoading，在/src/router.js中设置loading的组件
import createLoading from 'dva-loading';

// 兼容低版本浏览器的补丁
import './polyfill';

// 自动兼容客户端时区
import 'moment/locale/zh-cn';

// 加载公共css
import './index.less';

// 1. Initialize
const app = dva({
  history: createHistory(),
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

export default app._store;
