import React, { Component } from 'react';

export default class test extends Component {
	constructor (props) {
		super(props);
	}

	state = {
		color: 'blue'
	}

	componentDidMount () {
		console.log(arguments);
	}

	render () {
        const { text } = this.props
		return (
			<div>test</div>
		)
	}
}