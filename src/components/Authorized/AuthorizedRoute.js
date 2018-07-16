import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Authorized from './Authorized';

class AuthorizedRoute extends React.Component {
  render() {
    const { component: Component, render, authority, redirectPath, ...rest } = this.props;
    return (
      <Authorized
        // 权限列表
        authority={authority}
        // 如果未通过检测，那么重定向到指定的路由去
        noMatch={<Route {...rest} render={() => <Redirect to={{ pathname: redirectPath }} />} />}
      >
          <Route {...rest} render={props => (Component ? <Component {...props} /> : render(props))} />
      </Authorized>
    );
  }
}

export default AuthorizedRoute;
