import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import { userRole } from '../../../config/common.jsx';
import Window from '../../../component/window.jsx';
import Input from '../../../component/input.jsx';
import Select from '../../../component/select.jsx';
import Button from '../../../component/button.jsx';
import userStyle from './user.css';

class UserWindow extends React.Component {

	static defaultProps = {
		id: 0, // 用户ID
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.state = {
			userName: '', // 用户名称
			userCard: '', // 用户名片
			userPassword: '', // 用户密码
			userRole: 'normal', // 用户角色
			userAvatar: '/static/img/v2/public/default-avatar.png', // 用户头像
			userEmail: '', // 用户邮箱
		};
		this.fetchUser = this.fetchUser.bind(this);
		this.setUserName = this.setUserName.bind(this);
		this.setUserCard = this.setUserCard.bind(this);
		this.setUserPassword = this.setUserPassword.bind(this);
		this.setUserRole = this.setUserRole.bind(this);
		this.setUserAvatar = this.setUserAvatar.bind(this);
		this.setUserEmail = this.setUserEmail.bind(this);
		this.saveUser = this.saveUser.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.setState({
				userName: '',
				userCard: '',
				userPassword: '',
				userRole: 'normal',
				userAvatar: '/static/img/v2/public/default-avatar.png',
				userEmail: '',
			}, () => { this.fetchUser() });
		}
	}

	/**
	 * 获取用户信息
	 */
	fetchUser() {
		if (this.props.id === 0) { // 无id属性传入时，代表新建，无需获取信息
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/user/${this.props.id}`, {
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
				userName: json.name,
				userCard: json.card,
				userRole: json.role,
				userAvatar: json.avatar,
				userEmail: json.email,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 设置用户名称
	 * @param name 用户名称
	 */
	setUserName(name) {
		this.setState({
			userName: name,
		});
	}

	/**
	 * 设置用户名片
	 * @param card 用户名片
	 */
	setUserCard(card) {
		this.setState({
			userCard: card,
		});
	}

	/**
	 * 设置用户密码
	 * @param password 用户密码
	 */
	setUserPassword(password) {
		this.setState({
			userPassword: password,
		});
	}

	/**
	 * 设置用户角色
	 * @param role 用户角色
	 */
	setUserRole(role) {
		this.setState({
			userRole: role.index,
		});
	}

	/**
	 * 设置用户头像
	 * @param avatar 用户头像
	 */
	setUserAvatar(avatar) {
		this.setState({
			userAvatar: avatar,
		});
	}

	/**
	 * 设置用户邮箱
	 * @param email 用户邮箱
	 */
	setUserEmail(email) {
		this.setState({
			userEmail: email,
		});
	}

	/**
	 * 保存用户
	 */
	saveUser() {
		if (this.state.userName.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '用户名称不能为空' },
			}); // 发送通知
			return;
		}
		if (this.state.userCard.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '用户名片不能为空' },
			}); // 发送通知
			return;
		}
		const _this = this;
		if (this.props.id > 0) { // 更新用户
			const result = fetch(`${domainPath}/v2/post/api/user/${this.props.id}`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					user_name: this.state.userName,
					user_card: this.state.userCard,
					user_password: this.state.userPassword,
					user_role: this.state.userRole,
					user_avatar: this.state.userAvatar,
					user_email: this.state.userEmail,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				if (json.code === '000000') { // 请求成功
					_this.props.callback.bind(null, _this.state.userCard, _this.state.userRole, _this.state.userAvatar, _this.state.userEmail)();
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
		} else { // 新建用户
			const result = fetch(`${domainPath}/v2/put/api/user`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					user_name: this.state.userName,
					user_card: this.state.userCard,
					user_password: this.state.userPassword,
					user_role: this.state.userRole,
					user_avatar: this.state.userAvatar,
					user_email: this.state.userEmail,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				if (json.code === '000000') { // 请求成功
					_this.props.callback.bind(null, Number.parseInt(json.message), _this.state.userName, _this.state.userCard, _this.state.userRole, _this.state.userAvatar, _this.state.userEmail)();
					_this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 1, content: `用户创建成功：${json.message}` },
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

	render() {
		return (
			<Window displayed={this.props.displayed} height='490' title={this.props.id === 0 ? '创建用户' : '更新用户'} submitHandler={<Button text='保存' callback={this.saveUser} />} closeWindow={this.props.closeWindow}>
				<div>
					<Input width='500' name='userName' value={this.state.userName} maxLength='30' placeholder='用户名称，只能包含数字、字母与下划线，如：quickfox_2015' required={true} disabled={this.props.id === 0 ? false : true} callback={this.setUserName} />
				</div>
				<div>
					<Input width='500' name='userCard' value={this.state.userCard} maxLength='15' placeholder='用户名片，用以显示用户名字' required={true} callback={this.setUserCard} />
				</div>
				<div>
					<Input width='500' name='userPassword' type='password' value={this.state.userPassword} maxLength='32' placeholder='验证密码' callback={this.setUserPassword} />
				</div>
				<div>
					<Select width='500' name='userRole' index={this.state.userRole} options={userRole} disabled={this.state.userName === 'admin' ? true : false} callback={this.setUserRole} />
				</div>
				<div>
					<Input width='500' name='userEmail' value={this.state.userEmail} maxLength='50' placeholder='电子邮箱，如：me@quickfox.cn' callback={this.setUserEmail} />
				</div>
			</Window>
		);
	}
}

export default connect()(UserWindow);