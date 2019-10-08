import React from 'react';
import $ from 'jquery';
import Label from '../../component/label.jsx';
import Load from '../../component/load.jsx';
import SetOwnerWindow from './window/setOwner.jsx';
import SpaceWindow from './window/space.jsx';
import SpaceModuleWindow from './window/spaceModule.jsx';
import DeleteSpaceWindow from './window/deleteSpace.jsx';
import globalStyle from '../../public/global.css';
import spaceStyle from './space.css';

export default class SpaceList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			spaces: this.props.spaces, // 空间数据
			spaceWindowDisplayed: false, // 空间窗口显示状态
		};
		this.openSpaceWindow = this.openSpaceWindow.bind(this);
		this.closeSpaceWindow = this.closeSpaceWindow.bind(this);
		this.addSpace = this.addSpace.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			spaces: nextProps.spaces,
		});
	}

	/**
	 * 打开空间窗口
	 */
	openSpaceWindow() {
		this.setState({
			spaceWindowDisplayed: true,
		});
	}

	/**
	 * 关闭空间窗口
	 */
	closeSpaceWindow() {
		this.setState({
			spaceWindowDisplayed: false,
		});
	}

	/**
	 * 添加空间
	 * @param id 空间ID
	 * @param name 空间名称
	 */
	addSpace(id, name) {
		let spaces = this.state.spaces;
		spaces.unshift({
			id: id,
			owner_avatar: '/static/img/v2/public/default-avatar.png',
			owner_name: '未指派',
			name: name,
			new: true,
		});
		this.setState({
			spaces: spaces,
			spaceWindowDisplayed: false,
		});
	}

	render() {
		const idFieldOrderStyle = this.props.currentOrderField === 'id' ? (this.props.currentOrderType === 'asc' ? spaceStyle.arrowUp : spaceStyle.arrowDown) : '';
		const nameFieldOrderStyle = this.props.currentOrderField === 'name' ? (this.props.currentOrderType === 'asc' ? spaceStyle.arrowUp : spaceStyle.arrowDown) : '';
		return (
			<div>
				<div>
					<Label text='项目空间' />
					{
						this.props.userInfo.auth.indexOf('V2.Api.Space.Add') === -1 ? null : (() => {
							return (
								<div className={spaceStyle.newSpace} onClick={this.openSpaceWindow}><span>创建空间</span></div>
							);
						})()
					}
				</div>
				<div className={globalStyle.clear}></div>
				<div className={`${spaceStyle.space} ${spaceStyle.head}`}>
					<div className={`${spaceStyle.idCol} ${idFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'id')}><span className={globalStyle.autoHidden}>编号</span></div>
					<div className={`${spaceStyle.nameCol} ${nameFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'name')}><span className={globalStyle.autoHidden}>空间名称</span></div>
					<div className={`${spaceStyle.ownerCol}`}><span className={globalStyle.autoHidden}>维护人</span></div>
				</div>
				{
					this.props.loading ? (() => {
						return <Load />;
					})() : (() => {
						return (
							this.state.spaces.map((space) => {
								return (
									<Space key={space.id} userInfo={this.props.userInfo} id={space.id} ownerAvatar={space.owner_avatar} ownerName={space.owner_name} name={space.name} new={space.new} />
								);
							})
						);
					})()
				}
				<SpaceWindow displayed={this.state.spaceWindowDisplayed} callback={this.addSpace} closeWindow={this.closeSpaceWindow} />
			</div>
		);
	}
}

