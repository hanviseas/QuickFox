import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import Load from '../../../component/load.jsx';
import Window from '../../../component/window.jsx';
import Input from '../../../component/input.jsx';
import Editor from '../../../component/input/editor.jsx';
import SetModuleOwnerWindow from './setModuleOwner.jsx';
import globalStyle from '../../../public/global.css';
import spaceModuleStyle from './spaceModule.css';

class SpaceModuleWindow extends React.Component {

	static defaultProps = {
		id: 0, // 空间ID
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.state = {
			spaceName: '', // 空间名称
			modules: [], // 模块数据
			moduleName: '', // 模块名称
			loading: true, // 载入状态
		};
		this.fetchSpace = this.fetchSpace.bind(this);
		this.fetchModules = this.fetchModules.bind(this);
		this.setModuleName = this.setModuleName.bind(this);
		this.addModule = this.addModule.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.fetchSpace();
			this.fetchModules();
		}
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
	 * 获取空间信息
	 */
	fetchSpace() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/space/${this.props.id}`, {
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
				spaceName: json.name,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 获取模块数据
	 */
	fetchModules() {
		this.setState({
			loading: true,
		});
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/space/${this.props.id}/modules`, {
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
			let modules = [];
			json.map((module) => {
				modules.push(module);
			});
			_this.setState({
				loading: false,
				modules: modules,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 设置模块名称
	 * @param name 模块名称
	 */
	setModuleName(name) {
		this.setState({
			moduleName: name,
		});
	}

	/**
	 * 添加模块
	 */
	addModule() {
		if (this.state.moduleName.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '模块名称不能为空' },
			}); // 发送通知
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/put/api/module`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				space_id: this.props.id,
				module_name: this.state.moduleName,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			if (json.code === '000000') { // 请求成功
				let modules = _this.state.modules;
				modules.unshift({
					id: Number.parseInt(json.message),
					owner_avatar: '/static/img/v2/public/default-avatar.png',
					owner_name: '未指派',
					name: _this.state.moduleName,
				});
				_this.setState({
					moduleName: '',
					modules: modules,
				});
				_this.props.dispatch({
					type: 'SET_INFORMATION',
					information: { type: 1, content: `模块创建成功：${json.message}` },
				}); // 发送通知
			} else {
				_this.props.dispatch({
					type: 'SET_INFORMATION',
					information: { type: 0, content: json.message },
				}); // 发送通知

			}
		}).catch(function (e) {
			console.log(e);
		});
	}

	render() {
		return (
			<Window displayed={this.props.displayed} height='600' title={this.state.spaceName} closeWindow={this.props.closeWindow}>
				<div className={spaceModuleStyle.content}>
					{
						this.props.userInfo.auth.indexOf('V2.Api.Module.Add') === -1 ? null : (() => {
							return (
								<div className={spaceModuleStyle.newModule}>
									<div>
										<Input width='500' name='moduleName' value={this.state.moduleName} maxLength='30' placeholder='新增模块，请输入模块名称，如：登录注册' callback={this.setModuleName} />
									</div>
									<div className={spaceModuleStyle.add} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon} onClick={this.addModule}>
										<img src={`/static/img/v2/space/done.png`} />
									</div>
								</div>
							);
						})()
					}
					<div className={`${spaceModuleStyle.module} ${spaceModuleStyle.head}`}>
						<div className={spaceModuleStyle.idCol}><span className={globalStyle.autoHidden}>编号</span></div>
						<div className={spaceModuleStyle.nameCol}><span className={globalStyle.autoHidden}>模块名称</span></div>
					</div>
					{
						this.state.loading ? (() => {
							return <Load />;
						})() : (() => {
							return (
								this.state.modules.map((module) => {
									return (
										<Module key={module.id} userInfo={this.props.userInfo} id={module.id} ownerAvatar={module.owner_avatar} ownerName={module.owner_name} name={module.name} dispatch={this.props.dispatch} />
									);
								})
							);
						})()
					}
				</div>
			</Window>
		);
	}
}

class Module extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			ownerAvatar: this.props.ownerAvatar, // 维护人头像
			ownerName: this.props.ownerName, // 维护人名字
			moduleName: this.props.name, // 模块名称
			focused: false, // 焦点（鼠标移至上方）状态
			deleted: false, // 模块删除状态
			ownerWindowDisplayed: false, // 维护人窗口显示状态
		};
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
		this.renderIcon = this.renderIcon.bind(this);
		this.openOwnerWindow = this.openOwnerWindow.bind(this);
		this.closeOwnerWindow = this.closeOwnerWindow.bind(this);
		this.updateOwner = this.updateOwner.bind(this);
		this.updateModule = this.updateModule.bind(this);
		this.deleteModule = this.deleteModule.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			moduleName: nextProps.name,
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
			<div className={spaceModuleStyle.icon} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon}>
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
	 * 更新模块
	 * @param name 模块名称
	 */
	updateModule(name) {
		if (name.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '模块名称不能为空' },
			}); // 发送通知
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/post/api/module/${this.props.id}`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				module_name: name,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			if (json.code === '000000') { // 请求成功
				_this.setState({
					moduleName: name,
				});
				_this.props.dispatch({
					type: 'SET_INFORMATION',
					information: { type: 1, content: json.message },
				}); // 发送通知
			} else {
				_this.props.dispatch({
					type: 'SET_INFORMATION',
					information: { type: 0, content: json.message },
				}); // 发送通知
			}
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 删除模块
	 */
	deleteModule() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/delete/api/module/${this.props.id}`, {
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
			if (json.code === '000000') { // 请求成功
				_this.setState({
					deleted: true,
				});
				_this.props.dispatch({
					type: 'SET_INFORMATION',
					information: { type: 1, content: json.message },
				}); // 发送通知
			} else {
				_this.props.dispatch({
					type: 'SET_INFORMATION',
					information: { type: 0, content: json.message },
				}); // 发送通知
			}
		}).catch(function (e) {
			console.log(e);
		});
	}

	render() {
		if (this.state.deleted) { // 已删除模块返回空
			return null;
		}
		const focusStateClassName = this.state.focused ? spaceModuleStyle.focused : '';
		return (
			<div>
				<div className={`${spaceModuleStyle.module} ${focusStateClassName}`} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState}>
					<div className={spaceModuleStyle.idCol}><span className={globalStyle.autoHidden}>{this.props.id}</span></div>
					<div className={spaceModuleStyle.nameCol}>
						<Editor width='150' name='moduleName' value={this.state.moduleName} maxLength='30' placeholder='模块名称，如：登录注册' disabled={this.props.userInfo.auth.indexOf('V2.Api.Module.Update') === -1 ? true : false} callback={this.updateModule} />
					</div>
					<div className={spaceModuleStyle.ownerCol} onClick={this.props.userInfo.auth.indexOf('V2.Api.Module.Owner.Update') === -1 ? null : this.openOwnerWindow}>
						<img src={this.state.ownerAvatar} />
						<div><span className={globalStyle.autoHidden}>{this.state.ownerName}</span></div>
					</div>
					<div className={spaceModuleStyle.optionCol}>
						{
							this.props.userInfo.auth.indexOf('V2.Api.Module.Remove') === -1 ? null : (() => {
								return (
									<div onClick={this.deleteModule}>{this.renderIcon('delete', '删除')}</div>
								);
							})()
						}
					</div>
				</div>
				<SetModuleOwnerWindow id={this.props.id} displayed={this.state.ownerWindowDisplayed} callback={this.updateOwner} closeWindow={this.closeOwnerWindow} />
			</div>
		);
	}
}

export default connect()(SpaceModuleWindow);