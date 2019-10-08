import React from 'react';
import $ from 'jquery';
import { domainPath } from '../config/system.jsx';
import { connect } from 'react-redux';
import frameStyle from './frame.css';

class Header extends React.Component {

	constructor(props) {
		super(props);
	}

	/**
	 * 激活图标
	 */
	activateIcon(event) {
		$(event.currentTarget).find('img').attr('src', $(event.currentTarget).find('img').attr('src').replace('.png', '-actived.png'));
	}

	/**
	 * 不激活图标
	 */
	deactivateIcon(event) {
		$(event.currentTarget).find('img').attr('src', $(event.currentTarget).find('img').attr('src').replace('-actived.png', '.png'));
	}

	render() {
		return (
			<div className={frameStyle.header}>
				<div><span>{this.props.pageTitle}</span></div>
				<div>
					<div onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon}>
						<a href={`${domainPath}/logout`}><img src='/static/img/v2/public/logout.png' title='退出登录' /></a>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		pageTitle: state.pageTitle || '',
	};
}

export default connect(
	mapStateToProps
)(Header);