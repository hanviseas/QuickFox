import React from 'react';
import { connect } from 'react-redux';
import { menuItems } from '../config/menu.jsx';
import { domainPath } from '../config/system.jsx';
import { encodeParams } from '../util/http.jsx';
import { paramSet } from '../config/common.jsx';
import Select from '../component/select.jsx';
import SearchInput from '../component/input/search.jsx';
import Page from '../component/page.jsx';
import SetList from './param/set.jsx';
import globalStyle from '../public/global.css';
import paramStyle from './param.css';

class Param extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			currentEnvironmentId: 0, // 当前选中的环境ID
			currentSetType: 'param', // 当前选中的设置类型
			currentSetsType: 'param', // 当前设置集的设置类型
			currentKeyword: '', // 当前搜索关键字
			currentOrderField: 'id', // 当前排序字段
			currentOrderType: 'desc', // 当前排序方式
			maxSetListPageNumber: 1, // 设置列表最大页数
			currentSetListPageNumber: 1, // 设置列表当前页号
			environments: [], // 环境数据
			sets: [], // 设置集数据
			loading: true, // 载入状态
		};
		this.fetchEnvironments = this.fetchEnvironments.bind(this);
		this.fetchSets = this.fetchSets.bind(this);
		this.switchEnvironment = this.switchEnvironment.bind(this);
		this.switchSetType = this.switchSetType.bind(this);
		this.setKeyword = this.setKeyword.bind(this);
		this.setOrder = this.setOrder.bind(this);
	}

	componentWillMount() {
		this.props.dispatch({
			type: 'SET_ACTIVE_INDEX',
			activeIndex: menuItems._param.index,
		}); // 更新选中的二级菜单索引
		this.props.dispatch({
			type: 'SET_PAGE_TITLE',
			pageTitle: menuItems._param.name,
		}); // 更新页头标题
		this.fetchEnvironments();
		this.fetchSets(1);
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
	 * 获取设置集数据
	 * @param page 页数
	 */
	fetchSets(page) {
		this.setState({
			loading: true,
		});
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/environment/${this.state.currentEnvironmentId}/${this.state.currentSetType === 'param' ? 'params' : 'data'}`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
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
			let sets = [];
			json.collection.map((set) => {
				sets.push(set);
			});
			_this.setState({
				loading: false,
				currentSetsType: _this.state.currentSetType,
				sets: sets,
				maxSetListPageNumber: json.page,
				currentSetListPageNumber: page,
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
			currentKeyword: '',
		}, () => {
			this.fetchSets(1);
		}); // 切换环境时更新设置列表
	}

	/**
	 * 切换设置类型 
	 * @param setType 设置类型 
	 */
	switchSetType(setType) {
		this.setState({
			currentSetType: setType.index,
			currentKeyword: '',
			currentOrderField: 'id',
			currentOrderType: 'desc',
		}, () => {
			this.fetchSets(1);
		}); // 切换模块时更新设置列表
	}

	/**
	 * 设置搜索关键字
	 * @param keyword 搜索关键字	 
	 */
	setKeyword(keyword) {
		this.setState({
			currentKeyword: keyword,
		}, () => { this.fetchSets(1) });
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
			}, () => { this.fetchSets(1) });
		} else {
			this.setState({ // 同字段改变排列顺序
				currentOrderType: this.state.currentOrderType === 'asc' ? 'desc' : 'asc',
			}, () => { this.fetchSets(1) });
		}
	}

	render() {
		return (
			<div>
				<div className={paramStyle.filter}>
					<div>
						<Select name='environmentId' title='环境' index={this.state.currentEnvironmentId} options={this.state.environments} callback={this.switchEnvironment} />
					</div>
					<div>
						<Select name='setType' title='环境设置' index={this.state.currentSetType} options={paramSet} callback={this.switchSetType} />
					</div>
					<div className={paramStyle.searcher}>
						<SearchInput title='搜索' width='400' value={this.state.currentKeyword} callback={this.setKeyword} />
					</div>
				</div>
				<div className={globalStyle.clear}></div>
				<SetList userInfo={this.props.globalData.userInfo} loading={this.state.loading} sets={this.state.sets} environmentId={this.state.currentEnvironmentId} currentSetsType={this.state.currentSetsType} currentOrderField={this.state.currentOrderField} currentOrderType={this.state.currentOrderType} setOrder={this.setOrder} />
				<Page maxPageNumber={this.state.maxSetListPageNumber} currentPageNumber={this.state.currentSetListPageNumber} callback={this.fetchSets} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	if (!state.globalData.userInfo) {
		state.globalData.userInfo = {
			avatar: '/static/img/v2/public/default-avatar.png',
			role: 'null',
			card: '访客',
			auth: [],
		}
	}
	return {
		globalData: state.globalData,
	};
}

export default connect(
	mapStateToProps
)(Param);