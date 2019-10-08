import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../config/system.jsx';
import { encodeParams } from '../util/http.jsx';
import { userRole } from '../config/common.jsx';
import Label from '../component/label.jsx';
import Input from '../component/input.jsx';
import Button from '../component/button.jsx';
import profileStyle from './profile.css';

class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userName: '', // 用户名称
			userCard: '', // 用户名片
			userRole: 'normal', // 用户角色
			userAvatar: '/static/img/v2/public/default-avatar.png', // 用户头像
			userEmail: '', // 用户邮箱
			oldPassword: '', // 旧密码
			newPassword: '', // 新密码
		};
		this.fetchUser = this.fetchUser.bind(this);
		this.setUserCard = this.setUserCard.bind(this);
		this.setUserEmail = this.setUserEmail.bind(this);
		this.setOldPassword = this.setOldPassword.bind(this);
		this.setNewPassword = this.setNewPassword.bind(this);
		this.saveUser = this.saveUser.bind(this);
		this.savePassword = this.savePassword.bind(this);
	}

	componentWillMount() {
		this.props.dispatch({
			type: 'SET_ACTIVE_INDEX',
			activeIndex: 0,
		}); // 更新选中的二级菜单索引
		this.props.dispatch({
			type: 'SET_PAGE_TITLE',
			pageTitle: '我的',
		}); // 更新页头标题
		this.fetchUser();
	}

	/**
	 * 获取用户信息
	 */
	fetchUser() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/user/0`, {
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
	 * 设置用户名片
	 * @param card 用户名片
	 */
	setUserCard(card) {
		this.setState({
			userCard: card,
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
	 * 设置旧密码
	 * @param password 用户密码
	 */
	setOldPassword(password) {
		this.setState({
			oldPassword: password,
		});
	}

	/**
	 * 设置新密码
	 * @param password 用户密码
	 */
	setNewPassword(password) {
		this.setState({
			newPassword: password,
		});
	}

	/**
	 * 保存用户
	 */
	saveUser() {
		if (this.state.userCard.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '用户名片不能为空' },
			}); // 发送通知
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/post/api/user/0`, {
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

	/**
	 * 保存密码
	 */
	savePassword() {
		if (this.state.oldPassword.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '旧密码不能为空' },
			}); // 发送通知
			return;
		}
		if (this.state.newPassword.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '新密码不能为空' },
			}); // 发送通知
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/post/api/user/0/password`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				old_password: this.state.oldPassword,
				new_password: this.state.newPassword,
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
		let userRoleName = '未定义角色';
		userRole.map((role) => {
			if (this.state.userRole === role.index) {
				userRoleName = role.value;
			}
		});
		return (
			<div>
				<div>
					<Label text='个人信息' />
				</div>
				<div className={profileStyle.userInfo}>
					<div className={profileStyle.avatar}>
						<div><span>头像</span></div>
						<div>
							<img src={this.state.userAvatar} />
						</div>
					</div>
					<div>
						<div><span>角色</span></div>
						<div><span>{userRoleName}</span></div>
					</div>
					<div>
						<div><span>登录名</span></div>
						<div><span>{this.state.userName}</span></div>
					</div>
					<div>
						<div><span>显示名</span></div>
						<div>
							<Input width='300' name='userCard' value={this.state.userCard} maxLength='15' placeholder='用户名片，用以显示用户名字' required={true} callback={this.setUserCard} />
						</div>
					</div>
					<div>
						<div><span>邮箱</span></div>
						<div>
							<Input width='300' name='userEmail' value={this.state.userEmail} maxLength='50' placeholder='电子邮箱，如：me@quickfox.cn' callback={this.setUserEmail} />
						</div>
					</div>
				</div>
				<div className={profileStyle.button}>
					<Button text='保存' onClick={this.saveUser} />
				</div>
				<div>
					<Label text='密码修改' />
				</div>
				<div className={profileStyle.userInfo}>
					<div>
						<div><span>旧密码</span></div>
						<div>
							<Input width='300' name='oldPassword' type='password' value={this.state.oldPassword} maxLength='32' callback={this.setOldPassword} />
						</div>
					</div>
					<div>
						<div><span>新密码</span></div>
						<div>
							<Input width='300' name='newPassword' type='password' value={this.state.newPassword} maxLength='32' callback={this.setNewPassword} />
						</div>
					</div>
				</div>
				<div className={profileStyle.button}>
					<Button text='修改' onClick={this.savePassword} />
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
)(Profile);