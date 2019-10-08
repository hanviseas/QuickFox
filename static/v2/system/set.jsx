import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../config/system.jsx';
import { encodeParams } from '../util/http.jsx';
import { menuItems } from '../config/menu.jsx';
import Label from '../component/label.jsx';
import Input from '../component/input.jsx';
import Checkbox from '../component/checkbox.jsx';
import Button from '../component/button.jsx';
import SetDefaultOwnerWindow from './window/setDefaultOwner.jsx';
import globalStyle from '../public/global.css';
import setStyle from './set.css';

class Set extends React.Component {

	constructor(props) {
		super(props);
		this.smtpOptions = [
			{
				index: 'ssl',
				value: false,
				text: '使用SSL连接',
			},
			{
				index: 'defaultPort',
				value: true,
				text: '使用默认端口',
			},
		]; // SMTP选项
		this.state = {
			smtpServer: '127.0.0.1', // SMTP服务地址
			smtpPort: '25', // SMTP端口号
			smtpUser: '', // SMTP账号名
			smtpPassword: '', // SMTP密码
			smtpSsl: false, // SMTP是否使用SSL连接
			smtpDefaultPort: true, // SMTP是否使用默认端口号
			mailList: '', // 邮件列表
			default_owner: 0, // 默认维护人
			default_owner_avatar: '/static/img/v2/public/default-avatar.png', // 默认维护人头像
			default_owner_name: '未指派', // 默认维护人名字
			defaultOwnerWindowDisplayed: false, // 默认维护人窗口显示状态
		};
		this.fetchSystem = this.fetchSystem.bind(this);
		this.openDefaultOwnerWindow = this.openDefaultOwnerWindow.bind(this);
		this.closeDefaultOwnerWindow = this.closeDefaultOwnerWindow.bind(this);
		this.updateDefaultOwner = this.updateDefaultOwner.bind(this);
		this.setSmtpServer = this.setSmtpServer.bind(this);
		this.setSmtpPort = this.setSmtpPort.bind(this);
		this.setSmtpUser = this.setSmtpUser.bind(this);
		this.setSmtpPassword = this.setSmtpPassword.bind(this);
		this.setSmtpOption = this.setSmtpOption.bind(this);
		this.setMailList = this.setMailList.bind(this);
		this.saveMailSet = this.saveMailSet.bind(this);
	}

	componentWillMount() {
		this.props.dispatch({
			type: 'SET_ACTIVE_INDEX',
			activeIndex: menuItems._set.index,
		}); // 更新选中的二级菜单索引
		this.props.dispatch({
			type: 'SET_PAGE_TITLE',
			pageTitle: menuItems._set.name,
		}); // 更新页头标题
		this.fetchSystem();
	}

