import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import Window from '../../../component/window.jsx';
import Input from '../../../component/input.jsx';
import Button from '../../../component/button.jsx';
import copyCaseStyle from './copyCase.css';

class CopyCaseWindow extends React.Component {

	static defaultProps = {
		id: 0, // 用例ID
		spaceId: 0, // 空间ID
		moduleId: 0, // 模块ID
		itemId: 0, // 接口ID
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.state = {
			caseName: '', // 用例名称
		};
		this.setCaseName = this.setCaseName.bind(this);
		this.copyCase = this.copyCase.bind(this);
	}

	/**
	 * 设置用例名称
	 * @param name 用例名称
	 */
	setCaseName(name) {
		this.setState({
			caseName: name,
		});
	}

	/**
	 * 复制用例
	 */
	copyCase() {
		if (this.state.caseName.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '用例名称不能为空' },
			}); // 发送通知
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/put/api/case`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				source_id: this.props.id,
				space_id: this.props.spaceId,
				module_id: this.props.moduleId,
				item_id: this.props.itemId,
				case_name: this.state.caseName,
				request_type: 'GET',
				content_type: 'application/x-www-form-urlencoded',
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			if (json.code === '000000') { // 请求成功
				_this.props.callback.bind(null, Number.parseInt(json.message), _this.state.caseName, 3)();
				_this.props.dispatch({
					type: 'SET_INFORMATION',
					information: { type: 1, content: `用例创建成功：${json.message}` },
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
			<Window displayed={this.props.displayed} height='250' title='复制用例' submitHandler={<Button text='保存' callback={this.copyCase} />} closeWindow={this.props.closeWindow}>
				<div>
					<Input width='500' name='caseName' value={this.state.caseName} maxLength='30' placeholder='用例名称，如：使用正确帐号登录' required={true} callback={this.setCaseName} />
				</div>
			</Window>
		);
	}
}

export default connect()(CopyCaseWindow);