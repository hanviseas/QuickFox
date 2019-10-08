import React from 'react';
import $ from 'jquery';
import Input from '../input.jsx';
import searchStyle from './search.css';

export default class SearchInput extends React.Component {

	static defaultProps = {
		waitEnter: true, // 是否等待Enter按键（响应）
		callback: () => { }, // 回调函数
	};

	constructor(props) {
		super(props);
		this.state = {
			currentValue: this.props.value, // 当前文本值
		};
		this.callback = this.callback.bind(this);
		this.enterEvent = this.enterEvent.bind(this);
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
	 * 回调函数
	 * @param value 文本值
	 */
	callback(value) {
		this.setState({
			currentValue: value,
		}, () => {
			this.props.waitEnter || this.props.callback.bind(null, this.state.currentValue)(); // 不等待Enter模式按下则即刻回调
		});
	}

	/**
	 * Enter事件
	 * @param keyCode 键码
	 */
	enterEvent(keyCode) {
		if (Number.parseInt(keyCode) !== 13) { // 只响应Enter事件
			return;
		}
		this.props.waitEnter && this.props.callback.bind(null, this.state.currentValue)(); // 等待Enter模式按下则回调
	}

	render() {
		let newProps = {};
		Object.assign(newProps, this.props);
		newProps.callback = this.callback; // 替换回调函数
		newProps.value = this.state.currentValue;
		const withTitleClassName = (this.props.title !== undefined && this.props.title !== null && this.props.title !== '') ? searchStyle.withTitle : '';
		return (
			<div className={`${searchStyle.searcher} ${withTitleClassName}`}>
				<div>
					<Input {...newProps} keyUpEvent={this.enterEvent} />
				</div>
				<div className={searchStyle.magnifier} onClick={this.enterEvent.bind(null, 13)}>
					<img src={'/static/img/v2/component/magnifier.png'} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon} />
				</div>
			</div>
		);
	}
}