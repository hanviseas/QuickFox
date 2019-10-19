import React from 'react';
import $ from 'jquery';
import { domainPath } from '../../config/system.jsx';
import Load from '../../component/load.jsx';
import CaseWindow from './window/case.jsx';
import CaseLevelWindow from './window/caseLevel.jsx';
import CaseStepWindow from './window/caseStep.jsx';
import CopyCaseWindow from './window/copyCase.jsx';
import DeleteCaseWindow from './window/deleteCase.jsx';
import globalStyle from '../../public/global.css';
import caseStyle from './case.css';

export default class CaseList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			cases: this.props.cases, // 用例数据
			caseWindowDisplayed: false, // 用例窗口显示状态
		};
		this.openCaseWindow = this.openCaseWindow.bind(this);
		this.closeCaseWindow = this.closeCaseWindow.bind(this);
		this.addCase = this.addCase.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			cases: nextProps.cases,
		});
	}

	/**
	 * 打开用例窗口
	 */
	openCaseWindow() {
		this.setState({
			caseWindowDisplayed: true,
		});
	}

	/**
	 * 关闭用例窗口
	 */
	closeCaseWindow() {
		this.setState({
			caseWindowDisplayed: false,
		});
	}

	/**
	 * 添加用例
	 * @param id 用例ID
	 * @param name 用例名称
	 * @param level 用例等级
	 */
	addCase(id, name, level) {
		let cases = this.state.cases;
		cases.unshift({
			id: id,
			name: name,
			level: level,
			new: true,
		});
		this.setState({
			cases: cases,
			caseWindowDisplayed: false,
		});
	}

	render() {
		return (
			<div>
				<div className={caseStyle.header}>
					<div className={caseStyle.title}><span>共<span>{this.state.cases.length}</span>个测试用例</span></div>
					<div className={caseStyle.menu}>
						{
							this.props.userInfo.auth.indexOf('V2.Api.Case.Add') === -1 ? null : (() => {
								return (
									<div className={caseStyle.new} onClick={this.openCaseWindow}><span>创建用例</span></div>
								);
							})()
						}
					</div>
				</div>
				<div className={`${caseStyle.case} ${caseStyle.head}`}>
					<div className={caseStyle.idCol}><span className={globalStyle.autoHidden}>编号</span></div>
					<div className={caseStyle.nameCol}><span className={globalStyle.autoHidden}>名称</span></div>
					<div className={caseStyle.optionCol}><span className={globalStyle.autoHidden}>操作</span></div>
				</div>
				{
					this.props.loading ? (() => {
						return <Load />;
					})() : (() => {
						return (
							this.state.cases.map((casee) => {
								return (
									<Case key={casee.id} userInfo={this.props.userInfo} id={casee.id} spaceId={this.props.spaceId} moduleId={this.props.moduleId} itemId={this.props.itemId} name={casee.name} level={casee.level} addCase={this.addCase} new={casee.new} />
								);
							})
						);
					})()
				}
				<CaseWindow displayed={this.state.caseWindowDisplayed} spaceId={this.props.spaceId} moduleId={this.props.moduleId} itemId={this.props.itemId} callback={this.addCase} closeWindow={this.closeCaseWindow} />
			</div>
		);
	}
}

