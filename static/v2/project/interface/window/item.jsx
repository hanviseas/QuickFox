import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import Window from '../../../component/window.jsx';
import Select from '../../../component/select.jsx';
import Input from '../../../component/input.jsx';
import Button from '../../../component/button.jsx';
import itemStyle from './item.css';

class ItemWindow extends React.Component {

	static defaultProps = {
		id: 0, // 接口ID
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.defaultModuleOption = {
			index: 0,
			value: '不设置模块',
		}; // 默认模块选项
		this.state = {
			spaces: [], // 空间数据
			modules: [], // 模块数据
			spaceId: 0, // 空间ID
			moduleId: 0, // 模块ID
			itemName: '', // 接口名称
			requestUrl: '', // 请求地址
		};
		this.fetchItem = this.fetchItem.bind(this);
		this.fetchSpaces = this.fetchSpaces.bind(this);
		this.fetchModules = this.fetchModules.bind(this);
		this.switchSpace = this.switchSpace.bind(this);
		this.switchModule = this.switchModule.bind(this);
		this.setItemName = this.setItemName.bind(this);
		this.setRequestUrl = this.setRequestUrl.bind(this);
		this.saveItem = this.saveItem.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.setState({
				spaces: [],
				modules: [],
				spaceId: 0,
				moduleId: 0,
				itemName: '',
				requestUrl: '',
			}, () => { this.fetchItem() });
		}
	}

	/**
	 * 获取接口信息
	 */
	fetchItem() {
		if (this.props.id === 0) { // 无id属性传入时，代表新建，无需获取信息
			this.fetchSpaces();
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/item/${this.props.id}`, {
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
				spaceId: Number.parseInt(json.space_id),
				moduleId: Number.parseInt(json.module_id),
				itemName: json.name,
				requestUrl: json.url,
			}, () => { _this.fetchSpaces() });
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 获取空间数据
	 */
	fetchSpaces() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/spaces`, {
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
			let spaces = [];
			json.map((space) => {
				spaces.push({
					index: Number.parseInt(space.id),
					value: space.name,
				});
			});
			_this.setState({
				spaces: spaces,
			}, () => { _this.fetchModules() });
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 获取模块数据
	 */
	fetchModules() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/space/${this.state.spaceId}/modules`, {
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
			let modules = [_this.defaultModuleOption];
			json.map((module) => {
				modules.push({
					index: Number.parseInt(module.id),
					value: module.name,
				});
			});
			_this.setState({
				modules: modules,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 切换空间
	 * @param space 空间信息
	 */
	switchSpace(space) {
		this.setState({
			modules: [],
			spaceId: space.index,
		}, () => {
			this.switchModule(this.defaultModuleOption);
			this.fetchModules(space.index);
		}); // 切换空间时更新模块列表
	}

	/**
	 * 切换模块
	 * @param module 模块信息	 
	 */
	switchModule(module) {
		this.setState({
			moduleId: module.index,
		});
	}

	/**
	 * 设置接口名称
	 * @param name 接口名称
	 */
	setItemName(name) {
		this.setState({
			itemName: name,
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
	 * 保存接口
	 */
	saveItem() {
		if (this.state.itemName.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '接口名称不能为空' },
			}); // 发送通知
			return;
		}
		if (this.state.requestUrl.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '请求地址不能为空' },
			}); // 发送通知
			return;
		}
		const _this = this;
		if (this.props.id > 0) { // 更新接口
			const result = fetch(`${domainPath}/v2/post/api/item/${this.props.id}`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					item_name: this.state.itemName,
					request_url: this.state.requestUrl,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				if (json.code === '000000') { // 请求成功
					_this.props.callback.bind(null, _this.state.itemName, _this.state.requestUrl)();
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
		} else { // 新建接口
			const result = fetch(`${domainPath}/v2/put/api/item`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					space_id: this.state.spaceId,
					module_id: this.state.moduleId,
					item_name: this.state.itemName,
					request_url: this.state.requestUrl,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				if (json.code === '000000') { // 请求成功
					_this.props.callback.bind(null, Number.parseInt(json.message), _this.state.itemName, _this.state.requestUrl)();
					_this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 1, content: `接口创建成功：${json.message}` },
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
			<Window displayed={this.props.displayed} height='430' title={this.props.id === 0 ? '创建接口' : '更新接口'} submitHandler={<Button text='保存' callback={this.saveItem} />} closeWindow={this.props.closeWindow}>
				<div>
					<Select width='500' name='spaceId' index={this.state.spaceId} options={this.state.spaces} disabled={this.props.id === 0 ? false : true} callback={this.switchSpace} />
				</div>
				<div>
					<Select width='500' name='moduleId' index={this.state.moduleId} options={this.state.modules} disabled={this.props.id === 0 ? false : true} callback={this.switchModule} />
				</div>
				<div>
					<Input width='500' name='itemName' value={this.state.itemName} maxLength='30' placeholder='接口名称，如：用户登录' required={true} callback={this.setItemName} />
				</div>
				<div>
					<Input width='500' name='requestUrl' value={this.state.requestUrl} placeholder='接口请求地址，如：http://www.lazybug.cn/api/demo' required={true} callback={this.setRequestUrl} />
				</div>
			</Window>
		);
	}
}

export default connect()(ItemWindow);