class Space extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			ownerAvatar: this.props.ownerAvatar, // 维护人头像
			ownerName: this.props.ownerName, // 维护人名字
			spaceName: this.props.name, // 空间名称
			focused: false, // 焦点（鼠标移至上方）状态
			deleted: false, // 空间删除状态
			ownerWindowDisplayed: false, // 维护人窗口显示状态
			spaceWindowDisplayed: false, // 空间窗口显示状态
			spaceModuleWindowDisplayed: false, // 空间模块窗口显示状态
			deleteSpaceWindowDisplayed: false, // 删除空间窗口显示状态
		};
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
		this.renderIcon = this.renderIcon.bind(this);
		this.openOwnerWindow = this.openOwnerWindow.bind(this);
		this.closeOwnerWindow = this.closeOwnerWindow.bind(this);
		this.updateOwner = this.updateOwner.bind(this);
		this.openSpaceWindow = this.openSpaceWindow.bind(this);
		this.closeSpaceWindow = this.closeSpaceWindow.bind(this);
		this.updateSpace = this.updateSpace.bind(this);
		this.openSpaceModuleWindow = this.openSpaceModuleWindow.bind(this);
		this.closeSpaceModuleWindow = this.closeSpaceModuleWindow.bind(this);
		this.openDeleteSpaceWindow = this.openDeleteSpaceWindow.bind(this);
		this.closeDeleteSpaceWindow = this.closeDeleteSpaceWindow.bind(this);
		this.deleteSpace = this.deleteSpace.bind(this);
		this.renderOptionCol = this.renderOptionCol.bind(this);
	}

	/**
	 * 设置焦点状态
	 */
	setFocusState() {
		this.setState({
			focused: true,
		});
	}

	/**
	 * 取消焦点状态
	 */
	unsetFocusState() {
		this.setState({
			focused: false,
		});
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

	/**
	 * 渲染图标
	 * @param name 图像名
	 * @param title 提示文本
	 */
	renderIcon(name, title) {
		return (
			<div className={spaceStyle.icon} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon}>
				<img src={`/static/img/v2/space/icon-${name}.png`} title={title} />
			</div>
		);
	}

	/**
	 * 打开维护人窗口
	 */
	openOwnerWindow() {
		this.setState({
			ownerWindowDisplayed: true,
		});
	}

	/**
	 * 关闭维护人窗口
	 */
	closeOwnerWindow() {
		this.setState({
			ownerWindowDisplayed: false,
		});
	}

	/**
	 * 更新维护人
	 * @param avatar 维护人头像
	 * @param name 维护人名字
	 */
	updateOwner(avatar, name) {
		this.setState({
			ownerAvatar: avatar,
			ownerName: name,
			ownerWindowDisplayed: false,
		});
	}

	/**
	 * 打开空间窗口
	 */
	openSpaceWindow() {
		this.setState({
			spaceWindowDisplayed: true,
		});
	}

	/**
	 * 关闭空间窗口
	 */
	closeSpaceWindow() {
		this.setState({
			spaceWindowDisplayed: false,
		});
	}

	/**
	 * 更新空间
	 * @param name 空间名称 
	 */
	updateSpace(name) {
		this.setState({
			spaceName: name,
			spaceWindowDisplayed: false,
		});
	}

	/**
	 * 打开空间模块窗口
	 */
	openSpaceModuleWindow() {
		this.setState({
			spaceModuleWindowDisplayed: true,
		});
	}

	/**
	 * 关闭空间模块窗口
	 */
	closeSpaceModuleWindow() {
		this.setState({
			spaceModuleWindowDisplayed: false,
		});
	}

	/**
	 * 打开删除空间窗口
	 */
	openDeleteSpaceWindow() {
		this.setState({
			deleteSpaceWindowDisplayed: true,
		});
	}

	/**
	 * 关闭删除空间窗口
	 */
	closeDeleteSpaceWindow() {
		this.setState({
			deleteSpaceWindowDisplayed: false,
		});
	}

	/**
	 * 删除空间
	 */
	deleteSpace() {
		this.setState({
			deleted: true,
			deleteSpaceWindowDisplayed: false,
		});
	}

	/**
	 * 渲染选项列
	 * @return optionCol 选项列
	 */
	renderOptionCol() {
		if (this.props.id === 0) { // 默认空间不能编辑、删除
			return (
				<div className={spaceStyle.optionCol}>
					<div onClick={this.openSpaceModuleWindow}>{this.renderIcon('module', '模块')}</div>
				</div>
			);
		} else {
			return (
				<div className={spaceStyle.optionCol}>
					{
						this.props.userInfo.auth.indexOf('V2.Api.Space.Update') === -1 ? null : (() => {
							return (
								<div onClick={this.openSpaceWindow}>{this.renderIcon('edit', '编辑')}</div>
							);
						})()
					}
					<div onClick={this.openSpaceModuleWindow}>{this.renderIcon('module', '模块')}</div>
					{
						this.props.userInfo.auth.indexOf('V2.Api.Space.Remove') === -1 ? null : (() => {
							return (
								<div onClick={this.openDeleteSpaceWindow}>{this.renderIcon('delete', '删除')}</div>
							);
						})()
					}
				</div>
			);
		}
	}

	render() {
		if (this.state.deleted) { // 已删除空间返回空
			return null;
		}
		const focusStateClassName = this.state.focused ? spaceStyle.focused : '';
		const newStateClassName = this.props.new === undefined ? '' : spaceStyle.new;
		const lockStateClassName = this.props.id === 0 ? spaceStyle.locked : '';
		return (
			<div>
				<div className={`${spaceStyle.space} ${focusStateClassName} ${newStateClassName} ${lockStateClassName}`} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState}>
					<div className={spaceStyle.idCol}><span className={globalStyle.autoHidden}>{this.props.id}</span></div>
					<div className={spaceStyle.nameCol}><span className={globalStyle.autoHidden}>{this.state.spaceName}</span></div>
					<div className={spaceStyle.ownerCol} onClick={this.props.userInfo.auth.indexOf('V2.Api.Space.Owner.Update') === -1 ? null : this.openOwnerWindow}>
						<img src={this.state.ownerAvatar} />
						<div><span className={globalStyle.autoHidden}>{this.state.ownerName}</span></div>
					</div>
					{this.renderOptionCol()}
				</div>
				<SetOwnerWindow id={this.props.id} displayed={this.state.ownerWindowDisplayed} callback={this.updateOwner} closeWindow={this.closeOwnerWindow} />
				<SpaceWindow id={this.props.id} displayed={this.state.spaceWindowDisplayed} callback={this.updateSpace} closeWindow={this.closeSpaceWindow} />
				<SpaceModuleWindow id={this.props.id} displayed={this.state.spaceModuleWindowDisplayed} userInfo={this.props.userInfo} closeWindow={this.closeSpaceModuleWindow} />
				<DeleteSpaceWindow id={this.props.id} displayed={this.state.deleteSpaceWindowDisplayed} callback={this.deleteSpace} closeWindow={this.closeDeleteSpaceWindow} />
			</div>
		);
	}
}