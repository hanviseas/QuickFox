import React from 'react';
import { connect } from 'react-redux';
import { menuItems } from '../config/menu.jsx';

// import frameStyle from '../../../css/v2/start/new.css';

class Document extends React.Component {

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this.props.dispatch({
			type: 'SET_ACTIVE_INDEX',
			activeIndex: menuItems._document.index,
		}); // 更新选中的二级菜单索引
		this.props.dispatch({
			type: 'SET_PAGE_TITLE',
			pageTitle: menuItems._document.name,
		}); // 更新页头标题
	}

	render() {
		return (
			<div><span>功能开发中...</span></div>
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
)(Document);