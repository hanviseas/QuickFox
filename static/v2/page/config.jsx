import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../config/system.jsx';
import { encodeParams } from '../util/http.jsx';
import Input from '../component/input.jsx';
import Button from '../component/button.jsx';
import configStyle from './config.css';

class Config extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			domain: '', // 访问域名
			dbhost: '', // 数据库地址
			dbname: '', // 数据库名称
			dbuser: '', // 数据库账号
			dbpass: '', // 数据库密码
			message: '', // 提示消息
			messageType: 'error', // 提示消息类型
		};
		this.setDomain = this.setDomain.bind(this);
		this.setDbname = this.setDbname.bind(this);
		this.setDbuser = this.setDbuser.bind(this);
		this.setDbhost = this.setDbhost.bind(this);
		this.setDbpass = this.setDbpass.bind(this);
		this.fetchConfig = this.fetchConfig.bind(this);
		this.setConfig = this.setConfig.bind(this);
		this.renderMessage = this.renderMessage.bind(this);
	}

	componentWillMount() {
		this.fetchConfig();
	}

	/**
	 * 获取配置信息
	 */
	fetchConfig() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/system/0/conf`, {
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
				domain: json.domain,
				dbhost: json.dbhost,
				dbname: json.dbname,
				dbuser: json.dbuser,
				dbpass: json.dbpass,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 设置访问域名
	 * @param domain 访问域名
	 */
	setDomain(domain) {
		this.setState({
			domain: domain,
		});
	}

	/**
	 * 设置数据库名称
	 * @param name 数据库名称
	 */
	setDbname(name) {
		this.setState({
			dbname: name,
		});
	}

	/**
	 * 设置数据库账号
	 * @param user 数据库账号
	 */
	setDbuser(user) {
		this.setState({
			dbuser: user,
		});
	}

	/**
	 * 设置数据库地址
	 * @param host 数据库地址
	 */
	setDbhost(host) {
		this.setState({
			dbhost: host,
		});
	}

	/**
	 * 设置数据库密码
	 * @param pass 数据库密码
	 */
	setDbpass(pass) {
		this.setState({
			dbpass: pass,
		});
	}

	/**
	 * 设置提示消息
	 * @param message 提示消息
	 * @param type 提示消息类型
	 */
	setMessage(message, type) {
		this.setState({
			message: message,
			messageType: type,
		});
	}

	/**
	 * 设置配置
	 */
	setConfig() {
		if (this.state.dbhost.trim() === '') { // 参数检查
			this.setMessage('错误：数据库地址不能为空', 'error');
			return;
		}
		if (this.state.dbname.trim() === '') { // 参数检查
			this.setMessage('错误：数据库名称不能为空', 'error');
			return;
		}
		if (this.state.dbuser.trim() === '') { // 参数检查
			this.setMessage('错误：数据库账号不能为空', 'error');
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/post/api/system/0/conf`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				domain: this.state.domain,
				dbhost: this.state.dbhost,
				dbname: this.state.dbname,
				dbuser: this.state.dbuser,
				dbpass: this.state.dbpass,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			if (json.code === '000000') { // 请求成功
				_this.setMessage(json.message, 'success');
			} else {
				_this.setMessage(json.message, 'error');
			}
			return;
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 渲染信息
	 */
	renderMessage() {
		if (this.state.message === '') {
			return null;
		}
		const messageStyle = this.state.messageType === 'success' ? configStyle.successMessage : configStyle.errorMessage;
		return (
			<div className={`${configStyle.message} ${messageStyle}`}><span>{this.state.message}</span></div>
		);
	}

	render() {
		return (
			<div className={configStyle.board}>
				<div>
					<div><span>初始化配置</span></div>
					<div>
						<Input size='big' width='350' name='domain' value={this.state.domain} placeholder='访问域名' callback={this.setDomain} />
					</div>
					<div>
						<Input size='big' width='350' name='dbhost' value={this.state.dbhost} placeholder='数据库地址' required={true} callback={this.setDbhost} />
					</div>
					<div>
						<Input size='big' width='350' name='dbname' value={this.state.dbname} placeholder='数据库名称' required={true} callback={this.setDbname} />
					</div>
					<div>
						<Input size='big' width='350' name='dbuser' value={this.state.dbuser} placeholder='数据库账号' required={true} callback={this.setDbuser} />
					</div>
					<div>
						<Input size='big' width='350' name='dbpass' type='password' value={this.state.dbpass} placeholder='数据库密码' callback={this.setDbpass} />
					</div>
					<div>
						<Button size='big' width='350' text='覆盖配置' onClick={this.setConfig} />
					</div>
					{this.renderMessage()}
				</div>
			</div>
		);
	}
}

export default connect()(Config);