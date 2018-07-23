import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Form, Input, Button, Card, message, DatePicker } from 'antd';
import DictSelect from 'components/DictSelect';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
@connect(({ ogpPipelineFoundation, dictionary, loading }) => ({
  ogpPipelineFoundation,
  dictionary,
  submitting: loading.effects['ogpPipelineFoundation/save'],
}))
@Form.create()
export default class OgpPipelineFoundationEdit extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { opertype, pid } = params;

    if (opertype === 'edit') {
      dispatch({
        type: 'ogpPipelineFoundation/loadDomain',
        payload: pid,
        callback: () => {},
      });
    }

    dispatch({
    	type: 'dictionary/loadDict',
    	codetype: 'pipeline.state',
    });
    dispatch({
    	type: 'dictionary/loadDict',
    	codetype: 'risk.level',
    });
  }
  
  handleSave = (fields, isNew, editingKey) => {
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
            message.success('保存成功');
            dispatch(routerRedux.push('/opm/ogpPipelineFoundation-list'));
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
      ogpPipelineFoundation: { domain },
    } = this.props;
    const { getFieldDecorator } = form;
    const { opertype } = params;
    let isNew = true;
    let {
			pipelineId,
			dataRecordWay,
			state,
			riskLevel,
			pipelineLength,
			startLocation,
			endLocation,
			coordinateLongitude,
			coordinateLatitude,
			town,
			auditState,
			area,
			company,
		} = domain;
    if (opertype === 'edit') {
    	isNew = false;
    } else if (opertype === 'add') {
      		pipelineId = '';
      		dataRecordWay = '';
      		state = '';
      		riskLevel = '';
      		pipelineLength = '';
      		startLocation = '';
      		endLocation = '';
      		coordinateLongitude = '';
      		coordinateLatitude = '';
      		town = '';
      		auditState = '';
      		area = '';
      		company = '';
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
      <PageHeaderLayout title="管道基础信息" content="" action={action}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="数据录入方式">
      	    	{form.getFieldDecorator('dataRecordWay', {
      		        rules: [{ required: true, message: '请输入数据录入方式' }],
      		        initialValue: dataRecordWay,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="状态">
      	      {form.getFieldDecorator('state', {
      	          rules: [{ required: true, message: '请输入状态' }],
      	          initialValue: state,
      	        })(
      	          <DictSelect
      	            placeholder="请选择"
      	            style={{ width: '100%' }}
      	            dictList={dictionary['pipeline.state']}
      	          />
      	        )}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="风险等级">
      	      {form.getFieldDecorator('riskLevel', {
      	          rules: [{ required: true, message: '请输入风险等级' }],
      	          initialValue: riskLevel,
      	        })(
      	          <DictSelect
      	            placeholder="请选择"
      	            style={{ width: '100%' }}
      	            dictList={dictionary['risk.level']}
      	          />
      	        )}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="油气管道长度">
      	    	{form.getFieldDecorator('pipelineLength', {
      		        rules: [{ required: true, message: '请输入油气管道长度' }],
      		        initialValue: pipelineLength,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="开始位置">
      	    	{form.getFieldDecorator('startLocation', {
      		        rules: [{ required: true, message: '请输入开始位置' }],
      		        initialValue: startLocation,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="结束位置">
      	    	{form.getFieldDecorator('endLocation', {
      		        rules: [{ required: true, message: '请输入结束位置' }],
      		        initialValue: endLocation,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="坐标经度">
      	    	{form.getFieldDecorator('coordinateLongitude', {
      		        rules: [{ required: true, message: '请输入坐标经度' }],
      		        initialValue: coordinateLongitude,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="坐标纬度">
      	    	{form.getFieldDecorator('coordinateLatitude', {
      		        rules: [{ required: true, message: '请输入坐标纬度' }],
      		        initialValue: coordinateLatitude,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="镇街">
      	    	{form.getFieldDecorator('town', {
      		        rules: [{ required: true, message: '请输入镇街' }],
      		        initialValue: town,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="审核状态">
      	    	{form.getFieldDecorator('auditState', {
      		        rules: [{ required: true, message: '请输入审核状态' }],
      		        initialValue: auditState,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="区域">
      	    	{form.getFieldDecorator('area', {
      		        rules: [{ required: true, message: '请输入区域' }],
      		        initialValue: area,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="所属公司">
      	    	{form.getFieldDecorator('company', {
      		        rules: [{ required: true, message: '请输入所属公司' }],
      		        initialValue: company,
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
