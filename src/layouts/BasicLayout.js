import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';

import { Layout, Icon, message } from 'antd';

import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
// https://github.com/jljsj/enquire-js#readme
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

// css 的场景判断
const query = {
    'screen-xs': {maxWidth: 575, },
    'screen-sm': {minWidth: 576, maxWidth: 767, },
    'screen-md': {minWidth: 768, maxWidth: 991, },
    'screen-lg': {minWidth: 992, maxWidth: 1199, },
    'screen-xl': {minWidth: 1200, },
};

// 判断当前视窗是否为移动端
let isMobile;
enquireScreen(b => {  isMobile = b; });

// 将 model 和 component 串联起来
@connect(({ user, login, global = {}, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  menuData: login.menuData,         // by hzy
  redirectData: login.redirectData, // by hzy
}))

export default class BasicLayout extends React.PureComponent {

    state = {
      isMobile,
    };
    
    static childContextTypes = {
      location: PropTypes.object,
      breadcrumbNameMap: PropTypes.object,
    };

    getChildContext() {
        // 新增 menuData by hzy
        const { menuData, location, routerData } = this.props;
        return { location, breadcrumbNameMap: getBreadcrumbNameMap(menuData, routerData) };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        // 获取当前用户信息
        dispatch({ type: 'user/fetchCurrent' });
        // 根据当前视窗设置是否为移动端
        this.enquireHandler = enquireScreen(mobile => {
            this.setState({ isMobile: mobile });
        });
    }

    componentWillUnmount() {
        // 卸载 enquireScreen
        unenquireScreen(this.enquireHandler);
    }

    // 根据路由的name属性，获取当前URL路由配置的标题
    getPageTitle() {
        const { routerData, location } = this.props;
        const { pathname } = location;
        let title = 'Idea Design';
        let currRouterData = null;
        Object.keys(routerData).forEach(key => {
          if (pathToRegexp(key).test(pathname)) {
            currRouterData = routerData[key];
          }
        });
        if (currRouterData && currRouterData.name) {
          title = `${currRouterData.name} - Idea Design`;
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

    // 清空通知消息
    handleNoticeClear = type => {
        message.success(`清空了${type}`);
        const { dispatch } = this.props;
        dispatch({ type: 'global/clearNotices', payload: type });
    };

    // 通知消息发生变化
    handleNoticeVisibleChange = visible => {
      const { dispatch } = this.props;
      if (visible) {
        dispatch({
            type: 'global/fetchNotices',
        });
      }
    };

    // 用户菜单项的点击方法
    handleMenuClick = ({ key }) => {
      const { dispatch } = this.props;
      // 测试触发报错
      if (key === 'triggerError') dispatch(routerRedux.push('/exception/trigger'));
      // 退出登录
      if (key === 'logout') dispatch({ type: 'login/logout' });
    };

    // 收缩菜单面板
    handleMenuCollapse = collapsed => {
      const { dispatch } = this.props;
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload: collapsed,
      });
    };

    render() {
      // 新增 menuData、redirectData by hzy
      const { currentUser, collapsed, fetchingNotices, notices, routerData, match, location,  menuData,  redirectData, } = this.props;
      const { isMobile: mb } = this.state;
      let bashRedirect = this.getBaseRedirect();
      const layout = (
        <Layout>
              <SiderMenu
                  logo={logo}             
                  Authorized={Authorized} // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
                  menuData={menuData}     // by hzy
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
                            {redirectData.map(item => (<Redirect key={item.from} exact from={item.from} to={item.to} />))}
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
                        copyright={<Fragment> Copyright <Icon type="copyright" /> 2018 蚂蚁金服体验技术部出品</Fragment>}
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
