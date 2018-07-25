import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Row, Col,
  Divider
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Forms/style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  state = {
      myRows: [],
      planChildren: (function(){
          const children = [];
          for (let i = 10; i < 36; i++) {
            children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
          }
          return children
      }()),
      peopleChildren: (function(){
          const pooplename = []
          '吕浩瀚、章鸿熙、李泽雨、彭鸿羲、马运发、方景浩、谢鸿信、金泽洋、卫哲瀚、吴浩慨、何胤运、史佑运、韦允晨、齐运恒'.split('、').forEach(function (e, i) {
            pooplename.push(<Option key={e}>{e}</Option>);
          });
          return pooplename
      }())
  }

  componentDidMount () {
    // 默认添加一行示例
    this.handleAdd()
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  handleChangeleft = e => {

  }

  handleChangeright = e => {
    
  }

  handleAdd = e => {
     // 如果是第一行，给出示例
     const defaultValue1 = this.state.myRows.length === 0 ? ['李泽雨', '彭鸿羲'] : []
     const defaultValue2 = this.state.myRows.length === 0 ? ['a10', 'c12'] : []
     const index = this.state.myRows.length
     this.state.myRows.push(<Row style={{ marginBottom: 10 }} key={index}>
          <Col xs={11}>
                  <Select
                    mode="multiple"
                    size="large"
                    placeholder="Please select"
                    defaultValue={defaultValue1}
                    onChange={this.handleChangeleft}
                    style={{ width: '100%' }}
                  >
                      {this.state.peopleChildren}
                  </Select>
          </Col>
          <Col xs={11} offset={1}>
                  <Select
                    mode="multiple"
                    size="large"
                    placeholder="Please select"
                    defaultValue={defaultValue2}
                    onChange={this.handleChangeright}
                    style={{ width: '100%' }}
                  >
                      {this.state.planChildren}
                  </Select>
          </Col>
          <Icon onClick={() => {this.handledelete(index)}} type="close-circle" xs={1} style={{ position: 'relative', top: 9, left: 9, cursor: 'pointer' }} />
      </Row>)
      // 更新
      this.forceUpdate()
  }

  // bug：数组问题，可能需要重新设计。
  handledelete = index => {
    this.state.myRows.splice(index, 1)
    this.forceUpdate()
  }

  render() {
    const { submitting, form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout title="巡查计划">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="计划">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入标题',
                  },
                ],
              })(<Input placeholder="给计划起个名字吧！" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="起止日期">
              {getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                    message: '请选择起止日期',
                  },
                ],
              })(<RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="计划描述">
              {getFieldDecorator('goal', {
                rules: [
                  {
                    required: true,
                    message: '请输入计划描述',
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="请输入你的阶段性工作目标"
                  rows={4}
                />
              )}
            </FormItem>
            <div style={{ margin: 'auto', width: '60%' }}>
              <Row>
                <Col xs={11}><Divider><Icon type="user-add" /> 巡查人员</Divider></Col>
                <Col xs={11} offset={1}><Divider><Icon type="bell" /> 巡查任务</Divider></Col>
              </Row>
              
              { this.state.myRows }

              <Button type="dashed" style={{ width: '96%', marginTop: 10 }} icon="plus"onClick={this.handleAdd}>
                    新增一行
              </Button>
            </div>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>保存</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
