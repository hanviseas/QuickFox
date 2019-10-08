import React from 'react';
import { connect } from 'react-redux';
import { menuItems } from '../config/menu.jsx';
import { domainPath } from '../config/system.jsx';
import { encodeParams } from '../util/http.jsx';
import { logSource } from '../config/common.jsx';
import Select from '../component/select.jsx';
import SearchInput from '../component/input/search.jsx';
import Page from '../component/page.jsx';
import LogList from './log/log.jsx';
import globalStyle from '../public/global.css';
import logStyle from './log.css';

class Log extends React.Component {

	constructor(props) {
		super(props);
		this.defaultOperatorOption = {
			index: -1,
			value: '所有',
		}; // 所有操作人选项
		this.state = {
			currentSource: 'all', // 当前日志来源
			currentOperatorId: -1, // 当前操作人ID
			currentKeyword: '', // 当前搜索关键字
			currentOrderField: 'id', // 当前排序字段
			currentOrderType: 'desc', // 当前排序方式
			maxLogListPageNumber: 1, // 日志列表最大页数
			currentLogListPageNumber: 1, // 日志列表当前页号
			operators: [this.defaultOperatorOption], // 操作人数据
			logs: [], // 日志数据
			loading: true, // 载入状态
		};
		this.fetchOperators = this.fetchOperators.bind(this);
		this.fetchLogs = this.fetchLogs.bind(this);
		this.switchSource = this.switchSource.bind(this);
		this.switchOperator = this.switchOperator.bind(this);
		this.setKeyword = this.setKeyword.bind(this);
		this.setOrder = this.setOrder.bind(this);
	}

	componentWillMount() {
		this.props.dispatch({
			type: 'SET_ACTIVE_INDEX',
			activeIndex: menuItems._log.index,
		}); // 更新选中的二级菜单索引
		this.props.dispatch({
			type: 'SET_PAGE_TITLE',
			pageTitle: menuItems._log.name,
		}); // 更新页头标题
		this.fetchLogs(1);
	}

	/**
	 * 获取操作人数据
	 */
	fetchOperators() {
		let url = '';
		if (this.state.currentSource === 'user') {
			url = `${domainPath}/v2/get/api/users`;
		} else if (this.state.currentSource === 'app') {
			url = `${domainPath}/v2/get/api/applications`;
		} else { // 全部来源时不提供操作人列表
			this.setState({
				operators: [this.defaultOperatorOption],
			});
			return;
		}
		const _this = this;
		const result = fetch(url, {
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
			let operators = [_this.defaultOperatorOption];
			json.map((operator) => {
				operators.push({
					index: Number.parseInt(operator.id),
					value: operator.card ? operator.card : operator.name,
				});
			});
			_this.setState({
				operators: operators,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 获取日志数据
	 * @param page 页数
	 */
	fetchLogs(page) {
		this.setState({
			loading: true,
		});
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/logs`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				'source': this.state.currentSource,
				'operator_id': this.state.currentOperatorId,
				'page': page,
				'size': 10,
				'keyword': this.state.currentKeyword,
				'order_field': this.state.currentOrderField,
				'order_type': this.state.currentOrderType,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			let logs = [];
			json.collection.map((log) => {
				logs.push(log);
			});
			_this.setState({
				loading: false,
				logs: logs,
				maxLogListPageNumber: json.page,
				currentLogListPageNumber: page,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 切换来源
	 * @param source 来源信息
	 */
	switchSource(source) {
		this.setState({
			operators: [],
			currentSource: source.index,
			currentKeyword: '',
		}, () => {
			this.switchOperator(this.defaultOperatorOption);
			this.fetchOperators();
		}); // 切换来源时更新操作人列表
	}

	/**
	 * 切换操作人
	 * @param operator 操作人信息	 
	 */
	switchOperator(operator) {
		this.setState({
			currentOperatorId: operator.index,
			currentKeyword: '',
		}, () => {
			this.fetchLogs(1);
		}); // 切换操作人时更新日志列表
	}

	/**
	 * 设置搜索关键字
	 * @param keyword 搜索关键字	 
	 */
	setKeyword(keyword) {
		this.setState({
			currentKeyword: keyword,
		}, () => { this.fetchLogs(1) });
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
			}, () => { this.fetchLogs(1) });
		} else {
			this.setState({ // 同字段改变排列顺序
				currentOrderType: this.state.currentOrderType === 'asc' ? 'desc' : 'asc',
			}, () => { this.fetchLogs(1) });
		}
	}

	render() {
		return (
			<div>
				<div className={logStyle.filter}>
					<div>
						<Select width='250' name='source' title='日志来源' index={this.state.currentSource} options={logSource} callback={this.switchSource} />
					</div>
					<div>
						<Select width='250' name='operatorId' title='操作人' index={this.state.currentOperatorId} options={this.state.operators} callback={this.switchOperator} />
					</div>
					<div className={logStyle.searcher}>
						<SearchInput title='搜索' width='400' value={this.state.currentKeyword} callback={this.setKeyword} />
					</div>
				</div>
				<div className={globalStyle.clear}></div>
				<LogList loading={this.state.loading} logs={this.state.logs} currentOrderField={this.state.currentOrderField} currentOrderType={this.state.currentOrderType} setOrder={this.setOrder} />
				<Page maxPageNumber={this.state.maxLogListPageNumber} currentPageNumber={this.state.currentLogListPageNumber} callback={this.fetchLogs} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		globalData: state.globalData,
	};
}

export default connect(
	mapStateToProps
)(Log);