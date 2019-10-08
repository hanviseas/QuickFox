import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import { requestMethod } from '../../../config/common.jsx';
import { requestContentType } from '../../../config/common.jsx';
import Window from '../../../component/window.jsx';
import Input from '../../../component/input.jsx';
import Select from '../../../component/select.jsx';
import Textarea from '../../../component/textarea.jsx';
import Button from '../../../component/button.jsx';
import caseStyle from './case.css';

class CaseWindow extends React.Component {

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
			requestType: 'GET', // 请求类型
			contentType: 'application/x-www-form-urlencoded', // 内容类型
			requestParam: '{}', // 请求参数
			requestHeader: '{}', // 请求头
			contentTypeDisabled: false, // 内容类型禁用状态
		};
		this.fetchCase = this.fetchCase.bind(this);
		this.setCaseName = this.setCaseName.bind(this);
		this.setRequestType = this.setRequestType.bind(this);
		this.setContentType = this.setContentType.bind(this);
		this.setRequestParam = this.setRequestParam.bind(this);
		this.setRequestHeader = this.setRequestHeader.bind(this);
		this.saveCase = this.saveCase.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.setState({
				caseName: '',
				requestType: 'GET',
				contentType: 'application/x-www-form-urlencoded',
				requestParam: '{}',
				requestHeader: '{}',
				contentTypeDisabled: true,
			}, () => { this.fetchCase() });
		}
	}

	/**
	 * 获取用例信息
	 */
	fetchCase() {
		if (this.props.id === 0) { // 无id属性传入时，代表新建，无需获取信息

			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/case/${this.props.id}`, {
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
				caseName: json.name,
				requestType: json.stype,
				contentType: json.ctype,
				requestParam: json.param,
				requestHeader: json.header,
				contentTypeDisabled: json.stype === 'GET' ? true : false,
			});
		}).catch(function (e) {
			console.log(e);
		});
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
	 * 设置请求类型
	 * @param requestType 请求类型
	 */
	setRequestType(requestType) {
		if (requestType.index === 'GET') { // GET只有一种ContentType
			this.setState({
				requestType: requestType.index,
				contentType: 'application/x-www-form-urlencoded',
				contentTypeDisabled: true,
			});
		} else {
			this.setState({
				requestType: requestType.index,
				contentTypeDisabled: false,
			});
		}
	}

	/**
	 * 设置内容类型
	 * @param contentType 内容类型
	 */
	setContentType(contentType) {
		this.setState({
			contentType: contentType.index,
		});
	}

	/**
	 * 设置请求参数
	 * @param requestParam 请求参数
	 */
	setRequestParam(requestParam) {
		this.setState({
			requestParam: requestParam,
		});
	}

	/**
	 * 设置请求头
	 * @param requestHeader 请求头
	 */
	setRequestHeader(requestHeader) {
		this.setState({
			requestHeader: requestHeader,
		});
	}

	/**
	 * 保存用例
	 */
	saveCase() {
		if (this.state.caseName.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '用例名称不能为空' },
			}); // 发送通知
			return;
		}
		const _this = this;
		if (this.props.id > 0) { // 更新用例
			const result = fetch(`${domainPath}/v2/post/api/case/${this.props.id}`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					case_name: this.state.caseName,
					request_type: this.state.requestType,
					content_type: this.state.contentType,
					request_param: this.state.requestParam,
					request_header: this.state.requestHeader,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				if (json.code === '000000') { // 请求成功
					_this.props.callback.bind(null, _this.state.caseName)();
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
		} else { // 新建用例
			const result = fetch(`${domainPath}/v2/put/api/case`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					space_id: this.props.spaceId,
					module_id: this.props.moduleId === -1 ? 0 : this.props.moduleId,
					item_id: this.props.itemId,
					case_name: this.state.caseName,
					request_type: this.state.requestType,
					content_type: this.state.contentType,
					request_param: this.state.requestParam,
					request_header: this.state.requestHeader,
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
	}

	render() {
		return (
			<Window displayed={this.props.displayed} height='610' level={2} title={this.props.id === 0 ? '创建用例' : '更新用例'} submitHandler={<Button text='保存' callback={this.saveCase} />} closeWindow={this.props.closeWindow}>
				<div>
					<Input width='500' name='caseName' value={this.state.caseName} maxLength='30' placeholder='用例名称，如：使用正确帐号登录' required={true} callback={this.setCaseName} />
				</div>
				<div className={caseStyle.requestOption}>
					<div>
						<Select width='200' name='requestType' index={this.state.requestType} options={requestMethod} required={true} callback={this.setRequestType} />
					</div>
					<div>
						<Select name='contentType' index={this.state.contentType} options={requestContentType} required={true} disabled={this.state.contentTypeDisabled} callback={this.setContentType} />
					</div>
				</div>
				<div>
					<Textarea width='500' name='requestParam' value={this.state.requestParam} placeholder='接口参数，如：{"key1":"value1";"key2":"value2"}' callback={this.setRequestParam} />
				</div>
				<div>
					<Textarea width='500' name='requestHeader' value={this.state.requestHeader} placeholder='请求头，如：{"header1":"value1";"header2":"value2"}' callback={this.setRequestHeader} />
				</div>
			</Window>
		);
	}
}

export default connect()(CaseWindow);