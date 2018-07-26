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
    
    dispatch({
    	type: 'dictionary/loadDict',
    	codetype: 'WARNING_TARGET',
    });
    dispatch({
    	type: 'dictionary/loadDict',
    	codetype: 'WARNING_COMPARE',
    });
    dispatch({
    	type: 'dictionary/loadDict',
    	codetype: 'WARNING_LEVEL',
    });
    dispatch({
    	type: 'dictionary/loadDict',
    	codetype: 'WARNING_ENABLED',
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
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
      	<Col md={8} sm={24}>
      	<FormItem label="预警规则名称">
      		{getFieldDecorator('like_warningName')(<Input placeholder="请输入预警规则名称" />)}
      	</FormItem>
      	</Col>
      	<Col md={8} sm={24}>
      	<FormItem label="指&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;标">
      		{getFieldDecorator('eq_target')(
                <DictSelect
                  placeholder="请选择指标"
                  style={{ width: '100%' }}
                  dictList={dictionary['WARNING_TARGET']}
                />
              )}
      	</FormItem>
      	</Col>
      	<Col md={8} sm={24}>
      	<FormItem label="比较方法">
      		{getFieldDecorator('eq_compare')(
                <DictSelect
                  placeholder="请选择比较方法"
                  style={{ width: '100%' }}
                  dictList={dictionary['WARNING_COMPARE']}
                />
              )}
      	</FormItem>
      	</Col>
      	
      </Row>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
      <Col md={8} sm={24}>
      	<FormItem label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;预警等级">
      		{getFieldDecorator('eq_warningLevel')(
                <DictSelect
                  placeholder="请选择预警等级"
                  style={{ width: '100%' }}
                  dictList={dictionary['WARNING_LEVEL']}
                />
              )}
      	</FormItem>
      	</Col>
      	<Col md={8} sm={24}>
          <FormItem label="是否启用">
            {getFieldDecorator('eq_enabled')(
                  <DictSelect
                    placeholder="请选择是否启用"
                    style={{ width: '100%' }}
                    dictList={dictionary['WARNING_ENABLED']}
                  />
                )}
          </FormItem>
      	</Col>
        <Col md={8} sm={24}>
            <div style={{ overflow: 'hidden' }}>
                <Button icon="search" type="primary" htmlType="submit">
                  查询
                </Button>
                <Button icon="reload" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
            </div>
      	</Col>
      </Row>
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
        fixed: 'left',
      },
      {
        title: '预警规则名称',
        dataIndex: 'warningName',
      },
      {
        title: '指标',
        dataIndex: 'targetName',
      },
      {
        title: '比较方法',
        dataIndex: 'compareName',
      },
      {
        title: '阀值',
        dataIndex: 'threshold',
      },
      {
        title: '预警等级',
        dataIndex: 'warningLevelName',
      },
      {
        title: '是否启用',
        dataIndex: 'enabledName',
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
        fixed: 'right',
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
              <Button type="dashed" style={{ width: '100%' }} icon="plus"onClick={this.handleAdd}>
                    新建
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
              rowKey="warningId"
              scroll={{ x: 1300 }}
            />
          </div>
        </Card>
        </PageHeaderLayout>
    );
  }
}
