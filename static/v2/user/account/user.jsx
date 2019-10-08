import React from 'react';
import $ from 'jquery';
import { userRole } from '../../config/common.jsx';
import Label from '../../component/label.jsx';
import Load from '../../component/load.jsx';
import UserWindow from './window/user.jsx';
import DeleteUserWindow from './window/deleteUser.jsx';
import globalStyle from '../../public/global.css';
import userStyle from './user.css';

export default class UserList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			users: this.props.users, // 用户数据
			userWindowDisplayed: false, // 用户窗口显示状态
		};
		this.openUserWindow = this.openUserWindow.bind(this);
		this.closeUserWindow = this.closeUserWindow.bind(this);
		this.addUser = this.addUser.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			users: nextProps.users,
		});
	}

	/**
	 * 打开用户窗口
	 */
	openUserWindow() {
		this.setState({
			userWindowDisplayed: true,
		});
	}

	/**
	 * 关闭用户窗口
	 */
	closeUserWindow() {
		this.setState({
			userWindowDisplayed: false,
		});
	}

	/**
	 * 添加用户
	 * @param id 用户ID
	 * @param name 用户名称
	 * @param card 用户名片
	 * @param role 用户角色
	 * @param avatar 头像
	 * @param email 邮箱
	 */
	addUser(id, name, card, role, avatar, email) {
		let users = this.state.users;
		users.unshift({
			id: id,
			name: name,
			card: card,
			role: role,
			avatar: avatar,
			email: email,
			new: true,
		});
		this.setState({
			users: users,
			userWindowDisplayed: false,
		});
	}

	render() {
		const idFieldOrderStyle = this.props.currentOrderField === 'id' ? (this.props.currentOrderType === 'asc' ? userStyle.arrowUp : userStyle.arrowDown) : '';
		const nameFieldOrderStyle = this.props.currentOrderField === 'name' ? (this.props.currentOrderType === 'asc' ? userStyle.arrowUp : userStyle.arrowDown) : '';
		const cardFieldOrderStyle = this.props.currentOrderField === 'card' ? (this.props.currentOrderType === 'asc' ? userStyle.arrowUp : userStyle.arrowDown) : '';
		const roleFieldOrderStyle = this.props.currentOrderField === 'role' ? (this.props.currentOrderType === 'asc' ? userStyle.arrowUp : userStyle.arrowDown) : '';
		const emailFieldOrderStyle = this.props.currentOrderField === 'email' ? (this.props.currentOrderType === 'asc' ? userStyle.arrowUp : userStyle.arrowDown) : '';
		return (
			<div>
				<div>
					<Label text='用户帐号' />
					{
						this.props.userInfo.auth.indexOf('V2.Api.User.Add') === -1 ? null : (() => {
							return (
								<div className={userStyle.newUser} onClick={this.openUserWindow}><span>创建帐号</span></div>
							);
						})()
					}
				</div>
				<div className={globalStyle.clear}></div>
				<div className={`${userStyle.user} ${userStyle.head}`}>
					<div className={`${userStyle.idCol} ${idFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'id')}><span className={globalStyle.autoHidden}>编号</span></div>
					<div className={`${userStyle.nameCol} ${nameFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'name')}><span className={globalStyle.autoHidden}>帐号名</span></div>
					<div className={`${userStyle.cardCol} ${cardFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'card')}><span className={globalStyle.autoHidden}>名片</span></div>
					<div className={`${userStyle.roleCol} ${roleFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'role')}><span className={globalStyle.autoHidden}>角色</span></div>
					<div className={`${userStyle.emailCol} ${emailFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'email')}><span className={globalStyle.autoHidden}>邮箱</span></div>
				</div>
				{
					this.props.loading ? (() => {
						return <Load />;
					})() : (() => {
						return (
							this.state.users.map((user) => {
								return (
									<User key={user.id} userInfo={this.props.userInfo} id={user.id} name={user.name} card={user.card} role={user.role} avatar={user.avatar} email={user.email} new={user.new} />
								);
							})
						);
					})()
				}
				<UserWindow displayed={this.state.userWindowDisplayed} callback={this.addUser} closeWindow={this.closeUserWindow} />
			</div>
		);
	}
}

class User extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userName: this.props.name, // 用户名称
			userCard: this.props.card, // 用户名片
			userRole: this.props.role, // 用户角色
			userAvatar: this.props.avatar, // 用户头像
			userEmail: this.props.email, // 用户邮箱
			focused: false, // 焦点（鼠标移至上方）状态
			deleted: false, // 用户删除状态
			userWindowDisplayed: false, // 用户窗口显示状态
			deleteUserWindowDisplayed: false, // 删除用户窗口显示状态
		};
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
		this.renderIcon = this.renderIcon.bind(this);
		this.openUserWindow = this.openUserWindow.bind(this);
		this.closeUserWindow = this.closeUserWindow.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.openDeleteUserWindow = this.openDeleteUserWindow.bind(this);
		this.closeDeleteUserWindow = this.closeDeleteUserWindow.bind(this);
		this.deleteUser = this.deleteUser.bind(this);
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
			<div className={userStyle.icon} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon}>
				<img src={`/static/img/v2/space/icon-${name}.png`} title={title} />
			</div>
		);
	}

	/**
	 * 打开用户窗口
	 */
	openUserWindow() {
		this.setState({
			userWindowDisplayed: true,
		});
	}

	/**
	 * 关闭用户窗口
	 */
	closeUserWindow() {
		this.setState({
			userWindowDisplayed: false,
		});
	}

	/**
	 * 更新用户
	 * @param card 用户名片
	 * @param role 用户角色
	 * @param avatar 用户头像
	 * @param email 用户邮箱
	 */
	updateUser(card, role, avatar, email) {
		this.setState({
			userCard: card,
			userRole: role,
			userAvatar: avatar,
			userEmail: email,
			userWindowDisplayed: false,
		});
	}

	/**
	 * 打开删除用户窗口
	 */
	openDeleteUserWindow() {
		this.setState({
			deleteUserWindowDisplayed: true,
		});
	}

	/**
	 * 关闭删除用户窗口
	 */
	closeDeleteUserWindow() {
		this.setState({
			deleteUserWindowDisplayed: false,
		});
	}

	/**
	 * 删除用户
	 */
	deleteUser() {
		this.setState({
			deleted: true,
			deleteUserWindowDisplayed: false,
		});
	}

	render() {
		if (this.state.deleted) { // 已删除用户返回空
			return null;
		}
		const focusStateClassName = this.state.focused ? userStyle.focused : '';
		const newStateClassName = this.props.new === undefined ? '' : userStyle.new;
		let userRoleName = '未定义角色';
		userRole.map((role) => {
			if (this.state.userRole === role.index) {
				userRoleName = role.value;
			}
		});
		return (
			<div>
				<div className={`${userStyle.user} ${focusStateClassName} ${newStateClassName}`} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState}>
					<div className={userStyle.idCol}><span className={globalStyle.autoHidden}>{this.props.id}</span></div>
					<div className={userStyle.nameCol}>
						<img src={this.state.userAvatar} />
						<div><span className={globalStyle.autoHidden}>{this.state.userName}</span></div>
					</div>
					<div className={userStyle.cardCol}><span className={globalStyle.autoHidden}>{this.state.userCard}</span></div>
					<div className={userStyle.roleCol}><span className={globalStyle.autoHidden}>{userRoleName}</span></div>
					<div className={userStyle.emailCol}><span className={globalStyle.autoHidden}>{this.state.userEmail}</span></div>
					<div className={userStyle.optionCol}>
						{
							this.props.userInfo.auth.indexOf('V2.Api.User.Update') === -1 ? null : (() => {
								return (
									<div onClick={this.openUserWindow}>{this.renderIcon('edit', '编辑')}</div>
								);
							})()
						}
						{
							this.props.userInfo.auth.indexOf('V2.Api.User.Remove') === -1 ? null : (() => {
								return (
									<div onClick={this.openDeleteUserWindow}>{this.renderIcon('delete', '删除')}</div>
								);
							})()
						}
					</div>
				</div>
				<UserWindow id={this.props.id} displayed={this.state.userWindowDisplayed} callback={this.updateUser} closeWindow={this.closeUserWindow} />
				<DeleteUserWindow id={this.props.id} displayed={this.state.deleteUserWindowDisplayed} callback={this.deleteUser} closeWindow={this.closeDeleteUserWindow} />
			</div>
		);
	}
}