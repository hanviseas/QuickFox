import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../config/system.jsx';
import Window from '../window.jsx';
import Input from '../input.jsx';
import globalStyle from '../../public/global.css';
import usersStyle from './users.css';

class Users extends React.Component {

	static defaultProps = {
		id: 0, // 接口ID
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.defaultUserOption = {
			id: 0,
			avatar: '/static/img/v2/public/default-avatar.png',
			card: '未指派',
		}; // 默认用户选项
		this.state = {
			users: [], // 用户数据
			searchKeyword: '', // 搜索关键词
		};
		this.fetchUsers = this.fetchUsers.bind(this);
		this.setSearchKeyword = this.setSearchKeyword.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.setState({
				searchKeyword: '',
			}, () => { this.fetchUsers() });
		}
	}

	/**
	 * 获取用户数据
	 */
	fetchUsers() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/users`, {
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
			let users = [_this.defaultUserOption];
			json.map((user) => {
				users.push(user);
			});
			_this.setState({
				users: users,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 设置搜索关键词
	 * @param keyword 关键词
	 */
	setSearchKeyword(keyword) {
		this.setState({
			searchKeyword: keyword,
		});
	}

	render() {
		return (
			<Window displayed={this.props.displayed} width='400' height='600' title='选择用户' closeWindow={this.props.closeWindow}>
				<div>
					<div className={usersStyle.search}>
						<Input width='350' name='searchKeyword' value={this.state.searchKeyword} maxLength='30' placeholder='搜索用户姓名' callback={this.setSearchKeyword} />
					</div>
					{
						this.state.users.map((user) => {
							if (this.state.searchKeyword !== '' && !user.name.match(new RegExp(this.state.searchKeyword, 'i'))) {
								return;
							}
							return (
								<User key={user.id} id={user.id} avatar={user.avatar} name={user.card} callback={this.props.callback} />
							);
						})
					}
				</div>
			</Window>
		);
	}
}

class User extends React.Component {

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

	render() {
		const focusStateClassName = this.state.focused ? usersStyle.focused : '';
		return (
			<div key={this.props.id} className={`${usersStyle.user} ${focusStateClassName}`} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState} onClick={this.props.callback.bind(null, this.props.id, this.props.avatar, this.props.name)}>
				<img src={this.props.avatar} />
				<div><span className={globalStyle.autoHidden}>{this.props.name}</span></div>
			</div>
		);
	}
}

export default connect()(Users);