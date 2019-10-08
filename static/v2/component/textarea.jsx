import React from 'react';
import textareaStyle from './textarea.css';

export default class Textarea extends React.Component {

	static defaultProps = {
		name: 'defaultName', // 命名
		size: 'normal', // 外观大小
		width: '', // 显示宽度
		height: '', // 显示高度
		value: '', // 文本值
		maxLength: 100000, // 最大输入长度
		placeholder: '', // 提示文本
		required: false, // 是否必填
		disabled: false, // 是否禁用
		trim: true, // 是否自动去除首尾空格
		keyUpEvent: () => { }, // 键盘事件
		callback: () => { }, // 回调函数
	};

	constructor(props) {
		super(props);
		this.state = {
			focused: false, // 焦点状态
			required: false, // 必填提示状态
			disabled: this.props.disabled, // 禁用状态
			currentValue: this.props.value, // 当前文本值
		};
		this.keyUpEvent = this.keyUpEvent.bind(this);
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
		this.setCurrentValue = this.setCurrentValue.bind(this);
	}

	componentWillMount() {
		document.addEventListener('keyup', this.keyUpEvent, false);
	}

	componentWillUnmount() {
		document.removeEventListener('keyup', this.keyUpEvent, false);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			disabled: nextProps.disabled,
			currentValue: nextProps.value,
		});
	}

	/**
	 * 键盘事件
	 */
	keyUpEvent(event) {
		this.state.focused && this.props.keyUpEvent.bind(null, event.keyCode)(); // 仅在焦点状态下处理键盘事件
	}

	/**
	 * 设置焦点状态
	 */
	setFocusState() {
		if (this.state.disabled) { // 禁用状态下不可编辑
			return;
		}
		this.setState({
			focused: true,
		});
	}

	/**
	 * 取消焦点状态
	 */
	unsetFocusState(event) {
		if (this.state.disabled) { // 禁用状态下不可编辑
			return;
		}
		let value = event.currentTarget.value;
		this.props.trim && (value = value.trim());
		this.setState({
			focused: false,
			required: (this.props.required === true && value === '') ? true : false,
			currentValue: value,
		}, () => {
			this.props.callback.bind(null, value)(); // 文本值传到回调函数
		});
	}

	/**
	 * 设置当前文本值
	 */
	setCurrentValue(event) {
		if (this.state.disabled) { // 禁用状态下不可编辑
			return;
		}
		this.setState({
			currentValue: event.currentTarget.value,
		}, () => {
			this.props.callback.bind(null, this.state.currentValue)(); // 文本值传到回调函数
		});
	}

	render() {
		let containerWidth = '298px';
		let containerHeight = '120px';
		let textareaWidth = '268px';
		let textareaHeight = '90px';
		if (Number.parseInt(this.props.width)) {
			containerWidth = `${Number.parseInt(this.props.width) - 2}px`;
			textareaWidth = `${Number.parseInt(this.props.width) - 32}px`;
		} else if (this.props.size === 'big') {
			containerWidth = '398px';
			textareaWidth = '368px';
		}
		if (Number.parseInt(this.props.height)) {
			containerHeight = `${Number.parseInt(this.props.height)}px`;
			textareaHeight = `${Number.parseInt(this.props.height) - 30}px`;
		} else if (this.props.size === 'big') {
			containerHeight = '150px';
			textareaHeight = '120px';
		}
		const focusStateClassName = this.state.focused ? textareaStyle.focused : '';
		const requireStateClassName = this.state.required ? textareaStyle.required : '';
		const disableStateClassName = this.state.disabled ? textareaStyle.disabled : '';
		return (
			<div>
				<div className={`${textareaStyle.container} ${focusStateClassName} ${requireStateClassName} ${disableStateClassName}`} style={{ width: containerWidth, height: containerHeight }}>
					<textarea style={{ width: textareaWidth, height: textareaHeight, margin: '15px 15px' }} name={this.props.name} value={this.state.currentValue} maxLength={this.props.maxLength} placeholder={this.props.placeholder} autoComplete='off' onFocus={this.setFocusState} onBlur={this.unsetFocusState} onChange={this.setCurrentValue} />
				</div>
			</div>
		);
	}
}