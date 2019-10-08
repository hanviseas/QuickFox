import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import { generateRandString } from '../../../util/generator.jsx';
import Window from '../../../component/window.jsx';
import Input from '../../../component/input.jsx';
import Button from '../../../component/button.jsx';
import applicationStyle from './application.css';

class ApplicationWindow extends React.Component {

	static defaultProps = {
		id: 0, // 应用ID
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.state = {
			applicationName: '', // 应用名称
			applicationSecret: '', // 应用密钥
		};
		this.fetchApplication = this.fetchApplication.bind(this);
		this.setApplicationName = this.setApplicationName.bind(this);
		this.setApplicationSecret = this.setApplicationSecret.bind(this);
		this.resetSecret = this.resetSecret.bind(this);
		this.saveApplication = this.saveApplication.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.setState({
				applicationName: '',
				applicationSecret: '',
			}, () => { this.fetchApplication() });
		}
	}

	/**
	 * 获取应用信息
	 */
	fetchApplication() {
		if (this.props.id === 0) { // 无id属性传入时，代表新建，无需获取信息
			this.setState({
				applicationSecret: generateRandString(8) + '-' + generateRandString(8) + '-' + generateRandString(8) + '-' + generateRandString(8),
			});
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/application/${this.props.id}`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			_this.setState({
				applicationName: json.name,
				applicationSecret: json.secret
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 设置应用名称
	 * @param name 应用名称
	 */
	setApplicationName(name) {
		this.setState({
			applicationName: name,
		});
	}

	/**
	 * 设置应用密钥
	 * @param secret 应用密钥
	 */
	setApplicationSecret(secret) {
		this.setState({
			applicationSecret: secret,
		});
	}

	/**
	 * 重置密钥
	 */
	resetSecret() {
		this.setState({
			applicationSecret: generateRandString(8) + '-' + generateRandString(8) + '-' + generateRandString(8) + '-' + generateRandString(8),
		});
	}

	/**
	 * 保存应用
	 */
	saveApplication() {
		if (this.state.applicationName.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '应用名称不能为空' },
			}); // 发送通知
			return;
		}
		const _this = this;
		if (this.props.id > 0) { // 更新应用
			const result = fetch(`${domainPath}/v2/post/api/application/${this.props.id}`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					application_name: this.state.applicationName,
					application_secret: this.state.applicationSecret,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				if (json.code === '000000') { // 请求成功
					_this.props.callback.bind(null, _this.state.applicationName, _this.state.applicationSecret)();
					_this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 1, content: json.message },
					}); // 发送通知
				} else {
					_this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 0, content: json.message },
					}); // 发送通知

				}
			}).catch(function (e) {
				console.log(e);
			});
		} else { // 新建应用
			const result = fetch(`${domainPath}/v2/put/api/application`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					application_name: this.state.applicationName,
					application_secret: this.state.applicationSecret,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				if (json.code === '000000') { // 请求成功
					_this.props.callback.bind(null, Number.parseInt(json.message), _this.state.applicationName, _this.state.applicationSecret)();
					_this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 1, content: `应用创建成功：${json.message}` },
					}); // 发送通知
				} else {
					_this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 0, content: json.message },
					}); // 发送通知

				}
			}).catch(function (e) {
				console.log(e);
			});
		}
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

	/**
	 * 渲染图标
	 * @param name 图像名
	 * @param title 提示文本
	 */
	renderIcon(name, title) {
		return (
			<div className={applicationStyle.icon} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon}>
				<img src={`/static/img/v2/application/icon-${name}.png`} title={title} />
			</div>
		);
	}

	render() {
		return (
			<Window displayed={this.props.displayed} height='310' title={this.props.id === 0 ? '创建应用' : '更新应用'} submitHandler={<Button text='保存' callback={this.saveApplication} />} closeWindow={this.props.closeWindow}>
				<div>
					<Input width='500' name='applicationName' value={this.state.applicationName} maxLength='50' placeholder='应用名称，如：teambition' required={true} callback={this.setApplicationName} />
				</div>
				<div className={applicationStyle.secret}>
					<div>
						<Input className={applicationStyle.secret} width='469' name='applicationSecret' value={this.state.applicationSecret} maxLength='50' placeholder='应用密钥' disabled={true} required={true} callback={this.setApplicationSecret} />
					</div>
					<div>
						<div onClick={this.resetSecret}>{this.renderIcon('reset', '更新密钥')}</div>
					</div>
				</div>
			</Window>
		);
	}
}

export default connect()(ApplicationWindow);