import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import Suite from '../../../component/window/suite.jsx';
import Input from '../../../component/input.jsx';
import Select from '../../../component/select.jsx';
import Textarea from '../../../component/textarea.jsx';
import Checkbox from '../../../component/checkbox.jsx';
import Button from '../../../component/button.jsx';
import stepStyle from './step.css';

class StepWindow extends React.Component {

	static defaultProps = {
		spaceId: 0, // 空间ID
		caseId: 0, // 用例ID
		position: 0, // 步骤位置
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
		this.tabs = [
			{
				index: 'request',
				name: '调用接口',
				icon: '/static/img/v2/interface/icon-request.png',
			},
			{
				index: 'data',
				name: '存储查询',
				icon: '/static/img/v2/interface/icon-data.png',
			},
			{
				index: 'check',
				name: '检查点',
				icon: '/static/img/v2/interface/icon-check.png',
			},
			{
				index: 'time',
				name: '延时器',
				icon: '/static/img/v2/interface/icon-time.png',
			},
		]; // 窗口选单
		this.checkOptions = [
			{
				index: 'all',
				value: false,
				text: '完全匹配',
				mutex: ['begin', 'end'],
			},
			{
				index: 'begin',
				value: false,
				text: '前段匹配',
				mutex: ['all'],
			},
			{
				index: 'end',
				value: false,
				text: '后段匹配',
				mutex: ['all'],
			},
			{
				index: 'reg',
				value: false,
				text: '正则表达式',
			},
			{
				index: 'opposite',
				value: false,
				text: '取反',
			},
		]; // 检查点选项
		this.state = {
			currentTabIndex: this.tabs[0].index, // 当前选项卡索引
			stepName: '', // 步骤名称
			requestStepName: '调用: [接口]->[用例]', // 调用接口步骤名称
			prepositionFliter: '', // 前置过滤器
			postpositionFliter: '', // 后置过滤器
			currentSpaceId: this.props.spaceId, // 当前选中的空间ID
			currentModuleId: this.defaultModuleOption.index, // 当前选中的模块ID
			currentItemId: null, // 当前选中的接口ID
			currentItemName: '', // 当前选中的接口名称
			caseId: null, // 用例ID
			dataConfig: '', // 存储查询配置
			dataStatement: '', // 存储查询语句
			checkOption: 'include', // 检查点选项
			checkValidation: '', // 检查点校验值
			delayTime: '', // 延时时长（毫秒）
			spaces: [], // 空间数据
			modules: [], // 模块数据
			items: [], // 接口数据
			cases: [], // 用例数据
		};
		this.fetchSpaces = this.fetchSpaces.bind(this);
		this.fetchModules = this.fetchModules.bind(this);
		this.fetchItems = this.fetchItems.bind(this);
		this.fetchCases = this.fetchCases.bind(this);
		this.setCurrentTabIndex = this.setCurrentTabIndex.bind(this);
		this.setStepName = this.setStepName.bind(this);
		this.setRequestStepName = this.setRequestStepName.bind(this);
		this.setPrepositionFliter = this.setPrepositionFliter.bind(this);
		this.setPostpositionFliter = this.setPostpositionFliter.bind(this);
		this.switchSpace = this.switchSpace.bind(this);
		this.switchModule = this.switchModule.bind(this);
		this.switchItem = this.switchItem.bind(this);
		this.setCaseId = this.setCaseId.bind(this);
		this.setDataConfig = this.setDataConfig.bind(this);
		this.setDataStatement = this.setDataStatement.bind(this);
		this.setCheckOption = this.setCheckOption.bind(this);
		this.setCheckValidation = this.setCheckValidation.bind(this);
		this.setDelayTime = this.setDelayTime.bind(this);
		this.saveStep = this.saveStep.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.checkOptions.map((option) => { // 重置复选框选项
				option.value = false;
			});
			this.setState({
				stepName: '',
				requestStepName: '调用: [接口]->[用例]',
				prepositionFliter: '',
				postpositionFliter: '',
				currentSpaceId: nextProps.spaceId,
				currentModuleId: this.defaultModuleOption.index,
				currentItemId: null,
				currentItemName: '',
				caseId: null,
				dataConfig: '',
				dataStatement: '',
				checkOption: 'include',
				checkValidation: '',
				delayTime: '', // 延时时长（毫秒）
				spaces: [],
				modules: [],
				items: [],
				cases: [],
			}, () => { this.fetchSpaces() });
		}
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
	 * 设置当前选项卡索引
	 * @param tabIndex 选项卡索引
	 */
	setCurrentTabIndex(tabIndex) {
		this.setState({
			currentTabIndex: tabIndex,
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
	 * 设置调用接口步骤名称
	 * @param name 步骤名称
	 */
	setRequestStepName(name) {
		this.setState({
			requestStepName: name,
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
			requestStepName: '调用: [接口]->[用例]',
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
			requestStepName: '调用: [接口]->[用例]',
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
			requestStepName: '调用: ' + item.value,
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
			requestStepName: '调用: ' + this.state.currentItemName + '->' + casee.value,
			caseId: casee.index,
		});
	}

	/**
	 * 设置存储查询配置
	 * @param config 配置值
	 */
	setDataConfig(config) {
		this.setState({
			dataConfig: config,
		});
	}

	/**
	 * 设置存储查询语句
	 * @param statement 查询语句
	 */
	setDataStatement(statement) {
		this.setState({
			dataStatement: statement,
		});
	}

	/**
	 * 设置检查点选项
	 * @param values 选项值
	 */
	setCheckOption(values) {
		values.includes('all') || values.unshift('include'); // 非完全匹配模式，则设置为部分匹配
		this.setState({
			checkOption: values.join(' | '),
		});
	}

	/**
	 * 设置检查点校验值
	 * @param validation 校验值
	 */
	setCheckValidation(validation) {
		this.setState({
			checkValidation: validation,
		});
	}

	/**
	 * 设置延时时长
	 * @param time 延时时长
	 */
	setDelayTime(time) {
		this.setState({
			delayTime: time,
		});
	}

	/**
	 * 保存步骤
	 */
	saveStep() {
		const stepData = {
			case_id: this.props.caseId,
			name: this.state.currentTabIndex === 'request' ? this.state.requestStepName : this.state.stepName,
			type: '',
			command: '',
			preposition_fliter: this.state.prepositionFliter,
			postposition_fliter: this.state.postpositionFliter,
			value: '',
		}
		switch (this.state.currentTabIndex) {
			case 'request':
				if (this.state.requestStepName.trim() === '') { // 参数检查
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
				stepData.type = 'request';
				stepData.value = this.state.caseId;
				break;
			case 'data':
				if (this.state.stepName.trim() === '') { // 参数检查
					this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 0, content: '步骤名称不能为空' },
					}); // 发送通知
					return;
				}
				if (!this.state.dataConfig) { // 参数检查
					this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 0, content: '数据配置不能为空' },
					}); // 发送通知
					return;
				}
				if (!this.state.dataStatement) { // 参数检查
					this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 0, content: '查询语句不能为空' },
					}); // 发送通知
					return;
				}
				stepData.type = 'data';
				stepData.command = 'config:' + this.state.dataConfig;
				stepData.value = this.state.dataStatement;
				break;
			case 'check':
				if (this.state.stepName.trim() === '') { // 参数检查
					this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 0, content: '步骤名称不能为空' },
					}); // 发送通知
					return;
				}
				if (!this.state.checkValidation) { // 参数检查
					this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 0, content: '检查内容不能为空' },
					}); // 发送通知
					return;
				}
				stepData.type = 'check';
				stepData.command = this.state.checkOption;
				stepData.value = this.state.checkValidation;
				break;
			case 'time':
				if (this.state.stepName.trim() === '') { // 参数检查
					this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 0, content: '步骤名称不能为空' },
					}); // 发送通知
					return;
				}
				if (this.state.delayTime.trim() === '') { // 参数检查
					this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 0, content: '延时时长不能为空' },
					}); // 发送通知
					return;
				}
				if (parseInt(this.state.delayTime.trim()).toString() !== this.state.delayTime.trim()) { // 参数检查
					this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 0, content: '延时时长必须为整数' },
					}); // 发送通知
					return;
				}
				if (parseInt(this.state.delayTime.trim()) < 0 || parseInt(this.state.delayTime.trim()) > 60000) { // 参数检查
					this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 0, content: '延时时长必须在 0 ~ 60000 毫秒之间' },
					}); // 发送通知
					return;
				}
				stepData.type = 'time';
				stepData.value = parseInt(this.state.delayTime.trim());
				break;
		}
		this.props.callback.bind(null, this.props.position, stepData)();
	}

	render() {
		return (
			<Suite displayed={this.props.displayed} layout={'isolate'} width='800' height='650' level={3} title={'创建步骤'} tabs={this.tabs} submitHandler={<Button text='保存' callback={this.saveStep} />} closeWindow={this.props.closeWindow} callback={this.setCurrentTabIndex}>
				<div name={'request'}>
					<div>
						<Input width='500' name='requestStepName' value={this.state.requestStepName} maxLength='100' placeholder='步骤名称，如：用户登录' disabled={true} required={true} callback={this.setRequestStepName} />
					</div>
					<div>
						<Input width='500' name='prepositionFliter' value={this.state.prepositionFliter} maxLength='100' placeholder='前置过滤器' callback={this.setPrepositionFliter} />
					</div>
					<div>
						<Input width='500' name='postpositionFliter' value={this.state.postpositionFliter} maxLength='100' placeholder='后置过滤器' callback={this.setPostpositionFliter} />
					</div>
					<div>
						<Select width='500' name='spaceId' index={this.state.currentSpaceId} options={this.state.spaces} callback={this.switchSpace} />
					</div>
					<div>
						<Select width='500' name='moduleId' index={this.state.currentModuleId} options={this.state.modules} callback={this.switchModule} />
					</div>
					<div>
						<Select width='500' name='itemId' index={this.state.currentItemId} options={this.state.items} callback={this.switchItem} />
					</div>
					<div>
						<Select width='500' name='caseId' index={this.state.caseId} options={this.state.cases} required={true} callback={this.setCaseId} />
					</div>
				</div>
				<div name={'data'}>
					<div>
						<Input width='500' name='stepName' value={this.state.stepName} maxLength='30' placeholder='步骤名称，如：查询用户信息' required={true} callback={this.setStepName} />
					</div>
					<div>
						<Input width='500' name='prepositionFliter' value={this.state.prepositionFliter} maxLength='100' placeholder='前置过滤器' callback={this.setPrepositionFliter} />
					</div>
					<div>
						<Input width='500' name='command' value={this.state.dataConfig} maxLength='30' placeholder='数据配置，如：localdb' required={true} callback={this.setDataConfig} />
					</div>
					<div>
						<Textarea width='500' name='value' value={this.state.dataStatement} placeholder='查询语句，如：select * from user where userId = 1' required={true} callback={this.setDataStatement} />
					</div>
				</div>
				<div name={'check'}>
					<div>
						<Input width='500' name='stepName' value={this.state.stepName} maxLength='30' placeholder='步骤名称，如：检查用户状态' required={true} callback={this.setStepName} />
					</div>
					<div>
						<Input width='500' name='prepositionFliter' value={this.state.prepositionFliter} maxLength='100' placeholder='前置过滤器' callback={this.setPrepositionFliter} />
					</div>
					<div>
						<div className={stepStyle.checkbox}>
							<Checkbox name='command' options={this.checkOptions} callback={this.setCheckOption} />
						</div>
					</div>
					<div>
						<Textarea width='500' name='value' value={this.state.checkValidation} placeholder='检查内容，如："status":1' required={true} callback={this.setCheckValidation} />
					</div>
				</div>
				<div name={'time'}>
					<div>
						<Input width='500' name='stepName' value={this.state.stepName} maxLength='30' placeholder='步骤名称，如：等待 5000 毫秒' required={true} callback={this.setStepName} />
					</div>
					<div>
						<Input width='500' name='delayTime' value={this.state.delayTime} maxLength='5' placeholder='延时时长，单位为毫秒' required={true} callback={this.setDelayTime} />
					</div>
				</div>
			</Suite>
		);
	}
}

export default connect()(StepWindow);