import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Form, Input, Button, Card, message, DatePicker } from 'antd';
import DictSelect from 'components/DictSelect';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
@connect(({ ogpWarningCallUser, dictionary, loading }) => ({
  ogpWarningCallUser,
  dictionary,
  submitting: loading.effects['ogpWarningCallUser/save'],
}))
@Form.create()
export default class OgpWarningCallUserEdit extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { opertype, pid } = params;

    if (opertype === 'edit') {
      dispatch({
        type: 'ogpWarningCallUser/loadDomain',
        payload: pid,
        callback: () => {},
      });
    }

  }
  
  handleSave = (fields, isNew, editingKey) => {
	const { dispatch } = this.props;
	let datefields = {};
	dispatch({
        type: 'ogpWarningCallUser/save',
        payload: {
          ...fields,
          isNew,
          account: editingKey,
          ...datefields,
        },
        callback: response => {
          if (response.code === 200) {
            message.success('保存成功');
            dispatch(routerRedux.push('/risk/ogpWarningCallUser-list'));
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
      ogpWarningCallUser: { domain },
    } = this.props;
    const { getFieldDecorator } = form;
    const { opertype } = params;
    let isNew = true;
    let {
			account,
			name,
			mobile,
			email,
		} = domain;
    if (opertype === 'edit') {
    	isNew = false;
    } else if (opertype === 'add') {
      		account = '';
      		name = '';
      		mobile = '';
      		email = '';
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
      <PageHeaderLayout title="预警通知人员" content="" action={action}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="姓名">
      	    	{form.getFieldDecorator('name', {
      		        rules: [{ required: true, message: '请输入姓名' }],
      		        initialValue: name,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="手机">
      	    	{form.getFieldDecorator('mobile', {
      		        rules: [{ required: true, message: '请输入手机' }],
      		        initialValue: mobile,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="邮件">
      	    	{form.getFieldDecorator('email', {
      		        rules: [{ required: true, message: '请输入邮件' }],
      		        initialValue: email,
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
