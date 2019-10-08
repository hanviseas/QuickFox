import React from 'react';
import $ from 'jquery';
import Label from '../../component/label.jsx';
import { testLevel } from '../../config/common.jsx';
import { domainPath } from '../../config/system.jsx';
import { encodeParams } from '../../util/http.jsx';
import ReportWindow from '../report/window/report.jsx';
import TaskSuspensionWindow from './window/taskSuspension.jsx';
import TaskWindow from './window/task.jsx';
import DeleteTaskWindow from './window/deleteTask.jsx';
import globalStyle from '../../public/global.css';
import taskStyle from './task.css';

export default class TaskList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			tasks: this.props.tasks, // 任务数据
			taskWindowDisplayed: false, // 任务窗口显示状态
		};
		this.openTaskWindow = this.openTaskWindow.bind(this);
		this.closeTaskWindow = this.closeTaskWindow.bind(this);
		this.addTask = this.addTask.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			tasks: nextProps.tasks,
		});
	}

	/**
	 * 打开任务窗口
	 */
	openTaskWindow() {
		this.setState({
			taskWindowDisplayed: true,
		});
	}

	/**
	 * 关闭任务窗口
	 */
	closeTaskWindow() {
		this.setState({
			taskWindowDisplayed: false,
		});
	}

	/**
	 * 添加任务
	 * @param id 任务ID
	 * @param name 任务名称
	 * @param environmentName 环境名称
	 * @param spaceName 空间名称
	 * @param moduleName 模块名称
	 * @param level 测试等级
	 * @param runtime 任务运行时间
	 */
	addTask(id, name, environmentName, spaceName, moduleName, level, runtime) {
		let tasks = this.state.tasks;
		tasks.push({
			id: id,
			name: name,
			environment_name: environmentName,
			space_name: spaceName,
			module_name: moduleName,
			level: level,
			runtime: runtime,
			new: true,
			lasttime: '-',
		});
		this.setState({
			tasks: tasks,
			taskWindowDisplayed: false,
		});
	}

	render() {
		return (
			<div>
				<div>
					<Label text='定时任务' />
					<div className={taskStyle.newTask} onClick={this.openTaskWindow}><span>创建任务</span></div>
				</div>
				<div className={globalStyle.clear}></div>
				{
					this.state.tasks.map((task) => {
						return (
							<Task key={task.id} userInfo={this.props.userInfo} id={task.id} name={task.name} environmentName={task.environment_name} spaceName={task.space_name} moduleName={task.module_name} level={task.level} runtime={task.runtime} suspension={task.suspension} lasttime={task.lasttime} report={task.report} isRunning={task.is_running} testCurrentCount={task.test_current_count} testTotalCount={task.test_total_count} new={task.new} />
						);
					})
				}
				<TaskWindow displayed={this.state.taskWindowDisplayed} callback={this.addTask} closeWindow={this.closeTaskWindow} />
			</div>
		);
	}
}

