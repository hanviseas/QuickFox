import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import Window from '../../../component/window.jsx';
import Button from '../../../component/button.jsx';
import deleteUserStyle from './deleteUser.css';

class DeleteUserWindow extends React.Component {

	static defaultProps = {
		id: 0, // 用户ID
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.deleteUser = this.deleteUser.bind(this);
	}

	/**
	 * 删除用户
	 */
	deleteUser() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/delete/api/user/${this.props.id}`, {
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
			if (json.code === '000000') { // 请求成功
				_this.props.callback.bind(null)();
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
			<Window displayed={this.props.displayed} width='500' height='240' title='删除用户' submitHandler={<Button type='error' text='确认删除' callback={this.deleteUser} />} closeWindow={this.props.closeWindow}>
				<div className={deleteUserStyle.notice}><span>用户删除后将无法恢复，是否确认？</span></div>
			</Window>
		);
	}
}

export default connect()(DeleteUserWindow);