import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Form, Input, Button, Card, message } from 'antd';
import DictSelect from 'components/DictSelect';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;

@connect(({ example, dictionary, loading }) => ({
  example,
  dictionary,
  submitting: loading.effects['example/save'],
}))
@Form.create()
export default class MainEdit extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { opertype, pid } = params;

    if (opertype === 'edit') {
      dispatch({
        type: 'example/loadDomain',
        payload: pid,
        callback: () => {},
      });
    }

    dispatch({
      type: 'dictionary/loadDict',
      codetype: 'sys.user.state',
    });

    dispatch({
      type: 'dictionary/loadDict',
      codetype: 'sys.account.type',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      form,
      dispatch,
      match: { params },
    } = this.props;
    const { opertype, pid } = params;
    let isNew = true;
    if (opertype === 'edit') {
      isNew = false;
    }
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'example/save',
          payload: {
            ...fieldsValue,
            isNew,
            userid: pid,
          },
          callback: response => {
            if (response.code === 200) {
              message.success('保存成功');
              dispatch(routerRedux.push('/example/main-list'));
            } else {
              message.success('保存失败：[' + response.code + ']' + response.message);
            }
          },
        });
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
      example: { domain },
    } = this.props;
    const { getFieldDecorator } = form;
    const { opertype } = params;
    let isNew = true;
    let { fullname, account, mobile, accounttype } = domain;
    let { status } = domain;
    if (opertype === 'edit') {
      isNew = false;
      if (status) {
        status = status.toString();
      }
    } else if (opertype === 'add') {
      fullname = '';
      account = '';
      mobile = '';
      accounttype = '';
      status = '';
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
      <PageHeaderLayout title="用户管理-表单" content="" action={action}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <Row>
              <Col md={12} sm={24}>
                <FormItem {...formItemLayout} label="用户名称">
                  {getFieldDecorator('fullname', {
                    rules: [{ required: true, message: '' }],
                    initialValue: fullname,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem {...formItemLayout} label="登录账号">
                  {getFieldDecorator('account', {
                    rules: [{ required: true, message: '' }],
                    initialValue: account,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col md={12} sm={24}>
                <FormItem {...formItemLayout} label="密码">
                  {getFieldDecorator('password', {
                    rules: [{ required: isNew, message: '' }],
                    initialValue: '',
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem {...formItemLayout} label="手机号码">
                  {getFieldDecorator('mobile', {
                    rules: [{ required: true, message: '' }],
                    initialValue: mobile,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col md={12} sm={24}>
                <FormItem {...formItemLayout} label="状态">
                  {getFieldDecorator('status', {
                    rules: [{ required: true, message: '' }],
                    initialValue: status,
                  })(
                    <DictSelect
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      dictList={dictionary['sys.user.state']}
                    />
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem {...formItemLayout} label="账户类型">
                  {getFieldDecorator('accounttype', {
                    rules: [{ required: true, message: '' }],
                    initialValue: accounttype,
                  })(
                    <DictSelect
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      dictList={dictionary['sys.account.type']}
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
