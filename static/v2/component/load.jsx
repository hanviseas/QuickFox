import React from 'react';
import loadStyle from './load.css';

export default class Load extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div className={loadStyle.loading}><span>正在载入...</span></div>
			</div>
		);
	}
}