import React from 'react';
import globalStyle from '../public/global.css';
import labelStyle from './label.css';

export default class Label extends React.Component {

	static defaultProps = {
		text: '', // 标签文本
	};

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div className={labelStyle.label}>
					<div>
						<div><span className={globalStyle.autoHidden}>{this.props.text}</span></div>
					</div>
				</div>
				<div className={labelStyle.line}></div>
			</div>
		);
	}
}