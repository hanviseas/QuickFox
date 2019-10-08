import React from 'react';
import { connect } from 'react-redux';
import { menuItems } from '../config/menu.jsx';
import { domainPath } from '../config/system.jsx';
import { encodeParams } from '../util/http.jsx';
import SearchInput from '../component/input/search.jsx';
import TaskList from './task/task.jsx';
import globalStyle from '../public/global.css';
import taskStyle from './task.css';

class Task extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			currentKeyword: '', // 当前搜索关键字
			tasks: [], // 任务数据
		};
		this.fetchTasks = this.fetchTasks.bind(this);
		this.setKeyword = this.setKeyword.bind(this);
	}

	componentWillMount() {
		this.props.dispatch({
			type: 'SET_ACTIVE_INDEX',
			activeIndex: menuItems._task.index,
		}); // 更新选中的二级菜单索引
		this.props.dispatch({
			type: 'SET_PAGE_TITLE',
			pageTitle: menuItems._task.name,
		}); // 更新页头标题
		this.fetchTasks(1);
		this.clock = setInterval(this.fetchTasks.bind(null, 1), 5000);
	}

	componentWillUnmount() {
		window.clearInterval(this.clock);
	}

	/**
	 * 获取任务数据
	 * @param page 页数
	 */
	fetchTasks(page) {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/tasks`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				'page': page,
				'size': 100000,
				'keyword': this.state.currentKeyword,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			let tasks = [];
			json.collection.map((task) => {
				tasks.push(task);
			});
			_this.setState({
				tasks: tasks,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 设置搜索关键字
	 * @param keyword 搜索关键字	 
	 */
	setKeyword(keyword) {
		this.setState({
			currentKeyword: keyword,
		}, () => { this.fetchTasks(1) });
	}

	render() {
		return (
			<div>
				<div className={taskStyle.filter}>
					<div>
						<SearchInput title='搜索' width='400' value={this.state.currentKeyword} waitEnter={false} callback={this.setKeyword} />
					</div>
				</div>
				<div className={globalStyle.clear}></div>
				<TaskList userInfo={this.props.globalData.userInfo} tasks={this.state.tasks} />
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
)(Task);