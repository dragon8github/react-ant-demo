import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

export default function RouterConfig({ history, app }) {
    const { ConnectedRouter } = routerRedux;
    const { AuthorizedRoute } = Authorized;

    const routerData = getRouterData(app);
    const BasicLayout = routerData['/'].component;
    const UserLayout = routerData['/user'].component;

    return (
        <LocaleProvider locale={zhCN}>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route path="/user" component={UserLayout} />
                    <AuthorizedRoute
                        // 除了 “/user/xxxx” 以外所有的url都会匹配到 “/” 路径
                        path="/"
                        // 权限判定列表
                        authority={['admin', 'user', 'guest', 'clouduser']}
                        // 如果权限检查通过则渲染后台布局
                        render={props => <BasicLayout {...props} />}
                        // 如果检查不通过重定向的地址
                        redirectPath="/user/cloudlogin"
                    />
                </Switch>
            </ConnectedRouter>
        </LocaleProvider>
    );
}