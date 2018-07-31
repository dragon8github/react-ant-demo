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

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


@connect(({ ogpWarningCall, dictionary, loading }) => ({
  ogpWarningCall,
  dictionary,
  loading: loading.models.ogpWarningCall,
}))
@Form.create()
export default class OgpWarningCallList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ogpWarningCall/fetch',
    });
    
    dispatch({
    	type: 'dictionary/loadDict',
    	codetype: 'WARNING_WAY',
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
      type: 'ogpWarningCall/fetch',
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
      type: 'ogpWarningCall/fetch',
      payload: {},
    });
  };

  handleRemove = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    const onOkf = () => {
      dispatch({
        type: 'ogpWarningCall/remove',
        payload: {
          ids: selectedRows.map(row => row.warningCallId).join(','),
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
        type: 'ogpWarningCall/fetch',
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
    dispatch(routerRedux.push(`/risk/ogpWarningCall-profile/${key}`));
  };

  handleAdd = () => {
	const { dispatch } = this.props;
	dispatch(routerRedux.push(`/risk/ogpWarningCall-form/add/0`));
  };
  
  handleEdit = (e, key) => {
	const { dispatch } = this.props;
	dispatch(routerRedux.push(`/risk/ogpWarningCall-form/edit/${key}`));
  };

  renderAdvancedForm() {
	const { dictionary, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
      	<Col md={8} sm={24}>
      	<FormItem label="机制名称">
      		{getFieldDecorator('like_warningCallName')(<Input placeholder="请输入" />)}
      	</FormItem>
      	</Col>
      	<Col md={8} sm={24}>
      	<FormItem label="通知方式">
      		{getFieldDecorator('eq_callWay')(
                <DictSelect
                  placeholder="请选择"
                  style={{ width: '100%' }}
                  dictList={dictionary['WARNING_WAY']}
                />
              )}
      	</FormItem>
      	</Col>
      	<Col md={8} sm={24}>
      	<FormItem label="通知人帐号">
      		{getFieldDecorator('like_callAccount')(<Input placeholder="请输入" />)}
      	</FormItem>
      	</Col>
      
      </Row>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
      <Col md={8} sm={24}>
      	<FormItem label="通知人姓名">
      		{getFieldDecorator('like_callName')(<Input placeholder="请输入" />)}
      	</FormItem>
      	</Col>
      	<Col md={8} sm={24}>
      	<FormItem label="规则名称">
      		{getFieldDecorator('like_ruleName')(<Input placeholder="请输入" />)}
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
    const { ogpWarningCall: { data, domain }, dictionary, loading } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '机制ID',
        dataIndex: 'warningCallId',
      },
      {
        title: '机制名称',
        dataIndex: 'warningCallName',
      },
      {
        title: '通知方式',
        dataIndex: 'callWayName',
      },
      {
        title: '通知人编码',
        dataIndex: 'callId',
      },
      {
        title: '通知人帐号',
        dataIndex: 'callAccount',
      },
      {
        title: '通知人姓名',
        dataIndex: 'callName',
      },
      {
        title: '规则编码',
        dataIndex: 'ruleId',
      },
      {
        title: '规则名称',
        dataIndex: 'ruleName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '创建人帐号',
        dataIndex: 'createAccount',
      },
      {
        title: '创建人姓名',
        dataIndex: 'createName',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={e => this.handleEdit(e, record.warningCallId)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={e => this.handleShow(e, record.warningCallId)}>查看</a>
          </Fragment>
        ),
      },
    ];
    
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button type="dashed" style={{ width: '100%', marginBottom: 10 }} icon="plus" onClick={this.handleAdd}>
                    新建机制
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button icon="minus" type="dashed" onClick={this.handleRemove}>
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
              rowKey="warningCallId"
              scroll={{ x: 1300 }}
            />
          </div>
        </Card>
        </PageHeaderLayout>
    );
  }
}