	/**
	 * 获取系统信息
	 */
	fetchSystem() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/system/0`, {
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
			_this.smtpOptions = [
				{
					index: 'ssl',
					value: Number.parseInt(json.smtp_ssl) === 1,
					text: '使用SSL连接',
				},
				{
					index: 'defaultPort',
					value: Number.parseInt(json.smtp_default_port) === 1,
					text: '使用默认端口',
				},
			];
			_this.setState({
				smtpServer: json.smtp_server,
				smtpPort: json.smtp_port,
				smtpUser: json.smtp_user,
				smtpPassword: json.smtp_password,
				smtpSsl: Number.parseInt(json.smtp_ssl) === 1,
				smtpDefaultPort: Number.parseInt(json.smtp_default_port) === 1,
				mailList: json.mail_list,
				defaultOwner: json.default_owner,
				defaultOwnerAvatar: json.default_owner_avatar,
				defaultOwnerName: json.default_owner_name,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 打开默认维护人窗口
	 */
	openDefaultOwnerWindow() {
		this.setState({
			defaultOwnerWindowDisplayed: true,
		});
	}

	/**
	 * 关闭默认维护人窗口
	 */
	closeDefaultOwnerWindow() {
		this.setState({
			defaultOwnerWindowDisplayed: false,
		});
	}

	/**
	 * 更新默认维护人
	 * @param avatar 默认维护人头像
	 * @param name 默认维护人名字
	 */
	updateDefaultOwner(avatar, name) {
		this.setState({
			defaultOwnerAvatar: avatar,
			defaultOwnerName: name,
			defaultOwnerWindowDisplayed: false,
		});
	}

	/**
	 * 设置STMP服务地址
	 * @param server 服务地址
	 */
	setSmtpServer(server) {
		this.setState({
			smtpServer: server,
		});
	}

	/**
	 * 设置SMTP端口号
	 * @param port 端口号
	 */
	setSmtpPort(port) {
		this.setState({
			smtpPort: port,
		});
	}

	/**
	 * 设置SMTP账号名
	 * @param user 账号名
	 */
	setSmtpUser(user) {
		this.setState({
			smtpUser: user,
		});
	}

	/**
	 * 设置SMTP密码
	 * @param password 密码
	 */
	setSmtpPassword(password) {
		this.setState({
			smtpPassword: password,
		});
	}

	/**
	 * 设置SMTP选项
	 * @param values 选项值
	 */
	setSmtpOption(values) {
		if (values.includes('defaultPort')) { // 自动设置默认端口
			let smtpPort = 25;
			if (values.includes('ssl')) {
				smtpPort = 465;
			}
			this.setState({
				smtpPort: smtpPort,
			});
		}
		this.setState({
			smtpSsl: values.includes('ssl'),
			smtpDefaultPort: values.includes('defaultPort'),
		});
	}

	/**
	 * 设置邮件列表
	 * @param mailList 邮件列表
	 */
	setMailList(mailList) {
		this.setState({
			mailList: mailList,
		});
	}

	/**
	 * 保存邮件设置
	 */
	saveMailSet() {
		if (this.state.smtpServer.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: 'SMTP服务器地址不能为空' },
			}); // 发送通知
			return;
		}
		if (this.state.smtpPort.toString().trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: 'SMTP端口号不能为空' },
			}); // 发送通知
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/post/api/system/0/mail`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				smtp_server: this.state.smtpServer,
				smtp_port: this.state.smtpPort,
				smtp_user: this.state.smtpUser,
				smtp_password: this.state.smtpPassword,
				smtp_ssl: this.state.smtpSsl ? 1 : 0,
				smtp_default_port: this.state.smtpDefaultPort ? 1 : 0,
				mail_list: this.state.mailList,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			if (json.code === '000000') { // 请求成功
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
	}

	render() {
		return (
			<div>
				<div>
					<Label text='通用测试设置' />
				</div>
				<div className={setStyle.systemInfo}>
					<div>
						<div><span>默认维护人</span></div>
						<div className={setStyle.defaultOwner} onClick={this.openDefaultOwnerWindow}>
							<img src={this.state.defaultOwnerAvatar} />
							<div><span className={globalStyle.autoHidden}>{this.state.defaultOwnerName}</span></div>
						</div>
					</div>
				</div>
				<SetDefaultOwnerWindow displayed={this.state.defaultOwnerWindowDisplayed} callback={this.updateDefaultOwner} closeWindow={this.closeDefaultOwnerWindow} />
				<div className={setStyle.whiteSpace} />
				<div>
					<Label text='邮件通知设置' />
				</div>
				<div className={setStyle.systemInfo}>
					<div>
						<div><span>SMTP服务器</span></div>
						<div>
							<Input width='300' name='smtpServer' value={this.state.smtpServer} maxLength='100' placeholder='SMTP服务器地址' required={true} callback={this.setSmtpServer} />
						</div>
						<div></div>
						<div>
							<Input width='100' name='smtpPort' value={this.state.smtpPort} maxLength='10' placeholder='端口号' disabled={this.state.smtpDefaultPort} required={true} callback={this.setSmtpPort} />
						</div>
					</div>
					<div>
						<div></div>
						<div className={setStyle.smtpOptions}>
							<Checkbox name='smtpOptions' options={this.smtpOptions} callback={this.setSmtpOption} />
						</div>
					</div>
					<div>
						<div><span>邮件账号</span></div>
						<div>
							<Input width='400' name='smtpUser' value={this.state.smtpUser} maxLength='50' placeholder='账号名' callback={this.setSmtpUser} />
						</div>
					</div>
					<div>
						<div></div>
						<div>
							<Input width='400' name='smtpPassword' type='password' value={this.state.smtpPassword} maxLength='50' placeholder='密码' callback={this.setSmtpPassword} />
						</div>
					</div>
					<div>
						<div><span>收件人列表</span></div>
						<div>
							<Input width='400' name='mailList' value={this.state.mailList} placeholder='通件收件人列表，多个收件人使用英文逗号分隔' callback={this.setMailList} />
						</div>
					</div>
				</div>
				<div className={setStyle.button}>
					<Button text='保存' onClick={this.saveMailSet} />
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		globalData: state.globalData,
	};
}

export default connect(
	mapStateToProps
)(Set);