class Task extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			taskName: this.props.name, // 任务名称
			environmentName: this.props.environmentName, // 环境名称
			spaceName: this.props.spaceName, // 空间名称
			moduleName: this.props.moduleName, // 模块名称
			testLevel: this.props.level, // 测试等级
			taskRuntime: this.props.runtime, // 任务运行时间
			taskSuspension: this.props.suspension, // 任务挂起状态
			lasttime: this.props.lasttime, // 最后运行时间
			isRunning: this.props.isRunning, // 是否正在运行
			testCurrentCount: this.props.testCurrentCount, // 当前测试完成数
			testTotalCount: this.props.testTotalCount, // 任务测试总数
			focused: false, // 焦点（鼠标移至上方）状态
			deleted: false, // 任务删除状态
			reportWindowDisplayed: false, // 报告窗口显示状态
			taskSuspensionWindowDisplayed: false,  // 任务挂起状态窗口显示状态
			taskWindowDisplayed: false, // 任务窗口显示状态
			deleteTaskWindowDisplayed: false, // 删除任务窗口显示状态
		};
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
		this.renderIcon = this.renderIcon.bind(this);
		this.startTest = this.startTest.bind(this);
		this.stopTest = this.stopTest.bind(this);
		this.openReportWindow = this.openReportWindow.bind(this);
		this.closeReportWindow = this.closeReportWindow.bind(this);
		this.openTaskSuspensionWindow = this.openTaskSuspensionWindow.bind(this);
		this.closeTaskSuspensionWindow = this.closeTaskSuspensionWindow.bind(this);
		this.updateTaskSuspension = this.updateTaskSuspension.bind(this);
		this.openTaskWindow = this.openTaskWindow.bind(this);
		this.closeTaskWindow = this.closeTaskWindow.bind(this);
		this.updateTask = this.updateTask.bind(this);
		this.openDeleteTaskWindow = this.openDeleteTaskWindow.bind(this);
		this.closeDeleteTaskWindow = this.closeDeleteTaskWindow.bind(this);
		this.deleteTask = this.deleteTask.bind(this);
		this.renderTaskController = this.renderTaskController.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			isRunning: nextProps.isRunning,
			testCurrentCount: nextProps.testCurrentCount,
			testTotalCount: nextProps.testTotalCount,
		}); // 更新任务运行状态
	}

	/**
	 * 设置焦点状态
	 */
	setFocusState() {
		this.setState({
			focused: true,
		});
	}

	/**
	 * 取消焦点状态
	 */
	unsetFocusState() {
		this.setState({
			focused: false,
		});
	}

	/**
	 * 激活图标
	 */
	activateIcon(event) {
		$(event.currentTarget).find('img').attr('src', $(event.currentTarget).find('img').attr('src').replace('.png', '-actived.png'));
	}

	/**
	 * 不激活图标
	 */
	deactivateIcon(event) {
		$(event.currentTarget).find('img').attr('src', $(event.currentTarget).find('img').attr('src').replace('-actived.png', '.png'));
	}

	/**
	 * 渲染图标
	 * @param name 图像名
	 * @param title 提示文本
	 */
	renderIcon(name, title) {
		return (
			<div className={taskStyle.icon} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon}>
				<img src={`/static/img/v2/start/icon-${name}.png`} title={title} />
			</div>
		);
	}

	/**
	 * 开始测试
	 */
	startTest() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/put/api/job`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				task_id: this.props.id,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			_this.setState({
				isRunning: 1,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 停止测试
	 */
	stopTest() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/delete/api/job/_task/${this.props.id}`, {
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
				isRunning: 0,
				testCurrentCount: 0,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
 	 * 打开报告窗口
 	 */
	openReportWindow(event) {
		event.stopPropagation();
		this.setState({
			reportWindowDisplayed: true,
		});
	}

	/**
	 * 关闭报告窗口
	 */
	closeReportWindow() {
		this.setState({
			reportWindowDisplayed: false,
		});
	}

	/**
	 * 打开任务挂起状态窗口
	 */
	openTaskSuspensionWindow() {
		this.setState({
			taskSuspensionWindowDisplayed: true,
		});
	}

	/**
	 * 关闭任务挂起状态窗口
	 */
	closeTaskSuspensionWindow() {
		this.setState({
			taskSuspensionWindowDisplayed: false,
		});
	}

	/**
	 * 更新任务挂起状态
	 * @param suspension 任务挂起状态
	 */
	updateTaskSuspension(suspension) {
		this.setState({
			taskSuspension: suspension,
			taskSuspensionWindowDisplayed: false,
		});
	}

	/**
	 * 打开任务窗口
	 */
	openTaskWindow() {
		this.setState({
			taskWindowDisplayed: true,
		});
	}

	/**
	 * 关闭任务窗口
	 */
	closeTaskWindow() {
		this.setState({
			taskWindowDisplayed: false,
		});
	}

	/**
	 * 更新任务
	 * @param name 任务名称
	 * @param environmentName 环境名称
	 * @param spaceName 空间名称
	 * @param moduleName 模块名称
	 * @param level 测试等级
	 * @param runtime 任务运行时间
	 */
	updateTask(name, environmentName, spaceName, moduleName, level, runtime) {
		this.setState({
			taskName: name,
			environmentName: environmentName,
			spaceName: spaceName,
			moduleName: moduleName,
			testLevel: level,
			taskRuntime: runtime,
			taskWindowDisplayed: false,
		});
	}

	/**
	 * 打开删除任务窗口
	 */
	openDeleteTaskWindow() {
		this.setState({
			deleteTaskWindowDisplayed: true,
		});
	}

	/**
	 * 关闭删除任务窗口
	 */
	closeDeleteTaskWindow() {
		this.setState({
			deleteTaskWindowDisplayed: false,
		});
	}

	/**
	 * 删除任务
	 */
	deleteTask() {
		this.setState({
			deleted: true,
			deleteTaskWindowDisplayed: false,
		});
	}

	/**
	 * 渲染任务控制器
	 * @return taskController 任务控制器
	 */
	renderTaskController() {
		let runButton = null;
		let reportButton = null;
		let lockButton = null;
		if (Number.parseInt(this.state.isRunning) === 1) {
			runButton = (() => {
				return <img src={'/static/img/v2/start/stop-test.png'} title='停止运行' onClick={this.stopTest} />
			})();
		} else {
			runButton = (() => {
				return <img src={'/static/img/v2/start/start-test.png'} title='开始运行' onClick={this.startTest} />
			})();
		}
		if (this.props.report) {
			reportButton = (() => {
				return <img src={'/static/img/v2/start/report.png'} title='报告' />
			})();
		}
		if (Number.parseInt(this.state.taskSuspension) === 1) {
			lockButton = (() => {
				return <img src={'/static/img/v2/start/lock.png'} title='启用' />
			})();
		} else {
			lockButton = (() => {
				return <img src={'/static/img/v2/start/unlock.png'} title='禁用' />
			})();
		}
		return (
			<div className={taskStyle.option}>
				<div>
					{runButton}
				</div>
				<div onClick={this.openReportWindow}>
					{reportButton}
				</div>
				{
					this.props.userInfo.auth.indexOf('V2.Api.Task.Suspension.Update') === -1 ? null : (() => {
						return (
							<div onClick={this.openTaskSuspensionWindow}>
								{lockButton}
							</div>
						);
					})()
				}
				{
					this.props.userInfo.auth.indexOf('V2.Api.Task.Update') === -1 ? null : (() => {
						return (
							<div onClick={this.openTaskWindow}>
								<img src={'/static/img/v2/start/edit.png'} title='编辑' />
							</div>
						);
					})()
				}
				{
					this.props.userInfo.auth.indexOf('V2.Api.Task.Remove') === -1 ? null : (() => {
						return (
							<div onClick={this.openDeleteTaskWindow}>
								<img src={'/static/img/v2/start/delete.png'} title='删除' />
							</div>
						);
					})()
				}
			</div>
		);
	}

	render() {
		if (this.state.deleted) { // 已删除任务返回空
			return null;
		}
		const focusStateClassName = this.state.focused ? taskStyle.focused : '';
		const newStateClassName = this.props.new === undefined ? '' : taskStyle.new;
		const lockStateClassName = Number.parseInt(this.state.taskSuspension) ? taskStyle.locked : '';
		const runStateClassName = this.state.isRunning ? taskStyle.running : '';
		const taskRuntime = this.state.taskRuntime.replace('-', ' : ');
		let testLeveName = '未定义等级';
		testLevel.map((level) => {
			if (this.state.testLevel === level.index) {
				testLeveName = level.value;
			}
		});
		let processStyle = {
			width: `${(this.state.testCurrentCount / this.state.testTotalCount).toFixed(2) * 100}%`
		};
		return (
			<div className={`${taskStyle.task} ${focusStateClassName} ${newStateClassName} ${lockStateClassName} ${runStateClassName}`} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState}>
				<div>
					<div className={taskStyle.title}>
						<span className={globalStyle.autoHidden}>{this.state.taskName}</span>
						{this.renderTaskController()}
					</div>
					<div className={taskStyle.process}>
						<div style={processStyle}></div>
					</div>
					<div className={taskStyle.config}>
						<div><span>环境 :</span></div>
						<div><span className={globalStyle.autoHidden}>{this.state.environmentName}</span></div>
					</div>
					<div className={taskStyle.config}>
						<div><span>空间 :</span></div>
						<div><span className={globalStyle.autoHidden}>{this.state.spaceName}</span></div>
					</div>
					<div className={taskStyle.config}>
						<div><span>模块 :</span></div>
						<div><span className={globalStyle.autoHidden}>{this.state.moduleName}</span></div>
					</div>
					<div className={taskStyle.config}>
						<div><span>测试等级 :</span></div>
						<div><span className={globalStyle.autoHidden}>{testLeveName}</span></div>
					</div>
					<div className={taskStyle.config}>
						<div><span>运行时间 :</span></div>
						<div><span className={globalStyle.autoHidden}>{taskRuntime}</span></div>
					</div>
					<div className={taskStyle.config}>
						<div><span>最近运行 :</span></div>
						<div><span className={globalStyle.autoHidden}>{this.state.lasttime < '2000-01-01 00:00:00' ? '-' : this.state.lasttime}</span></div>
					</div>
				</div>
				<ReportWindow id={this.props.report ? this.props.report.id : 0} displayed={this.state.reportWindowDisplayed} userInfo={this.props.userInfo} closeWindow={this.closeReportWindow} />
				<TaskSuspensionWindow id={this.props.id} displayed={this.state.taskSuspensionWindowDisplayed} callback={this.updateTaskSuspension} closeWindow={this.closeTaskSuspensionWindow} />
				<TaskWindow id={this.props.id} displayed={this.state.taskWindowDisplayed} callback={this.updateTask} closeWindow={this.closeTaskWindow} />
				<DeleteTaskWindow id={this.props.id} displayed={this.state.deleteTaskWindowDisplayed} callback={this.deleteTask} closeWindow={this.closeDeleteTaskWindow} />
			</div>
		);
	}
}