import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

@connect(({ ogpRiskInfo, loading }) => ({
	ogpRiskInfo,
  loading: loading.effects['ogpRiskInfo/loadDomain'],
}))
export default class OgpRiskInfoProfile extends Component {
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    dispatch({
      type: 'ogpRiskInfo/loadDomain',
      payload: params.pid,
    });
  }

  goback = () => {
    history.back();
  };

  render() {
    const { ogpRiskInfo: { domain } } = this.props;
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
      <PageHeaderLayout title="风险点信息" action={action}>
        <Card bordered={false}>
          <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
          	<Description term="风险点信息id">{domain.riskInfoId}</Description>
          	<Description term="风险状态">{domain.riskState}</Description>
          	<Description term="当前风险安全等级">{domain.nowRiskRank}</Description>
          	<Description term="推测风险安全等级">{domain.preRiskRank}</Description>
          	<Description term="风险点编号">{domain.riskPointNo}</Description>
          	<Description term="风险点名称">{domain.riskPointName}</Description>
          	<Description term="风险类型名称">{domain.riskType}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
