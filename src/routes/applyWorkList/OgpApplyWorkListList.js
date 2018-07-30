import React, { PureComponent } from 'react';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../List/BasicList.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ ogpApplyWorkList, list, loading }) => ({
  ogpApplyWorkList,
  list,
  loading: loading.models.list,
}))
export default class BasicList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 5,
      },
    });
  }

  handleAdd = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/applyWorkList/ogpApplyWorkList-form/add/0`));
  };

  handleShow = (e, key) => {
    const { dispatch } = this.props;
      dispatch(routerRedux.push(`/applyWorkList/ogpApplyWorkList-profile/${key}`));
  };

  render() {
    const {
      list: { list },
      loading,
    } = this.props;

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">进行中</RadioButton>
          <RadioButton value="waiting">等待中</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };

    const ListContent = ({ data: { owner, createdAt, percent, status } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>Owner</span>
          <p>{owner}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>开始时间</span>
          <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
        </div>
      </div>
    );

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="代办事项" value="5个任务" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="平均处理时间" value="32小时" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="已完成任务数" value="24个任务" />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="办理进度"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            {/* <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} onClick={this.handleAdd} icon="plus">
              添加
            </Button> */}
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item actions={[<a onClick={this.handleShow}>查看详情</a>]}>
                    <List.Item.Meta
                      avatar={<Avatar src={item.logo} shape="square" size="large" />}
                      title={<a href={item.href}>{item.title}</a>}
                      description={item.subDescription}
                    />
                    <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
