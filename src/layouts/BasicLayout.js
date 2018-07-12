import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';

import { Layout, Icon, message } from 'antd';

import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import { enquireScreen, unenquireScreen } from 'enquire-js';

import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';

import logo from '../assets/logo.svg';

const { Content, Header, Footer } = Layout;
const { AuthorizedRoute, check } = Authorized;

// 改为后端动态获取 by hzy
// import { getMenuData } from '../common/menu';

/**
 * 根据菜单取得重定向地址. by hzy
 */
// const redirectData = [];
// const getRedirect = item => {
//   if (item && item.children) {
//     if (item.children[0] && item.children[0].path) {
//       redirectData.push({
//         from: `${item.path}`,
//         to: `${item.children[0].path}`,
//       });
//       item.children.forEach(children => {
//         getRedirect(children);
//       });
//     }
//   }
// };
// getMenuData().forEach(getRedirect);

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
    const result = {};
    const childResult = {};
    for (const i of menuData) {
      if (!routerData[i.path]) {
        result[i.path] = i;
      }
      if (i.children) {
        Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
      }
    }
    return Object.assign({}, routerData, result, childResult);
};

const query = {
    'screen-xs': {maxWidth: 575, },
    'screen-sm': {minWidth: 576, maxWidth: 767, },
    'screen-md': {minWidth: 768, maxWidth: 991, },
    'screen-lg': {minWidth: 992, maxWidth: 1199, },
    'screen-xl': {minWidth: 1200, },
};

let isMobile;
enquireScreen(b => {  isMobile = b; });

class BasicLayout extends React.PureComponent {

    state = {
      isMobile,
    };
    
    static childContextTypes = {
      location: PropTypes.object,
      breadcrumbNameMap: PropTypes.object,
    };

    getChildContext() {
       console.log(20180712151242, this.props);
      // by hzy
      const { menuData, location, routerData } = this.props;
      return {
        location,
        breadcrumbNameMap: getBreadcrumbNameMap(menuData, routerData),
      };
    }

    componentDidMount() {
        this.enquireHandler = enquireScreen(mobile => {
            this.setState({ isMobile: mobile });
        });
        const { dispatch } = this.props;
        dispatch({ type: 'user/fetchCurrent' });
    }

    componentWillUnmount() {
      unenquireScreen(this.enquireHandler);
    }

    // 获取当前路由配置的标题（根据路由的name属性）
    getPageTitle() {
        const { routerData, location } = this.props;
        const { pathname } = location;
        let title = 'Ant Design Pro';
        let currRouterData = null;
        Object.keys(routerData).forEach(key => {
          if (pathToRegexp(key).test(pathname)) {
            currRouterData = routerData[key];
          }
        });
        if (currRouterData && currRouterData.name) {
          title = `${currRouterData.name} - Ant Design Pro`;
        }
        return title;
    }

    getBaseRedirect = () => {
        // According to the url parameter to redirect
        // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
        const urlParams = new URL(window.location.href);

        const redirect = urlParams.searchParams.get('redirect');

        // Remove the parameters in the url
        if (redirect) {
          urlParams.searchParams.delete('redirect');
          window.history.replaceState(null, 'redirect', urlParams.href);
        } else {
          const { routerData } = this.props;
          // get the first authorized route path in routerData
          const authorizedPath = Object.keys(routerData).find(item => {
              return check(routerData[item].authority, item) && item !== '/'
          });
          return authorizedPath;
        }
        return redirect;
    };

    handleMenuCollapse = collapsed => {
      const { dispatch } = this.props;
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload: collapsed,
      });
    };

    handleNoticeClear = type => {
      message.success(`清空了${type}`);
      const { dispatch } = this.props;
      dispatch({
        type: 'global/clearNotices',
        payload: type,
      });
    };

    handleMenuClick = ({ key }) => {
      const { dispatch } = this.props;
      if (key === 'triggerError') {
        dispatch(routerRedux.push('/exception/trigger'));
        return;
      }
      if (key === 'logout') {
        dispatch({
          type: 'login/logout',
        });
      }
    };

    handleNoticeVisibleChange = visible => {
      const { dispatch } = this.props;
      if (visible) {
        dispatch({
          type: 'global/fetchNotices',
        });
      }
    };

    render() {
      const {
          currentUser, collapsed, fetchingNotices, notices, routerData, match, location,
          // by hzy
          menuData,  redirectData,
      } = this.props;

      const { isMobile: mb } = this.state;

      let bashRedirect = this.getBaseRedirect();
      
      const layout = (
        <Layout>
          <SiderMenu
            logo={logo}
            // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
            // If you do not have the Authorized parameter
            // you will be forced to jump to the 403 interface without permission
            Authorized={Authorized}
            menuData={menuData} // by hzy
            collapsed={collapsed}
            location={location}
            isMobile={mb}
            onCollapse={this.handleMenuCollapse}
          />
          <Layout>

            <Header style={{ padding: 0 }}>
              <GlobalHeader
                  logo={logo}
                  currentUser={currentUser}
                  fetchingNotices={fetchingNotices}
                  notices={notices}
                  collapsed={collapsed}
                  isMobile={mb}
                  onNoticeClear={this.handleNoticeClear}
                  onCollapse={this.handleMenuCollapse}
                  onMenuClick={this.handleMenuClick}
                  onNoticeVisibleChange={this.handleNoticeVisibleChange}
              />
            </Header>

            <Content style={{ margin: '24px 24px 0', height: '100%' }}>
                <Switch>

                  {redirectData.map(item => (
                    <Redirect key={item.from} exact from={item.from} to={item.to} />
                  ))}

                  {getRoutes(match.path, routerData).map(item => (
                      <AuthorizedRoute
                          key={item.key}
                          path={item.path}
                          component={item.component}
                          exact={item.exact}
                          authority={item.authority}
                          redirectPath="/exception/403"
                      />
                  ))}

                  <Redirect exact from="/" to={bashRedirect} />

                  <Route render={NotFound} />

                </Switch>
            </Content>

            <Footer style={{ padding: 0 }}>
              <GlobalFooter
                  links={[
                      {key: 'Pro 首页', title: 'Pro 首页', href: 'http://pro.ant.design', blankTarget: true, },
                      {key: 'github', title: <Icon type="github" />, href: 'https://github.com/ant-design/ant-design-pro', blankTarget: true, },
                      {key: 'Ant Design', title: 'Ant Design', href: 'http://ant.design', blankTarget: true, },
                  ]}

                  copyright={
                    <Fragment>
                      Copyright <Icon type="copyright" /> 2018 蚂蚁金服体验技术部出品
                    </Fragment>
                  }
              />
            </Footer>

          </Layout>
        </Layout>
      );

      return (
        <DocumentTitle title={this.getPageTitle()}>
          <ContainerQuery query={query}>
            {params => <div className={classNames(params)}>{layout}</div>}
          </ContainerQuery>
        </DocumentTitle>
      );
    }
}
// by hzy
export default connect(({ user, login, global = {}, loading }) => ({
    currentUser: user.currentUser,
    fetchingNotices: loading.effects['global/fetchNotices'],
    collapsed: global.collapsed,
    notices: global.notices,
    menuData: login.menuData,         // by hzy
    redirectData: login.redirectData, // by hzy
}))(BasicLayout);
