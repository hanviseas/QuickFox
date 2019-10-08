import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import Window from '../../../component/window.jsx';
import Select from '../../../component/select.jsx';
import Button from '../../../component/button.jsx';
import switchModuleStyle from './switchModule.css';

class SwitchModuleWindow extends React.Component {

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
		};
		this.fetchItem = this.fetchItem.bind(this);
		this.fetchSpaces = this.fetchSpaces.bind(this);
		this.fetchModules = this.fetchModules.bind(this);
		this.switchSpace = this.switchSpace.bind(this);
		this.switchModule = this.switchModule.bind(this);
		this.switch = this.switch.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.setState({
				spaces: [],
				modules: [],
				spaceId: 0,
				moduleId: 0,
			}, () => { this.fetchItem() });
		}
	}

	/**
	 * 获取接口信息
	 */
	fetchItem() {
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
	 * 切换
	 */
	switch() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/post/api/item/${this.props.id}/module`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				module_id: this.state.moduleId,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			if (json.code === '000000') { // 请求成功
				_this.props.callback.bind(null, _this.state.spaceId, _this.state.moduleId)();
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
			<Window displayed={this.props.displayed} height='310' title='切换模块' submitHandler={<Button text='保存' callback={this.switch} />} closeWindow={this.props.closeWindow}>
				<div>
					<Select width='500' name='spaceId' index={this.state.spaceId} options={this.state.spaces} callback={this.switchSpace} />
				</div>
				<div>
					<Select width='500' name='moduleId' index={this.state.moduleId} options={this.state.modules} callback={this.switchModule} />
				</div>
			</Window>
		);
	}
}

export default connect()(SwitchModuleWindow);