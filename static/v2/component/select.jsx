import React from 'react';
import globalStyle from '../public/global.css';
import selectStyle from './select.css';

export default class Select extends React.Component {

	static defaultProps = {
		title: '', // 标题
		name: 'defaultName', // 命名
		size: 'normal', // 外观大小
		width: '', // 显示宽度
		height: '', // 显示高度
		options: [], // 选项数组
		index: undefined, // 当前索引值
		required: false, // 是否必填
		disabled: false, // 是否禁用
		callback: () => { }, // 回调函数
	};

	constructor(props) {
		super(props);
		this.state = {
			focused: false, // 焦点状态
			required: false, // 必填提示状态
			disabled: this.props.disabled, // 禁用状态
			folded: true, // 选项折叠状态
			currentIndex: this.props.index, // 当前选项索引
			currentValue: this.findValueByIndex(this.props.index, this.props.options), // 当前选项文本
		};
		this.hiddenOptions = this.hiddenOptions.bind(this);
		this.changeOptionsViewState = this.changeOptionsViewState.bind(this);
		this.setCurrentOption = this.setCurrentOption.bind(this);
	}

	componentWillMount() {
		document.addEventListener('click', this.hiddenOptions, false);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.hiddenOptions, false);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			disabled: nextProps.disabled,
			currentIndex: nextProps.index,
			currentValue: this.findValueByIndex(nextProps.index, nextProps.options),
		});
	}

	/**
	 * 获取索引对应的文本值
	 * @param index 索引
	 * @return value 文本值
	 */
	findValueByIndex(index, options) {
		let value = '';
		for (const option of options) {
			try {
				option.index === index && (value = option.value);
			} catch (e) {
				value = '';
			}
		}
		return value;
	}

	/**
	 * 隐藏选项
	 */
	hiddenOptions() {
		this.setState({
			focused: false,
			folded: true,
		});
	}

	/**
	 * 改变选项显示状态
	 */
	changeOptionsViewState(event) {
		event.nativeEvent.stopImmediatePropagation();
		if (this.state.disabled) { // 禁用状态下不可编辑
			return;
		}
		this.setState({
			focused: this.state.folded ? true : false,
			required: (this.props.required === true && !this.state.folded && this.state.currentIndex === undefined) ? true : false,
			folded: !this.state.folded,
		});
	}

	/**
	 * 设置当前选项
	 * @param index 索引
	 */
	setCurrentOption(index, event) {
		event.nativeEvent.stopImmediatePropagation();
		if (this.state.disabled) { // 禁用状态下不可编辑
			return;
		}
		const value = this.findValueByIndex(index, this.props.options);
		this.setState({
			focused: false,
			required: (this.props.required === true && index === undefined) ? true : false,
			folded: true,
			currentIndex: index,
			currentValue: value,
		}, () => {
			this.props.callback.bind(null, {
				index: index,
				value: value,
			})(); // 选中值传到回调函数
		});
	}

	render() {
		let selectWidth = '300px';
		let optionsWidth = '298px';
		let optionsHeight = '30px';
		if (Number.parseInt(this.props.width)) {
			selectWidth = `${Number.parseInt(this.props.width)}px`;
			optionsWidth = `${Number.parseInt(this.props.width) - 2}px`;
		} else if (this.props.size === 'big') {
			selectWidth = '400px';
			optionsWidth = '398px';
		}
		if (Number.parseInt(this.props.height)) {
			optionsHeight = `${Number.parseInt(this.props.height)}px`;
		} else if (this.props.size === 'big') {
			optionsHeight = '40px';
		}
		const focusStateClassName = this.state.focused ? selectStyle.focused : '';
		const requireStateClassName = this.state.required ? selectStyle.required : '';
		const disableStateClassName = this.state.disabled ? selectStyle.disabled : '';
		const foldStateClassName = this.state.folded ? selectStyle.folded : '';
		return (
			<div style={{ width: selectWidth }}>
				<div><span className={selectStyle.title}>{this.props.title}</span></div>
				<div>
					<div className={selectStyle.arrow}></div>
					<div className={`${selectStyle.currentOption} ${focusStateClassName} ${requireStateClassName} ${disableStateClassName}`} style={{ height: optionsHeight, lineHeight: optionsHeight }} onClick={this.changeOptionsViewState}><span className={globalStyle.autoHidden}>{this.state.currentValue}</span></div>
					<div className={`${selectStyle.options} ${foldStateClassName}`} style={{ width: optionsWidth }}>
						{
							this.props.options.map((option) => {
								return <Option key={option.index} index={option.index} value={option.value} currentIndex={this.state.currentIndex} setCurrentOption={this.setCurrentOption} />
							})
						}
					</div>
				</div>
			</div>
		);
	}
}

class Option extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			focused: false, // 焦点（鼠标移至上方）状态
			selected: false, // 选中状态
		};
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
	}

	/**
	 * 设置焦点状态
	 */
	setFocusState() {
		this.setState({
			focused: true,
		});
	}

	/**
	 * 取消焦点状态
	 */
	unsetFocusState() {
		this.setState({
			focused: false,
		});
	}

	render() {
		const selected = (this.props.index === this.props.currentIndex) ? true : false; // 当选项索引等于当前索引时，设置选中状态
		const focusStateClassName = this.state.focused && !selected ? selectStyle.focused : '';
		const selectStateClassName = selected ? selectStyle.selected : '';
		return (
			<div className={`${focusStateClassName} ${selectStateClassName}`} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState} onClick={this.props.setCurrentOption.bind(null, this.props.index)}><span className={globalStyle.autoHidden}>{this.props.value}</span></div>
		);
	}
}