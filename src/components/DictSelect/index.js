import React, { Component } from 'react';
import { Select } from 'antd';

// 数据字典下拉选择框 by hzy
export default class DictSelect extends Component {
  render() {
    const { dictList, ...rest } = this.props;
    const { Option } = Select;
    let selectList = [];
    if (dictList) {
      selectList = dictList.map(item => (
        <Option key={item.codeDef} value={item.codeDef}>
          {item.codename}
        </Option>
      ));
    }
    return <Select {...rest}>{selectList}</Select>;
  }
}
