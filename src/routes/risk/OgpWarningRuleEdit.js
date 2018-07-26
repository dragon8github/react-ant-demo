import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Form, Input, Button, Card, message, DatePicker } from 'antd';
import DictSelect from 'components/DictSelect';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
@connect(({ ogpWarningRule, dictionary, loading }) => ({
  ogpWarningRule,
  dictionary,
  submitting: loading.effects['ogpWarningRule/save'],
}))
@Form.create()
export default class OgpWarningRuleEdit extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { opertype, pid } = params;

    if (opertype === 'edit') {
      dispatch({
        type: 'ogpWarningRule/loadDomain',
        payload: pid,
        callback: () => {},
      });
    }

  }
  
  handleSave = (fields, isNew, editingKey) => {
	const { dispatch } = this.props;
	let datefields = {};
	if(fields.createTime != undefined){
    	datefields.createTime = fields.createtime.format('YYYY-MM-DD HH:mm:ss');
	} else{
		datefields.createTime = '';
	}
	dispatch({
        type: 'ogpWarningRule/save',
        payload: {
          ...fields,
          isNew,
          warningId: editingKey,
          ...datefields,
        },
        callback: response => {
          if (response.code === 200) {
            message.success('保存成功');
            dispatch(routerRedux.push('/risk/ogpWarningRule-list'));
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
      ogpWarningRule: { domain },
    } = this.props;
    const { getFieldDecorator } = form;
    const { opertype } = params;
    let isNew = true;
    let {
			warningId,
			warningName,
			target,
			compare,
			threshold,
			warningLevel,
			enabled,
			roles,
			warningCallId,
			createTime,
			createAccount,
			createName,
		} = domain;
    if (opertype === 'edit') {
    	isNew = false;
	  	if(createTime != undefined && createTime != null){
	  		createTime = moment(createTime, 'yyyy-MM-dd HH:mm:ss');
	  	}
    } else if (opertype === 'add') {
      		warningId = '';
      		warningName = '';
      		target = '';
      		compare = '';
      		threshold = '';
      		warningLevel = '';
      		enabled = '';
      		roles = '';
      		warningCallId = '';
      		createTime = '';
      		createAccount = '';
      		createName = '';
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
      <PageHeaderLayout title="预警规则" content="" action={action}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="预警规则名称">
      	    	{form.getFieldDecorator('warningName', {
      		        rules: [{ required: true, message: '请输入预警规则名称' }],
      		        initialValue: warningName,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="指标">
      	    	{form.getFieldDecorator('target', {
      		        rules: [{ required: true, message: '请输入指标' }],
      		        initialValue: target,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="比较方法">
      	    	{form.getFieldDecorator('compare', {
      		        rules: [{ required: true, message: '请输入比较方法' }],
      		        initialValue: compare,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="阀值">
      	    	{form.getFieldDecorator('threshold', {
      		        rules: [{ required: true, message: '请输入阀值' }],
      		        initialValue: threshold,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="预警等级">
      	    	{form.getFieldDecorator('warningLevel', {
      		        rules: [{ required: true, message: '请输入预警等级' }],
      		        initialValue: warningLevel,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="是否启用">
      	    	{form.getFieldDecorator('enabled', {
      		        rules: [{ required: true, message: '请输入是否启用' }],
      		        initialValue: enabled,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="角色ID列表">
      	    	{form.getFieldDecorator('roles', {
      		        rules: [{ required: true, message: '请输入角色ID列表' }],
      		        initialValue: roles,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="预警机制ID">
      	    	{form.getFieldDecorator('warningCallId', {
      		        rules: [{ required: true, message: '请输入预警机制ID' }],
      		        initialValue: warningCallId,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="创建时间">
              	{form.getFieldDecorator('createTime',{
              		rules: [{ required: false }],
              		initialValue: createTime,
              		})(
      	                <DatePicker
      	                  style={{ width: '100%' }}
      	                  format="YYYY-MM-DD HH:mm:ss"
      	                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
      	                />
      	              )}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="创建人帐号">
      	    	{form.getFieldDecorator('createAccount', {
      		        rules: [{ required: true, message: '请输入创建人帐号' }],
      		        initialValue: createAccount,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="创建人姓名">
      	    	{form.getFieldDecorator('createName', {
      		        rules: [{ required: true, message: '请输入创建人姓名' }],
      		        initialValue: createName,
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
