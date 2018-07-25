import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

@connect(({ ogpPipeInfo, loading }) => ({
	ogpPipeInfo,
  loading: loading.effects['ogpPipeInfo/loadDomain'],
}))
export default class OgpPipeInfoProfile extends Component {
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    dispatch({
      type: 'ogpPipeInfo/loadDomain',
      payload: params.pid,
    });
  }

  goback = () => {
    history.back();
  };

  render() {
    const { ogpPipeInfo: { domain } } = this.props;
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
      <PageHeaderLayout title="管道信息" action={action}>
        <Card bordered={false}>
          <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
          	<Description term="管段ID">{domain.pipeId}</Description>
          	<Description term="管段起始位置">{domain.pipeStartPoint}</Description>
          	<Description term="管段结束位置">{domain.pipeEndPoint}</Description>
          	<Description term="管段名称">{domain.pipeName}</Description>
          	<Description term="管段压力值">{domain.pipePressure}</Description>
          	<Description term="管段流量">{domain.pipeFlow}</Description>
          	<Description term="管道服役期限">{domain.pipeServiceDeadline}</Description>
          	<Description term="管道爆管情况">{domain.pipeBurstCase}</Description>
          	<Description term="是否涉及施工挖掘，涉及情况，交越点管理子系统数据">{domain.digCase}</Description>
          	<Description term="管道维修次数">{domain.pipeRepairTimes}</Description>
          	<Description term="管道所属部门">{domain.pipeDep}</Description>
          	<Description term="管道失效后果">{domain.pipeDisableEffect}</Description>
          	<Description term="管段失效概率">{domain.pipeDisableProb}</Description>
          	<Description term="负责人">{domain.manager}</Description>
          	<Description term="负责人电话">{domain.phone}</Description>
          	<Description term="管道所属企业">{domain.pipeCompany}</Description>
          	<Description term="风险点信息ID">{domain.riskInfoId}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
