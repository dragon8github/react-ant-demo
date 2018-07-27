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


@connect(({ ogpRiskInfo, dictionary, loading }) => ({
  ogpRiskInfo,
  dictionary,
  loading: loading.models.ogpRiskInfo,
}))
@Form.create()
export default class OgpRiskInfoList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ogpRiskInfo/fetch',
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
      type: 'ogpRiskInfo/fetch',
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
      type: 'ogpRiskInfo/fetch',
      payload: {},
    });
  };

  handleRemove = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    const onOkf = () => {
      dispatch({
        type: 'ogpRiskInfo/remove',
        payload: {
          ids: selectedRows.map(row => row.riskInfoId).join(','),
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
        type: 'ogpRiskInfo/fetch',
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
    dispatch(routerRedux.push(`/risk/ogpRiskInfo-profile/${key}`));
  };

  handleAdd = () => {
	const { dispatch } = this.props;
	dispatch(routerRedux.push(`/risk/ogpRiskInfo-form/add/0`));
  };
  
  handleEdit = (e, key) => {
	const { dispatch } = this.props;
	dispatch(routerRedux.push(`/risk/ogpRiskInfo-form/edit/${key}`));
  };

  renderAdvancedForm() {
	const { dictionary, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
      	<Col md={6} sm={24}>
      	<FormItem label="风险点编号">
      		{getFieldDecorator('eq_riskPointNo')(<Input placeholder="请输入" />)}
      	</FormItem>
      	</Col>
      	<Col md={6} sm={24}>
      	<FormItem label="风险类型名称">
      		{getFieldDecorator('eq_riskType')(<Input placeholder="请输入" />)}
      	</FormItem>
      	</Col>
      	<Col md={6} sm={24}>
      	<FormItem label="风险状态">
      		{getFieldDecorator('eq_riskState')(<Input placeholder="请输入" />)}
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
    const { ogpRiskInfo: { data, domain }, dictionary, loading } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '风险点信息id',
        dataIndex: 'riskInfoId',
      },
      {
        title: '风险状态',
        dataIndex: 'riskState',
      },
      {
        title: '当前风险安全等级',
        dataIndex: 'nowRiskRank',
      },
      {
        title: '推测风险安全等级',
        dataIndex: 'preRiskRank',
      },
      {
        title: '风险点编号',
        dataIndex: 'riskPointNo',
      },
      {
        title: '风险点名称',
        dataIndex: 'riskPointName',
      },
      {
        title: '风险类型名称',
        dataIndex: 'riskType',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={e => this.handleEdit(e, record.riskInfoId)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={e => this.handleShow(e, record.riskInfoId)}>查看</a>
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
                    新建风险点
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button icon="minus" type="danger" style={{ marginBottom: 10, marginTop: 10 }} onClick={this.handleRemove}>
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
              rowKey="riskInfoId"
            />
          </div>
        </Card>
        </PageHeaderLayout>
    );
  }
}
