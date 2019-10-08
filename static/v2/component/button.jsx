import React from 'react';
import globalStyle from '../public/global.css';
import buttonStyle from './button.css';

export default class Button extends React.Component {

	static defaultProps = {
		type: '', // 按钮类型
		text: '', // 按钮文本
		size: 'normal', // 外观大小
		width: '', // 显示宽度
		height: '', // 显示高度
	};

	constructor(props) {
		super(props);
	}

	render() {
		let buttonWidth = '100px';
		let buttonHeight = '30px';
		if (Number.parseInt(this.props.width)) {
			buttonWidth = `${Number.parseInt(this.props.width)}px`;
		} else if (this.props.size === 'big') {
			buttonWidth = '200px';
		}
		if (Number.parseInt(this.props.height)) {
			buttonHeight = `${Number.parseInt(this.props.height)}px`;
		} else if (this.props.size === 'big') {
			buttonHeight = '40px';
		}
		const buttonType = buttonStyle[this.props.type];
		return (
			<div className={`${buttonStyle.button} ${buttonType}`} style={{ width: buttonWidth, height: buttonHeight, lineHeight: buttonHeight }} onClick={this.props.onClick}>
				<div>
					<div><span className={globalStyle.autoHidden}>{this.props.text}</span></div>
				</div>
			</div>
		);
	}
}