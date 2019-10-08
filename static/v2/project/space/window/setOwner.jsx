import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import Users from '../../../component/window/users.jsx';
import setOwnerStyle from './setOwner.css';

class SetOwnerWindow extends React.Component {

	static defaultProps = {
		id: 0, // 接口ID
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.update = this.update.bind(this);
	}

	/**
	 * 更新
	 * @param id 维护人ID
	 * @param avatar 维护人头像
	 * @param name 维护人名字
	 */
	update(id, avatar, name) {
		const _this = this;
		const result = fetch(`${domainPath}/v2/post/api/space/${this.props.id}/owner`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				owner_id: id,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			if (json.code === '000000') { // 请求成功
				_this.props.callback.bind(null, avatar, name)();
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
			<Users displayed={this.props.displayed} callback={this.update} closeWindow={this.props.closeWindow} />
		);
	}
}

export default connect()(SetOwnerWindow);