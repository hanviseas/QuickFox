import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import Window from '../../../component/window.jsx';
import Input from '../../../component/input.jsx';
import Select from '../../../component/select.jsx';
import Button from '../../../component/button.jsx';
import requestStepStyle from './requestStep.css';

class RequestStepWindow extends React.Component {

	static defaultProps = {
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.defaultModuleOption = {
			index: -1,
			value: '全部模块',
		}; // 默认模块选项
		this.unsetModuleOption = {
			index: 0,
			value: '未划分模块',
		}; // 未划分模块选项
		this.state = {
			stepName: this.props.name, // 步骤名称
			prepositionFliter: this.props.preposition_fliter, // 前置过滤器
			postpositionFliter: this.props.postposition_fliter, // 后置过滤器
			currentSpaceId: this.props.spaceId, // 当前选中的空间ID
			currentModuleId: this.defaultModuleOption.index, // 当前选中的模块ID
			currentItemId: null, // 当前选中的接口ID
			currentItemName: '', // 当前选中的接口名称
			caseId: null, // 用例ID
			spaces: [], // 空间数据
			modules: [], // 模块数据
			items: [], // 接口数据
			cases: [], // 用例数据
		};
		this.fetchCase = this.fetchCase.bind(this);
		this.fetchSpaces = this.fetchSpaces.bind(this);
		this.fetchModules = this.fetchModules.bind(this);
		this.fetchItems = this.fetchItems.bind(this);
		this.fetchCases = this.fetchCases.bind(this);
		this.setStepName = this.setStepName.bind(this);
		this.setPrepositionFliter = this.setPrepositionFliter.bind(this);
		this.setPostpositionFliter = this.setPostpositionFliter.bind(this);
		this.switchSpace = this.switchSpace.bind(this);
		this.switchModule = this.switchModule.bind(this);
		this.switchItem = this.switchItem.bind(this);
		this.setCaseId = this.setCaseId.bind(this);
		this.saveStep = this.saveStep.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.setState({
				stepName: nextProps.name,
				prepositionFliter: nextProps.preposition_fliter,
				postpositionFliter: nextProps.postposition_fliter,
				currentSpaceId: nextProps.spaceId,
				currentModuleId: this.defaultModuleOption.index,
				currentItemId: null,
				currentItemName: '',
				caseId: null,
				spaces: [],
				modules: [],
				items: [],
				cases: [],
			}, () => { this.fetchCase() });
		}
	}

	/**
	 * 获取用例信息
	 */
	fetchCase() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/case/${this.props.value}`, {
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
				currentSpaceId: Number.parseInt(json.space_id),
				currentModuleId: Number.parseInt(json.module_id),
				currentItemId: Number.parseInt(json.item_id),
				currentItemName: _this.state.stepName.substr(0, _this.state.stepName.length - json.name.length - 2).substr(4),
				caseId: Number.parseInt(json.id),
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
			}, () => { _this.state.currentSpaceId !== null && _this.fetchModules() });
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 获取模块数据
	 */
	fetchModules() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/space/${this.state.currentSpaceId}/modules`, {
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
			let modules = [_this.defaultModuleOption, _this.unsetModuleOption];
			json.map((module) => {
				modules.push({
					index: Number.parseInt(module.id),
					value: module.name,
				});
			});
			_this.setState({
				modules: modules,
			}, () => { _this.state.currentModuleId !== null && _this.fetchItems() });
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 获取接口数据
	 */
	fetchItems() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/space/${this.state.currentSpaceId}/items`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				'module_id': this.state.currentModuleId,
				'page': 0,
				'size': 0,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			let items = [];
			json.map((item) => {
				items.push({
					index: Number.parseInt(item.id),
					value: item.name,
				});
			});
			_this.setState({
				items: items,
			}, () => { _this.state.currentItemId !== null && _this.fetchCases() });
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 获取用例数据
	 */
	fetchCases() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/item/${this.state.currentItemId}/cases`, {
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
			let cases = [];
			json.map((casee) => {
				cases.push({
					index: Number.parseInt(casee.id),
					value: casee.name,
				});
			});
			_this.setState({
				cases: cases,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 设置步骤名称
	 * @param name 步骤名称
	 */
	setStepName(name) {
		this.setState({
			stepName: name,
		});
	}

	/**
	 * 设置前置过滤器
	 * @param fliter 过滤器
	 */
	setPrepositionFliter(fliter) {
		this.setState({
			prepositionFliter: fliter,
		});
	}

	/**
	 * 设置后置过滤器
	 * @param fliter 过滤器
	 */
	setPostpositionFliter(fliter) {
		this.setState({
			postpositionFliter: fliter,
		});
	}

	/**
	 * 切换空间
	 * @param space 空间信息
	 */
	switchSpace(space) {
		this.setState({
			stepName: '调用: [接口]->[用例]',
			currentSpaceId: space.index,
			currentModuleId: this.defaultModuleOption.index,
			currentItemId: null,
			currentItemName: '',
			caseId: null,
			modules: [this.defaultModuleOption, this.unsetModuleOption],
			modules: [],
			items: [],
			cases: [],
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
			stepName: '调用: [接口]->[用例]',
			currentModuleId: module.index,
			currentItemId: null,
			currentItemName: '',
			caseId: null,
			items: [],
			cases: [],
		}, () => {
			this.fetchItems();
		}); // 切换模块时更新接口列表
	}

	/**
	 * 切换接口
	 * @param item 接口信息
	 */
	switchItem(item) {
		this.setState({
			stepName: '调用: ' + item.value,
			currentItemId: item.index,
			currentItemName: item.value,
			caseId: null,
			cases: [],
		}, () => {
			this.fetchCases();
		}); // 切换接口时更新用例列表
	}

	/**
	 * 设置用例ID
	 * @param casee 用例信息
	 */
	setCaseId(casee) {
		this.setState({
			stepName: '调用: ' + this.state.currentItemName + '->' + casee.value,
			caseId: casee.index,
		});
	}

	/**
	 * 保存步骤
	 */
	saveStep() {
		const stepData = {
			name: this.state.stepName,
			command: this.props.command,
			preposition_fliter: this.state.prepositionFliter,
			postposition_fliter: this.state.postpositionFliter,
			value: this.state.caseId,
		}
		if (this.state.stepName.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '步骤名称不能为空' },
			}); // 发送通知
			return;
		}
		if (!this.state.caseId) { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '必须选择一个用例' },
			}); // 发送通知
			return;
		}
		this.props.callback.bind(null, this.props.index, stepData)();
	}

	render() {
		return (
			<Window displayed={this.props.displayed} width='600' height='620' level={2} title={'编辑调用接口步骤'} submitHandler={<Button text='保存' callback={this.saveStep} />} closeWindow={this.props.closeWindow}>
				<div>
					<Input width='500' name='stepName' value={this.state.stepName} maxLength='100' placeholder='步骤名称，如：用户登录' disabled={true} required={true} callback={this.setStepName} />
				</div>
				<div>
					<Input width='500' name='prepositionFliter' value={this.state.prepositionFliter} maxLength='100' placeholder='前置过滤器' callback={this.setPrepositionFliter} />
				</div>
				<div>
					<Input width='500' name='postpositionFliter' value={this.state.postpositionFliter} maxLength='100' placeholder='后置过滤器' callback={this.setPostpositionFliter} />
				</div>
				<div>
					<Select width='500' name='spaceId' index={this.state.currentSpaceId} options={this.state.spaces} disabled={this.props.command === 'self' ? true : false} callback={this.switchSpace} />
				</div>
				<div>
					<Select width='500' name='moduleId' index={this.state.currentModuleId} options={this.state.modules} disabled={this.props.command === 'self' ? true : false} callback={this.switchModule} />
				</div>
				<div>
					<Select width='500' name='itemId' index={this.state.currentItemId} options={this.state.items} disabled={this.props.command === 'self' ? true : false} callback={this.switchItem} />
				</div>
				<div>
					<Select width='500' name='caseId' index={this.state.caseId} options={this.state.cases} disabled={this.props.command === 'self' ? true : false} required={true} callback={this.setCaseId} />
				</div>
			</Window>
		);
	}
}

export default connect()(RequestStepWindow);