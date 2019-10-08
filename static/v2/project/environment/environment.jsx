import React from 'react';
import $ from 'jquery';
import Label from '../../component/label.jsx';
import Load from '../../component/load.jsx';
import EnvironmentWindow from './window/environment.jsx';
import DeleteEnvironmentWindow from './window/deleteEnvironment.jsx';
import globalStyle from '../../public/global.css';
import environmentStyle from './environment.css';

export default class EnvironmentList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			environments: this.props.environments, // 环境数据
			environmentWindowDisplayed: false, // 环境窗口显示状态
		};
		this.openEnvironmentWindow = this.openEnvironmentWindow.bind(this);
		this.closeEnvironmentWindow = this.closeEnvironmentWindow.bind(this);
		this.addEnvironment = this.addEnvironment.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			environments: nextProps.environments,
		});
	}

	/**
	 * 打开环境窗口
	 */
	openEnvironmentWindow() {
		this.setState({
			environmentWindowDisplayed: true,
		});
	}

	/**
	 * 关闭环境窗口
	 */
	closeEnvironmentWindow() {
		this.setState({
			environmentWindowDisplayed: false,
		});
	}

	/**
	 * 添加环境
	 * @param id 环境ID
	 * @param name 环境名称
	 */
	addEnvironment(id, name) {
		let environments = this.state.environments;
		environments.unshift({
			id: id,
			name: name,
			new: true,
		});
		this.setState({
			environments: environments,
			environmentWindowDisplayed: false,
		});
	}

	render() {
		const idFieldOrderStyle = this.props.currentOrderField === 'id' ? (this.props.currentOrderType === 'asc' ? environmentStyle.arrowUp : environmentStyle.arrowDown) : '';
		const nameFieldOrderStyle = this.props.currentOrderField === 'name' ? (this.props.currentOrderType === 'asc' ? environmentStyle.arrowUp : environmentStyle.arrowDown) : '';
		return (
			<div>
				<div>
					<Label text='测试环境' />
					{
						this.props.userInfo.auth.indexOf('V2.Api.Environment.Add') === -1 ? null : (() => {
							return (
								<div className={environmentStyle.newEnvironment} onClick={this.openEnvironmentWindow}><span>创建环境</span></div>
							);
						})()
					}
				</div>
				<div className={globalStyle.clear}></div>
				<div className={`${environmentStyle.environment} ${environmentStyle.head}`}>
					<div className={`${environmentStyle.idCol} ${idFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'id')}><span className={globalStyle.autoHidden}>编号</span></div>
					<div className={`${environmentStyle.nameCol} ${nameFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'name')}><span className={globalStyle.autoHidden}>环境名称</span></div>
				</div>
				{
					this.props.loading ? (() => {
						return <Load />;
					})() : (() => {
						return (
							this.state.environments.map((environment) => {
								return (
									<Environment key={environment.id} userInfo={this.props.userInfo} id={environment.id} ownerAvatar={environment.owner_avatar} ownerName={environment.owner_name} name={environment.name} new={environment.new} />
								);
							})
						);
					})()
				}
				<EnvironmentWindow displayed={this.state.environmentWindowDisplayed} callback={this.addEnvironment} closeWindow={this.closeEnvironmentWindow} />
			</div>
		);
	}
}

class Environment extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			environmentName: this.props.name, // 环境名称
			focused: false, // 焦点（鼠标移至上方）状态
			deleted: false, // 环境删除状态
			environmentWindowDisplayed: false, // 环境窗口显示状态
			deleteEnvironmentWindowDisplayed: false, // 删除环境窗口显示状态
		};
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
		this.renderIcon = this.renderIcon.bind(this);
		this.openEnvironmentWindow = this.openEnvironmentWindow.bind(this);
		this.closeEnvironmentWindow = this.closeEnvironmentWindow.bind(this);
		this.updateEnvironment = this.updateEnvironment.bind(this);
		this.openDeleteEnvironmentWindow = this.openDeleteEnvironmentWindow.bind(this);
		this.closeDeleteEnvironmentWindow = this.closeDeleteEnvironmentWindow.bind(this);
		this.deleteEnvironment = this.deleteEnvironment.bind(this);
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
			<div className={environmentStyle.icon} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon}>
				<img src={`/static/img/v2/environment/icon-${name}.png`} title={title} />
			</div>
		);
	}

	/**
	 * 打开环境窗口
	 */
	openEnvironmentWindow() {
		this.setState({
			environmentWindowDisplayed: true,
		});
	}

	/**
	 * 关闭环境窗口
	 */
	closeEnvironmentWindow() {
		this.setState({
			environmentWindowDisplayed: false,
		});
	}

	/**
	 * 更新环境
	 * @param name 环境名称 
	 */
	updateEnvironment(name) {
		this.setState({
			environmentName: name,
			environmentWindowDisplayed: false,
		});
	}

	/**
	 * 打开删除环境窗口
	 */
	openDeleteEnvironmentWindow() {
		this.setState({
			deleteEnvironmentWindowDisplayed: true,
		});
	}

	/**
	 * 关闭删除环境窗口
	 */
	closeDeleteEnvironmentWindow() {
		this.setState({
			deleteEnvironmentWindowDisplayed: false,
		});
	}

	/**
	 * 删除环境
	 */
	deleteEnvironment() {
		this.setState({
			deleted: true,
			deleteEnvironmentWindowDisplayed: false,
		});
	}

	/**
	 * 渲染选项列
	 * @return optionCol 选项列
	 */
	renderOptionCol() {
		if (this.props.id === 0) { // 默认环境不能编辑、删除
			return (
				<div className={environmentStyle.optionCol}>
				</div>
			);
		} else {
			return (
				<div className={environmentStyle.optionCol}>
					{
						this.props.userInfo.auth.indexOf('V2.Api.Environment.Update') === -1 ? null : (() => {
							return (
								<div onClick={this.openEnvironmentWindow}>{this.renderIcon('edit', '编辑')}</div>
							);
						})()
					}
					{
						this.props.userInfo.auth.indexOf('V2.Api.Environment.Remove') === -1 ? null : (() => {
							return (
								<div onClick={this.openDeleteEnvironmentWindow}>{this.renderIcon('delete', '删除')}</div>
							);
						})()
					}
				</div>
			);
		}
	}

	render() {
		if (this.state.deleted) { // 已删除环境返回空
			return null;
		}
		const focusStateClassName = this.state.focused ? environmentStyle.focused : '';
		const newStateClassName = this.props.new === undefined ? '' : environmentStyle.new;
		const lockStateClassName = this.props.id === 0 ? environmentStyle.locked : '';
		return (
			<div>
				<div className={`${environmentStyle.environment} ${focusStateClassName} ${newStateClassName} ${lockStateClassName}`} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState}>
					<div className={environmentStyle.idCol}><span className={globalStyle.autoHidden}>{this.props.id}</span></div>
					<div className={environmentStyle.nameCol}><span className={globalStyle.autoHidden}>{this.state.environmentName}</span></div>
					{this.renderOptionCol()}
				</div>
				<EnvironmentWindow id={this.props.id} displayed={this.state.environmentWindowDisplayed} callback={this.updateEnvironment} closeWindow={this.closeEnvironmentWindow} />
				<DeleteEnvironmentWindow id={this.props.id} displayed={this.state.deleteEnvironmentWindowDisplayed} callback={this.deleteEnvironment} closeWindow={this.closeDeleteEnvironmentWindow} />
			</div>
		);
	}
}