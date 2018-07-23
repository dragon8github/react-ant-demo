import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

@connect(({ ogpPipelineFoundation, loading }) => ({
	ogpPipelineFoundation,
  loading: loading.effects['ogpPipelineFoundation/loadDomain'],
}))
export default class OgpPipelineFoundationProfile extends Component {
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    dispatch({
      type: 'ogpPipelineFoundation/loadDomain',
      payload: params.pid,
    });
  }

  goback = () => {
    history.back();
  };

  render() {
    const { ogpPipelineFoundation: { domain } } = this.props;
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
      <PageHeaderLayout title="管道基础信息" action={action}>
        <Card bordered={false}>
          <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
          	<Description term="管道ID">{domain.pipelineId}</Description>
          	<Description term="数据录入方式">{domain.dataRecordWay}</Description>
          	<Description term="状态">{domain.stateName}</Description>
          	<Description term="风险等级">{domain.riskLevelName}</Description>
          	<Description term="油气管道长度">{domain.pipelineLength}</Description>
          	<Description term="开始位置">{domain.startLocation}</Description>
          	<Description term="结束位置">{domain.endLocation}</Description>
          	<Description term="坐标经度">{domain.coordinateLongitude}</Description>
          	<Description term="坐标纬度">{domain.coordinateLatitude}</Description>
          	<Description term="镇街">{domain.town}</Description>
          	<Description term="审核状态">{domain.auditState}</Description>
          	<Description term="区域">{domain.area}</Description>
          	<Description term="所属公司">{domain.company}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
