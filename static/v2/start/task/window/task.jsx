import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import { testLevel } from '../../../config/common.jsx';
import { hour } from '../../../config/common.jsx';
import { minute } from '../../../config/common.jsx';
import Window from '../../../component/window.jsx';
import Input from '../../../component/input.jsx';
import Select from '../../../component/select.jsx';
import Textarea from '../../../component/textarea.jsx';
import Button from '../../../component/button.jsx';
import taskStyle from './task.css';

class TaskWindow extends React.Component {

	static defaultProps = {
		id: 0, // 任务ID
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
		this.defaultHourOption = {
			index: '/',
			value: '/',
		}; // 默认运行时间（小时）选项
		this.defaultMinuteOption = {
			index: '/',
			value: '/',
		}; // 默认运行时间（分钟）选项
		this.runHourOptions = [this.defaultHourOption, ...hour];  // 运行时间（小时）选项
		this.runMinuteOptions = [this.defaultMinuteOption, ...minute]; // 运行时间（分钟）选项
		this.state = {
			environments: [], // 环境数据
			spaces: [], // 空间数据
			modules: [], // 模块数据
			taskName: '', // 任务名称
			environmentId: 0, // 环境ID
			spaceId: 0, // 空间ID
			moduleId: -1, // 模块ID
			testLevel: 3, // 测试等级
			runHour: '/', // 运行时间（小时）
			runMinute: '/', // 运行时间（分钟）
			prepositionScript: '', // 前置脚本
			postpositionScript: '', // 后置脚本
		};
		this.fetchTask = this.fetchTask.bind(this);
		this.fetchEnvironments = this.fetchEnvironments.bind(this);
		this.fetchSpaces = this.fetchSpaces.bind(this);
		this.fetchModules = this.fetchModules.bind(this);
		this.setTaskName = this.setTaskName.bind(this);
		this.setEnvironmentId = this.setEnvironmentId.bind(this);
		this.switchSpace = this.switchSpace.bind(this);
		this.switchModule = this.switchModule.bind(this);
		this.setTestLevel = this.setTestLevel.bind(this);
		this.setRunHour = this.setRunHour.bind(this);
		this.setRunMinute = this.setRunMinute.bind(this);
		this.setPrepositionScript = this.setPrepositionScript.bind(this);
		this.setPostpositionScript = this.setPostpositionScript.bind(this);
		this.saveTask = this.saveTask.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.setState({
				environments: [],
				spaces: [],
				modules: [],
				taskName: '',
				environmentId: 0,
				spaceId: 0,
				moduleId: -1,
				testLevel: 3,
				runHour: '/',
				runMinute: '/',
				prepositionScript: '',
				postpositionScript: '',
			}, () => { this.fetchTask() });
		}
	}

	/**
	 * 获取任务信息
	 */
	fetchTask() {
		if (this.props.id === 0) { // 无id属性传入时，代表新建，无需获取信息
			this.fetchEnvironments();
			this.fetchSpaces();
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/task/${this.props.id}`, {
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
			const times = json.runtime.split('-');
			_this.setState({
				taskName: json.name,
				environmentId: Number.parseInt(json.environment_id),
				environmentName: json.environment_name,
				spaceId: Number.parseInt(json.space_id),
				spaceName: json.space_name,
				moduleId: Number.parseInt(json.module_id),
				moduleName: json.module_name,
				testLevel: Number.parseInt(json.level),
				runHour: times[0],
				runMinute: times[1],
				prepositionScript: json.preposition_script,
				postpositionScript: json.postposition_script,
			}, () => {
				_this.fetchEnvironments();
				_this.fetchSpaces();
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 获取环境数据
	 */
	fetchEnvironments() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/environments`, {
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
			let environments = [];
			json.map((environment) => {
				environments.push({
					index: Number.parseInt(environment.id),
					value: environment.name,
				});
			});
			_this.setState({
				environments: environments,
			});
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
	 * 设置任务名称
	 * @param name 任务名称
	 */
	setTaskName(name) {
		this.setState({
			taskName: name,
		});
	}

	/**
	 * 设置环境ID
	 * @param environment 环境信息
	 */
	setEnvironmentId(environment) {
		this.setState({
			environmentId: environment.index,
			environmentName: environment.value,
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
			spaceName: space.value,
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
			moduleName: module.value,
		});
	}

	/**
	 * 设置测试等级
	 * @param level 测试等级
	 */
	setTestLevel(level) {
		this.setState({
			testLevel: level.index,
		});
	}

	/**
	 * 设置运行时间（小时）
	 * @param hour 运行时间（小时）
	 */
	setRunHour(hour) {
		this.setState({
			runHour: hour.index,
		});
	}

	/**
	 * 设置运行时间（分钟）
	 * @param minute 运行时间（分钟）
	 */
	setRunMinute(minute) {
		this.setState({
			runMinute: minute.index,
		});
	}

	/**
	 * 设置前置脚本
	 * @param script 前置脚本
	 */
	setPrepositionScript(script) {
		this.setState({
			prepositionScript: script,
		});
	}

	/**
	 * 设置后置脚本
	 * @param script 后置脚本
	 */
	setPostpositionScript(script) {
		this.setState({
			postpositionScript: script,
		});
	}

	/**
	 * 保存任务
	 */
	saveTask() {
		if (this.state.taskName.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '任务名称不能为空' },
			}); // 发送通知
			return;
		}
		const _this = this;
		if (this.props.id > 0) { // 更新任务
			const result = fetch(`${domainPath}/v2/post/api/task/${this.props.id}`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					task_name: this.state.taskName,
					environment_id: this.state.environmentId,
					space_id: this.state.spaceId,
					module_id: this.state.moduleId,
					test_level: this.state.testLevel,
					test_runtime: this.state.runHour + '-' + this.state.runMinute,
					preposition_script: this.state.prepositionScript,
					postposition_script: this.state.postpositionScript,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				if (json.code === '000000') { // 请求成功
					_this.props.callback.bind(null, _this.state.taskName, _this.state.environmentName, _this.state.spaceName, _this.state.moduleName, _this.state.testLevel, _this.state.runHour + '-' + _this.state.runMinute)();
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
		} else { // 新建任务
			const result = fetch(`${domainPath}/v2/put/api/task`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					task_name: this.state.taskName,
					environment_id: this.state.environmentId,
					space_id: this.state.spaceId,
					module_id: this.state.moduleId,
					test_level: this.state.testLevel,
					test_runtime: this.state.runHour + '-' + this.state.runMinute,
					preposition_script: this.state.prepositionScript,
					postposition_script: this.state.postpositionScript,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				if (json.code === '000000') { // 请求成功
					_this.props.callback.bind(null, Number.parseInt(json.message), _this.state.taskName, _this.state.environmentName, _this.state.spaceName, _this.state.moduleName, _this.state.testLevel, _this.state.runHour + '-' + _this.state.runMinute)();
					_this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 1, content: `任务创建成功：${json.message}` },
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
			<Window displayed={this.props.displayed} layout='isolate' height='600' title={this.props.id === 0 ? '创建任务' : '更新任务'} submitHandler={<Button text='保存' callback={this.saveTask} />} closeWindow={this.props.closeWindow}>
				<div>
					<Input width='500' name='taskName' value={this.state.taskName} maxLength='30' placeholder='任务名称，如：线上回归任务' required={true} callback={this.setTaskName} />
				</div>
				<div>
					<Select width='500' name='environmentId' index={this.state.environmentId} options={this.state.environments} callback={this.setEnvironmentId} />
				</div>
				<div>
					<Select width='500' name='spaceId' index={this.state.spaceId} options={this.state.spaces} callback={this.switchSpace} />
				</div>
				<div>
					<Select width='500' name='moduleId' index={this.state.moduleId} options={this.state.modules} callback={this.switchModule} />
				</div>
				<div>
					<Select width='500' index={this.state.testLevel} options={testLevel} callback={this.setTestLevel} />
				</div>
				<div className={taskStyle.runtimeOption}>
					<div>
						<Select width='200' name='runHour' index={this.state.runHour} options={this.runHourOptions} required={true} callback={this.setRunHour} />
					</div>
					<div><span>时</span></div>
					<div>
						<Select width='200' name='runMinute' index={this.state.runMinute} options={this.runMinuteOptions} required={true} callback={this.setRunMinute} />
					</div>
					<div><span>分</span></div>
				</div>
				<div>
					<Textarea width='500' name='prepositionScript' value={this.state.prepositionScript} placeholder='任务开始前执行的脚本' callback={this.setPrepositionScript} />
				</div>
				<div>
					<Textarea width='500' name='postpositionScript' value={this.state.postpositionScript} placeholder='任务完成后执行的脚本' callback={this.setPostpositionScript} />
				</div>
			</Window>
		);
	}
}

export default connect()(TaskWindow);