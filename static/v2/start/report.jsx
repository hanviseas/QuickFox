import React from 'react';
import { connect } from 'react-redux';
import { menuItems } from '../config/menu.jsx';
import { domainPath } from '../config/system.jsx';
import { encodeParams } from '../util/http.jsx';
import Select from '../component/select.jsx';
import Page from '../component/page.jsx';
import ReportList from './report/report.jsx';
import globalStyle from '../public/global.css';
import reportStyle from './report.css';

class Report extends React.Component {

	constructor(props) {
		super(props);
		this.defaultTaskOption = {
			index: 0,
			value: '全部报告',
		}; // 默认空间选项
		this.state = {
			currentTaskId: this.defaultTaskOption.index, // 当前选中的任务ID
			currentOrderField: 'id', // 当前排序字段
			currentOrderType: 'desc', // 当前排序方式
			maxReportListPageNumber: 1, // 报告列表最大页数
			currentReportListPageNumber: 1, // 报告列表当前页号
			tasks: [], // 任务数据
			reports: [], // 报告数据
			loading: true, // 载入状态
		};
		this.fetchTasks = this.fetchTasks.bind(this);
		this.fetchReports = this.fetchReports.bind(this);
		this.switchTask = this.switchTask.bind(this);
		this.setOrder = this.setOrder.bind(this);
	}

	componentWillMount() {
		this.props.dispatch({
			type: 'SET_ACTIVE_INDEX',
			activeIndex: menuItems._report.index,
		}); // 更新选中的二级菜单索引
		this.props.dispatch({
			type: 'SET_PAGE_TITLE',
			pageTitle: menuItems._report.name,
		}); // 更新页头标题
		this.fetchTasks();
		this.fetchReports(1);
	}

	/**
	 * 获取任务数据
	 */
	fetchTasks() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/tasks`, {
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
			let tasks = [_this.defaultTaskOption];
			json.map((task) => {
				tasks.push({
					index: Number.parseInt(task.id),
					value: task.name,
				});
			});
			_this.setState({
				tasks: tasks,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 获取报告数据
	 * @param page 页数
	 */
	fetchReports(page) {
		this.setState({
			loading: true,
		});
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/reports`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				'task_id': this.state.currentTaskId,
				'page': page,
				'size': 10,
				'order_field': this.state.currentOrderField,
				'order_type': this.state.currentOrderType,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			let reports = [];
			json.collection.map((report) => {
				reports.push(report);
			});
			_this.setState({
				loading: false,
				reports: reports,
				maxReportListPageNumber: json.page,
				currentReportListPageNumber: page,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 切换任务
	 * @param task 任务信息
	 */
	switchTask(task) {
		this.setState({
			currentTaskId: task.index,
		}, () => {
			this.fetchReports(1);
		}); // 切换任务时更新报告列表
	}

	/**
	 * 设置排序
	 * @param field 排序字段
	 */
	setOrder(field) {
		if (field !== this.state.currentOrderField) { // 不同字段默认升序排列
			this.setState({
				currentOrderField: field,
				currentOrderType: 'asc',
			}, () => { this.fetchReports(1) });
		} else {
			this.setState({ // 同字段改变排列顺序
				currentOrderType: this.state.currentOrderType === 'asc' ? 'desc' : 'asc',
			}, () => { this.fetchReports(1) });
		}
	}

	render() {
		return (
			<div>
				<div className={reportStyle.filter}>
					<div>
						<Select name='taskId' title='定时任务' index={this.state.currentTaskId} options={this.state.tasks} callback={this.switchTask} />
					</div>
				</div>
				<div className={globalStyle.clear}></div>
				<ReportList userInfo={this.props.globalData.userInfo} loading={this.state.loading} reports={this.state.reports} currentOrderField={this.state.currentOrderField} currentOrderType={this.state.currentOrderType} setOrder={this.setOrder} />
				<Page maxPageNumber={this.state.maxReportListPageNumber} currentPageNumber={this.state.currentReportListPageNumber} callback={this.fetchReports} />
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
)(Report);