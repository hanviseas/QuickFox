import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import Window from '../../../component/window.jsx';
import Input from '../../../component/input.jsx';
import Button from '../../../component/button.jsx';
import environmentStyle from './environment.css';

class EnvironmentWindow extends React.Component {

	static defaultProps = {
		id: 0, // 环境ID
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.state = {
			environmentName: '', // 环境名称
		};
		this.fetchEnvironment = this.fetchEnvironment.bind(this);
		this.setEnvironmentName = this.setEnvironmentName.bind(this);
		this.saveEnvironment = this.saveEnvironment.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.setState({
				environmentName: '',
			}, () => { this.fetchEnvironment() });
		}
	}

	/**
	 * 获取环境信息
	 */
	fetchEnvironment() {
		if (this.props.id === 0) { // 无id属性传入时，代表新建，无需获取信息
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/environment/${this.props.id}`, {
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
				environmentName: json.name,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 设置环境名称
	 * @param name 环境名称
	 */
	setEnvironmentName(name) {
		this.setState({
			environmentName: name,
		});
	}

	/**
	 * 保存环境
	 */
	saveEnvironment() {
		if (this.state.environmentName.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '环境名称不能为空' },
			}); // 发送通知
			return;
		}
		const _this = this;
		if (this.props.id > 0) { // 更新环境
			const result = fetch(`${domainPath}/v2/post/api/environment/${this.props.id}`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					environment_name: this.state.environmentName,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				if (json.code === '000000') { // 请求成功
					_this.props.callback.bind(null, _this.state.environmentName)();
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
		} else { // 新建环境
			const result = fetch(`${domainPath}/v2/put/api/environment`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					environment_name: this.state.environmentName,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				if (json.code === '000000') { // 请求成功
					_this.props.callback.bind(null, Number.parseInt(json.message), _this.state.environmentName)();
					_this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 1, content: `环境创建成功：${json.message}` },
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
			<Window displayed={this.props.displayed} height='250' title={this.props.id === 0 ? '创建环境' : '更新环境'} submitHandler={<Button text='保存' callback={this.saveEnvironment} />} closeWindow={this.props.closeWindow}>
				<div>
					<Input width='500' name='environmentName' value={this.state.environmentName} maxLength='30' placeholder='环境名称，如：测试环境' required={true} callback={this.setEnvironmentName} />
				</div>
			</Window>
		);
	}
}

export default connect()(EnvironmentWindow);