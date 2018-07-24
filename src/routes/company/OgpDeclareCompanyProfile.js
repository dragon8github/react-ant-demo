import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

@connect(({ ogpDeclareCompany, loading }) => ({
	ogpDeclareCompany,
  loading: loading.effects['ogpDeclareCompany/loadDomain'],
}))
export default class OgpDeclareCompanyProfile extends Component {
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    dispatch({
      type: 'ogpDeclareCompany/loadDomain',
      payload: params.pid,
    });
  }

  goback = () => {
    history.back();
  };

  render() {
    const { ogpDeclareCompany: { domain } } = this.props;
    const action = (
      <Fragment>
        <ButtonGroup>
          <Button icon="rollback" onClick={this.goback}>
            返回
          </Button>
        </ButtonGroup>
      </Fragment>
    );

    return (
      <PageHeaderLayout title="申报单位" action={action}>
        <Card bordered={false}>
          <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
          	<Description term="单位ID">{domain.companyId}</Description>
          	<Description term="登陆账号">{domain.account}</Description>
          	<Description term="密码">{domain.password}</Description>
          	<Description term="企业名称">{domain.companyName}</Description>
          	<Description term="营业执照号">{domain.businessLicense}</Description>
          	<Description term="注册地区">{domain.registeredArea}</Description>
          	<Description term="注册地址">{domain.registeredAdress}</Description>
          	<Description term="企业网址">{domain.registeredUrl}</Description>
          	<Description term="联系人">{domain.contacts}</Description>
          	<Description term="联系电话">{domain.contactNumber}</Description>
          	<Description term="注册时间">{domain.registeredTime}</Description>
          	<Description term="状态">{domain.state}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
