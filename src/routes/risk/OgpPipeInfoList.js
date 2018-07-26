import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import DictSelect from 'components/DictSelect';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
import styles from '../List/TableList.less';
const { Description } = DescriptionList;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


@connect(({ ogpPipeInfo, dictionary, loading }) => ({
  ogpPipeInfo,
  dictionary,
  loading: loading.models.ogpPipeInfo,
}))
@Form.create()
export default class OgpPipeInfoList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ogpPipeInfo/fetch',
    });
    
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current - 1,
      size: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'ogpPipeInfo/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'ogpPipeInfo/fetch',
      payload: {},
    });
  };

  handleRemove = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    const onOkf = () => {
      dispatch({
        type: 'ogpPipeInfo/remove',
        payload: {
          ids: selectedRows.map(row => row.pipeId).join(','),
        },
        callback: () => {
          this.setState({
            selectedRows: [],
          });
          message.info('已成功删除');
          this.doSearch();
        },
      });
    };
    Modal.confirm({
      title: '删除',
      content: '确定永久删除选定的记录吗？',
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: onOkf,
      onCancel() {
        // console.log('Cancel');
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  doSearch = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      // console.log(values)

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'ogpPipeInfo/fetch',
        payload: values,
      });
    });
  };

  handleSearch = e => {
    e.preventDefault();

    this.doSearch();
  };
  

  handleShow = (e, key) => {
	const { dispatch } = this.props;
    dispatch(routerRedux.push(`/risk/ogpPipeInfo-profile/${key}`));
  };

  handleAdd = () => {
	const { dispatch } = this.props;
	dispatch(routerRedux.push(`/risk/ogpPipeInfo-form/add/0`));
  };
  
  handleEdit = (e, key) => {
	const { dispatch } = this.props;
	dispatch(routerRedux.push(`/risk/ogpPipeInfo-form/edit/${key}`));
  };

  renderAdvancedForm() {
	const { dictionary, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
      	<Col md={6} sm={24}>
      	<FormItem label="风险点信息ID">
      		{getFieldDecorator('eq_riskInfoId')(<Input placeholder="请输入" />)}
      	</FormItem>
      	</Col>
      	<Col md={6} sm={24}>
      	<FormItem label="管段名称">
      		{getFieldDecorator('like_pipeName')(<Input placeholder="请输入" />)}
      	</FormItem>
      	</Col>
      	<Col md={6} sm={24}>
      	<FormItem label="负责人">
      		{getFieldDecorator('like_manager')(<Input placeholder="请输入" />)}
      	</FormItem>
      	</Col>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'left', marginBottom: 24 }}>
            <Button icon="search" type="primary" htmlType="submit">
              查询
            </Button>
            <Button icon="reload" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </span>
        </div>
      </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderAdvancedForm();
  }

  render() {
    const { ogpPipeInfo: { data, domain }, dictionary, loading } = this.props;
    const { selectedRows } = this.state;

    console.log(20180725162500, data)

    const columns = [
      {
        title: '管段ID',
        dataIndex: 'pipeId',
        // fixed: 'left',
      },
      {
        title: '风险点信息ID',
        dataIndex: 'riskInfoId',
      },
      {
        title: '负责人',
        dataIndex: 'manager',
      },
      {
        title: '负责人电话',
        dataIndex: 'phone',
      },
      {
        title: '管道所属企业',
        dataIndex: 'pipeCompany',
      },
      {
        title: '管段名称',
        dataIndex: 'pipeName',
      },
      {
        title: '管道所属部门',
        dataIndex: 'pipeDep',
      },
      {
        title: '管段起始位置',
        dataIndex: 'pipeStartPoint',
      },
      {
        title: '管段结束位置',
        dataIndex: 'pipeEndPoint',
      },
      {
        title: '管段压力值',
        dataIndex: 'pipePressure',
      },
      {
        title: '管段流量',
        dataIndex: 'pipeFlow',
      },
      {
        title: '管道服役期限',
        dataIndex: 'pipeServiceDeadline',
      },
      {
        title: '管道爆管情况',
        dataIndex: 'pipeBurstCase',
      },
      {
        title: '涉及情况',
        dataIndex: 'digCase',
      },
      {
        title: '管道维修次数',
        dataIndex: 'pipeRepairTimes',
      },
      {
        title: '管道失效后果',
        dataIndex: 'pipeDisableEffect',
      },
      {
        title: '管段失效概率',
        dataIndex: 'pipeDisableProb',
      },
      {
        title: '操作',
        // fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={e => this.handleEdit(e, record.pipeId)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={e => this.handleShow(e, record.pipeId)}>查看</a>
          </Fragment>
        ),
      },
    ];

    const desc = <Card >
        <DescriptionList size="large" title="风险信息">
          <Description term="风险点信息id">1</Description>
          <Description term="风险状态">预警状态</Description>
          <Description term="当前风险安全等级">6</Description>
          <Description term="推测风险安全等级">7</Description>
          <Description term="风险点编号">1</Description>
          <Description term="风险点名称">风险点1</Description>
          <Description term="风险类型名称">蓄意破坏</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
    </Card>
    
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button type="dashed" style={{ width: '100%' }} icon="plus"onClick={this.handleAdd}>
                    新建管道
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button icon="minus" type="danger" style={{ marginTop: 10 }} onClick={this.handleRemove}>
                    删除
                  </Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="pipeId"
              scroll={{ x: 2200 }}
              expandedRowRender={record => <div style={{ maxWidth: 1000 }}>{desc}</div>}
            />
          </div>
        </Card>
        </PageHeaderLayout>
    );
  }
}
