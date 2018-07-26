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


@connect(({ ogpWarningRule, dictionary, loading }) => ({
  ogpWarningRule,
  dictionary,
  loading: loading.models.ogpWarningRule,
}))
@Form.create()
export default class OgpWarningRuleList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ogpWarningRule/fetch',
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
      type: 'ogpWarningRule/fetch',
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
      type: 'ogpWarningRule/fetch',
      payload: {},
    });
  };

  handleRemove = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    const onOkf = () => {
      dispatch({
        type: 'ogpWarningRule/remove',
        payload: {
          ids: selectedRows.map(row => row.warningId).join(','),
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
        type: 'ogpWarningRule/fetch',
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
    dispatch(routerRedux.push(`/risk/ogpWarningRule-profile/${key}`));
  };

  handleAdd = () => {
	const { dispatch } = this.props;
	dispatch(routerRedux.push(`/risk/ogpWarningRule-form/add/0`));
  };
  
  handleEdit = (e, key) => {
	const { dispatch } = this.props;
	dispatch(routerRedux.push(`/risk/ogpWarningRule-form/edit/${key}`));
  };

  renderAdvancedForm() {
	const { dictionary, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button icon="search" type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.renderAdvancedForm();
  }

  render() {
    const { ogpWarningRule: { data, domain }, dictionary, loading } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '预警规则ID',
        dataIndex: 'warningId',
      },
      {
        title: '预警规则名称',
        dataIndex: 'warningName',
      },
      {
        title: '指标',
        dataIndex: 'target',
      },
      {
        title: '比较方法',
        dataIndex: 'compare',
      },
      {
        title: '阀值',
        dataIndex: 'threshold',
      },
      {
        title: '预警等级',
        dataIndex: 'warningLevel',
      },
      {
        title: '是否启用',
        dataIndex: 'enabled',
      },
      {
        title: '角色ID列表',
        dataIndex: 'roles',
      },
      {
        title: '预警机制ID',
        dataIndex: 'warningCallId',
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
            <a onClick={e => this.handleEdit(e, record.warningId)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={e => this.handleShow(e, record.warningId)}>查看</a>
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
              <Button icon="plus" type="primary" onClick={this.handleAdd}>
                新建
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
              rowKey="warningId"
            />
          </div>
        </Card>
        </PageHeaderLayout>
    );
  }
}
