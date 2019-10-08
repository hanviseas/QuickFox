import React from 'react';
import { connect } from 'react-redux';
import { menuItems } from '../config/menu.jsx';
import { domainPath } from '../config/system.jsx';
import { encodeParams } from '../util/http.jsx';
import SearchInput from '../component/input/search.jsx';
import Page from '../component/page.jsx';
import SpaceList from './space/space.jsx';
import globalStyle from '../public/global.css';
import spaceStyle from './space.css';

class Space extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			currentKeyword: '', // 当前搜索关键字
			currentOrderField: 'id', // 当前排序字段
			currentOrderType: 'desc', // 当前排序方式
			maxSpaceListPageNumber: 1, // 空间列表最大页数
			currentSpaceListPageNumber: 1, // 空间列表当前页号
			spaces: [], // 空间数据
			loading: true, // 载入状态
		};
		this.fetchSpaces = this.fetchSpaces.bind(this);
		this.setKeyword = this.setKeyword.bind(this);
		this.setOrder = this.setOrder.bind(this);
	}

	componentWillMount() {
		this.props.dispatch({
			type: 'SET_ACTIVE_INDEX',
			activeIndex: menuItems._space.index,
		}); // 更新选中的二级菜单索引
		this.props.dispatch({
			type: 'SET_PAGE_TITLE',
			pageTitle: menuItems._space.name,
		}); // 更新页头标题
		this.fetchSpaces(1);
	}

	/**
	 * 获取空间数据
	 * @param page 页数
	 */
	fetchSpaces(page) {
		this.setState({
			loading: true,
		});
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/spaces`, {
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
			let spaces = [];
			json.collection.map((space) => {
				spaces.push(space);
			});
			_this.setState({
				loading: false,
				spaces: spaces,
				maxSpaceListPageNumber: json.page,
				currentSpaceListPageNumber: page,
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
		}, () => { this.fetchSpaces(1) });
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
			}, () => { this.fetchSpaces(1) });
		} else {
			this.setState({ // 同字段改变排列顺序
				currentOrderType: this.state.currentOrderType === 'asc' ? 'desc' : 'asc',
			}, () => { this.fetchSpaces(1) });
		}
	}

	render() {
		return (
			<div>
				<div className={spaceStyle.filter}>
					<div>
						<SearchInput title='搜索' width='400' value={this.state.currentKeyword} callback={this.setKeyword} />
					</div>
				</div>
				<div className={globalStyle.clear}></div>
				<SpaceList userInfo={this.props.globalData.userInfo} loading={this.state.loading} spaces={this.state.spaces} currentOrderField={this.state.currentOrderField} currentOrderType={this.state.currentOrderType} setOrder={this.setOrder} />
				<Page maxPageNumber={this.state.maxSpaceListPageNumber} currentPageNumber={this.state.currentSpaceListPageNumber} callback={this.fetchSpaces} />
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
)(Space);