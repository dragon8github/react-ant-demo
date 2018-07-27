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
const RangePicker = DatePicker.RangePicker;
import styles from '../List/TableList.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


@connect(({ ogpPatrolPlan, dictionary, loading }) => ({
  ogpPatrolPlan,
  dictionary,
  loading: loading.models.ogpPatrolPlan,
}))
@Form.create()
export default class OgpPatrolPlanList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ogpPatrolPlan/fetch',
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
      type: 'ogpPatrolPlan/fetch',
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
      type: 'ogpPatrolPlan/fetch',
      payload: {},
    });
  };

  handleRemove = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    const onOkf = () => {
      dispatch({
        type: 'ogpPatrolPlan/remove',
        payload: {
          ids: selectedRows.map(row => row.planId).join(','),
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
        le_createTime: fieldsValue.le_createTime && fieldsValue.le_createTime.format('YYYY-MM-DD HH:mm:ss'),
        ge_createTime: fieldsValue.ge_createTime && fieldsValue.ge_createTime.format('YYYY-MM-DD HH:mm:ss'),
      };

      // console.log(values)

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'ogpPatrolPlan/fetch',
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
    dispatch(routerRedux.push(`/opm/ogpPatrolPlan-profile/${key}`));
  };

  handleAdd = () => {
	const { dispatch } = this.props;
	dispatch(routerRedux.push(`/opm/ogpPatrolPlan-form/add/0`));
  };
  
  handleEdit = (e, key) => {
	const { dispatch } = this.props;
	dispatch(routerRedux.push(`/opm/ogpPatrolPlan-form/edit/${key}`));
  };

  renderAdvancedForm() {
	const { dictionary, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
      	<Col md={6} sm={24}>
      	<FormItem label="计划名称">
      		{getFieldDecorator('like_planName')(<Input placeholder="请输入计划名称" />)}
      	</FormItem>
      	</Col>
      	<Col md={6} sm={24}>
      	<FormItem label="创建人员">
      		{getFieldDecorator('like_createPerson')(<Input placeholder="请输入创建人员" />)}
      	</FormItem>
      	</Col>
      	<Col md={7} sm={24}>
      	<FormItem label="创建时间">
      		{getFieldDecorator('le_createTime')(
                 <RangePicker placeholder={['开始日期', '结束日期']} />
          )}
      	</FormItem>
      	</Col>
        <div style={{ overflow: 'hidden' }}>
            <Button icon="search" type="primary" htmlType="submit">
              查询
            </Button>
            <Button icon="reload" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
        </div>
      </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderAdvancedForm();
  }

  render() {
    const { ogpPatrolPlan: { data, domain }, dictionary, loading } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '计划编号',
        dataIndex: 'planId',
      },
      {
        title: '计划名称',
        dataIndex: 'planName',
      },
      {
        title: '创建人员',
        dataIndex: 'createPerson',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={e => this.handleEdit(e, record.planId)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={e => this.handleShow(e, record.planId)}>查看</a>
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
                    新建任务
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
              rowKey="planId"
            />
          </div>
        </Card>
        </PageHeaderLayout>
    );
  }
}
