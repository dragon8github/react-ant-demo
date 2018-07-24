import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Form, Input, Button, Card, message, DatePicker } from 'antd';
import DictSelect from 'components/DictSelect';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
@connect(({ ogpDeclareCompany, dictionary, loading }) => ({
  ogpDeclareCompany,
  dictionary,
  submitting: loading.effects['ogpDeclareCompany/save'],
}))
@Form.create()
export default class OgpDeclareCompanyEdit extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { opertype, pid } = params;

    if (opertype === 'edit') {
      dispatch({
        type: 'ogpDeclareCompany/loadDomain',
        payload: pid,
        callback: () => {},
      });
    }

  }
  
  handleSave = (fields, isNew, editingKey) => {
	const { dispatch } = this.props;
	let datefields = {};
	if(fields.registeredTime != undefined){
    	datefields.registeredTime = fields.createtime.format('YYYY-MM-DD HH:mm:ss');
	} else{
		datefields.registeredTime = '';
	}
	dispatch({
        type: 'ogpDeclareCompany/save',
        payload: {
          ...fields,
          isNew,
          companyId: editingKey,
          ...datefields,
        },
        callback: response => {
          if (response.code === 200) {
            message.success('保存成功');
            dispatch(routerRedux.push('/company/ogpDeclareCompany-list'));
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
      ogpDeclareCompany: { domain },
    } = this.props;
    const { getFieldDecorator } = form;
    const { opertype } = params;
    let isNew = true;
    let {
			companyId,
			account,
			password,
			companyName,
			businessLicense,
			registeredArea,
			registeredAdress,
			registeredUrl,
			contacts,
			contactNumber,
			registeredTime,
			state,
		} = domain;
    if (opertype === 'edit') {
    	isNew = false;
	  	if(registeredTime != undefined && registeredTime != null){
	  		registeredTime = moment(registeredTime, 'yyyy-MM-dd HH:mm:ss');
	  	}
    } else if (opertype === 'add') {
      		companyId = '';
      		account = '';
      		password = '';
      		companyName = '';
      		businessLicense = '';
      		registeredArea = '';
      		registeredAdress = '';
      		registeredUrl = '';
      		contacts = '';
      		contactNumber = '';
      		registeredTime = '';
      		state = '';
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
      <PageHeaderLayout title="申报单位" content="" action={action}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="登陆账号">
      	    	{form.getFieldDecorator('account', {
      		        rules: [{ required: true, message: '请输入登陆账号' }],
      		        initialValue: account,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="密码">
      	    	{form.getFieldDecorator('password', {
      		        rules: [{ required: true, message: '请输入密码' }],
      		        initialValue: password,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="企业名称">
      	    	{form.getFieldDecorator('companyName', {
      		        rules: [{ required: true, message: '请输入企业名称' }],
      		        initialValue: companyName,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="营业执照号">
      	    	{form.getFieldDecorator('businessLicense', {
      		        rules: [{ required: true, message: '请输入营业执照号' }],
      		        initialValue: businessLicense,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="注册地区">
      	    	{form.getFieldDecorator('registeredArea', {
      		        rules: [{ required: true, message: '请输入注册地区' }],
      		        initialValue: registeredArea,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="注册地址">
      	    	{form.getFieldDecorator('registeredAdress', {
      		        rules: [{ required: true, message: '请输入注册地址' }],
      		        initialValue: registeredAdress,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="企业网址">
      	    	{form.getFieldDecorator('registeredUrl', {
      		        rules: [{ required: true, message: '请输入企业网址' }],
      		        initialValue: registeredUrl,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="联系人">
      	    	{form.getFieldDecorator('contacts', {
      		        rules: [{ required: true, message: '请输入联系人' }],
      		        initialValue: contacts,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="联系电话">
      	    	{form.getFieldDecorator('contactNumber', {
      		        rules: [{ required: true, message: '请输入联系电话' }],
      		        initialValue: contactNumber,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="注册时间">
              	{form.getFieldDecorator('registeredTime',{
              		rules: [{ required: false }],
              		initialValue: registeredTime,
              		})(
      	                <DatePicker
      	                  style={{ width: '100%' }}
      	                  format="YYYY-MM-DD HH:mm:ss"
      	                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
      	                />
      	              )}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="状态">
      	    	{form.getFieldDecorator('state', {
      		        rules: [{ required: true, message: '请输入状态' }],
      		        initialValue: state,
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
