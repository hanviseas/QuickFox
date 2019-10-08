import React from 'react';
import { connect } from 'react-redux';
import { menuItems } from '../config/menu.jsx';
import { domainPath } from '../config/system.jsx';
import { encodeParams } from '../util/http.jsx';
import Select from '../component/select.jsx';
import SearchInput from '../component/input/search.jsx';
import Page from '../component/page.jsx';
import ItemList from './interface/item.jsx';
import globalStyle from '../public/global.css';
import interfaceStyle from './interface.css';

class Interface extends React.Component {

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
		const currentSpaceId = Number.parseInt(localStorage.getItem('currentSpaceId')); // 读取选过的空间
		this.state = {
			currentSpaceId: currentSpaceId ? currentSpaceId : 0, // 当前选中的空间ID
			currentModuleId: -1, // 当前选中的模块ID
			currentKeyword: '', // 当前搜索关键字
			currentOrderField: 'id', // 当前排序字段
			currentOrderType: 'desc', // 当前排序方式
			itemCount: '...', // 接口统计
			caseCount: '...', // 用例统计
			rateCount: '-', // 通过率统计
			maxItemListPageNumber: 1, // 接口列表最大页数
			currentItemListPageNumber: 1, // 接口列表当前页号
			spaces: [], // 空间数据
			modules: [], // 模块数据
			items: [], // 接口数据
			loading: true, // 载入状态
		};
		this.fetchSpaces = this.fetchSpaces.bind(this);
		this.fetchModules = this.fetchModules.bind(this);
		this.fetchStatistics = this.fetchStatistics.bind(this);
		this.fetchItems = this.fetchItems.bind(this);
		this.switchSpace = this.switchSpace.bind(this);
		this.switchModule = this.switchModule.bind(this);
		this.setKeyword = this.setKeyword.bind(this);
		this.setOrder = this.setOrder.bind(this);
	}

	componentWillMount() {
		this.props.dispatch({
			type: 'SET_ACTIVE_INDEX',
			activeIndex: menuItems._interface.index,
		}); // 更新选中的二级菜单索引
		this.props.dispatch({
			type: 'SET_PAGE_TITLE',
			pageTitle: menuItems._interface.name,
		}); // 更新页头标题
		this.fetchSpaces();
		this.fetchModules();
		this.fetchItems(1);
		this.fetchStatistics();
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
			});
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
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 获取统计数据
	 */
	fetchStatistics() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/module/${this.state.currentModuleId}/statistics`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				space_id: this.state.currentSpaceId,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			_this.setState({
				itemCount: json.item_num,
				caseCount: json.case_num,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 获取接口数据
	 * @param page 页数
	 */
	fetchItems(page) {
		this.setState({
			loading: true,
		});
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/space/${this.state.currentSpaceId}/items`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				'module_id': this.state.currentModuleId,
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
			let items = [];
			json.collection.map((item) => {
				items.push(item);
			});
			_this.setState({
				loading: false,
				items: items,
				maxItemListPageNumber: json.page,
				currentItemListPageNumber: page,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 切换空间
	 * @param space 空间信息
	 */
	switchSpace(space) {
		localStorage.setItem('currentSpaceId', space.index); // 记忆选中的空间
		this.setState({
			modules: [],
			currentSpaceId: space.index,
			currentKeyword: '',
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
			currentModuleId: module.index,
			currentKeyword: '',
		}, () => {
			this.fetchItems(1);
			this.fetchStatistics();
		}); // 切换模块时更新接口列表
	}

	/**
	 * 设置搜索关键字
	 * @param keyword 搜索关键字	 
	 */
	setKeyword(keyword) {
		this.setState({
			currentKeyword: keyword,
		}, () => { this.fetchItems(1) });
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
			}, () => { this.fetchItems(1) });
		} else {
			this.setState({ // 同字段改变排列顺序
				currentOrderType: this.state.currentOrderType === 'asc' ? 'desc' : 'asc',
			}, () => { this.fetchItems(1) });
		}
	}

	render() {
		return (
			<div>
				<div className={interfaceStyle.filter}>
					<div>
						<Select name='spaceId' title='项目空间' index={this.state.currentSpaceId} options={this.state.spaces} callback={this.switchSpace} />
					</div>
					<div>
						<Select name='moduleId' title='接口模块' index={this.state.currentModuleId} options={this.state.modules} callback={this.switchModule} />
					</div>
					<div className={interfaceStyle.searcher}>
						<SearchInput title='搜索' width='400' value={this.state.currentKeyword} callback={this.setKeyword} />
					</div>
				</div>
				<div className={globalStyle.clear}></div>
				<ItemList userInfo={this.props.globalData.userInfo} loading={this.state.loading} items={this.state.items} spaceId={this.state.currentSpaceId} moduleId={this.state.currentModuleId} itemCount={this.state.itemCount} caseCount={this.state.caseCount} rateCount={this.state.rateCount} currentOrderField={this.state.currentOrderField} currentOrderType={this.state.currentOrderType} setOrder={this.setOrder} />
				<Page maxPageNumber={this.state.maxItemListPageNumber} currentPageNumber={this.state.currentItemListPageNumber} callback={this.fetchItems} />
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
)(Interface);