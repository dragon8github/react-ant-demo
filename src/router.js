import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';

export default function RouterConfig({ history, app }) {
    const { ConnectedRouter } = routerRedux;
    const { AuthorizedRoute } = Authorized;

    const routerData = getRouterData(app);
    const BasicLayout = routerData['/'].component;
    const UserLayout = routerData['/user'].component;

    return (
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/user" component={UserLayout} />
                <AuthorizedRoute
                    path="/"
                    // 请注意这里的render，并不是route的render。而仅仅是属性而已。
                    // 实际是这个并不是一个route对象，不过，最终这里的props也确实是route对象的render的props。
                    render={props => <BasicLayout {...props} />}
                    authority={['admin', 'user', 'guest', 'clouduser']}
                    redirectPath="/user/cloudlogin"
                />
            </Switch>
        </ConnectedRouter>
    );
}