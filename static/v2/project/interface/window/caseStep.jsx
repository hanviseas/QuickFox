import React from 'react';
import $ from 'jquery';
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux';
import HTML5Backend, { getEmptyImage } from 'react-dnd-html5-backend';
import { DragDropContext, DragSource, DropTarget, DragLayer } from 'react-dnd';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import Load from '../../../component/load.jsx';
import Window from '../../../component/window.jsx';
import Select from '../../../component/select.jsx';
import Button from '../../../component/button.jsx';
import StepWindow from './step.jsx';
import RequestStepWindow from './requestStep.jsx';
import DataStepWindow from './dataStep.jsx';
import CheckStepWindow from './checkStep.jsx';
import TimeStepWindow from './timeStep.jsx';
import globalStyle from '../../../public/global.css';
import caseStepStyle from './caseStep.css';

class CaseStepWindow extends React.Component {

	static defaultProps = {
		id: 0, // 用例ID
		spaceId: 0, // 空间ID
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.state = {
			caseName: '', // 用例名称
			saving: false, // 保存中
			testing: false, // 测试中
			currentEnvironmentId: 0, // 当前环境ID
			currentTestStepIndex: 0, // 当前测试步骤索引
			environments: [], // 环境数据
			steps: [], // 步骤数据
			tests: [], // 测试数据
			loading: true, // 载入状态
		};
		this.fetchEnvironments = this.fetchEnvironments.bind(this);
		this.fetchCase = this.fetchCase.bind(this);
		this.fetchSteps = this.fetchSteps.bind(this);
		this.switchEnvironment = this.switchEnvironment.bind(this);
		this.resortStepList = this.resortStepList.bind(this);
		this.callTest = this.callTest.bind(this);
		this.testRequestStep = this.testRequestStep.bind(this);
		this.testDataStep = this.testDataStep.bind(this);
		this.testCheckStep = this.testCheckStep.bind(this);
		this.testTimeStep = this.testTimeStep.bind(this);
		this.startTest = this.startTest.bind(this);
		this.stopTest = this.stopTest.bind(this);
		this.clearTest = this.clearTest.bind(this);
		this.unfoldTest = this.unfoldTest.bind(this);
		this.foldTest = this.foldTest.bind(this);
		this.testResponseAreaSlideUp = this.testResponseAreaSlideUp.bind(this);
		this.testResponseAreaSlideDown = this.testResponseAreaSlideDown.bind(this);
		this.testResponseAreaReset = this.testResponseAreaReset.bind(this);
		this.addStep = this.addStep.bind(this);
		this.updateStep = this.updateStep.bind(this);
		this.deleteStep = this.deleteStep.bind(this);
		this.saveSteps = this.saveSteps.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.setState({
				saving: false, // 保存中
				testing: false, // 测试中
				currentEnvironmentId: 0, // 当前环境ID
				currentTestStepIndex: 0, // 当前测试步骤索引
				environments: [], // 环境数据
				steps: [], // 步骤数据
				tests: [], // 测试数据
				loading: true, // 载入状态
			}, () => {
				this.fetchCase();
				this.fetchEnvironments();
			});
		}
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
	 * 获取用例信息
	 */
	fetchCase() {
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
			}, () => { _this.fetchSteps() });
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 获取用例步骤
	 */
	fetchSteps() {
		this.setState({
			loading: true,
		});
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/case/${this.props.id}/steps`, {
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
			let steps = [];
			json.map((step) => {
				steps.push(step);
			});
			_this.setState({
				loading: false,
				steps: steps,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 切换环境
	 * @param environment 环境信息
	 */
	switchEnvironment(environment) {
		this.setState({
			currentEnvironmentId: environment.index,
		});
	}

	/**
	 * 步骤重新排序
	 * @param source 源位置
	 * @param target 目标位置
	 */
	resortStepList(source, target) {
		let steps = this.state.steps;
		if (source <= target) { // 往后拖动
			steps.splice(target + 1, 0, steps[source]);
			steps.splice(source, 1);
		} else { // 往前拖动
			steps.splice(target, 0, steps[source]);
			steps.splice(source + 1, 1);
		}
		this.setState({
			steps: steps,
		});
	}

	/**
	 * 调用测试
	 * @param extendsion 附加内容
	 */
	callTest(extendsion) {
		if (!this.state.testing) { // 已停止测试
			return;
		}
		const tests = this.state.tests;
		const step = tests.shift();
		this.setState({
			tests: tests,
		}, () => {
			if (step) { // 测试未完成
				if (step.type === 'request') {
					this.testRequestStep(step, extendsion);
				} else if (step.type === 'data') {
					this.testDataStep(step, extendsion);
				} else if (step.type === 'check') {
					this.testCheckStep(step, extendsion);
				} else if (step.type === 'time') {
					this.testTimeStep(step, extendsion);
				}
			} else { // 测试已完成
				this.setState({
					testing: false,
					currentTestStepIndex: 0,
				});
			}
		});
	}

	/**
	 * 测试调用接口步骤
	 * @param step 步骤
	 * @param extendsion 附加内容
	 */
	testRequestStep(step, extension) {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/test/step/request/${step.value}`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				step_value: step.value,
				environment_id: this.state.currentEnvironmentId,
				preposition_fliter: step.preposition_fliter,
				postposition_fliter: step.postposition_fliter,
				extension: extension,
			}),
		});
		result.then(function (response) {
			//console.log(response);
			return response.text();
		}).then(function (text) {
			const jsonObj = JSON.parse(text);
			const steps = _this.state.steps; // 回写测试结果
			steps[_this.state.currentTestStepIndex].haveResponse = true;
			steps[_this.state.currentTestStepIndex].response = {
				requestUrl: jsonObj.request_url,
				requestParam: jsonObj.request_param,
				requestHeader: jsonObj.request_header,
				responseHeader: jsonObj.response_header,
				responseBody: jsonObj.response_body,
				responseCode: jsonObj.response_code,
				responseTime: jsonObj.response_time,
			};
			_this.setState({
				steps: steps,
				currentTestStepIndex: _this.state.testing ? ++_this.state.currentTestStepIndex : 0,
			}, () => {
				if (_this.state.testing) { // 取回返回值时可能已停止测试
					_this.callTest(jsonObj.response_body);
				}
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 测试存储查询步骤
	 * @param step 步骤
	 * @param extendsion 附加内容
	 */
	testDataStep(step, extension) {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/test/step/data/data`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				step_command: step.command,
				step_value: step.value,
				environment_id: this.state.currentEnvironmentId,
				preposition_fliter: step.preposition_fliter,
				extension: extension,
			}),
		});
		result.then(function (response) {
			//console.log(response);
			return response.text();
		}).then(function (text) {
			const jsonObj = JSON.parse(text);
			const steps = _this.state.steps; // 回写测试结果
			steps[_this.state.currentTestStepIndex].haveResponse = true;
			steps[_this.state.currentTestStepIndex].response = {
				query: jsonObj.query,
				data: jsonObj.data,
			};
			_this.setState({
				steps: steps,
				currentTestStepIndex: _this.state.testing ? ++_this.state.currentTestStepIndex : 0,
			}, () => {
				if (_this.state.testing) { // 取回返回值时可能已停止测试
					_this.callTest(jsonObj.data);
				}
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 测试检查点步骤
	 * @param step 步骤
	 * @param extendsion 附加内容
	 */
	testCheckStep(step, extension) {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/test/step/check/check`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				step_command: step.command,
				step_value: step.value,
				environment_id: this.state.currentEnvironmentId,
				preposition_fliter: step.preposition_fliter,
				extension: extension,
			}),
		});
		result.then(function (response) {
			//console.log(response);
			return response.text();
		}).then(function (text) {
			const jsonObj = JSON.parse(text);
			const steps = _this.state.steps; // 回写测试结果
			steps[_this.state.currentTestStepIndex].haveResponse = true;
			steps[_this.state.currentTestStepIndex].response = {
				source: jsonObj.source,
				target: jsonObj.target,
				result: jsonObj.result,
			};
			_this.setState({
				steps: steps,
				currentTestStepIndex: _this.state.testing ? ++_this.state.currentTestStepIndex : 0,
			}, () => {
				if (_this.state.testing) { // 取回返回值时可能已停止测试
					_this.callTest(extension);
				}
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 测试延时器步骤
	 * @param step 步骤
	 * @param extendsion 附加内容
	 */
	testTimeStep(step, extension) {
		const _this = this;
		setTimeout(function () {
			const steps = _this.state.steps; // 回写测试结果
			steps[_this.state.currentTestStepIndex].haveResponse = true;
			steps[_this.state.currentTestStepIndex].response = {
				time: step.value,
			};
			_this.setState({
				steps: steps,
				currentTestStepIndex: _this.state.testing ? ++_this.state.currentTestStepIndex : 0,
			}, () => {
				if (_this.state.testing) { // 取回返回值时可能已停止测试
					_this.callTest(extension);
				}
			});
		}, step.value);
	}

	/**
	 * 开始测试
	 */
	startTest() {
		this.clearTest(() => {
			this.setState({
				testing: true,
				tests: this.state.steps.concat(),
			}, () => { this.callTest('') });
		});
	}

	/**
	 * 停止测试
	 */
	stopTest() {
		this.setState({
			testing: false,
			currentTestStepIndex: 0,
		});
	}

	/**
	 * 清理测试
	 * @param callback 回调函数
	 */
	clearTest(callback) {
		const steps = this.state.steps;
		steps.map((step, index) => { // 清除所有测试结果
			steps[index].haveResponse = false;
			steps[index].testResponseAreaHeightLevel = 1;
		});
		this.setState({
			steps: steps,
		}, callback.bind(this));
	}

	/**
	 * 全部展开
	 */
	unfoldTest() {
		const steps = this.state.steps;
		steps.map((step, index) => {
			steps[index].testResponseAreaHeightLevel = 2;
		});
		this.setState({
			steps: steps,
		});
	}

	/**
	 * 全部收起
	 */
	foldTest() {
		const steps = this.state.steps;
		steps.map((step, index) => {
			steps[index].testResponseAreaHeightLevel = 1;
		});
		this.setState({
			steps: steps,
		});
	}

	/**
	 * 收起步骤测试响应区域
	 * @param index 步骤索引
	 */
	testResponseAreaSlideUp(index) {
		const steps = this.state.steps;
		steps[index].testResponseAreaHeightLevel === undefined && (steps[index].testResponseAreaHeightLevel = 1);
		steps[index].testResponseAreaHeightLevel = --(steps[index].testResponseAreaHeightLevel);
		this.setState({
			steps: steps,
		});
	}

	/**
	 * 展开步骤测试响应区域
	 * @param index 步骤索引
	 */
	testResponseAreaSlideDown(index) {
		const steps = this.state.steps;
		steps[index].testResponseAreaHeightLevel === undefined && (steps[index].testResponseAreaHeightLevel = 1);
		steps[index].testResponseAreaHeightLevel = ++(steps[index].testResponseAreaHeightLevel);
		this.setState({
			steps: steps,
		});
	}

	/**
	 * 重置步骤测试响应区域
	 * @param index 步骤索引
	 */
	testResponseAreaReset(index) {
		const steps = this.state.steps;
		steps[index].haveResponse = false;
		steps[index].testResponseAreaHeightLevel = 1;
		this.setState({
			steps: steps,
		});
	}

	/**
	 * 添加步骤
	 * @param position 添加位置
	 * @param data 步骤数据
	 */
	addStep(position, data) {
		let steps = this.state.steps;
		steps.splice(position, 0, data);
		steps.map((step, index) => {
			steps[index].sequence = index + 1; // 重写序号以防重复
		});
		this.setState({
			steps: steps,
		});
	}

	/**
	 * 更新步骤
	 * @param index 位置索引
	 * @param data 步骤数据
	 */
	updateStep(index, data) {
		let steps = this.state.steps;
		steps[index].name = data.name;
		steps[index].command = data.command;
		steps[index].preposition_fliter = data.preposition_fliter;
		steps[index].postposition_fliter = data.postposition_fliter;
		steps[index].value = data.value;
		this.setState({
			steps: steps,
		});
	}

	/**
	 * 删除步骤
	 * @param index 位置索引
	 */
	deleteStep(index) {
		let steps = this.state.steps;
		steps.splice(index, 1);
		this.setState({
			steps: steps,
		});
	}

	/**
	 * 保存步骤
	 */
	saveSteps() {
		this.setState({
			saving: true,
		}, () => {
			let step_counter = 0;
			const _this = this;
			const result = fetch(`${domainPath}/v2/delete/api/case/${this.props.id}/steps`, {
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
				_this.state.steps.map((step, index) => {
					const result = fetch(`${domainPath}/v2/put/api/step`, {
						method: 'post',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
						},
						body: encodeParams({
							case_id: step.case_id,
							step_name: step.name,
							step_type: step.type,
							step_command: step.command,
							preposition_fliter: step.preposition_fliter,
							postposition_fliter: step.postposition_fliter,
							step_value: step.value,
							step_sequence: index + 1,
						}),
					});
					result.then(function (response) {
						// console.log(response);
						return response.json();
					}).then(function (json) {
						step_counter++;
						if (step_counter === _this.state.steps.length) { // 所有步骤保存成功后发送消息
							_this.props.dispatch({
								type: 'SET_INFORMATION',
								information: { type: 1, content: '步骤保存成功' },
							}); // 发送通知
						}
						_this.setState({
							saving: false,
						});
					}).catch(function (e) {
						console.log(e);
					});
				});
			}).catch(function (e) {
				console.log(e);
			});
		});
	}

	render() {
		return (
			<Window displayed={this.props.displayed} size='full' level={2} title={this.state.caseName} submitHandler={this.props.userInfo.auth.indexOf('V2.Api.Step.Add') === -1 ? <Button type='disability' text='无权限' callback={() => { }} /> : (this.state.saving ? <Button type='disability' text='保存中' callback={() => { }} /> : <Button text='保存' callback={this.saveSteps} />)} closeWindow={this.props.closeWindow}>
				<StepList loading={this.state.loading} environments={this.state.environments} steps={this.state.steps} spaceId={this.props.spaceId} caseId={this.props.id} saving={this.state.saving} testing={this.state.testing} currentEnvironmentId={this.state.currentEnvironmentId} switchEnvironment={this.switchEnvironment} resortStepList={this.resortStepList} startTest={this.startTest} stopTest={this.stopTest} clearTest={this.clearTest} unfoldTest={this.unfoldTest} foldTest={this.foldTest} testResponseAreaSlideUp={this.testResponseAreaSlideUp} testResponseAreaSlideDown={this.testResponseAreaSlideDown} testResponseAreaReset={this.testResponseAreaReset} addStep={this.addStep} updateStep={this.updateStep} deleteStep={this.deleteStep} />
			</Window>
		);
	}
}

@DragDropContext(HTML5Backend)
class StepList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			viewMode: 'test', // 查看模式（默认为测试模式）
			steps: this.props.steps, // 步骤数据
		};
		this.setViewMode = this.setViewMode.bind(this);
		this.renderTestController = this.renderTestController.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			steps: nextProps.steps,
		});
	}

	/**
	 * 获取步骤类型名称
	 * @param type 类型
	 */
	getStepTypeName(type) {
		switch (type) {
			case 'request':
				return '调用接口';
			case 'data':
				return '存储查询';
			case 'check':
				return '检查点';
			case 'time':
				return '延时器';
		}
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
	 * 渲染测试控制器
	 * @return testController 测试控制器
	 */
	renderTestController() {
		return this.state.viewMode === 'edit' ? null : (() => { // 编辑模式不显示测试控制器
			return (
				<div>
					{
						this.props.testing ? (() => {
							return (
								<div className={caseStepStyle.controller}>
									<div><img src='/static/img/v2/interface/start-test-disabled.png' title='开始测试' /></div>
									<div onClick={this.props.stopTest}><img src='/static/img/v2/interface/stop-test.png' title='停止测试' /></div>
									<div><img src='/static/img/v2/interface/clear-test-disabled.png' title='清理测试' /></div>
									<div><img src='/static/img/v2/interface/unfold-test-disabled.png' title='全部展开' /></div>
									<div><img src='/static/img/v2/interface/fold-test-disabled.png' title='全部收起' /></div>
								</div>
							);
						})() : (() => {
							return (
								<div className={caseStepStyle.controller}>
									<div onClick={this.props.startTest}><img src='/static/img/v2/interface/start-test.png' title='开始测试' /></div>
									<div><img src='/static/img/v2/interface/stop-test-disabled.png' title='停止测试' /></div>
									<div onClick={this.props.clearTest.bind(null, () => { })}><img src='/static/img/v2/interface/clear-test.png' title='清理测试' /></div>
									<div onClick={this.props.unfoldTest}><img src='/static/img/v2/interface/unfold-test.png' title='全部展开' /></div>
									<div onClick={this.props.foldTest}><img src='/static/img/v2/interface/fold-test.png' title='全部收起' /></div>
								</div>
							);
						})()
					}
				</div>
			);
		})();
	}

	render() {
		const testModeButtonStyle = this.state.viewMode === 'test' ? caseStepStyle.selected : '';
		const editModeButtonStyle = this.state.viewMode === 'edit' ? caseStepStyle.selected : '';
		return (
			<div className={caseStepStyle.content}>
				<div className={caseStepStyle.console}>
					<div className={caseStepStyle.environment}>
						<Select width='200' name='environmentId' index={this.props.currentEnvironmentId} options={this.props.environments} callback={this.props.switchEnvironment} />
					</div>
					{this.renderTestController()}
					<div className={caseStepStyle.viewMode}>
						<div className={`${caseStepStyle.testModeButton} ${testModeButtonStyle}`} onClick={this.setViewMode.bind(null, 'test')}><span>测试模式</span></div>
						<div className={`${caseStepStyle.editModeButton} ${editModeButtonStyle}`} onClick={this.setViewMode.bind(null, 'edit')}><span>编辑模式</span></div>
					</div>
				</div>
				<DragStep getStepTypeName={this.getStepTypeName} />
				<Space position={0} spaceId={this.props.spaceId} caseId={this.props.caseId} viewMode={this.state.viewMode} addStep={this.props.addStep} />
				{
					this.props.loading ? (() => {
						return <Load />;
					})() : (() => {
						return (
							this.state.steps.map((step, index) => {
								return (
									<div key={step.sequence}>
										<Step index={index} spaceId={this.props.spaceId} {...step} viewMode={this.state.viewMode} getStepTypeName={this.getStepTypeName} resortStepList={this.props.resortStepList} testResponseAreaSlideUp={this.props.testResponseAreaSlideUp} testResponseAreaSlideDown={this.props.testResponseAreaSlideDown} testResponseAreaReset={this.props.testResponseAreaReset} updateStep={this.props.updateStep} deleteStep={this.props.deleteStep} />
										<Space position={index + 1} spaceId={this.props.spaceId} caseId={this.props.caseId} viewMode={this.state.viewMode} addStep={this.props.addStep} />
									</div>
								);
							})
						);
					})()
				}
			</div>
		);
	}
}

