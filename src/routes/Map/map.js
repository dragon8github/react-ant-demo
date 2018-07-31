import React, { Component, Fragment } from 'react';
import { Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const ButtonGroup = Button.Group;

export default class map extends Component {
	constructor (props) {
		super(props);
	}

	state = {
		
	}

	componentDidMount () {
	}

	render () {
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
			<PageHeaderLayout>
				<div style={{ width: '100%', height: window.innerHeight - 150}}>
					<iframe  style={{width: '100%', height: '100%'}} src="http://fuckyou.com/map.html" frameBorder="0"></iframe>
				</div>
			</PageHeaderLayout>
		)
	}
}