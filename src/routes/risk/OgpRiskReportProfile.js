import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

@connect(({ ogpRiskReport, loading }) => ({
	ogpRiskReport,
  loading: loading.effects['ogpRiskReport/loadDomain'],
}))
export default class OgpRiskReportProfile extends Component {
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    dispatch({
      type: 'ogpRiskReport/loadDomain',
      payload: params.pid,
    });
  }

  goback = () => {
    history.back();
  };

  render() {
    const { ogpRiskReport: { domain } } = this.props;
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
      <PageHeaderLayout title="风险报告" action={action}>
        <Card bordered={false}>
          <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
          	<Description term="管段ID">{domain.pipeId}</Description>
          	<Description term="风险类型名称">{domain.riskTypeName}</Description>
          	<Description term="风险评价方法">{domain.evaluateMethod}</Description>
          	<Description term="危险识别要求">{domain.recognizeRequire}</Description>
          	<Description term="结论与建议">{domain.subjest}</Description>
          	<Description term="风险防控措施">{domain.riskPreventMethod}</Description>
          	<Description term="风险等级评价">{domain.rankComent}</Description>
          	<Description term="风险等级">{domain.riskRank}</Description>
          	<Description term="风险值">{domain.riskValue}</Description>
          	<Description term="管道失效概率">{domain.disableProb}</Description>
          	<Description term="管道失效后果">{domain.disableEffect}</Description>
          	<Description term="报告ID">{domain.reportId}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
