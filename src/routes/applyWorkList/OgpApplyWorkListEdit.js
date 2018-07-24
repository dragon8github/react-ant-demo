import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Form, Input, Button, Card, message, DatePicker } from 'antd';
import DictSelect from 'components/DictSelect';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
@connect(({ ogpApplyWorkList, dictionary, loading }) => ({
  ogpApplyWorkList,
  dictionary,
  submitting: loading.effects['ogpApplyWorkList/save'],
}))
@Form.create()
export default class OgpApplyWorkListEdit extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { opertype, pid } = params;

    if (opertype === 'edit') {
      dispatch({
        type: 'ogpApplyWorkList/loadDomain',
        payload: pid,
        callback: () => {},
      });
    }

    dispatch({
    	type: 'dictionary/loadDict',
    	codetype: 'apply.work.state',
    });
    dispatch({
    	type: 'dictionary/loadDict',
    	codetype: 'check.state',
    });
  }
  
  handleSave = (fields, isNew, editingKey) => {
	const { dispatch } = this.props;
	let datefields = {};
	if(fields.createTime != undefined){
    	datefields.createTime = fields.createtime.format('YYYY-MM-DD HH:mm:ss');
	} else{
		datefields.createTime = '';
	}
	if(fields.updateTime != undefined){
    	datefields.updateTime = fields.createtime.format('YYYY-MM-DD HH:mm:ss');
	} else{
		datefields.updateTime = '';
	}
	if(fields.archivionTime != undefined){
    	datefields.archivionTime = fields.createtime.format('YYYY-MM-DD HH:mm:ss');
	} else{
		datefields.archivionTime = '';
	}
	dispatch({
        type: 'ogpApplyWorkList/save',
        payload: {
          ...fields,
          isNew,
          applyNo: editingKey,
          ...datefields,
        },
        callback: response => {
          if (response.code === 200) {
            message.success('保存成功');
            dispatch(routerRedux.push('/applyWorkList/ogpApplyWorkList-list'));
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
      ogpApplyWorkList: { domain },
    } = this.props;
    const { getFieldDecorator } = form;
    const { opertype } = params;
    let isNew = true;
    let {
			applyNo,
			companyId,
			companyName,
			projectName,
			crossPointId,
			state,
			operResult,
			enclosureUrl,
			createTime,
			updateTime,
			opinionAnnotation,
			archivionTime,
		} = domain;
    if (opertype === 'edit') {
    	isNew = false;
	  	if (state != undefined && state != null) {
	  		state = state.toString();
	  	}
	  	if (operResult != undefined && operResult != null) {
	  		operResult = operResult.toString();
	  	}
	  	if(createTime != undefined && createTime != null){
	  		createTime = moment(createTime, 'yyyy-MM-dd HH:mm:ss');
	  	}
	  	if(updateTime != undefined && updateTime != null){
	  		updateTime = moment(updateTime, 'yyyy-MM-dd HH:mm:ss');
	  	}
	  	if(archivionTime != undefined && archivionTime != null){
	  		archivionTime = moment(archivionTime, 'yyyy-MM-dd HH:mm:ss');
	  	}
    } else if (opertype === 'add') {
      		applyNo = '';
      		companyId = '';
      		companyName = '';
      		projectName = '';
      		crossPointId = '';
      		state = '';
      		operResult = '';
      		enclosureUrl = '';
      		createTime = '';
      		updateTime = '';
      		opinionAnnotation = '';
      		archivionTime = '';
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
      <PageHeaderLayout title="代办事项" content="" action={action}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="单位ID">
      	    	{form.getFieldDecorator('companyId', {
      		        rules: [{ required: true, message: '请输入单位ID' }],
      		        initialValue: companyId,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="企业名称">
      	    	{form.getFieldDecorator('companyName', {
      		        rules: [{ required: true, message: '请输入企业名称' }],
      		        initialValue: companyName,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="项目名称">
      	    	{form.getFieldDecorator('projectName', {
      		        rules: [{ required: true, message: '请输入项目名称' }],
      		        initialValue: projectName,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="交越点ID">
      	    	{form.getFieldDecorator('crossPointId', {
      		        rules: [{ required: true, message: '请输入交越点ID' }],
      		        initialValue: crossPointId,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="工单状态(apply.work.state)">
      	      {form.getFieldDecorator('state', {
      	          rules: [{ required: true, message: '请输入工单状态(apply.work.state)' }],
      	          initialValue: state,
      	        })(
      	          <DictSelect
      	            placeholder="请选择"
      	            style={{ width: '100%' }}
      	            dictList={dictionary['apply.work.state']}
      	          />
      	        )}
      	    </FormItem>
      		</Col>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="核查结果(check.state)">
      	      {form.getFieldDecorator('operResult', {
      	          rules: [{ required: true, message: '请输入核查结果(check.state)' }],
      	          initialValue: operResult,
      	        })(
      	          <DictSelect
      	            placeholder="请选择"
      	            style={{ width: '100%' }}
      	            dictList={dictionary['check.state']}
      	          />
      	        )}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="附件URL">
      	    	{form.getFieldDecorator('enclosureUrl', {
      		        rules: [{ required: true, message: '请输入附件URL' }],
      		        initialValue: enclosureUrl,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
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
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="修改时间">
              	{form.getFieldDecorator('updateTime',{
              		rules: [{ required: false }],
              		initialValue: updateTime,
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
      	    <FormItem {...formItemLayout} label="意见批注">
      	    	{form.getFieldDecorator('opinionAnnotation', {
      		        rules: [{ required: true, message: '请输入意见批注' }],
      		        initialValue: opinionAnnotation,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
      		<Col md={12} sm={24}>
      	    <FormItem {...formItemLayout} label="归档时间">
              	{form.getFieldDecorator('archivionTime',{
              		rules: [{ required: false }],
              		initialValue: archivionTime,
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
