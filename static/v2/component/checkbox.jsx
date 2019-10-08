import React from 'react';
import $ from 'jquery';
import checkboxStyle from './checkbox.css';

export default class Checkbox extends React.Component {

	static defaultProps = {
		title: '', // 标题
		name: 'defaultName', // 命名
		options: [], // 选项数组
		callback: () => { }, // 回调函数
	};

	constructor(props) {
		super(props);
		this.state = {
			options: this.props.options, // 选项值
		};
		this.setOptions = this.setOptions.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			options: nextProps.options,
		});
	}

	/**
	 * 设置选项值
	 * @param index 索引
	 * @param value 选项值
	 * @param disabled 禁用状态
	 * @param mutex 互斥选项
	 */
	setOptions(index, value, disabled, mutex) {
		if (disabled) { // 禁用状态下不可编辑
			return;
		}
		let options = this.state.options;
		Array.from(options, (option) => {
			try {
				if (option.index === index) {
					option.value = value;
				} else if (value && Array.isArray(mutex) && mutex.includes(option.index)) { // 选中状态关闭互斥的选项
					option.value = false;
				}
			} catch (e) {
				// 不做处理
			}
		});
		this.setState({
			options: options,
		}, () => {
			let values = [];
			Array.from(options, (option) => { // 选中的选项返回值
				option.value && values.push(option.index);
			});
			this.props.callback.bind(null, values)(); // 选项值传到回调函数
		});
	}

	render() {
		return (
			<div>
				<div><span className={checkboxStyle.title}>{this.props.title}</span></div>
				<div className={checkboxStyle.options}>
					{
						this.state.options.map((option) => {
							return <Option key={option.index} {...option} setOptions={this.setOptions} />
						})
					}
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
		};
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
	}

	/**
	 * 设置焦点状态
	 */
	setFocusState(event) {
		if (this.props.disabled) { // 禁用状态下不响应
			return;
		}
		this.setState({
			focused: true,
		});
		$(event.currentTarget).find('img').attr('src', $(event.currentTarget).find('img').attr('src').replace('.png', '-actived.png'));
	}

	/**
	 * 取消焦点状态
	 */
	unsetFocusState(event) {
		if (this.props.disabled) { // 禁用状态下不响应
			return;
		}
		this.setState({
			focused: false,
		});
		$(event.currentTarget).find('img').attr('src', $(event.currentTarget).find('img').attr('src').replace('-actived.png', '.png'));

	}

	render() {
		const checkboxImg = (() => {
			let imgName = 'checkbox';
			this.props.value && (imgName += '-selected');
			this.state.focused && (imgName += '-actived');
			this.props.disabled && (imgName += '-disabled');
			return '/static/img/v2/component/' + imgName + '.png';
		})();
		const focusStateClassName = this.state.focused ? checkboxStyle.focused : '';
		return (
			<div onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState} onClick={this.props.setOptions.bind(null, this.props.index, !this.props.value, this.props.disabled, this.props.mutex)}>
				<div>
					<img src={checkboxImg} />
				</div>
				<div className={focusStateClassName}><span>{this.props.text}</span></div>
			</div>
		);
	}
}