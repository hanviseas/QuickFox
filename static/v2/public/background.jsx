import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../config/system.jsx';
import Information from './information.jsx';
import Menu from './menu.jsx';
import Header from './header.jsx';
import Board from './board.jsx';

class Background extends React.Component {

	constructor(props) {
		super(props);
		this.loadUserInfo();
	}

	/**
	 * 加载用户信息
	 */
	loadUserInfo() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/user/0`, {
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
			let globalData = JSON.parse(JSON.stringify(_this.props.globalData));
			globalData.userInfo = json;
			_this.props.setGlobalData(globalData);
		}).catch(function (e) {
			console.log(e);
		});
	}

	render() {
		return (
			<div>
				<Information /> {/* 通知层 */}
				<Menu /> {/* 左侧导航菜单 */}
				<Header /> {/* 右侧页头 */}
				<Board /> {/* 右侧主体页面 */}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		globalData: state.globalData,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		setGlobalData: (globalData) => {
			dispatch({
				type: 'SET_GLOBAL_DATA',
				globalData: globalData,
			});
		}
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Background);
