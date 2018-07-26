import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

@connect(({ ogpWarningCall, loading }) => ({
	ogpWarningCall,
  loading: loading.effects['ogpWarningCall/loadDomain'],
}))
export default class OgpWarningCallProfile extends Component {
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    dispatch({
      type: 'ogpWarningCall/loadDomain',
      payload: params.pid,
    });
  }

  goback = () => {
    history.back();
  };

  render() {
    const { ogpWarningCall: { domain } } = this.props;
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
      <PageHeaderLayout title="预警机制" action={action}>
        <Card bordered={false}>
          <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
          	<Description term="预警机制ID">{domain.warningCallId}</Description>
          	<Description term="预警机制名称">{domain.warningCallName}</Description>
          	<Description term="预警通知方式">{domain.callWayName}</Description>
          	<Description term="预警通知人帐号">{domain.callAccount}</Description>
          	<Description term="预警通知人姓名">{domain.callName}</Description>
          	<Description term="创建时间">{domain.createTime}</Description>
          	<Description term="创建人帐号">{domain.createAccount}</Description>
          	<Description term="创建人姓名">{domain.createName}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
