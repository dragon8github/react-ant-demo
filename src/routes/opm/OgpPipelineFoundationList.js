import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import {
  Row,
  Col,
  Icon,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  Popconfirm
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../List/BasicList.less';
import cardstyles from '../List/CardList.less';

const { Search } = Input;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


    
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="上传管道信息"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      okText="确认"
      cancelText="取消"
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="经纬度">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入经纬度..." />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="镇街">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入镇街..." />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="管道长度">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入管道长度..." />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="开始位置">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入开始位置..." />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="结束位置">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入结束位置..." />)}
      </FormItem>
      <FormItem style={{ marginBottom: 0 }}>
            <Button type="dashed" className={cardstyles.newButton} style={{height: 100}}>
                    <Icon type="plus" /> 新增产品
            </Button>
      </FormItem>
    </Modal>
  );
});

@connect(({ ogpPipelineFoundation, dictionary, loading }) => ({
  ogpPipelineFoundation,
  dictionary,
  loading: loading.models.ogpPipelineFoundation,
}))
@Form.create()
export default class OgpPipelineFoundationList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    modalVisible: false
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ogpPipelineFoundation/fetch',
    });
    
    dispatch({
    	type: 'dictionary/loadDict',
    	codetype: 'pipeline.state',
    });
    dispatch({
    	type: 'dictionary/loadDict',
    	codetype: 'risk.level',
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
      type: 'ogpPipelineFoundation/fetch',
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
      type: 'ogpPipelineFoundation/fetch',
      payload: {},
    });
  };

  handleRemove = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    const onOkf = () => {
      dispatch({
        type: 'ogpPipelineFoundation/remove',
        payload: {
          ids: selectedRows.map(row => row.pipelineId).join(','),
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
        type: 'ogpPipelineFoundation/fetch',
        payload: values,
      });
    });
  };

  handleSearch = content => {
     console.log(20180723173704, e, '搜索')
    // this.doSearch();
  };

  handleAddMap = e => {
    console.log(20180723173507, '地图建模')
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  
  handleAdd = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/opm/ogpPipelineFoundation-form/add/0`));
  };
  
  handleEdit = (e, key) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/opm/ogpPipelineFoundation-form/edit/${key}`));
  };

 

  render() {
    const { ogpPipelineFoundation: { data, domain }, dictionary, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const confirm = (...rest) => {
      message.success('审核成功');
    }
    
    const extraContent = (
      <div>
        <div className={styles.extraContent}>
          <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={ this.handleSearch } />
        </div>
      </div>
     
    );

    const columns = [
      {
        title: '管道ID',
        dataIndex: 'pipelineId',
        fixed: 'left',
      },
      {
        title: '数据录入方式',
        dataIndex: 'dataRecordWay',
      },
      {
        title: '状态',
        dataIndex: 'stateName',
      },
      {
        title: '风险等级',
        dataIndex: 'riskLevelName',
      },
      {
        title: '油气管道长度',
        dataIndex: 'pipelineLength',
      },
      {
        title: '开始位置',
        dataIndex: 'startLocation',
      },
      {
        title: '结束位置',
        dataIndex: 'endLocation',
      },
      {
        title: '坐标经度',
        dataIndex: 'coordinateLongitude',
      },
      {
        title: '坐标纬度',
        dataIndex: 'coordinateLatitude',
      },
      {
        title: '镇街',
        dataIndex: 'town',
      },
      {
        title: '审核状态',
        dataIndex: 'auditState',
      },
      {
        title: '区域',
        dataIndex: 'area',
      },
      {
        title: '所属公司',
        dataIndex: 'company',
      },
      {
        title: '操作',
        fixed: 'right',
        render: (...rest) => (
          <Popconfirm title="你确定要审核通过该任务?" onConfirm={() => { confirm(rest) }} okText="Yes" cancelText="No">
            <a>审核</a>
          </Popconfirm>
        ),
      },
    ];
    
    return (
      <PageHeaderLayout >
       <div className={styles.standardList}>
          <Card 
            className={styles.listCard} 
            bordered={false} 
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            title={<Button icon="plus" type="primary" onClick={() => this.handleAddMap(true)}>地图建模</Button>}
            extra={extraContent}
          >          
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button type="dashed" style={{ width: '100%', marginBottom: 32 }} icon="plus" onClick={() => this.handleModalVisible(true)}>
                  上传管道信息
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
                rowKey="pipelineId"
                scroll={{ x: 1400 }}
              />
            </div>
          </Card>
          </div>
          <CreateForm {...parentMethods} modalVisible={modalVisible} />
        </PageHeaderLayout>
    );
  }
}
