import React, { Component } from 'react';

export default class test extends Component {
	constructor (props) {
		super(props);
	}

	state = {
		
	}

	componentDidMount () {
	}

	render () {
		return (
			<div style={{ width: '100%', height: window.innerHeight - 100}}>
				<iframe  style={{width: '100%', height: '100%'}} src="http://fuckyou.com/map.html" frameBorder="0"></iframe>
			</div>
		)
	}
}