import React from 'react';
import { connect } from 'react-redux';
import { menuItems } from '../config/menu.jsx';
import { domainPath } from '../config/system.jsx';
import infoStyle from './info.css';

class Info extends React.Component {

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this.props.dispatch({
			type: 'SET_ACTIVE_INDEX',
			activeIndex: menuItems._info.index,
		}); // 更新选中的二级菜单索引
		this.props.dispatch({
			type: 'SET_PAGE_TITLE',
			pageTitle: menuItems._info.name,
		}); // 更新页头标题
	}

	render() {
		return (
			<div><iframe src={domainPath + '/phpinfo'} className={infoStyle.iframe} scrolling='no'></iframe></div>
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
)(Info);