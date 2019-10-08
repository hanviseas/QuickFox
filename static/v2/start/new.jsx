import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { menuItems } from '../config/menu.jsx';
import { domainPath } from '../config/system.jsx';
import { encodeParams } from '../util/http.jsx';
import { requestMethod } from '../config/common.jsx';
import { requestContentType } from '../config/common.jsx';
import { json_formater, xml_formater } from '../util/formater.jsx';
import Label from '../component/label.jsx';
import Select from '../component/select.jsx';
import Input from '../component/input.jsx';
import Button from '../component/button.jsx';
import RequestHeaderList from './new/requestHeader.jsx';
import RequestParamList from './new/requestParam.jsx';
import { RequestParamString } from './new/requestParam.jsx';
import SaveWindow from './new/window/save.jsx';
import newStyle from './new.css';

class New extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			sending: false, // 请求状态
			spaceId: 0, // 空间ID
			moduleId: 0, // 模块ID
			caseId: this.props.match.params.caseId, // 用例ID
			itemName: '', // 接口名称
			caseName: '', // 用例名称
			requestType: 'GET', // 请求类型
			requestUrl: '', // 请求地址
			contentType: 'application/x-www-form-urlencoded', // 内容类型
			requestHeader: [{
				key: '',
				value: '',
				type: 'TEXT',
			}], // 请求头
			requestParam: [{
				key: '',
				value: '',
			}], // 请求参数
			viewMode: 'text', // 查看模式（默认为原始文本模式）
			responseContent: '', // 响应内容
			saveWindowDisplayed: false, // 保存窗口显示状态
		};
		this.fetchCase = this.fetchCase.bind(this);
		this.fetchItem = this.fetchItem.bind(this);
		this.setRequestType = this.setRequestType.bind(this);
		this.setRequestUrl = this.setRequestUrl.bind(this);
		this.setContentType = this.setContentType.bind(this);
		this.setRequestHeader = this.setRequestHeader.bind(this);
		this.setRequestParam = this.setRequestParam.bind(this);
		this.setResponseContent = this.setResponseContent.bind(this);
		this.composeRequestData = this.composeRequestData.bind(this);
		this.submitRequest = this.submitRequest.bind(this);
		this.setViewMode = this.setViewMode.bind(this);
		this.openSaveWindow = this.openSaveWindow.bind(this);
		this.closeSaveWindow = this.closeSaveWindow.bind(this);
		this.saveCase = this.saveCase.bind(this);
		this.renderSendButton = this.renderSendButton.bind(this);
		this.renderContentTypeHeader = this.renderContentTypeHeader.bind(this);
		this.renderRequestParam = this.renderRequestParam.bind(this);
		this.renderResponseContent = this.renderResponseContent.bind(this);
	}

	componentWillMount() {
		this.props.dispatch({
			type: 'SET_ACTIVE_INDEX',
			activeIndex: menuItems._new.index,
		}); // 更新选中的二级菜单索引
		this.props.dispatch({
			type: 'SET_PAGE_TITLE',
			pageTitle: menuItems._new.name,
		}); // 更新页头标题	
		this.fetchCase(this.props.match.params.caseId);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.match.params.caseId === nextProps.match.params.caseId) { // 路径用例ID未更改不重载用例数据
			return;
		}
		this.setState({
			sending: false,
			spaceId: 0,
			moduleId: 0,
			caseId: nextProps.match.params.caseId,
			itemName: '',
			caseName: '',
			requestType: 'GET',
			requestUrl: '',
			contentType: 'application/x-www-form-urlencoded',
			requestHeader: [{
				key: '',
				value: '',
				type: 'TEXT',
			}],
			requestParam: [{
				key: '',
				value: '',
			}],
			viewMode: 'text',
			responseContent: '',
			saveWindowDisplayed: false,
		}, () => this.fetchCase(nextProps.match.params.caseId));
	}

	/**
	 * 获取用例信息
	 * @param id 用例ID
	 */
	fetchCase(id) {
		if (!id) { // 路径未提供用例ID不加载用例数据
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/case/${id}`, {
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
			try {
				let requestHeader = [];
				let requestHeaderObj = null;
				try { // 对非JSON格式字符串做容错
					requestHeaderObj = JSON.parse(json.header);
				} catch (e) {
					requestHeaderObj = JSON.parse('{}');
				}
				for (let key in requestHeaderObj) { // JSON对象转译成数组
					requestHeader.push({
						key: key,
						value: requestHeaderObj[key],
						type: Number.isFinite(requestHeaderObj[key]) ? 'NUM' : 'TEXT'
					});
				}
				if (requestHeader.length === 0) { // 无数据时补充一个填写项
					requestHeader.push({
						key: '',
						value: '',
						type: 'TEXT',
					});
				}
				let requestParam = json.param;
				if (json.ctype === 'application/x-www-form-urlencoded') { // x-www-form-urlencoded的参数值设为数组形式
					requestParam = [];
					let requestParamObj = null;
					try { // 对非JSON格式字符串做容错
						requestParamObj = JSON.parse(json.param);
					} catch (e) {
						requestParamObj = JSON.parse('{}');
					}
					for (let key in requestParamObj) { // JSON对象转译成数组
						requestParam.push({
							key: key,
							value: requestParamObj[key],
						});
					}
					if (requestParam.length === 0) { // 无数据时补充一个填写项
						requestParam.push({
							key: '',
							value: '',
						});
					}
				}
				_this.setState({
					caseName: json.name,
					requestType: json.stype,
					contentType: json.ctype,
					requestHeader: requestHeader,
					requestParam: requestParam,
				}, () => { _this.fetchItem(Number.parseInt(json.item_id)) });
			} catch (e) {
				console.log(e);
			}
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 获取接口信息
	 * @param id 接口ID
	 */
	fetchItem(id) {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/item/${id}`, {
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
				spaceId: json.space_id,
				moduleId: json.module_id,
				itemName: json.name,
				requestUrl: json.url,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 设置请求类型
	 * @param requestType 请求类型
	 */
	setRequestType(requestType) {
		if (this.state.requestType !== requestType.index && (this.state.requestType === 'GET' || requestType.index === 'GET')) { // 仅在GET与非GET之间切换时重设
			if (requestType.index === 'GET') { // GET的内容类型设为application/x-www-form-urlencoded
				this.setContentType({
					index: 'application/x-www-form-urlencoded',
				});
			}
		}
		this.setState({
			requestType: requestType.index,
		});
	}

	/**
	 * 设置请求地址
	 * @param url 请求地址
	 */
	setRequestUrl(url) {
		this.setState({
			requestUrl: url,
		});
	}

	/**
	 * 设置内容类型
	 * @param contentType 内容类型
	 */
	setContentType(contentType) {
		let requestParam = this.state.requestParam;
		if (this.state.contentType !== contentType.index && (this.state.contentType === 'application/x-www-form-urlencoded' || contentType.index === 'application/x-www-form-urlencoded')) { // 仅在x-www-form-urlencoded与非x-www-form-urlencoded之间切换时重设
			if (contentType.index === 'application/x-www-form-urlencoded') { // x-www-form-urlencoded的参数值设为数组形式
				requestParam = [{
					key: '',
					value: '',
				}];
			} else { // 其他情况参数值设为字符串形式
				requestParam = '';
			}
		}
		this.setState({
			contentType: contentType.index,
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
	   * 设置请求参数
	   * @param requestParam 请求参数
	   */
	setRequestParam(requestParam) {
		this.setState({
			requestParam: requestParam,
		});
	}

	/**
	   * 设置响应内容
	   * @param responseContent 响应内容
	   */
	setResponseContent(responseContent) {
		this.setState({
			responseContent: responseContent,
		});
	}

	/**
	 * 组装请求数据
	 */
	composeRequestData() {
		let requestHeader = null;
		let requestHeaders = new Object();
		if (this.state.requestHeader.length !== 0) {
			this.state.requestHeader.map((header) => {
				if (header.key.trim() !== '') { // 关键字未填写的项不做处理
					if (header.type === 'NUM') {
						header.value = Number.parseInt(header.value);
					}
					requestHeaders[header.key.trim()] = header.value;
				}
			});
		}
		requestHeader = JSON.stringify(requestHeaders);
		let requestParam = null;
		if (this.state.contentType === 'application/x-www-form-urlencoded' && this.state.requestParam.length !== 0) { // 参数拼装成JSON格式
			let requestParams = new Object();
			this.state.requestParam.map((param) => {
				if (param.key.trim() !== '') {  // 关键字未填写的项不做处理
					requestParams[param.key.trim()] = param.value;
				}
			});
			requestParam = JSON.stringify(requestParams);
		} else { // 非x-www-form-urlencoded取原始文本即可
			requestParam = this.state.requestParam;
		}
		return {
			'requestHeader': requestHeader,
			'requestParam': requestParam,
		}
	}

	/**
	 * 提交请求
	 */
	submitRequest() {
		this.setState({
			sending: true,
		}, () => {
			const requestData = this.composeRequestData();
			const _this = this;
			const result = fetch(`${domainPath}/v2/get/api/request`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					request_url: this.state.requestUrl,
					request_type: this.state.requestType,
					content_type: this.state.contentType,
					request_header: requestData.requestHeader,
					request_param: requestData.requestParam,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				json.body = json.body === false ? '请求异常，请检查后重试' : json.body; // false代表请求失败
				_this.setState({
					sending: false,
					responseContent: json.body,
				});
			}).catch(function (e) {
				console.log(e);
				this.setState({
					sending: false,
					responseContent: '请求异常，请检查后重试',
				});
			});
		});
	}

	/**
	 * 设置浏览模式
	 * @param mode 模式
	 */
	setViewMode(mode) {
		this.setState({
			viewMode: mode,
		});
	}

	/**
	 * 打开保存窗口
	 */
	openSaveWindow() {
		this.setState({
			saveWindowDisplayed: true,
		});
	}

	/**
	 * 关闭保存窗口
	 */
	closeSaveWindow() {
		this.setState({
			saveWindowDisplayed: false,
		});
	}

	/**
	 * 保存用例
	 */
	saveCase(spaceId, moduleId, itemName, caseName) {
		if (this.state.requestUrl.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '请求地址不能为空' },
			}); // 发送通知
			return;
		}
		if (itemName.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '接口名称不能为空' },
			}); // 发送通知
			return;
		}
		if (caseName.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '用例名称不能为空' },
			}); // 发送通知
			return;
		}
		const requestData = this.composeRequestData();
		const _this = this;
		const result = fetch(`${domainPath}/v2/put/api/test`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				space_id: spaceId,
				module_id: moduleId,
				item_name: itemName,
				case_name: caseName,
				request_url: this.state.requestUrl,
				request_type: this.state.requestType,
				content_type: this.state.contentType,
				request_param: requestData.requestParam,
				request_header: requestData.requestHeader,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			if (json.code === '000000') { // 请求成功
				_this.props.dispatch({
					type: 'SET_INFORMATION',
					information: { type: 1, content: '用例保存成功' },
				}); // 发送通知
			} else {
				_this.props.dispatch({
					type: 'SET_INFORMATION',
					information: { type: 0, content: json.message },
				}); // 发送通知
			}
			_this.setState({
				saveWindowDisplayed: false,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 渲染发送按钮
	 */
	renderSendButton() {
		if (this.state.sending) { // 发送中时禁用按钮
			return <Button type='disability' text='发送' />
		} else {
			return <Button text='发送' onClick={this.submitRequest} />
		}
	}

	/**
	 * 渲染内容类型请求头
	 */
	renderContentTypeHeader() {
		if (this.state.requestType === 'GET') { // GET不需指定Content-Type
			return null;
		}
		return (
			<div>
				<div>
					<Input width='200' name='contentTypeKey' value='Content-Type' disabled={true} />
				</div>
				<div>
					<Select name='contentType' index={this.state.contentType} options={requestContentType} required={true} callback={this.setContentType} />
				</div>
			</div>
		);
	}

	/**
	 * 渲染请求参数
	 */
	renderRequestParam() {
		if (this.state.contentType === 'application/x-www-form-urlencoded') {
			return <RequestParamList requestParam={this.state.requestParam} setRequestParam={this.setRequestParam} />; // 参数列表形式
		} else {
			return <RequestParamString requestParam={this.state.requestParam} setRequestParam={this.setRequestParam} />; // 参数体文本形式
		}
	}

	/**
	 * 渲染响应内容
	 */
	renderResponseContent() {
		if (this.state.viewMode === 'text') {
			return <div><span>{this.state.responseContent}</span></div>;
		} else if (this.state.viewMode === 'json') {
			return <div dangerouslySetInnerHTML={{ __html: json_formater(this.state.responseContent, '') }}></div>;
		} else if (this.state.viewMode === 'xml') {
			return <div dangerouslySetInnerHTML={{ __html: xml_formater(this.state.responseContent, '') }}></div>;
		}
	}

	render() {
		const textModeButtonStyle = this.state.viewMode === 'text' ? newStyle.selected : '';
		const jsonModeButtonStyle = this.state.viewMode === 'json' ? newStyle.selected : '';
		const xmlModeButtonStyle = this.state.viewMode === 'xml' ? newStyle.selected : '';
		return (
			<div>
				<div>
					<Label text='开始测试' />
				</div>
				<div className={newStyle.requestOption}>
					<div>
						<div>
							<Select width='100' name='requestType' index={this.state.requestType} options={requestMethod} required={true} callback={this.setRequestType} />
						</div>
						<div>
							<Input width='500' name='requestUrl' value={this.state.requestUrl} placeholder='请求地址，如：http://www.quickfox.cn' required={true} callback={this.setRequestUrl} />
						</div>
						<div>
							{this.renderSendButton()}
						</div>
						{
							this.props.globalData.userInfo.auth.indexOf('V2.Api.Test.Add') === -1 ? null : (() => {
								return (
									<div>
										<img src={`/static/img/v2/start/upload.png`} title='保存到用例库' onClick={this.openSaveWindow} />
									</div>
								);
							})()
						}
					</div>
				</div>
				<div className={newStyle.whiteSpace} />
				<div>
					<Label text='请求头' />
				</div>
				<div className={newStyle.requestOption}>
					{this.renderContentTypeHeader()}
				</div>
				<RequestHeaderList requestHeader={this.state.requestHeader} setRequestHeader={this.setRequestHeader} />
				<div className={newStyle.whiteSpace} />
				<div>
					<Label text='请求参数' />
					{this.renderRequestParam()}
				</div>
				<div className={newStyle.whiteSpace} />
				<div>
					<Label text='测试结果' />
				</div>
				<div className={newStyle.viewMode}>
					<div className={`${newStyle.textModeButton} ${textModeButtonStyle}`} onClick={this.setViewMode.bind(null, 'text')}><span>原始文本</span></div>
					<div className={`${newStyle.textModeButton} ${jsonModeButtonStyle}`} onClick={this.setViewMode.bind(null, 'json')}><span>JSON</span></div>
					<div className={`${newStyle.textModeButton} ${xmlModeButtonStyle}`} onClick={this.setViewMode.bind(null, 'xml')}><span>XML</span></div>
				</div>
				<div className={newStyle.response}>
					{this.renderResponseContent()}
				</div>
				<SaveWindow spaceId={this.state.spaceId} moduleId={this.state.moduleId} caseId={this.state.caseId} itemName={this.state.itemName} caseName={this.state.caseName} displayed={this.state.saveWindowDisplayed} callback={this.saveCase} closeWindow={this.closeSaveWindow} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	if (!state.globalData.userInfo) {
		state.globalData.userInfo = {
			auth: [],
		}
	}
	return {
		globalData: state.globalData,
	};
}

export default connect(
	mapStateToProps
)(New);