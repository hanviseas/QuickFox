import React from 'react';
import $ from 'jquery';
import { domainPath } from '../../config/system.jsx';
import Label from '../../component/label.jsx';
import Load from '../../component/load.jsx';
import SetOwnerWindow from './window/setOwner.jsx';
import ItemWindow from './window/item.jsx';
import SwitchModuleWindow from './window/switchModule.jsx';
import DeleteItemWindow from './window/deleteItem.jsx';
import CaseList from './case.jsx';
import globalStyle from '../../public/global.css';
import itemStyle from './item.css';

export default class ItemList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			items: this.props.items, // 接口数据
			itemWindowDisplayed: false, // 接口窗口显示状态
		};
		this.openItemWindow = this.openItemWindow.bind(this);
		this.closeItemWindow = this.closeItemWindow.bind(this);
		this.addItem = this.addItem.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			items: nextProps.items,
		});
	}

	/**
	 * 打开接口窗口
	 */
	openItemWindow() {
		this.setState({
			itemWindowDisplayed: true,
		});
	}

	/**
	 * 关闭接口窗口
	 */
	closeItemWindow() {
		this.setState({
			itemWindowDisplayed: false,
		});
	}

	/**
	 * 添加接口
	 * @param id 接口ID
	 * @param name 接口名称
	 * @param url 请求地址
	 */
	addItem(id, name, url) {
		let items = this.state.items;
		items.unshift({
			id: id,
			owner_avatar: '/static/img/v2/public/default-avatar.png',
			owner_name: '未指派',
			name: name,
			url: url,
			new: true,
		});
		this.setState({
			items: items,
			itemWindowDisplayed: false,
		});
	}

	render() {
		const idFieldOrderStyle = this.props.currentOrderField === 'id' ? (this.props.currentOrderType === 'asc' ? itemStyle.arrowUp : itemStyle.arrowDown) : '';
		const nameFieldOrderStyle = this.props.currentOrderField === 'name' ? (this.props.currentOrderType === 'asc' ? itemStyle.arrowUp : itemStyle.arrowDown) : '';
		const urlFieldOrderStyle = this.props.currentOrderField === 'url' ? (this.props.currentOrderType === 'asc' ? itemStyle.arrowUp : itemStyle.arrowDown) : '';
		return (
			<div>
				<div>
					<Label text='接口用例' />
					{
						this.props.userInfo.auth.indexOf('V2.Api.Item.Add') === -1 ? null : (() => {
							return (
								<div className={itemStyle.newItem} onClick={this.openItemWindow}><span>创建接口</span></div>
							);
						})()
					}
				</div>
				<div className={itemStyle.statistics}>
					<div className={itemStyle.itemCount}>
						<div><span>接口总数</span></div>
						<div><span>{this.props.itemCount}</span></div>
					</div>
					<div className={itemStyle.caseCount}>
						<div><span>用例总数</span></div>
						<div><span>{this.props.caseCount}</span></div>
					</div>
					<div className={itemStyle.rateCount}>
						<div><span>近期通过率</span></div>
						<div><span>{this.props.rateCount}</span></div>
					</div>
				</div>
				<div className={globalStyle.clear}></div>
				<div className={`${itemStyle.item} ${itemStyle.head}`}>
					<div className={`${itemStyle.idCol} ${idFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'id')}><span className={globalStyle.autoHidden}>编号</span></div>
					<div className={`${itemStyle.nameCol} ${nameFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'name')}><span className={globalStyle.autoHidden}>接口名称</span></div>
					<div className={`${itemStyle.urlCol} ${urlFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'url')}><span className={globalStyle.autoHidden}>请求地址</span></div>
					<div className={`${itemStyle.ownerCol}`}><span className={globalStyle.autoHidden}>维护人</span></div>
				</div>
				{
					this.props.loading ? (() => {
						return <Load />;
					})() : (() => {
						return (
							this.state.items.map((item) => {
								return (
									<Item key={item.id} userInfo={this.props.userInfo} id={item.id} spaceId={this.props.spaceId} moduleId={this.props.moduleId} ownerId={item.owner_id} ownerAvatar={item.owner_avatar} ownerName={item.owner_name} ownerSource={item.owner_source} name={item.name} url={item.url} new={item.new} />
								);
							})
						);
					})()
				}
				<ItemWindow displayed={this.state.itemWindowDisplayed} spaceId={this.props.spaceId} moduleId={this.props.moduleId} callback={this.addItem} closeWindow={this.closeItemWindow} />
			</div>
		);
	}
}

class Item extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			ownerAvatar: this.props.ownerAvatar, // 维护人头像
			ownerName: this.props.ownerName, // 维护人名字
			ownerSource: this.props.ownerSource, // 维护人来源
			itemName: this.props.name, // 接口名称
			requestUrl: this.props.url, // 请求地址
			focused: false, // 焦点（鼠标移至上方）状态
			deleted: false, // 接口删除状态
			ownerWindowDisplayed: false, // 维护人窗口显示状态
			itemWindowDisplayed: false, // 接口窗口显示状态
			switchModuleWindowDisplayed: false, // 切换模块窗口显示状态
			deleteItemWindowDisplayed: false, // 删除接口窗口显示状态
			folded: true, // 用例列表折叠状态
			cases: [], // 用例数据
			loading: true, // 载入状态
		};
		this.fetchItemOwner = this.fetchItemOwner.bind(this);
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
		this.renderIcon = this.renderIcon.bind(this);
		this.openOwnerWindow = this.openOwnerWindow.bind(this);
		this.closeOwnerWindow = this.closeOwnerWindow.bind(this);
		this.updateOwner = this.updateOwner.bind(this);
		this.openItemWindow = this.openItemWindow.bind(this);
		this.closeItemWindow = this.closeItemWindow.bind(this);
		this.updateItem = this.updateItem.bind(this);
		this.openSwitchModuleWindow = this.openSwitchModuleWindow.bind(this);
		this.closeSwitchModuleWindow = this.closeSwitchModuleWindow.bind(this);
		this.switchModule = this.switchModule.bind(this);
		this.openDeleteItemWindow = this.openDeleteItemWindow.bind(this);
		this.closeDeleteItemWindow = this.closeDeleteItemWindow.bind(this);
		this.deleteItem = this.deleteItem.bind(this);
		this.fetchCases = this.fetchCases.bind(this);
		this.switchCaseListFoldState = this.switchCaseListFoldState.bind(this);
	}

	componentWillMount() {
		this.fetchItemOwner();
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			deleted: false,
		}); // 切换模块时强制显示迁移的接口
	}

	/**
	 * 获取接口维护人信息
	 */
	fetchItemOwner() {
		if (this.props.ownerId !== 0) { // 接口已有维护人不再处理
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/item/${this.props.id}/owner`, {
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
			_this.setState({
				ownerAvatar: json.avatar,
				ownerName: json.name,
				ownerSource: json.source,
			});
		}).catch(function (e) {
			console.log(e);
		});
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
			<div className={itemStyle.icon} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon}>
				<img src={`/static/img/v2/interface/icon-${name}.png`} title={title} />
			</div>
		);
	}

	/**
	 * 打开维护人窗口
	 */
	openOwnerWindow(event) {
		event.stopPropagation();
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
	 * 打开接口窗口
	 */
	openItemWindow(event) {
		event.stopPropagation();
		this.setState({
			itemWindowDisplayed: true,
		});
	}

	/**
	 * 关闭接口窗口
	 */
	closeItemWindow() {
		this.setState({
			itemWindowDisplayed: false,
		});
	}

	/**
	 * 更新接口
	 * @param name 接口名称 
	 * @param url 请求地址
	 */
	updateItem(name, url) {
		this.setState({
			itemName: name,
			requestUrl: url,
			itemWindowDisplayed: false,
		});
	}

	/**
	 * 打开切换模块窗口
	 */
	openSwitchModuleWindow(event) {
		event.stopPropagation();
		this.setState({
			switchModuleWindowDisplayed: true,
		});
	}

	/**
	 * 关闭切换模块窗口
	 */
	closeSwitchModuleWindow() {
		this.setState({
			switchModuleWindowDisplayed: false,
		});
	}

	/**
	 * 切换模块
	 * @param spaceId 空间ID
	 * @param moduleId 模块ID
	 */
	switchModule(spaceId, moduleId) {
		if ((this.props.moduleId === -1 && spaceId !== this.props.spaceId) || (this.props.moduleId !== -1 && moduleId !== this.props.moduleId)) { // 切换的目标模块与当前模块不一致，需要移除接口
			this.setState({
				deleted: true,
			});
		}
		this.setState({
			switchModuleWindowDisplayed: false,
		});
	}

	/**
	 * 打开删除接口窗口
	 */
	openDeleteItemWindow(event) {
		event.stopPropagation();
		this.setState({
			deleteItemWindowDisplayed: true,
		});
	}

	/**
	 * 关闭删除接口窗口
	 */
	closeDeleteItemWindow() {
		this.setState({
			deleteItemWindowDisplayed: false,
		});
	}

	/**
	 * 删除接口
	 */
	deleteItem() {
		this.setState({
			deleted: true,
			deleteItemWindowDisplayed: false,
		});
	}

	/**
	 * 获取用例数据
	 */
	fetchCases() {
		this.setState({
			loading: true,
			folded: false,
		});
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/item/${_this.props.id}/cases`, {
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
			let cases = [];
			json.map((casee) => {
				cases.push(casee);
			});
			_this.setState({
				loading: false,
				cases: cases,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 切换用例列表显示状态
	 */
	switchCaseListFoldState() {
		if (this.state.folded) { // 展开时更新用例列表
			this.fetchCases();
		} else {
			this.setState({
				folded: true,
			});
		}
	}

	render() {
		if (this.state.deleted) { // 已删除接口返回空
			return null;
		}
		const focusStateClassName = this.state.focused && this.state.folded ? itemStyle.focused : '';
		const selectStateClassName = this.state.folded ? '' : itemStyle.selected;
		const newStateClassName = this.props.new === undefined ? '' : itemStyle.new;
		const successiveStateClassName = this.state.ownerSource === 'item' || this.state.ownerSource === undefined ? '' : itemStyle.successive;
		let ownerSource = '';
		if (this.state.ownerSource === 'space') {
			ownerSource = '继承自空间';
		} else if (this.state.ownerSource === 'module') {
			ownerSource = '继承自模块';
		}
		return (
			<div>
				<div className={`${itemStyle.item} ${focusStateClassName} ${selectStateClassName} ${newStateClassName} ${successiveStateClassName}`} onClick={this.switchCaseListFoldState} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState}>
					<div className={itemStyle.idCol}><span className={globalStyle.autoHidden}>{this.props.id}</span></div>
					<div className={itemStyle.nameCol}><span className={globalStyle.autoHidden}>{this.state.itemName}</span></div>
					<div className={itemStyle.urlCol}><span className={globalStyle.autoHidden}>{this.state.requestUrl}</span></div>
					<div className={itemStyle.ownerCol} title={ownerSource} onClick={this.props.userInfo.auth.indexOf('V2.Api.Item.Owner.Update') === -1 ? null : this.openOwnerWindow}>
						<img src={this.state.ownerAvatar} />
						<div><span className={globalStyle.autoHidden}>{this.state.ownerName}</span></div>
					</div>
					<div className={itemStyle.optionCol}>
						{
							this.props.userInfo.auth.indexOf('V2.Api.Item.Update') === -1 ? null : (() => {
								return (
									<div onClick={this.openItemWindow}>{this.renderIcon('edit', '编辑')}</div>
								);
							})()
						}
						{
							this.props.userInfo.auth.indexOf('V2.Api.Item.Module.Update') === -1 ? null : (() => {
								return (
									<div onClick={this.openSwitchModuleWindow}>{this.renderIcon('module', '模块')}</div>
								);
							})()
						}
						{
							this.props.userInfo.auth.indexOf('V2.Api.Item.Remove') === -1 ? null : (() => {
								return (
									<div onClick={this.openDeleteItemWindow}>{this.renderIcon('delete', '删除')}</div>
								);
							})()
						}
					</div>
				</div>
				{
					this.state.folded ? null : (() => { // 折叠状态下不显示内容
						return (
							<div className={itemStyle.caseList}>
								<CaseList userInfo={this.props.userInfo} loading={this.state.loading} cases={this.state.cases} spaceId={this.props.spaceId} moduleId={this.props.moduleId} itemId={this.props.id} />
							</div>
						);
					})()
				}
				<SetOwnerWindow id={this.props.id} displayed={this.state.ownerWindowDisplayed} callback={this.updateOwner} closeWindow={this.closeOwnerWindow} />
				<ItemWindow id={this.props.id} displayed={this.state.itemWindowDisplayed} callback={this.updateItem} closeWindow={this.closeItemWindow} />
				<SwitchModuleWindow id={this.props.id} displayed={this.state.switchModuleWindowDisplayed} callback={this.switchModule} closeWindow={this.closeSwitchModuleWindow} />
				<DeleteItemWindow id={this.props.id} displayed={this.state.deleteItemWindowDisplayed} callback={this.deleteItem} closeWindow={this.closeDeleteItemWindow} />
			</div>
		);
	}
}