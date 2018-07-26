import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

@connect(({ ogpWarningCallUser, loading }) => ({
	ogpWarningCallUser,
  loading: loading.effects['ogpWarningCallUser/loadDomain'],
}))
export default class OgpWarningCallUserProfile extends Component {
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    dispatch({
      type: 'ogpWarningCallUser/loadDomain',
      payload: params.pid,
    });
  }

  goback = () => {
    history.back();
  };

  render() {
    const { ogpWarningCallUser: { domain } } = this.props;
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
      <PageHeaderLayout title="预警通知人员" action={action}>
        <Card bordered={false}>
          <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
          	<Description term="帐号">{domain.account}</Description>
          	<Description term="姓名">{domain.name}</Description>
          	<Description term="手机">{domain.mobile}</Description>
          	<Description term="邮件">{domain.email}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