@DragSource('step', {
	beginDrag(props) {
		props.testResponseAreaReset(props.index);
		return {
			index: props.index,
			type: props.type,
			name: props.name,
		}
	}
}, (connect, monitor) => {
	return {
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		isDragging: monitor.isDragging(),
	}
})
@DropTarget('step', {
	hover(props, monitor, component) {
		if (monitor.getItem().index === props.index) { // 自身不响应
			return;
		}
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2; // 元素中线Y座标
		const clientOffset = monitor.getClientOffset();
		const hoverClientY = clientOffset.y - hoverBoundingRect.top; // 当前指针在元素中的Y座标
		if (monitor.getItem().index < props.index && hoverClientY < hoverMiddleY) { // 有向后拖动倾向，必须大于中线
			return;
		}
		if (monitor.getItem().index > props.index && hoverClientY > hoverMiddleY) { // 有向前拖动倾向，必须小于中线
			return;
		}
		props.resortStepList.bind(null, monitor.getItem().index, props.index)();
		monitor.getItem().index = props.index;
	}
}, (connect, monitor) => {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
	}
})
class Step extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			currentTestResponseContentIndex: '', // 当前测试响应内容索引 
			requestStepWindowDisplayed: false, // 调用接口窗口显示状态
			dataStepWindowDisplayed: false, // 存储查询窗口显示状态
			checkStepWindowDisplayed: false, // 检查点窗口显示状态
			timeStepWindowDisplayed: false, // 延时器窗口显示状态
		};
		this.editStep = this.editStep.bind(this);
		this.openRequestStepWindow = this.openRequestStepWindow.bind(this);
		this.closeRequestStepWindow = this.closeRequestStepWindow.bind(this);
		this.openDataStepWindow = this.openDataStepWindow.bind(this);
		this.closeDataStepWindow = this.closeDataStepWindow.bind(this);
		this.openCheckStepWindow = this.openCheckStepWindow.bind(this);
		this.closeCheckStepWindow = this.closeCheckStepWindow.bind(this);
		this.openTimeStepWindow = this.openTimeStepWindow.bind(this);
		this.closeTimeStepWindow = this.closeTimeStepWindow.bind(this);
		this.updateStep = this.updateStep.bind(this);
		this.activateIcon = this.activateIcon.bind(this);
		this.deactivateIcon = this.deactivateIcon.bind(this);
		this.setCurrentTestResponseContentIndex = this.setCurrentTestResponseContentIndex.bind(this);
		this.renderOptionCol = this.renderOptionCol.bind(this);
		this.renderTestResponseAreaIconImage = this.renderTestResponseAreaIconImage.bind(this);
		this.renderTestResponseAreaIcon = this.renderTestResponseAreaIcon.bind(this);
		this.renderTestResponseAreaContent = this.renderTestResponseAreaContent.bind(this);
		this.renderTestResponseArea = this.renderTestResponseArea.bind(this);
		this.renderStepWindow = this.renderStepWindow.bind(this);
	}

	componentDidMount() {
		this.props.connectDragPreview(getEmptyImage(), {
			captureDraggingState: true,
		});
		switch (this.props.type) { // 根据步骤类型初始化当前测试响应内容索引（即默认查看的内容）
			case 'request':
				this.setState({
					currentTestResponseContentIndex: 'response',
				});
				break;
			case 'data':
				this.setState({
					currentTestResponseContentIndex: 'data',
				});
				break;
			case 'check':
				this.setState({
					currentTestResponseContentIndex: 'result',
				});
				break;
			case 'time':
				this.setState({
					currentTestResponseContentIndex: 'time',
				});
				break;
		}
	}

	/**
	 * 编辑步骤
	 */
	editStep() {
		switch (this.props.type) {
			case 'request':
				this.openRequestStepWindow();
				break;
			case 'data':
				this.openDataStepWindow();
				break;
			case 'check':
				this.openCheckStepWindow();
				break;
			case 'time':
				this.openTimeStepWindow();
				break;
		}
	}

	/**
	 * 打开调用接口步骤窗口
	 */
	openRequestStepWindow() {
		this.setState({
			requestStepWindowDisplayed: true,
		});
	}

	/**
	 * 关闭调用接口步骤窗口
	 */
	closeRequestStepWindow() {
		this.setState({
			requestStepWindowDisplayed: false,
		});
	}

	/**
	 * 打开存储查询步骤窗口
	 */
	openDataStepWindow() {
		this.setState({
			dataStepWindowDisplayed: true,
		});
	}

	/**
	 * 关闭存储查询步骤窗口
	 */
	closeDataStepWindow() {
		this.setState({
			dataStepWindowDisplayed: false,
		});
	}

	/**
	 * 打开检查点步骤窗口
	 */
	openCheckStepWindow() {
		this.setState({
			checkStepWindowDisplayed: true,
		});
	}

	/**
	 * 关闭检查点步骤窗口
	 */
	closeCheckStepWindow() {
		this.setState({
			checkStepWindowDisplayed: false,
		});
	}

	/**
	 * 打开延时器步骤窗口
	 */
	openTimeStepWindow() {
		this.setState({
			timeStepWindowDisplayed: true,
		});
	}

	/**
	 * 关闭延时器步骤窗口
	 */
	closeTimeStepWindow() {
		this.setState({
			timeStepWindowDisplayed: false,
		});
	}

	/**
	 * 更新步骤
	 * @param index 位置索引
	 * @param data 步骤数据
	 */
	updateStep(index, data) {
		this.props.updateStep.bind(null, index, data)();
		this.setState({
			requestStepWindowDisplayed: false,
			dataStepWindowDisplayed: false,
			checkStepWindowDisplayed: false,
			timeStepWindowDisplayed: false,
		});
	}

	/**
	 * 激活图标
	 * @param index 内容索引
	 */
	activateIcon(index, event) {
		if (index !== this.state.currentTestResponseContentIndex) { // 已选中的图标不触发事件
			$(event.currentTarget).find('img').attr('src', $(event.currentTarget).find('img').attr('src').replace('.png', '-actived.png'));
		}
	}

	/**
	 * 不激活图标
	 * @param index 内容索引
	 */
	deactivateIcon(index, event) {
		if (index !== this.state.currentTestResponseContentIndex) { // 已选中的图标不触发事件
			$(event.currentTarget).find('img').attr('src', $(event.currentTarget).find('img').attr('src').replace('-actived.png', '.png'));
		}
	}

	/**
	 * 设置当前测试响应内容索引
	 * @param index 内容索引
	 */
	setCurrentTestResponseContentIndex(index) {
		this.setState({
			currentTestResponseContentIndex: index,
		});
	}

	/**
	 * 渲染选项列
	 * @return optionCol 选项列
	 */
	renderOptionCol() {
		if (this.props.viewMode === 'test') {
			return (
				<div className={caseStepStyle.optionCol}>
					{
						(() => {
							if (!this.props.haveResponse) { // 未测试过的步骤不显示状态
								return null;
							}
							if (this.props.type === 'check' && this.props.response.result === 'FAIL') {
								return <img src='/static/img/v2/interface/test-fail.png' />
							} else {
								return <img src='/static/img/v2/interface/test-pass.png' />
							}
						})()
					}
				</div>
			);
		} else {
			return (
				<div className={caseStepStyle.optionCol} onClick={this.props.command === 'self' ? null : this.props.deleteStep.bind(null, this.props.index)}>
					<img src={this.props.command === 'self' ? '/static/img/v2/interface/remove-disabled.png' : '/static/img/v2/interface/remove.png'} />
				</div>
			);
		}
	}

	/**
	 * 渲染测试响应区域图标图片
	 * @param index 图片索引
	 * @param title 提示文本
	 * @return testResponseAreaIconImage 测试响应区域图标图片
	 */
	renderTestResponseAreaIconImage(index, title) {
		const selectStateClassName = (index === this.state.currentTestResponseContentIndex) ? caseStepStyle.selected : '';
		return (
			<div className={selectStateClassName} onClick={this.setCurrentTestResponseContentIndex.bind(null, index)} onMouseEnter={this.activateIcon.bind(null, index)} onMouseLeave={this.deactivateIcon.bind(null, index)}>
				{
					(() => {
						if (this.state.currentTestResponseContentIndex === index) {
							return <img src={'/static/img/v2/interface/test-' + index + '-actived.png'} title={title} />
						} else {
							return <img src={'/static/img/v2/interface/test-' + index + '.png'} title={title} />
						}
					})()
				}
			</div>
		);
	}

	/**
	 * 渲染测试响应区域图标
	 * @return testResponseAreaIcon 响应区域图标
	 */
	renderTestResponseAreaIcon() {
		switch (this.props.type) {
			case 'request':
				return (
					<div>
						{this.renderTestResponseAreaIconImage('request', '请求')}
						{this.renderTestResponseAreaIconImage('response', '响应')}
					</div>
				);
			case 'data':
				return (
					<div>
						{this.renderTestResponseAreaIconImage('query', '查询')}
						{this.renderTestResponseAreaIconImage('data', '数据')}
					</div>
				);
			case 'check':
				return (
					<div>
						{this.renderTestResponseAreaIconImage('match', '匹配')}
						{this.renderTestResponseAreaIconImage('result', '检查')}
					</div>
				);
			case 'time':
				return (
					<div>
						{this.renderTestResponseAreaIconImage('time', '延时')}
					</div>
				);
		}
	}

	/**
	 * 渲染测试响应区域内容
	 * @return testResponseAreaContent 测试响应区域内容
	 */
	renderTestResponseAreaContent() {
		if (this.props.response === undefined) { // 无响应数据返回空层
			return <div>&nbsp;</div>
		}
		switch (this.state.currentTestResponseContentIndex) {
			case 'request':
				if (this.props.response.requestUrl === undefined) {
					return <div>&nbsp;</div>
				}
				return (
					<div>
						<div className={caseStepStyle.responseTitle}><span>请求地址</span></div>
						<div><span>{this.props.response.requestUrl}</span></div>
						<div className={caseStepStyle.responseTitle}><span>请求头</span></div>
						<div><span>{this.props.response.requestHeader}</span></div>
						<div className={caseStepStyle.responseTitle}><span>请求参数</span></div>
						<div><span>{this.props.response.requestParam}</span></div>
					</div>
				);
			case 'response':
				if (this.props.response.responseHeader === undefined) {
					return <div>&nbsp;</div>
				}
				return (
					<div>
						<div className={caseStepStyle.responseTitle}><span>响应摘要</span></div>
						<div><span>{this.props.response.requestUrl}</span><span className={caseStepStyle.responseCode}>{this.props.response.responseCode}</span><span className={caseStepStyle.responseTime}>{this.props.response.responseTime}s</span></div>
						<div className={caseStepStyle.responseTitle}><span>响应头</span></div>
						<div><span>{this.props.response.responseHeader}</span></div>
						<div className={caseStepStyle.responseTitle}><span>响应内容</span></div>
						<div><span>{this.props.response.responseBody}</span></div>
					</div>
				);
			case 'query':
				if (this.props.response.query === undefined) {
					return <div>&nbsp;</div>
				}
				return (
					<div>
						<div className={caseStepStyle.responseTitle}><span>查询语句</span></div>
						<div><span>{this.props.response.query}</span></div>
					</div>
				);
			case 'data':
				if (this.props.response.data === undefined) {
					return <div>&nbsp;</div>
				}
				return (
					<div>
						<div className={caseStepStyle.responseTitle}><span>数据返回</span></div>
						<div><span>{this.props.response.data}</span></div>
					</div>
				);
			case 'match':
				if (this.props.response.source === undefined) {
					return <div>&nbsp;</div>
				}
				return (
					<div>
						<div className={caseStepStyle.responseTitle}><span>源文本</span></div>
						<div><span>{this.props.response.source}</span></div>
						<div className={caseStepStyle.responseTitle}><span>匹配文本</span></div>
						<div><span>{this.props.response.target}</span></div>
					</div>
				);
			case 'result':
				if (this.props.response.result === undefined) {
					return <div>&nbsp;</div>
				}
				const testStatusClassName = (this.props.response.result === 'PASS') ? caseStepStyle.testPass : caseStepStyle.testFail;
				return (
					<div>
						<div className={caseStepStyle.responseTitle}><span>检查结果</span></div>
						<div className={testStatusClassName}><span>{this.props.response.result === 'PASS' ? '测试通过' : '测试未通过'}</span></div>
					</div>
				);
			case 'time':
				return (
					<div>
						<div className={caseStepStyle.responseTitle}><span>延时时长</span></div>
						<div><span>延时 {this.props.value} 毫秒</span></div>
					</div>
				);
		}
	}

	/**
	 * 渲染测试响应区域
	 * @return testResponseArea 测试响应区域
	 */
	renderTestResponseArea() {
		return (this.props.viewMode === 'edit' || this.props.haveResponse === undefined || this.props.haveResponse === false) ? null : (() => { // 编辑模式、未生成测试结果时不显示测试响应区域
			const testResponseAreaHeightLevel = (this.props.testResponseAreaHeightLevel === undefined) ? 1 : this.props.testResponseAreaHeightLevel; // 默认收起响应区域
			const testResponseAreaStyle = caseStepStyle[`height${testResponseAreaHeightLevel}`];
			return (
				<div className={`${caseStepStyle.testResponse} ${testResponseAreaStyle}`}>
					<div className={caseStepStyle.more} onClick={this.props.testResponseAreaSlideDown.bind(null, this.props.index)}><span>...</span></div>
					<div className={caseStepStyle.detail}>
						{this.renderTestResponseAreaIcon()}
						{this.renderTestResponseAreaContent()}
						<div>
							<div className={caseStepStyle.slideUp} onClick={this.props.testResponseAreaSlideUp.bind(null, this.props.index)}>
								<img src={'/static/img/v2/interface/slide-up.png'} />
							</div>
							<div className={caseStepStyle.slideDown} onClick={this.props.testResponseAreaSlideDown.bind(null, this.props.index)}>
								<img src={'/static/img/v2/interface/slide-down.png'} />
							</div>
						</div>
					</div>
				</div>
			);
		})();
	}

	/**
	 * 渲染步骤窗口
	 * @return stepWindow 步骤窗口
	 */
	renderStepWindow() {
		switch (this.props.type) {
			case 'request':
				return <RequestStepWindow displayed={this.state.requestStepWindowDisplayed} {...this.props} callback={this.updateStep} closeWindow={this.closeRequestStepWindow} />;
			case 'data':
				return <DataStepWindow displayed={this.state.dataStepWindowDisplayed} {...this.props} callback={this.updateStep} closeWindow={this.closeDataStepWindow} />
			case 'check':
				return <CheckStepWindow displayed={this.state.checkStepWindowDisplayed} {...this.props} callback={this.updateStep} closeWindow={this.closeCheckStepWindow} />
			case 'time':
				return <TimeStepWindow displayed={this.state.timeStepWindowDisplayed} {...this.props} callback={this.updateStep} closeWindow={this.closeTimeStepWindow} />
		}
	}

	render() {
		const { connectDragSource, isDragging, connectDropTarget, isOver } = this.props;
		const dragStateClassName = isDragging ? caseStepStyle.dragging : '';
		const stepCursorClassName = (this.props.command === 'self') ? '' : caseStepStyle.removable;
		return connectDropTarget(
			<div>
				{
					connectDragSource(
						<div className={`${caseStepStyle.step} ${dragStateClassName} ${stepCursorClassName}`}>
							<div className={caseStepStyle.indexCol}><span>{this.props.index}</span></div>
							<div className={caseStepStyle.typeCol} onClick={this.editStep}><span>{this.props.getStepTypeName(this.props.type)}</span></div>
							<div className={`${caseStepStyle.nameCol} ${globalStyle.autoHidden}`} onClick={this.editStep}><span>{this.props.name}</span></div>
							{this.renderOptionCol()}
						</div>
					)
				}
				{this.renderTestResponseArea()}
				{this.renderStepWindow()}
			</div>
		);
	}
}

