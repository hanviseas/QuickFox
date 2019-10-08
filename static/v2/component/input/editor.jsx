import React from 'react';
import $ from 'jquery';
import Input from '../input.jsx';
import globalStyle from '../../public/global.css';
import editorStyle from './editor.css';

export default class Editor extends React.Component {

	static defaultProps = {
		disabled: false, // 是否禁用
		callback: () => { }, // 回调函数
	};

	constructor(props) {
		super(props);
		this.state = {
			currentValue: this.props.value, // 当前文本值
			tmpValue: this.props.value, // 临时文本值
			editing: false, // 编辑状态
		};
		this.edit = this.edit.bind(this);
		this.setTmpValue = this.setTmpValue.bind(this);
		this.compeleteEdit = this.compeleteEdit.bind(this);
		this.cancelEdit = this.cancelEdit.bind(this);
		this.keyEvent = this.keyEvent.bind(this);
	}

	componentWillMount() {
		document.addEventListener('keyup', this.keyUpEvent, false);
	}

	componentWillUnmount() {
		document.removeEventListener('keyup', this.keyUpEvent, false);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			currentValue: nextProps.value,
		});
	}

	/**
	 * 激活图标
	 */
	activateIcon(event) {
		$(event.currentTarget).attr('src', $(event.currentTarget).attr('src').replace('.png', '-actived.png'));
	}

	/**
	 * 不激活图标
	 */
	deactivateIcon(event) {
		$(event.currentTarget).attr('src', $(event.currentTarget).attr('src').replace('-actived.png', '.png'));
	}

	/**
	 * 编辑
	 */
	edit() {
		this.setState({
			tmpValue: this.state.currentValue,
			editing: true,
		});
	}

	/**
	 * 设置临时文本值
	 * @param value 临时文本值
	 */
	setTmpValue(value) {
		this.setState({
			tmpValue: value,
		});
	}

	/**
	 * 完成编辑
	 */
	compeleteEdit() {
		this.setState({
			currentValue: this.state.tmpValue,
			editing: false,
		}, () => {
			this.props.callback.bind(null, this.state.currentValue)(); // 文本值传到回调函数
		});
	}

	/**
	 * 取消编辑
	 */
	cancelEdit() {
		this.setState({
			editing: false,
		});
	}

	/**
	 * 键盘事件
	 * @param keyCode 键码
	 */
	keyEvent(keyCode) {
		if (Number.parseInt(keyCode) === 13) { // Enter事件
			this.compeleteEdit();
		} else if (Number.parseInt(keyCode) === 27) { // Esc事件
			this.setState({
				editing: false,
			});
		}
	}

	render() {
		let newProps = {};
		Object.assign(newProps, this.props);
		newProps.callback = this.setTmpValue; // 替换回调函数
		newProps.value = this.state.tmpValue;
		if (this.state.editing) { // 编辑状态显示输入框
			return (
				<div className={editorStyle.container}>
					<div>
						<Input {...newProps} keyUpEvent={this.keyEvent} />
					</div>
					<div onClick={this.compeleteEdit}>
						<img src={`/static/img/v2/component/compelete.png`} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon} />
					</div>
					<div onClick={this.cancelEdit}>
						<img src={`/static/img/v2/component/cancel.png`} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon} />
					</div>
				</div>
			);
		} else { // 非编辑状态显示文本
			return (
				<div className={editorStyle.container} onClick={this.props.disabled || this.editing ? null : this.edit}><span className={globalStyle.autoHidden}>{this.state.currentValue}</span></div>
			);
		}
	}
}