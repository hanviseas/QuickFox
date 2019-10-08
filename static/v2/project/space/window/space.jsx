import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import Window from '../../../component/window.jsx';
import Input from '../../../component/input.jsx';
import Button from '../../../component/button.jsx';
import spaceStyle from './space.css';

class SpaceWindow extends React.Component {

	static defaultProps = {
		id: 0, // 空间ID
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.state = {
			spaceName: '', // 空间名称
		};
		this.fetchSpace = this.fetchSpace.bind(this);
		this.setSpaceName = this.setSpaceName.bind(this);
		this.saveSpace = this.saveSpace.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.setState({
				spaceName: '',
			}, () => { this.fetchSpace() });
		}
	}

	/**
	 * 获取空间信息
	 */
	fetchSpace() {
		if (this.props.id === 0) { // 无id属性传入时，代表新建，无需获取信息
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/space/${this.props.id}`, {
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
				spaceName: json.name,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 设置空间名称
	 * @param name 空间名称
	 */
	setSpaceName(name) {
		this.setState({
			spaceName: name,
		});
	}

	/**
	 * 保存空间
	 */
	saveSpace() {
		if (this.state.spaceName.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '空间名称不能为空' },
			}); // 发送通知
			return;
		}
		const _this = this;
		if (this.props.id > 0) { // 更新空间
			const result = fetch(`${domainPath}/v2/post/api/space/${this.props.id}`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					space_name: this.state.spaceName,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				if (json.code === '000000') { // 请求成功
					_this.props.callback.bind(null, _this.state.spaceName)();
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
		} else { // 新建空间
			const result = fetch(`${domainPath}/v2/put/api/space`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					space_name: this.state.spaceName,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				if (json.code === '000000') { // 请求成功
					_this.props.callback.bind(null, Number.parseInt(json.message), _this.state.spaceName)();
					_this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 1, content: `空间创建成功：${json.message}` },
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
			<Window displayed={this.props.displayed} height='250' title={this.props.id === 0 ? '创建空间' : '更新空间'} submitHandler={<Button text='保存' callback={this.saveSpace} />} closeWindow={this.props.closeWindow}>
				<div>
					<Input width='500' name='spaceName' value={this.state.spaceName} maxLength='30' placeholder='空间名称，如：基础平台项目' required={true} callback={this.setSpaceName} />
				</div>
			</Window>
		);
	}
}

export default connect()(SpaceWindow);