import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import windowStyle from './window.css';

class Window extends React.Component {

	static defaultProps = {
		displayed: false, // 显示状态
		layout: 'standard', // 布局
		size: 'normal', // 外观大小
		level: '', // 层级
		width: '', // 显示宽度
		height: '', // 显示高度
		title: '', // 标题
		submitHandler: '', // 提交处理器（触发提交事件的元素）
		cancelHandler: '', // 取消处理器（触发取消事件的元素）
		closeWindow: () => { }, // 关闭窗口函数
	};

	constructor(props) {
		super(props);
		this.keyUpEvent = this.keyUpEvent.bind(this);
		this.closeWindow = this.closeWindow.bind(this);
	}

	componentWillMount() {
		document.addEventListener('keyup', this.keyUpEvent, false);
	}

	componentWillUnmount() {
		document.removeEventListener('keyup', this.keyUpEvent, false);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) { // 设置背板滚动
			this.props.dispatch({
				type: 'SET_SHADE',
				shade: true,
			});
		} else { // 恢复背板滚动
			this.props.dispatch({
				type: 'SET_SHADE',
				shade: false,
			});
		}
	}

	/**
	 * 键盘事件
	 * @param event 事件
	 */
	keyUpEvent(event) {
		if (!this.props.displayed) { // 仅在显示状态下处理键盘事件
			return;
		}
		if (event.ctrlKey && Number.parseInt(event.keyCode) === 13) { // Ctrl+Enter事件
			this.props.submitHandler.props.callback.bind(null)();
		} else if (event.ctrlKey && Number.parseInt(event.keyCode) === 81) { // Ctrl+Q事件
			this.props.closeWindow.bind(null)();
		}
	}

	/**
	 * 关闭窗口
	 */
	closeWindow() {
		this.props.closeWindow.bind(null)(); // 点击遮罩层时执行
	}

	/**
	 * 激活图标
	 */
	activateIcon(event) {
		$(event.currentTarget).find('img').attr('src', $(event.currentTarget).find('img').attr('src').replace('.png', '-actived.png'));
	}

	/**
	 * 不激活图标
	 */
	deactivateIcon(event) {
		$(event.currentTarget).find('img').attr('src', $(event.currentTarget).find('img').attr('src').replace('-actived.png', '.png'));
	}

	render() {
		if (!this.props.displayed) { // 非显示状态返回空
			return null;
		}
		let layoutStyle = {};
		let contentStyle = {};
		let handlerStyle = {};
		if (this.props.size === 'full') {
			layoutStyle = {
				width: '100%',
				height: '100%',
				top: '0px',
				left: '0px',
				bottom: '0px',
				left: '0px'
			}
			contentStyle = { position: 'absolute', top: '60px', right: '0px', bottom: '120px', left: '0px' };
			handlerStyle = { position: 'absolute', right: '0px', bottom: '60px', left: '0px' };
		} else if (this.props.size === 'big') {
			layoutStyle = {
				width: Number.parseInt(this.props.width) ? Number.parseInt(this.props.width) : '800px',
				height: Number.parseInt(this.props.height) ? Number.parseInt(this.props.height) : '800px',
				marginTop: Number.parseInt(this.props.height) ? `${0 - Number.parseInt(this.props.height) / 2}px` : '-400px',
				marginLeft: Number.parseInt(this.props.width) ? `${0 - Number.parseInt(this.props.width) / 2}px` : '-400px',
			}
			contentStyle = { height: Number.parseInt(this.props.height) ? `${Number.parseInt(this.props.height) - 150}px` : '650px' };
		} else {
			layoutStyle = {
				width: Number.parseInt(this.props.width) ? Number.parseInt(this.props.width) : '600px',
				height: Number.parseInt(this.props.height) ? Number.parseInt(this.props.height) : '600px',
				marginTop: Number.parseInt(this.props.height) ? `${0 - Number.parseInt(this.props.height) / 2}px` : '-300px',
				marginLeft: Number.parseInt(this.props.width) ? `${0 - Number.parseInt(this.props.width) / 2}px` : '-300px',
			}
			contentStyle = { height: Number.parseInt(this.props.height) ? `${Number.parseInt(this.props.height) - 150}px` : '450px' };
		}
		const windowLayout = windowStyle[`${this.props.layout}Layout`];
		const windowLevel = windowStyle[`level${this.props.level}`];
		return (
			<div>
				<div className={`${windowStyle.window} ${windowLayout} ${windowLevel}`} style={layoutStyle}>
					<div className={windowStyle.title}>
						<span>{this.props.title}</span>
						<div className={windowStyle.closeButton} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon} onClick={this.closeWindow}>
							<img src={`/static/img/v2/component/quit.png`} title={'关闭'} />
						</div>
					</div>
					<div className={windowStyle.content} style={contentStyle}>
						{this.props.children /* 窗口内容套在Window组件子级元素中 */}
					</div>
					<div className={`${windowStyle.handler} ${windowLayout}`} style={handlerStyle}>
						{
							this.props.submitHandler === '' ? null : (() => { // 未传入提交处理器则不显示内容
								return (
									<div onClick={this.props.submitHandler.props.callback.bind(null)}>
										{this.props.submitHandler /* 提交处理器需要指定回调函数以检查表单并决定是否关闭窗口 */}
									</div>
								);
							})()
						}
						{
							this.props.cancelHandler === '' ? null : (() => { // 未传入取消处理器则不显示内容
								return (
									<div onClick={this.closeWindow}>
										{this.props.cancelHandler /* 提交处理器直接关闭窗口 */}
									</div>
								);
							})()
						}
					</div>
				</div>
				<div className={`${windowStyle.lockLayer} ${windowLevel}`} onClick={this.closeWindow}></div> { /* 窗口蒙层 */}
			</div>
		);
	}
}

export default connect()(Window);