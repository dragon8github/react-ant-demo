import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Form, Input, Button, Card, message, DatePicker } from 'antd';
import DictSelect from 'components/DictSelect';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
@connect(({ ogpPipeInfo, dictionary, loading }) => ({
  ogpPipeInfo,
  dictionary,
  submitting: loading.effects['ogpPipeInfo/save'],
}))
@Form.create()
export default class OgpPipeInfoEdit extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { opertype, pid } = params;

    if (opertype === 'edit') {
      dispatch({
        type: 'ogpPipeInfo/loadDomain',
        payload: pid,
        callback: () => {},
      });
    }

  }
  
  handleSave = (fields, isNew, editingKey) => {
	const { dispatch } = this.props;
	let datefields = {};
	dispatch({
        type: 'ogpPipeInfo/save',
        payload: {
          ...fields,
          isNew,
          pipeId: editingKey,
          ...datefields,
        },
        callback: response => {
          if (response.code === 200) {
            message.success('保存成功');
            dispatch(routerRedux.push('/risk/ogpPipeInfo-list'));
          } else {
            message.success('保存失败：[' + response.code + ']' + response.message);
          }
        },
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      form,
      match: { params },
    } = this.props;
    const { opertype, pid } = params;
    let isNew = true;
    if (opertype === 'edit') {
      isNew = false;
    }
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
    	this.handleSave(fieldsValue, isNew, pid);
      }
    });
  };

  goback = () => {
    history.back();
  };

  render() {
    const {
      submitting,
      form,
      dictionary,
      match: { params },
      ogpPipeInfo: { domain },
    } = this.props;
    const { getFieldDecorator } = form;
    const { opertype } = params;
    let isNew = true;
    let {
			pipeId,
			pipeStartPoint,
			pipeEndPoint,
			pipeName,
			pipePressure,
			pipeFlow,
			pipeServiceDeadline,
			pipeBurstCase,
			digCase,
			pipeRepairTimes,
			pipeDep,
			pipeDisableEffect,
			pipeDisableProb,
			manager,
			phone,
			pipeCompany,
			riskInfoId,
		} = domain;
    if (opertype === 'edit') {
    	isNew = false;
    } else if (opertype === 'add') {
      		pipeId = '';
      		pipeStartPoint = '';
      		pipeEndPoint = '';
      		pipeName = '';
      		pipePressure = '';
      		pipeFlow = '';
      		pipeServiceDeadline = '';
      		pipeBurstCase = '';
      		digCase = '';
      		pipeRepairTimes = '';
      		pipeDep = '';
      		pipeDisableEffect = '';
      		pipeDisableProb = '';
      		manager = '';
      		phone = '';
      		pipeCompany = '';
      		riskInfoId = '';
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 5 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 15 },
        sm: { span: 15 },
        md: { span: 15 },
        lg: { span: 15 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const action = (
      <Fragment>
        <ButtonGroup>
          <Button icon="rollback" onClick={this.goback}>
            返回
          </Button>
        </ButtonGroup>
      </Fragment>
    );

    return (
      <PageHeaderLayout title="管道信息" content="" action={action}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="管段起始位置">
      	    	{form.getFieldDecorator('pipeStartPoint', {
      		        rules: [{ required: true, message: '请输入管段起始位置' }],
      		        initialValue: pipeStartPoint,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="管段结束位置">
      	    	{form.getFieldDecorator('pipeEndPoint', {
      		        rules: [{ required: true, message: '请输入管段结束位置' }],
      		        initialValue: pipeEndPoint,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="管段名称">
      	    	{form.getFieldDecorator('pipeName', {
      		        rules: [{ required: true, message: '请输入管段名称' }],
      		        initialValue: pipeName,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="管段压力值">
      	    	{form.getFieldDecorator('pipePressure', {
      		        rules: [{ required: true, message: '请输入管段压力值' }],
      		        initialValue: pipePressure,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="管段流量">
      	    	{form.getFieldDecorator('pipeFlow', {
      		        rules: [{ required: true, message: '请输入管段流量' }],
      		        initialValue: pipeFlow,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="管道服役期限">
      	    	{form.getFieldDecorator('pipeServiceDeadline', {
      		        rules: [{ required: true, message: '请输入管道服役期限' }],
      		        initialValue: pipeServiceDeadline,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="管道爆管情况">
      	    	{form.getFieldDecorator('pipeBurstCase', {
      		        rules: [{ required: true, message: '请输入管道爆管情况' }],
      		        initialValue: pipeBurstCase,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="是否涉及施工">
      	    	{form.getFieldDecorator('digCase', {
      		        rules: [{ required: true, message: '请输入是否涉及施工' }],
      		        initialValue: digCase,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="管道维修次数">
      	    	{form.getFieldDecorator('pipeRepairTimes', {
      		        rules: [{ required: true, message: '请输入管道维修次数' }],
      		        initialValue: pipeRepairTimes,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="管道所属部门">
      	    	{form.getFieldDecorator('pipeDep', {
      		        rules: [{ required: true, message: '请输入管道所属部门' }],
      		        initialValue: pipeDep,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="管道失效后果">
      	    	{form.getFieldDecorator('pipeDisableEffect', {
      		        rules: [{ required: true, message: '请输入管道失效后果' }],
      		        initialValue: pipeDisableEffect,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="管段失效概率">
      	    	{form.getFieldDecorator('pipeDisableProb', {
      		        rules: [{ required: true, message: '请输入管段失效概率' }],
      		        initialValue: pipeDisableProb,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="负责人">
      	    	{form.getFieldDecorator('manager', {
      		        rules: [{ required: true, message: '请输入负责人' }],
      		        initialValue: manager,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="负责人电话">
      	    	{form.getFieldDecorator('phone', {
      		        rules: [{ required: true, message: '请输入负责人电话' }],
      		        initialValue: phone,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="管道所属企业">
      	    	{form.getFieldDecorator('pipeCompany', {
      		        rules: [{ required: true, message: '请输入管道所属企业' }],
      		        initialValue: pipeCompany,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="风险点信息ID">
      	    	{form.getFieldDecorator('riskInfoId', {
      		        rules: [{ required: true, message: '请输入风险点信息ID' }],
      		        initialValue: riskInfoId,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
      	  <Row>
	        <Col md={12} sm={24} />
	        <Col md={12} sm={24}>
	          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
	            <Button type="primary" htmlType="submit" loading={submitting}>
	              提交
	            </Button>
	          </FormItem>
	        </Col>
	      </Row>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
