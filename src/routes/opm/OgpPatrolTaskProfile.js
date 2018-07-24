import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

@connect(({ ogpPatrolTask, loading }) => ({
	ogpPatrolTask,
  loading: loading.effects['ogpPatrolTask/loadDomain'],
}))
export default class OgpPatrolTaskProfile extends Component {
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    dispatch({
      type: 'ogpPatrolTask/loadDomain',
      payload: params.pid,
    });
  }

  goback = () => {
    history.back();
  };

  render() {
    const { ogpPatrolTask: { domain } } = this.props;
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
      <PageHeaderLayout title="巡查任务" action={action}>
        <Card bordered={false}>
          <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
          	<Description term="任务编号">{domain.taskId}</Description>
          	<Description term="任务名称">{domain.taskName}</Description>
          	<Description term="巡检路线">{domain.patrolRoute}</Description>
          	<Description term="巡检点位">{domain.patrolLocation}</Description>
          	<Description term="巡检事件">{domain.patrolEvent}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
