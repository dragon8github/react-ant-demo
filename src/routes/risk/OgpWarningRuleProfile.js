import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

@connect(({ ogpWarningRule, loading }) => ({
	ogpWarningRule,
  loading: loading.effects['ogpWarningRule/loadDomain'],
}))
export default class OgpWarningRuleProfile extends Component {
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    dispatch({
      type: 'ogpWarningRule/loadDomain',
      payload: params.pid,
    });
  }

  goback = () => {
    history.back();
  };

  render() {
    const { ogpWarningRule: { domain } } = this.props;
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
      <PageHeaderLayout title="预警规则" action={action}>
        <Card bordered={false}>
          <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
          	<Description term="预警规则ID">{domain.warningId}</Description>
          	<Description term="预警规则名称">{domain.warningName}</Description>
          	<Description term="指标">{domain.target}</Description>
          	<Description term="比较方法">{domain.compare}</Description>
          	<Description term="阀值">{domain.threshold}</Description>
          	<Description term="预警等级">{domain.warningLevel}</Description>
          	<Description term="是否启用">{domain.enabled}</Description>
          	<Description term="角色ID列表">{domain.roles}</Description>
          	<Description term="预警机制ID">{domain.warningCallId}</Description>
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
