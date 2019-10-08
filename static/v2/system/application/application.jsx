import React from 'react';
import $ from 'jquery';
import Label from '../../component/label.jsx';
import Load from '../../component/load.jsx';
import ApplicationWindow from './window/application.jsx';
import DeleteApplicationWindow from './window/deleteApplication.jsx';
import globalStyle from '../../public/global.css';
import applicationStyle from './application.css';

export default class ApplicationList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			applications: this.props.applications, // 应用数据
			applicationWindowDisplayed: false, // 应用窗口显示状态
		};
		this.openApplicationWindow = this.openApplicationWindow.bind(this);
		this.closeApplicationWindow = this.closeApplicationWindow.bind(this);
		this.addApplication = this.addApplication.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			applications: nextProps.applications,
		});
	}

	/**
	 * 打开应用窗口
	 */
	openApplicationWindow() {
		this.setState({
			applicationWindowDisplayed: true,
		});
	}

	/**
	 * 关闭应用窗口
	 */
	closeApplicationWindow() {
		this.setState({
			applicationWindowDisplayed: false,
		});
	}

	/**
	 * 添加应用
	 * @param id 应用ID
	 * @param name 应用名称
	 * @param secret 应用密钥
	 */
	addApplication(id, name, secret) {
		let applications = this.state.applications;
		applications.unshift({
			id: id,
			name: name,
			secret: secret,
			new: true,
		});
		this.setState({
			applications: applications,
			applicationWindowDisplayed: false,
		});
	}

	render() {
		const idFieldOrderStyle = this.props.currentOrderField === 'id' ? (this.props.currentOrderType === 'asc' ? applicationStyle.arrowUp : applicationStyle.arrowDown) : '';
		const nameFieldOrderStyle = this.props.currentOrderField === 'name' ? (this.props.currentOrderType === 'asc' ? applicationStyle.arrowUp : applicationStyle.arrowDown) : '';
		return (
			<div>
				<div>
					<Label text='应用接入' />
					{
						this.props.userInfo.auth.indexOf('V2.Api.Application.Add') === -1 ? null : (() => {
							return (
								<div className={applicationStyle.newApplication} onClick={this.openApplicationWindow}><span>创建应用</span></div>
							);
						})()
					}
				</div>
				<div className={globalStyle.clear}></div>
				<div className={`${applicationStyle.application} ${applicationStyle.head}`}>
					<div className={`${applicationStyle.idCol} ${idFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'id')}><span className={globalStyle.autoHidden}>编号</span></div>
					<div className={`${applicationStyle.nameCol} ${nameFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'name')}><span className={globalStyle.autoHidden}>应用名称</span></div>
					<div className={applicationStyle.secretCol}><span className={globalStyle.autoHidden}>应用密钥</span></div>
				</div>
				{
					this.props.loading ? (() => {
						return <Load />;
					})() : (() => {
						return (
							this.state.applications.map((application) => {
								return (
									<Application key={application.id} userInfo={this.props.userInfo} id={application.id} name={application.name} secret={application.secret} new={application.new} />
								);
							})
						);
					})()
				}
				<ApplicationWindow displayed={this.state.applicationWindowDisplayed} callback={this.addApplication} closeWindow={this.closeApplicationWindow} />
			</div>
		);
	}
}

class Application extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			applicationName: this.props.name, // 应用名称
			applicationSecret: this.props.secret, // 应用密钥
			focused: false, // 焦点（鼠标移至上方）状态
			deleted: false, // 应用删除状态
			applicationWindowDisplayed: false, // 应用窗口显示状态
			deleteApplicationWindowDisplayed: false, // 删除应用窗口显示状态
		};
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
		this.renderIcon = this.renderIcon.bind(this);
		this.openApplicationWindow = this.openApplicationWindow.bind(this);
		this.closeApplicationWindow = this.closeApplicationWindow.bind(this);
		this.updateApplication = this.updateApplication.bind(this);
		this.openDeleteApplicationWindow = this.openDeleteApplicationWindow.bind(this);
		this.closeDeleteApplicationWindow = this.closeDeleteApplicationWindow.bind(this);
		this.deleteApplication = this.deleteApplication.bind(this);
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
			<div className={applicationStyle.icon} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon}>
				<img src={`/static/img/v2/application/icon-${name}.png`} title={title} />
			</div>
		);
	}

	/**
	 * 打开应用窗口
	 */
	openApplicationWindow() {
		this.setState({
			applicationWindowDisplayed: true,
		});
	}

	/**
	 * 关闭应用窗口
	 */
	closeApplicationWindow() {
		this.setState({
			applicationWindowDisplayed: false,
		});
	}

	/**
	 * 更新应用
	 * @param name 应用名称
	 * @param serect 应用密钥
	 */
	updateApplication(name, serect) {
		this.setState({
			applicationName: name,
			applicationSecret: serect,
			applicationWindowDisplayed: false,
		});
	}

	/**
	 * 打开删除应用窗口
	 */
	openDeleteApplicationWindow() {
		this.setState({
			deleteApplicationWindowDisplayed: true,
		});
	}

	/**
	 * 关闭删除应用窗口
	 */
	closeDeleteApplicationWindow() {
		this.setState({
			deleteApplicationWindowDisplayed: false,
		});
	}

	/**
	 * 删除应用
	 */
	deleteApplication() {
		this.setState({
			deleted: true,
			deleteApplicationWindowDisplayed: false,
		});
	}

	render() {
		if (this.state.deleted) { // 已删除应用返回空
			return null;
		}
		const focusStateClassName = this.state.focused ? applicationStyle.focused : '';
		const newStateClassName = this.props.new === undefined ? '' : applicationStyle.new;
		return (
			<div>
				<div className={`${applicationStyle.application} ${focusStateClassName} ${newStateClassName}`} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState}>
					<div className={applicationStyle.idCol}><span className={globalStyle.autoHidden}>{this.props.id}</span></div>
					<div className={applicationStyle.nameCol}><span className={globalStyle.autoHidden}>{this.state.applicationName}</span></div>
					<div className={applicationStyle.secretCol}><span className={globalStyle.autoHidden}>{this.state.applicationSecret}</span></div>
					<div className={applicationStyle.optionCol}>
						{
							this.props.userInfo.auth.indexOf('V2.Api.Application.Update') === -1 ? null : (() => {
								return (
									<div onClick={this.openApplicationWindow}>{this.renderIcon('edit', '编辑')}</div>
								);
							})()
						}
						{
							this.props.userInfo.auth.indexOf('V2.Api.Application.Remove') === -1 ? null : (() => {
								return (
									<div onClick={this.openDeleteApplicationWindow}>{this.renderIcon('delete', '删除')}</div>
								);
							})()
						}
					</div>
				</div>
				<ApplicationWindow id={this.props.id} displayed={this.state.applicationWindowDisplayed} callback={this.updateApplication} closeWindow={this.closeApplicationWindow} />
				<DeleteApplicationWindow id={this.props.id} displayed={this.state.deleteApplicationWindowDisplayed} callback={this.deleteApplication} closeWindow={this.closeDeleteApplicationWindow} />
			</div>
		);
	}
}