class Case extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			caseName: this.props.name, // 用例名称
			caseLevel: this.props.level, // 用例等级
			focused: false, // 焦点（鼠标移至上方）状态
			deleted: false, // 用例删除状态
			caseWindowDisplayed: false, // 用例窗口显示状态
			caseLevelWindowDisplayed: false, // 用例等级窗口显示状态
			caseStepWindowDisplayed: false, // 用例步骤窗口显示状态
			copyCaseWindowDisplayed: false, // 复制用例窗口显示状态
			deleteCaseWindowDisplayed: false, // 删除用例窗口显示状态
		};
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
		this.renderIcon = this.renderIcon.bind(this);
		this.openCaseWindow = this.openCaseWindow.bind(this);
		this.closeCaseWindow = this.closeCaseWindow.bind(this);
		this.addCase = this.addCase.bind(this);
		this.updateCase = this.updateCase.bind(this);
		this.openCaseLevelWindow = this.openCaseLevelWindow.bind(this);
		this.closeCaseLevelWindow = this.closeCaseLevelWindow.bind(this);
		this.updateCaseLevel = this.updateCaseLevel.bind(this);
		this.openCaseStepWindow = this.openCaseStepWindow.bind(this);
		this.closeCaseStepWindow = this.closeCaseStepWindow.bind(this);
		this.openCopyCaseWindow = this.openCopyCaseWindow.bind(this);
		this.closeCopyCaseWindow = this.closeCopyCaseWindow.bind(this);
		this.openDeleteCaseWindow = this.openDeleteCaseWindow.bind(this);
		this.closeDeleteCaseWindow = this.closeDeleteCaseWindow.bind(this);
		this.deleteCase = this.deleteCase.bind(this);
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
		$(event.currentTarget).attr('src', $(event.currentTarget).attr('src').replace('.png', '-actived.png'));
	}

	/**
	 * 不激活图标
	 */
	deactivateIcon(event) {
		$(event.currentTarget).attr('src', $(event.currentTarget).attr('src').replace('-actived.png', '.png'));
	}

	/**
	 * 渲染图标
	 * @param name 图像名
	 * @param title 提示文本
	 */
	renderIcon(name, title) {
		return (
			<div>
				<img src={`/static/img/v2/interface/icon-${name}.png`} title={title} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon} />
			</div>
		);
	}

	/**
	 * 打开用例窗口
	 */
	openCaseWindow() {
		this.setState({
			caseWindowDisplayed: true,
		});
	}

	/**
	 * 关闭用例窗口
	 */
	closeCaseWindow() {
		this.setState({
			caseWindowDisplayed: false,
		});
	}

	/**
	 * 添加用例
	 * @param id 用例ID
	 * @param name 用例名称
	 * @param level 用例等级
	 */
	addCase(id, name, level) {
		this.props.addCase.bind(null, id, name, level)();
		this.setState({
			copyCaseWindowDisplayed: false,
		});
	}

	/**
	 * 更新用例
	 * @param name 用例名称 
	 */
	updateCase(name) {
		this.setState({
			caseName: name,
			caseWindowDisplayed: false,
		});
	}

	/**
	 * 打开用例等级窗口
	 */
	openCaseLevelWindow() {
		this.setState({
			caseLevelWindowDisplayed: true,
		});
	}

	/**
	 * 关闭用例等级窗口
	 */
	closeCaseLevelWindow() {
		this.setState({
			caseLevelWindowDisplayed: false,
		});
	}

	/**
	 * 更新用例等级
	 * @param level 用例等级 
	 */
	updateCaseLevel(level) {
		this.setState({
			caseLevel: level,
			caseLevelWindowDisplayed: false,
		});
	}

	/**
	 * 打开用例步骤窗口
	 */
	openCaseStepWindow() {
		this.setState({
			caseStepWindowDisplayed: true,
		});
	}

	/**
	 * 关闭用例步骤窗口
	 */
	closeCaseStepWindow() {
		this.setState({
			caseStepWindowDisplayed: false,
		});
	}

	/**
	 * 打开复制用例窗口
	 */
	openCopyCaseWindow() {
		this.setState({
			copyCaseWindowDisplayed: true,
		});
	}

	/**
	 * 关闭复制用例窗口
	 */
	closeCopyCaseWindow() {
		this.setState({
			copyCaseWindowDisplayed: false,
		});
	}

	/**
	 * 打开删除用例窗口
	 */
	openDeleteCaseWindow() {
		this.setState({
			deleteCaseWindowDisplayed: true,
		});
	}

	/**
	 * 关闭删除用例窗口
	 */
	closeDeleteCaseWindow() {
		this.setState({
			deleteCaseWindowDisplayed: false,
		});
	}

	/**
	 * 删除用例
	 */
	deleteCase() {
		this.setState({
			deleted: true,
			deleteCaseWindowDisplayed: false,
		});
	}

	render() {
		if (this.state.deleted) { // 已删除用例返回空
			return null;
		}
		const focusStateClassName = this.state.focused ? caseStyle.focused : '';
		const newStateClassName = this.props.new === undefined ? '' : caseStyle.new;
		const levelIconClassName = caseStyle[`iconLevel${Number.parseInt(this.state.caseLevel)}`];
		return (
			<div>
				<div className={`${caseStyle.case} ${focusStateClassName} ${newStateClassName}`} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState}>
					<div className={caseStyle.idCol}><span className={`${globalStyle.autoHidden} ${levelIconClassName}`}>TC-{this.props.id}</span></div>
					<div className={caseStyle.nameCol}><span className={globalStyle.autoHidden}>{this.state.caseName}</span></div>
					<div className={caseStyle.optionCol}>
						{
							this.props.userInfo.auth.indexOf('V2.Api.Case.Update') === -1 ? null : (() => {
								return (
									<div onClick={this.openCaseWindow}>{this.renderIcon('edit', '编辑')}</div>
								);
							})()
						}
						{
							this.props.userInfo.auth.indexOf('V2.Api.Case.Level.Update') === -1 ? null : (() => {
								return (
									<div onClick={this.openCaseLevelWindow}>{this.renderIcon('level', '等级')}</div>
								);
							})()
						}
						{
							this.props.userInfo.auth.indexOf('V2.Api.Case.Steps.Steps') === -1 ? null : (() => {
								return (
									<div onClick={this.openCaseStepWindow}>{this.renderIcon('step', '步骤')}</div>
								);
							})()
						}
						{
							this.props.userInfo.auth.indexOf('V2.Api.Case.Add') === -1 ? null : (() => {
								return (
									<div onClick={this.openCopyCaseWindow}>{this.renderIcon('copy', '复制')}</div>
								);
							})()
						}
						<div><a href={`javascript:(window.location.href = '${domainPath}/v2/u/load/${this.props.id}')`}>{this.renderIcon('load', '载入')}</a></div>
						{
							this.props.userInfo.auth.indexOf('V2.Api.Case.Remove') === -1 ? null : (() => {
								return (
									<div onClick={this.openDeleteCaseWindow}>{this.renderIcon('delete', '删除')}</div>
								);
							})()
						}
					</div>
				</div>
				<CaseWindow id={this.props.id} displayed={this.state.caseWindowDisplayed} callback={this.updateCase} closeWindow={this.closeCaseWindow} />
				<CaseLevelWindow id={this.props.id} displayed={this.state.caseLevelWindowDisplayed} callback={this.updateCaseLevel} closeWindow={this.closeCaseLevelWindow} />
				<CaseStepWindow id={this.props.id} displayed={this.state.caseStepWindowDisplayed} userInfo={this.props.userInfo} spaceId={this.props.spaceId} closeWindow={this.closeCaseStepWindow} />
				<CopyCaseWindow id={this.props.id} displayed={this.state.copyCaseWindowDisplayed} spaceId={this.props.spaceId} moduleId={this.props.moduleId} itemId={this.props.itemId} callback={this.addCase} closeWindow={this.closeCopyCaseWindow} />
				<DeleteCaseWindow id={this.props.id} displayed={this.state.deleteCaseWindowDisplayed} callback={this.deleteCase} closeWindow={this.closeDeleteCaseWindow} />
			</div>
		);
	}
}