import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Form, Input, Button, Card, message, DatePicker } from 'antd';
import DictSelect from 'components/DictSelect';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
@connect(({ ogpRiskInfo, dictionary, loading }) => ({
  ogpRiskInfo,
  dictionary,
  submitting: loading.effects['ogpRiskInfo/save'],
}))
@Form.create()
export default class OgpRiskInfoEdit extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { opertype, pid } = params;

    if (opertype === 'edit') {
      dispatch({
        type: 'ogpRiskInfo/loadDomain',
        payload: pid,
        callback: () => {},
      });
    }

  }
  
  handleSave = (fields, isNew, editingKey) => {
	const { dispatch } = this.props;
	let datefields = {};
	dispatch({
        type: 'ogpRiskInfo/save',
        payload: {
          ...fields,
          isNew,
          riskInfoId: editingKey,
          ...datefields,
        },
        callback: response => {
          if (response.code === 200) {
            message.success('保存成功');
            dispatch(routerRedux.push('/risk/ogpRiskInfo-list'));
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
      ogpRiskInfo: { domain },
    } = this.props;
    const { getFieldDecorator } = form;
    const { opertype } = params;
    let isNew = true;
    let {
			riskInfoId,
			riskState,
			nowRiskRank,
			preRiskRank,
			riskPointNo,
			riskPointName,
			riskType,
		} = domain;
    if (opertype === 'edit') {
    	isNew = false;
    } else if (opertype === 'add') {
      		riskInfoId = '';
      		riskState = '';
      		nowRiskRank = '';
      		preRiskRank = '';
      		riskPointNo = '';
      		riskPointName = '';
      		riskType = '';
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
      <PageHeaderLayout title="风险点信息" content="" action={action}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="风险状态">
      	    	{form.getFieldDecorator('riskState', {
      		        rules: [{ required: true, message: '请输入风险状态' }],
      		        initialValue: riskState,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="当前风险安全等级">
      	    	{form.getFieldDecorator('nowRiskRank', {
      		        rules: [{ required: true, message: '请输入当前风险安全等级' }],
      		        initialValue: nowRiskRank,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="推测风险安全等级">
      	    	{form.getFieldDecorator('preRiskRank', {
      		        rules: [{ required: true, message: '请输入推测风险安全等级' }],
      		        initialValue: preRiskRank,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="风险点编号">
      	    	{form.getFieldDecorator('riskPointNo', {
      		        rules: [{ required: true, message: '请输入风险点编号' }],
      		        initialValue: riskPointNo,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="风险点名称">
      	    	{form.getFieldDecorator('riskPointName', {
      		        rules: [{ required: true, message: '请输入风险点名称' }],
      		        initialValue: riskPointName,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="风险类型名称">
      	    	{form.getFieldDecorator('riskType', {
      		        rules: [{ required: true, message: '请输入风险类型名称' }],
      		        initialValue: riskType,
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
