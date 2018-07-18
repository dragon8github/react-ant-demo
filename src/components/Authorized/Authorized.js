import React from 'react';
import CheckPermissions from './CheckPermissions';

class Authorized extends React.Component {
  render() {
    const { children, authority, noMatch = null } = this.props;
    const childrenRender = typeof children === 'undefined' ? null : children;
    // 这里的 children/childrenRender 其实就是 AuthorizedRoute.js 中的 route，也就是后台布局界面
    return CheckPermissions(authority, childrenRender, noMatch);
  }
}

export default Authorized;
