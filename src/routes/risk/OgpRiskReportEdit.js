import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Form, Input, Button, Card, message, DatePicker } from 'antd';
import DictSelect from 'components/DictSelect';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
@connect(({ ogpRiskReport, dictionary, loading }) => ({
  ogpRiskReport,
  dictionary,
  submitting: loading.effects['ogpRiskReport/save'],
}))
@Form.create()
export default class OgpRiskReportEdit extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { opertype, pid } = params;

    if (opertype === 'edit') {
      dispatch({
        type: 'ogpRiskReport/loadDomain',
        payload: pid,
        callback: () => {},
      });
    }

  }
  
  handleSave = (fields, isNew, editingKey) => {
	const { dispatch } = this.props;
	let datefields = {};
	dispatch({
        type: 'ogpRiskReport/save',
        payload: {
          ...fields,
          isNew,
          reportId: editingKey,
          ...datefields,
        },
        callback: response => {
          if (response.code === 200) {
            message.success('保存成功');
            dispatch(routerRedux.push('/risk/ogpRiskReport-list'));
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
      ogpRiskReport: { domain },
    } = this.props;
    const { getFieldDecorator } = form;
    const { opertype } = params;
    let isNew = true;
    let {
			pipeId,
			riskTypeName,
			evaluateMethod,
			recognizeRequire,
			subjest,
			riskPreventMethod,
			rankComent,
			riskRank,
			riskValue,
			disableProb,
			disableEffect,
			reportId,
		} = domain;
    if (opertype === 'edit') {
    	isNew = false;
    } else if (opertype === 'add') {
      		pipeId = '';
      		riskTypeName = '';
      		evaluateMethod = '';
      		recognizeRequire = '';
      		subjest = '';
      		riskPreventMethod = '';
      		rankComent = '';
      		riskRank = '';
      		riskValue = '';
      		disableProb = '';
      		disableEffect = '';
      		reportId = '';
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
      <PageHeaderLayout title="风险报告" content="" action={action}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="管段ID">
      	    	{form.getFieldDecorator('pipeId', {
      		        rules: [{ required: true, message: '请输入管段ID' }],
      		        initialValue: pipeId,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="风险类型名称">
      	    	{form.getFieldDecorator('riskTypeName', {
      		        rules: [{ required: true, message: '请输入风险类型名称' }],
      		        initialValue: riskTypeName,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="风险评价方法">
      	    	{form.getFieldDecorator('evaluateMethod', {
      		        rules: [{ required: true, message: '请输入风险评价方法' }],
      		        initialValue: evaluateMethod,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="危险识别要求">
      	    	{form.getFieldDecorator('recognizeRequire', {
      		        rules: [{ required: true, message: '请输入危险识别要求' }],
      		        initialValue: recognizeRequire,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="结论与建议">
      	    	{form.getFieldDecorator('subjest', {
      		        rules: [{ required: true, message: '请输入结论与建议' }],
      		        initialValue: subjest,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="风险防控措施">
      	    	{form.getFieldDecorator('riskPreventMethod', {
      		        rules: [{ required: true, message: '请输入风险防控措施' }],
      		        initialValue: riskPreventMethod,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="风险等级评价">
      	    	{form.getFieldDecorator('rankComent', {
      		        rules: [{ required: true, message: '请输入风险等级评价' }],
      		        initialValue: rankComent,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="风险等级">
      	    	{form.getFieldDecorator('riskRank', {
      		        rules: [{ required: true, message: '请输入风险等级' }],
      		        initialValue: riskRank,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="风险值">
      	    	{form.getFieldDecorator('riskValue', {
      		        rules: [{ required: true, message: '请输入风险值' }],
      		        initialValue: riskValue,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="管道失效概率">
      	    	{form.getFieldDecorator('disableProb', {
      		        rules: [{ required: true, message: '请输入管道失效概率' }],
      		        initialValue: disableProb,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="管道失效后果">
      	    	{form.getFieldDecorator('disableEffect', {
      		        rules: [{ required: true, message: '请输入管道失效后果' }],
      		        initialValue: disableEffect,
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
