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
  Popconfirm,
  Upload
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DictSelect from 'components/DictSelect';
import cardstyles from '../List/CardList.less';

import styles from '../List/TableList.less';
const Dragger = Upload.Dragger;
const { Search } = Input;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


    
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleSave, doSearch, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      fieldsValue.coordinateLatitude =  113
      fieldsValue.coordinateLongitude =  23
      fieldsValue.state = 1
      fieldsValue.isNew = true
      fieldsValue.company = '东莞某公司'
      fieldsValue.riskLevel = 2
      fieldsValue.area = '南城'
      fieldsValue.dataRecordWay = '人工录入'
      fieldsValue.auditState = 0
      handleSave(fieldsValue, true, 0);
    });
  };

  const DraggerProps = {
    name: 'file',
    multiple: true,
    action: '/api/ljdp/attach/memory/upload.act?busiPath=',
    // action: '//jsonplaceholder.typicode.com/posts/',
    onChange(info) {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        // message.error(`${info.file.name} file upload failed.`);
        message.success(`${info.file.name} file uploaded successfully.`);
      }
    },
  };

  return (
    <Modal
      style={{ top: 45 }}
      title="上传管道信息"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      okText="确认"
      cancelText="取消"
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="经纬度">
        {form.getFieldDecorator('coordinateLongitude', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入经纬度..." />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="镇街">
        {form.getFieldDecorator('town', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入镇街..." />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="管道长度">
        {form.getFieldDecorator('pipelineLength', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入管道长度..." />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="开始位置">
        {form.getFieldDecorator('startLocation', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入开始位置..." />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="结束位置">
        {form.getFieldDecorator('endLocation', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入结束位置..." />)}
      </FormItem>
      <FormItem style={{ marginBottom: 0 }}>
          <Dragger {...DraggerProps}>
                  <p className="ant-upload-drag-icon" >
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
          </Dragger>
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


  handleSave = (fields, isNew, editingKey, content = "保存") => {
    const { dispatch } = this.props;
    let datefields = {};
    dispatch({
          type: 'ogpPipelineFoundation/save',
          payload: {
            ...fields,
            isNew,
            pipelineId: editingKey,
            ...datefields,
          },
          callback: response => {
            if (response.code === 200) {
              message.success(content+ '成功');
              this.handleModalVisible(false)
              this.doSearch();
            } else {
              message.success(content+'失败：[' + response.code + ']' + response.message);
            }
          },
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
    this.doSearch();
  };

  handleAddMap = e => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/opm/mapPipeInfo`));
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
  renderAdvancedForm() {
    const { dictionary, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
          <FormItem label="审核状态">
            {getFieldDecorator('eq_auditState')(<Input placeholder="请输入" />)}
          </FormItem>
          </Col>
          <Col md={6} sm={24}>
          <FormItem label="镇街">
            {getFieldDecorator('like_town')(<Input placeholder="请输入" />)}
          </FormItem>
          </Col>
          <Col md={6} sm={24}>
          <FormItem label="所属公司">
            {getFieldDecorator('like_company')(<Input placeholder="请输入" />)}
          </FormItem>
          </Col>
          <Col md={6} sm={24}>
          <FormItem label="风险等级">
            {getFieldDecorator('eq_riskLevel')(
                  <DictSelect
                    placeholder="请选择"
                    style={{ width: '100%' }}
                    dictList={dictionary['risk.level']}
                  />
                )}
          </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
          <FormItem label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;状态">
            {getFieldDecorator('eq_state')(
                  <DictSelect
                    placeholder="请选择"
                    style={{ width: '100%' }}
                    dictList={dictionary['pipeline.state']}
                  />
                )}
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
    const { ogpPipelineFoundation: { data, domain }, dictionary, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleSave: this.handleSave,
      doSearch: this.doSearch,
      handleModalVisible: this.handleModalVisible,
    };

    const confirm = (...rest) => {
      let obj = rest[0][1];
      obj.auditState = '已审核'
      this.handleSave(obj, false, obj.pipelineId, "审核");
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
          rest[1].auditState === '已审核' ? 
          <div><i class="anticon anticon-check-circle" style={{ color: '#87d068' }}></i> 审核成功</div> :
          <Popconfirm title="你确定要审核通过该任务?" onConfirm={() => { confirm(rest) }} okText="Yes" cancelText="No">
            <a>审核</a>
          </Popconfirm>  
        ),
      },
    ];
    
    return (
      <PageHeaderLayout >
          <Card  bordered={false} >          
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Button type="dashed" style={{ width: '100%', marginBottom: 10 }} icon="plus"  onClick={() => this.handleAddMap(true)}>
                  地图建模
                </Button>
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>新增</Button>
                {selectedRows.length > 0 && (
                  <span>
                    <Button icon="minus" type="dashed" style={{ marginBottom: 10, marginTop: 10 }} onClick={this.handleRemove}>
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
                scroll={{ x: 1600 }}
              />
            </div>
          </Card>
          <CreateForm {...parentMethods} modalVisible={modalVisible} />
        </PageHeaderLayout>
    );
  }
}
