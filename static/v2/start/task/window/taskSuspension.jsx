import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import Window from '../../../component/window.jsx';
import Button from '../../../component/button.jsx';
import taskSuspensionStyle from './taskSuspension.css';

class TaskSuspensionWindow extends React.Component {

	static defaultProps = {
		id: 0, // 任务ID
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.state = {
			taskSuspension: 0, // 任务挂起状态
		};
		this.fetchTask = this.fetchTask.bind(this);
		this.saveTask = this.saveTask.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		nextProps.displayed && this.fetchTask();
	}

	/**
	 * 获取任务信息
	 */
	fetchTask() {
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
			_this.setState({
				taskSuspension: Number.parseInt(json.suspension),
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 设置任务挂起状态
	 */
	saveTask() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/post/api/task/${this.props.id}/suspension`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				task_suspension: this.state.taskSuspension === 1 ? 0 : 1,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			if (json.code === '000000') { // 请求成功
				_this.props.callback.bind(null, _this.state.taskSuspension === 1 ? 0 : 1)();
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
			<Window displayed={this.props.displayed} width='500' height='250' title={this.state.taskSuspension === 0 ? '禁用任务' : '启用任务'} submitHandler={<Button type='error' text={this.state.taskSuspension === 0 ? '确认禁用' : '确认启用'} callback={this.saveTask} />} closeWindow={this.props.closeWindow}>
				<div className={taskSuspensionStyle.notice}><span>{this.state.taskSuspension === 0 ? '任务禁用后将不再自动执行，是否确认？' : '任务启用后将在设置时间自动执行，是否确认？'}</span></div>
			</Window>
		);
	}
}

export default connect()(TaskSuspensionWindow);