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
                render={props => <BasicLayout {...props} />}
                authority={['admin', 'user', 'guest', 'clouduser']}
                redirectPath="/user/cloudlogin"
                />
            </Switch>
        </ConnectedRouter>
    );
}