@DragLayer((monitor) => {
	return {
		item: monitor.getItem(),
		currentOffset: monitor.getSourceClientOffset(),
		isDragging: monitor.isDragging(),
	}
})
class DragStep extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		if (!this.props.isDragging) { // 不在拖拽状态返回空
			return null;
		}
		const { item, currentOffset } = this.props;
		const transformStyle = !currentOffset ? { display: 'none' } : {
			transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`, // 跟随鼠标移动拖拽层
		};
		return (
			<div style={transformStyle} className={`${caseStepStyle.step} ${caseStepStyle.dragStep}`}>
				<div className={caseStepStyle.indexCol}><span> - </span></div>
				<div className={caseStepStyle.typeCol}><span>{this.props.getStepTypeName(item.type)}</span></div>
				<div className={`${caseStepStyle.nameCol} ${globalStyle.autoHidden}`}><span>{item.name}</span></div>
				<div className={caseStepStyle.optionCol}></div>
			</div>
		);
	}
}

class Space extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			focused: false, // 焦点（鼠标移至上方）状态
			stepWindowDisplayed: false, // 步骤窗口显示状态
		};
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
		this.openStepWindow = this.openStepWindow.bind(this);
		this.closeStepWindow = this.closeStepWindow.bind(this);
		this.addStep = this.addStep.bind(this);
	}

	/**
	 * 设置焦点状态
	 */
	setFocusState(event) {
		this.setState({
			focused: true,
		});
		$(event.currentTarget).find('img').attr('src', $(event.currentTarget).find('img').attr('src').replace('.png', '-actived.png'));
	}

	/**
	 * 取消焦点状态
	 */
	unsetFocusState(event) {
		this.setState({
			focused: false,
		});
		$(event.currentTarget).find('img').attr('src', $(event.currentTarget).find('img').attr('src').replace('-actived.png', '.png'));
	}

	/**
	 * 打开步骤窗口
	 */
	openStepWindow() {
		this.setState({
			stepWindowDisplayed: true,
		});
	}

	/**
	 * 关闭步骤窗口
	 */
	closeStepWindow() {
		this.setState({
			stepWindowDisplayed: false,
		});
	}

	/**
	 * 添加步骤
	 * @param position 添加位置
	 * @param data 步骤数据
	 */
	addStep(position, data) {
		this.props.addStep.bind(null, position, data)();
		this.setState({
			stepWindowDisplayed: false,
		});
	}

	render() {
		if (this.props.viewMode !== 'edit') { // 非编辑模式返回空
			return null;
		}
		const focusStateClassName = this.state.focused ? caseStepStyle.focused : '';
		return (
			<div>
				<div className={`${caseStepStyle.space} ${focusStateClassName}`} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState} onClick={this.openStepWindow}>
					<img src='/static/img/v2/interface/new.png' />
				</div>
				<StepWindow displayed={this.state.stepWindowDisplayed} spaceId={this.props.spaceId} caseId={this.props.caseId} position={this.props.position} callback={this.addStep} closeWindow={this.closeStepWindow} />
			</div>
		);
	}
}

export default connect()(CaseStepWindow);