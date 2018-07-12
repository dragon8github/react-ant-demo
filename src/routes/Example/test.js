import React, { Component } from 'react';
import { Map } from 'react-amap';

export default class test extends Component {
	constructor (props) {
		super(props);
	}

	state = {
		color: 'blue',
		YOUR_AMAP_KEY: '9f1c132e77dc10edf34fe44bec1208a9',
		VERSION: '1.4.0'
	}

	componentDidMount () {
		console.log(this.state.YOUR_AMAP_KEY);
	}

	render () {
		return (
			<div style={{width: 500, height: 500}}>
				<Map amapkey={this.state.YOUR_AMAP_KEY} VERSION={this.state.VERSION} />
			</div>
		)
	}
}