import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Form, Input, Button, Card, message, DatePicker, Transfer } from 'antd';
import DictSelect from 'components/DictSelect';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const RangePicker = DatePicker.RangePicker;


const mockData = [];
'吕浩瀚、章鸿熙、李泽雨、彭鸿羲、马运发、方景浩、谢鸿信、金泽洋、卫哲瀚、吴浩慨、何胤运、史佑运、韦允晨、齐运恒'.split('、').forEach(function (e, i) {
	mockData.push({
			key: i.toString(),
			title: e,
			description: `description of ${e}`,
			disabled: i % 3 < 1,  // 禁用
  });
});

const targetKeys = mockData
  .filter(item => +item.key % 3 > 1)
  .map(item => item.key);


@connect(({ ogpWarningCall, dictionary, loading }) => ({
  ogpWarningCall,
  dictionary,
  submitting: loading.effects['ogpWarningCall/save'],
}))
@Form.create()
export default class OgpWarningCallEdit extends PureComponent {

    state = {
        targetKeys,
        selectedKeys: [],
    }


    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
      this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });

      console.log('sourceSelectedKeys: ', sourceSelectedKeys);
      console.log('targetSelectedKeys: ', targetSelectedKeys);
    }

    handleScroll = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
    }


    handleChange = (nextTargetKeys, direction, moveKeys) => {
      this.setState({ targetKeys: nextTargetKeys });

      console.log('targetKeys: ', targetKeys);
      console.log('direction: ', direction);
      console.log('moveKeys: ', moveKeys);
    }


  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { opertype, pid } = params;

    if (opertype === 'edit') {
      dispatch({
        type: 'ogpWarningCall/loadDomain',
        payload: pid,
        callback: () => {},
      });
    }

    dispatch({
    	type: 'dictionary/loadDict',
    	codetype: 'WARNING_WAY',
    });
  }
  
  handleSave = (fields, isNew, editingKey) => {
	const { dispatch } = this.props;
	let datefields = {};
	if(fields.createTime != undefined){
    	datefields.createTime = fields.createtime // fields.createtime.format('YYYY-MM-DD HH:mm:ss');
	} else{
		datefields.createTime = '';
	}
	dispatch({
        type: 'ogpWarningCall/save',
        payload: {
          ...fields,
          isNew,
          warningCallId: editingKey,
          ...datefields,
        },
        callback: response => {
          if (response.code === 200) {
            message.success('保存成功');
            dispatch(routerRedux.push('/risk/ogpWarningCall-list'));
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
      ogpWarningCall: { domain },
    } = this.props;

    const { getFieldDecorator } = form;
    const { opertype } = params;
    let isNew = true;
    let {
			warningCallId,
			warningCallName,
			callWay,
			callAccount,
			callName,
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
      		warningCallId = '';
      		warningCallName = '';
      		callWay = '';
      		callAccount = '';
      		callName = '';
      		createTime = '';
      		createAccount = '';
      		createName = '';
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 20 },
        md: { span: 20 },
        lg: { span: 20 },
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
      <PageHeaderLayout title="预警机制" content="" action={action}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8, maxWidth: 700 }}>
          <Row>
      		<Col md={24} sm={24}>
      	    <FormItem {...formItemLayout} label="预警机制名称">
      	    	{form.getFieldDecorator('warningCallName', {
      		        rules: [{ required: true, message: '请输入预警机制名称' }],
      		        initialValue: warningCallName,
      		      })(<Input placeholder="请输入" />)}
      	    </FormItem>
      		</Col>
          </Row>
          <Row>
          <Col md={24} sm={24}>
      	    <FormItem {...formItemLayout} label="预警通知方式">
      	      {form.getFieldDecorator('callWay', {
      	          rules: [{ required: true, message: '请输入预警通知方式' }],
      	          initialValue: callWay,
      	        })(
      	          <DictSelect
      	            placeholder="请选择"
      	            style={{ width: '100%' }}
      	            dictList={dictionary['WARNING_WAY']}
      	          />
      	        )}
      	    </FormItem>
      		</Col>
          </Row>
          
          <Row>
            <Col md={24} sm={24}>
              <FormItem {...formItemLayout} label="创建时间">
                  {form.getFieldDecorator('createTime',{
                    rules: [{ required: false }],
                    initialValue: createTime,
                    })(
                      <RangePicker placeholder={['开始日期', '结束日期']} style={{width: '100%'}} />
                  )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col md={24} sm={24}>
              <FormItem {...formItemLayout} label="预警规则">
                {form.getFieldDecorator('callWay', {
                    rules: [{ required: true, message: '请输入预警规则' }],
                    initialValue: callWay,
                  })(
                    <DictSelect
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      dictList={dictionary['WARNING_WAY']}
                    />
                  )}
              </FormItem>
            </Col>
          </Row>

          <Row>
                <Col md={24} sm={24}>
                  <FormItem  {...formItemLayout}  label="通知对象">  
                    <Transfer 
                      showSearch
                      dataSource={mockData}
                      listStyle={{
                      width: 268,
                      height: 300,
                      }}
                      titles={['通知人员', '已选人员']}
                      targetKeys={this.state.targetKeys}
                      selectedKeys={this.state.selectedKeys}
                      onChange={this.handleChange}
                      onSelectChange={this.handleSelectChange}
                      onScroll={this.handleScroll}
                      render={item => item.title}
                    />
                  </FormItem>
                </Col>
          </Row>        
              
      	  <Row>
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
