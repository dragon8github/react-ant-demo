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


@connect(({ ogpDeclareCompany, dictionary, loading }) => ({
  ogpDeclareCompany,
  dictionary,
  loading: loading.models.ogpDeclareCompany,
}))
@Form.create()
export default class OgpDeclareCompanyList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ogpDeclareCompany/fetch',
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
      type: 'ogpDeclareCompany/fetch',
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
      type: 'ogpDeclareCompany/fetch',
      payload: {},
    });
  };

  handleRemove = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    const onOkf = () => {
      dispatch({
        type: 'ogpDeclareCompany/remove',
        payload: {
          ids: selectedRows.map(row => row.companyId).join(','),
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
        type: 'ogpDeclareCompany/fetch',
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
    dispatch(routerRedux.push(`/company/ogpDeclareCompany-profile/${key}`));
  };

  handleAdd = () => {
	const { dispatch } = this.props;
	dispatch(routerRedux.push(`/company/ogpDeclareCompany-form/add/0`));
  };
  
  handleEdit = (e, key) => {
	const { dispatch } = this.props;
	dispatch(routerRedux.push(`/company/ogpDeclareCompany-form/edit/${key}`));
  };

  renderAdvancedForm() {
	const { dictionary, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
      	<Col md={6} sm={24}>
      	<FormItem label="登陆账号=">
      		{getFieldDecorator('eq_account')(<Input placeholder="请输入" />)}
      	</FormItem>
      	</Col>
      	<Col md={6} sm={24}>
      	<FormItem label="企业名称=">
      		{getFieldDecorator('eq_companyName')(<Input placeholder="请输入" />)}
      	</FormItem>
      	</Col>
      	<Col md={6} sm={24}>
      	<FormItem label="营业执照号=">
      		{getFieldDecorator('eq_businessLicense')(<Input placeholder="请输入" />)}
      	</FormItem>
      	</Col>
      	<Col md={6} sm={24}>
      	<FormItem label="联系人=">
      		{getFieldDecorator('eq_contacts')(<Input placeholder="请输入" />)}
      	</FormItem>
      	</Col>
      </Row>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
      	<Col md={6} sm={24}>
      	<FormItem label="联系电话=">
      		{getFieldDecorator('eq_contactNumber')(<Input placeholder="请输入" />)}
      	</FormItem>
      	</Col>
      </Row>
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
    const { ogpDeclareCompany: { data, domain }, dictionary, loading } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '单位ID',
        dataIndex: 'companyId',
      },
      {
        title: '登陆账号',
        dataIndex: 'account',
      },
      {
        title: '密码',
        dataIndex: 'password',
      },
      {
        title: '企业名称',
        dataIndex: 'companyName',
      },
      {
        title: '营业执照号',
        dataIndex: 'businessLicense',
      },
      {
        title: '注册地区',
        dataIndex: 'registeredArea',
      },
      {
        title: '注册地址',
        dataIndex: 'registeredAdress',
      },
      {
        title: '企业网址',
        dataIndex: 'registeredUrl',
      },
      {
        title: '联系人',
        dataIndex: 'contacts',
      },
      {
        title: '联系电话',
        dataIndex: 'contactNumber',
      },
      {
        title: '注册时间',
        dataIndex: 'registeredTime',
      },
      {
        title: '状态',
        dataIndex: 'state',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={e => this.handleEdit(e, record.companyId)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={e => this.handleShow(e, record.companyId)}>查看</a>
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
              rowKey="companyId"
            />
          </div>
        </Card>
        </PageHeaderLayout>
    );
  }
}
