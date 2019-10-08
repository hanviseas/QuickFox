import React from 'react';
import { version, domainPath } from '../config/system.jsx';
import { encodeParams } from '../util/http.jsx';
import Input from '../component/input.jsx';
import Button from '../component/button.jsx';
import loginStyle from './login.css';

export default class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			username: '', // 登录帐号
			password: '', // 验证密码
			errorMessage: '', // 错误消息
		};
		this.keyUpEvent = this.keyUpEvent.bind(this);
		this.setUsername = this.setUsername.bind(this);
		this.setPassword = this.setPassword.bind(this);
		this.setErrorMessage = this.setErrorMessage.bind(this);
		this.login = this.login.bind(this);
		this.renderErrorMessage = this.renderErrorMessage.bind(this);
	}

	componentWillMount() {
		document.addEventListener('keyup', this.keyUpEvent, false);
	}

	componentWillUnmount() {
		document.removeEventListener('keyup', this.keyUpEvent, false);
	}

	/**
	 * 键盘事件
	 */
	keyUpEvent(event) {
		if (Number.parseInt(event.keyCode) !== 13) { // 只响应Enter事件
			return;
		}
		this.login();
	}

	/**
	 * 设置登录帐号
	 * @param username 登录帐号
	 */
	setUsername(name) {
		this.setState({
			username: name,
		});
	}

	/**
	 * 设置验证密码
	 * @param password 验证密码
	 */
	setPassword(password) {
		this.setState({
			password: password,
		});
	}

	/**
	 * 设置错误消息
	 * @param message 错误消息
	 */
	setErrorMessage(message) {
		this.setState({
			errorMessage: message,
		});
	}

	/**
	 * 登录
	 */
	login() {
		if (this.state.username.trim() === '') { // 参数检查
			this.setErrorMessage('错误：登录帐号不能为空');
			return;
		}
		if (this.state.password.trim() === '') { // 参数检查
			this.setErrorMessage('错误：验证密码不能为空');
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/auth/account`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				username: this.state.username,
				password: this.state.password,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			if (json.code === '000000') { // 请求成功
				window.location.href = '/';
				return;
			} else {
				_this.setErrorMessage('错误：帐号验证失败，请检查您的登录信息');
			}
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 渲染错误信息
	 */
	renderErrorMessage() {
		if (this.state.errorMessage === '') {
			return null;
		}
		return (
			<div className={loginStyle.errorMessage}><span>{this.state.errorMessage}</span></div>
		);
	}

	render() {
		return (
			<div className={loginStyle.board}>
				<div>
					<div>
						<img src='/static/img/v2/public/logo-60.png' />
						<img src='/static/img/v2/public/logo2.png' />
					</div>
					<div><span>{version}</span></div>
					<div>
						<Input size='big' width='350' name='username' value={this.state.username} maxLength='20' placeholder='登录帐号' required={true} callback={this.setUsername} />
					</div>
					<div>
						<Input size='big' width='350' name='password' type='password' value={this.state.password} maxLength='20' placeholder='验证密码' required={true} callback={this.setPassword} />
					</div>
					<div>
						<Button size='big' width='350' text='登录' onClick={this.login} />
					</div>
					<div>
						<Button type='green' size='big' width='350' text='Teambition 帐号登录' onClick={() => { window.location.href = `${domainPath}/v2/g/third/teambition` }} />
					</div>
					<div><a href={`${domainPath}/check`}><span>系统环境检查</span></a></div>
					{this.renderErrorMessage()}
				</div>
			</div>
		);
	}
}