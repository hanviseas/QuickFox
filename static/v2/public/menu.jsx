import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { domainPath } from '../config/system.jsx';
import { userRole } from '../config/common.jsx';
import menuList from '../config/menu.jsx';
import globalStyle from '../public/global.css';
import frameStyle from './frame.css';

class Menu extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activeIndex: this.props.activeIndex, // 当前处于选中状态的二级菜单索引
			targetIndex: this.props.activeIndex - this.props.activeIndex % 10, // 最后点击的一级菜单索引(10的倍数)
		};
		this.setTargetIndex = this.setTargetIndex.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			activeIndex: nextProps.activeIndex,
			targetIndex: nextProps.activeIndex - nextProps.activeIndex % 10,
		});
	}

	/**
	 * 设置最后点击的一级菜单索引
	 * @param index 索引
	 */
	setTargetIndex(index) {
		this.setState({
			targetIndex: index,
		});
	}

	render() {
		let userRoleName = '未定义角色';
		userRole.map((role) => {
			if (this.props.globalData.userInfo.role === role.index) {
				userRoleName = role.value;
			}
		});
		return (
			<div className={frameStyle.menu}>
				<div className={frameStyle.head}>
					<img src='/static/img/v2/public/logo-30.png' />
					<img src='/static/img/v2/public/logo.png' />
				</div>
				<div className={frameStyle.body}>
					{
						menuList.map((group) => {
							return <SubMenu key={group.index} userInfo={this.props.globalData.userInfo} name={group.name} index={group.index} activeIndex={this.state.activeIndex} targetIndex={this.state.targetIndex} items={group.items} setTargetIndex={this.setTargetIndex} />
						})
					}
				</div>
				<div className={frameStyle.profile}>
					<div className={frameStyle.avatar}>
						<Link to={`${domainPath}/v2/u/profile`}><img src={this.props.globalData.userInfo.avatar} /></Link>
					</div>
					<div className={frameStyle.title}><span className={globalStyle.autoHidden}> {userRoleName} </span></div>
					<div className={frameStyle.name}><span className={globalStyle.autoHidden}> {this.props.globalData.userInfo.card} </span></div>
				</div>
			</div>
		);
	}
}

class SubMenu extends React.Component {

	constructor(props) {
		super(props);
		const diff = this.props.activeIndex - this.props.index; // 选中的二级菜单索引和子组件一级菜单索引差值
		this.state = {
			viewState: (diff > 0 && diff < 10) ? true : false, // 一级菜单展开显示状态
		}; // 如果差值在10以内，代表子组件一级菜单处于选中状态，展开显示
	}

	componentWillReceiveProps(nextProps) {
		const diff = nextProps.activeIndex - this.props.index; // 选中的二级菜单索引和子组件一级菜单索引差值
		this.setState({
			viewState: (diff > 0 && diff < 10) || (this.props.index === nextProps.targetIndex && !this.state.viewState) ? true : false,
		}); // 如果差值在10以内，代表子组件一级菜单处于选中状态，或者是最后点击且原先处于关闭状态的子组件一级菜单，两者均会展开显示
	}

	render() {
		const viewStateClassName = this.state.viewState ? frameStyle.opened : frameStyle.closed;
		return (
			<div>
				<div className={`${frameStyle.title} ${viewStateClassName}`} onClick={this.props.setTargetIndex.bind(null, this.props.index)}><span>{this.props.name}</span></div>
				<ul className={this.state.viewState ? frameStyle.opened : frameStyle.closed}>
					{
						this.props.items.map((item) => {
							if (this.props.userInfo.auth.indexOf(item.auth) === -1) { // 菜单角色权限判定
								return;
							}
							const selectStateClassName = (item.index === this.props.activeIndex) ? frameStyle.selected : '';
							return (
								<Link key={item.index} to={item.target}>
									<li className={selectStateClassName}>
										<div></div>
										<span className={item.icon}>{item.name}</span>
									</li>
								</Link>
							);
						})
					}
				</ul>
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
		activeIndex: state.activeIndex || 0,
	};
}

export default connect(
	mapStateToProps
)(Menu);