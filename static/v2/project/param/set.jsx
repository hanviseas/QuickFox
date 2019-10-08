import React from 'react';
import $ from 'jquery';
import Label from '../../component/label.jsx';
import Load from '../../component/load.jsx';
import ParamWindow from './window/param.jsx';
import DeleteParamWindow from './window/deleteParam.jsx';
import DataWindow from './window/data.jsx';
import DeleteDataWindow from './window/deleteData.jsx';
import globalStyle from '../../public/global.css';
import setStyle from './set.css';

export default class SetList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			sets: this.props.sets, // 设置集数据
			paramWindowDisplayed: false, // 参数窗口显示状态
			dataWindowDisplayed: false, // 数据源窗口显示状态
		};
		this.openParamWindow = this.openParamWindow.bind(this);
		this.closeParamWindow = this.closeParamWindow.bind(this);
		this.addParam = this.addParam.bind(this);
		this.openDataWindow = this.openDataWindow.bind(this);
		this.closeDataWindow = this.closeDataWindow.bind(this);
		this.addData = this.addData.bind(this);
		this.renderParamList = this.renderParamList.bind(this);
		this.renderDataList = this.renderDataList.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			sets: nextProps.sets,
		});
	}

	/**
	 * 打开参数窗口
	 */
	openParamWindow() {
		this.setState({
			paramWindowDisplayed: true,
		});
	}

	/**
	 * 关闭参数窗口
	 */
	closeParamWindow() {
		this.setState({
			paramWindowDisplayed: false,
		});
	}

	/**
	 * 添加参数
	 * @param id 参数ID
	 * @param keyword 参数关键字
	 * @param value 参数值
	 * @param comment 参数备注
	 */
	addParam(id, keyword, value, comment) {
		let sets = this.state.sets;
		sets.unshift({
			id: id,
			keyword: keyword,
			value: value,
			comment: comment,
			new: true,
		});
		this.setState({
			sets: sets,
			paramWindowDisplayed: false,
		});
	}

	/**
	 * 打开数据源窗口
	 */
	openDataWindow() {
		this.setState({
			dataWindowDisplayed: true,
		});
	}

	/**
	 * 关闭数据源窗口
	 */
	closeDataWindow() {
		this.setState({
			dataWindowDisplayed: false,
		});
	}

	/**
	 * 添加数据源
	 * @param id 数据源ID
	 * @param source 数据源
	 * @param keyword 设置关键字
	 * @param comment 数据源备注
	 */
	addData(id, source, keyword, comment) {
		let sets = this.state.sets;
		sets.unshift({
			id: id,
			source: source,
			keyword: keyword,
			comment: comment,
			new: true,
		});
		this.setState({
			sets: sets,
			dataWindowDisplayed: false,
		});
	}

	/**
	 * 渲染参数列表
	 * @param idFieldOrderStyle ID字段排序样式
	 * @param keywordFieldOrderStyle 关键字字段排序样式
	 */
	renderParamList(idFieldOrderStyle, keywordFieldOrderStyle) {
		return (
			<div>
				<div>
					<Label text='参数设置' />
					{
						this.props.userInfo.auth.indexOf('V2.Api.Param.Add') === -1 ? null : (() => {
							return (
								<div className={setStyle.newSet} onClick={this.openParamWindow}><span>创建参数</span></div>
							);
						})()
					}
				</div>
				<div className={globalStyle.clear}></div>
				<div className={`${setStyle.param} ${setStyle.head}`}>
					<div className={`${setStyle.idCol} ${idFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'id')}><span className={globalStyle.autoHidden}>编号</span></div>
					<div className={`${setStyle.keywordCol} ${keywordFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'keyword')}><span className={globalStyle.autoHidden}>参数名</span></div>
					<div className={`${setStyle.valueCol}`}><span className={globalStyle.autoHidden}>参数值</span></div>
					<div className={`${setStyle.commentCol}`}><span className={globalStyle.autoHidden}>备注</span></div>
				</div>
				{
					this.props.loading ? (() => {
						return <Load />;
					})() : (() => {
						return (
							this.state.sets.map((param) => {
								return (
									<Param key={param.id} userInfo={this.props.userInfo} id={param.id} keyword={param.keyword} value={param.value} comment={param.comment} currentSetType={this.props.currentSetType} new={param.new} />
								);
							})
						);
					})()
				}
				<ParamWindow displayed={this.state.paramWindowDisplayed} environmentId={this.props.environmentId} callback={this.addParam} closeWindow={this.closeParamWindow} />
			</div>
		);
	}

	/**
	 * 渲染参数列表
	 * @param idFieldOrderStyle ID字段排序样式
	 * @param sourceFieldOrderStyle 数据源字段排序样式
	 * @param keywordFieldOrderStyle 关键字字段排序样式
	 */
	renderDataList(idFieldOrderStyle, sourceFieldOrderStyle, keywordFieldOrderStyle) {
		return (
			<div>
				<div>
					<Label text='数据源设置' />
					{
						this.props.userInfo.auth.indexOf('V2.Api.Data.Add') === -1 ? null : (() => {
							return (
								<div className={setStyle.newSet} onClick={this.openDataWindow}><span>创建数据源</span></div>
							);
						})()
					}
				</div>
				<div className={globalStyle.clear}></div>
				<div className={`${setStyle.data} ${setStyle.head}`}>
					<div className={`${setStyle.idCol} ${idFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'id')}><span className={globalStyle.autoHidden}>编号</span></div>
					<div className={`${setStyle.sourceCol} ${sourceFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'source')}><span className={globalStyle.autoHidden}>数据源</span></div>
					<div className={`${setStyle.keywordCol} ${keywordFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'keyword')}><span className={globalStyle.autoHidden}>配置名</span></div>
					<div className={`${setStyle.commentCol}`}><span className={globalStyle.autoHidden}>备注</span></div>
				</div>
				{
					this.props.loading ? (() => {
						return <Load />;
					})() : (() => {
						return (
							this.state.sets.map((data) => {
								return (
									<Data key={data.id} userInfo={this.props.userInfo} id={data.id} keyword={data.keyword} source={data.source} comment={data.comment} currentSetType={this.props.currentSetType} new={data.new} />
								);
							})
						);
					})()
				}
				<DataWindow displayed={this.state.dataWindowDisplayed} environmentId={this.props.environmentId} callback={this.addData} closeWindow={this.closeDataWindow} />
			</div>
		);
	}

	render() {
		const idFieldOrderStyle = this.props.currentOrderField === 'id' ? (this.props.currentOrderType === 'asc' ? setStyle.arrowUp : setStyle.arrowDown) : '';
		const sourceFieldOrderStyle = this.props.currentOrderField === 'source' ? (this.props.currentOrderType === 'asc' ? setStyle.arrowUp : setStyle.arrowDown) : '';
		const keywordFieldOrderStyle = this.props.currentOrderField === 'keyword' ? (this.props.currentOrderType === 'asc' ? setStyle.arrowUp : setStyle.arrowDown) : '';
		return this.props.currentSetsType === 'param' ? this.renderParamList(idFieldOrderStyle, keywordFieldOrderStyle) : this.renderDataList(idFieldOrderStyle, sourceFieldOrderStyle, keywordFieldOrderStyle);
	}
}

class Param extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			paramKeyword: this.props.keyword, // 参数关键字
			paramValue: this.props.value, // 参数值
			paramComment: this.props.comment, // 参数备注
			focused: false, // 焦点（鼠标移至上方）状态
			deleted: false, // 参数删除状态
			paramWindowDisplayed: false, // 参数窗口显示状态
			deleteParamWindowDisplayed: false, // 删除参数窗口显示状态
		};
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
		this.renderIcon = this.renderIcon.bind(this);
		this.openParamWindow = this.openParamWindow.bind(this);
		this.closeParamWindow = this.closeParamWindow.bind(this);
		this.updateParam = this.updateParam.bind(this);
		this.openDeleteParamWindow = this.openDeleteParamWindow.bind(this);
		this.closeDeleteParamWindow = this.closeDeleteParamWindow.bind(this);
		this.deleteParam = this.deleteParam.bind(this);
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
			<div className={setStyle.icon} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon}>
				<img src={`/static/img/v2/interface/icon-${name}.png`} title={title} />
			</div>
		);
	}

	/**
	 * 打开参数窗口
	 */
	openParamWindow() {
		this.setState({
			paramWindowDisplayed: true,
		});
	}

	/**
	 * 关闭参数窗口
	 */
	closeParamWindow() {
		this.setState({
			paramWindowDisplayed: false,
		});
	}

	/**
	 * 更新参数
	 * @param keyword 参数关键字
	 * @param value 参数值
	 * @param comment 参数备注
	 */
	updateParam(keyword, value, comment) {
		this.setState({
			paramKeyword: keyword,
			paramValue: value,
			paramComment: comment,
			paramWindowDisplayed: false,
		});
	}

	/**
	 * 打开删除参数窗口
	 */
	openDeleteParamWindow() {
		this.setState({
			deleteParamWindowDisplayed: true,
		});
	}

	/**
	 * 关闭删除参数窗口
	 */
	closeDeleteParamWindow() {
		this.setState({
			deleteParamWindowDisplayed: false,
		});
	}

	/**
	 * 删除参数
	 */
	deleteParam() {
		this.setState({
			deleted: true,
			deleteParamWindowDisplayed: false,
		});
	}

	render() {
		if (this.state.deleted) { // 已删除参数返回空
			return null;
		}
		const focusStateClassName = this.state.focused ? setStyle.focused : '';
		const newStateClassName = this.props.new === undefined ? '' : setStyle.new;
		return (
			<div>
				<div className={`${setStyle.param} ${focusStateClassName} ${newStateClassName}`} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState}>
					<div className={setStyle.idCol}><span className={globalStyle.autoHidden}>{this.props.id}</span></div>
					<div className={setStyle.keywordCol}><span className={globalStyle.autoHidden}>{this.state.paramKeyword}</span></div>
					<div className={setStyle.valueCol}><span className={globalStyle.autoHidden}>{this.state.paramValue}</span></div>
					<div className={setStyle.commentCol}><span className={globalStyle.autoHidden}>{this.state.paramComment}</span></div>
					<div className={setStyle.optionCol}>
						{
							this.props.userInfo.auth.indexOf('V2.Api.Param.Update') === -1 ? null : (() => {
								return (
									<div onClick={this.openParamWindow}>{this.renderIcon('edit', '编辑')}</div>
								);
							})()
						}
						{
							this.props.userInfo.auth.indexOf('V2.Api.Param.Remove') === -1 ? null : (() => {
								return (
									<div onClick={this.openDeleteParamWindow}>{this.renderIcon('delete', '删除')}</div>
								);
							})()
						}
					</div>
				</div>
				<ParamWindow id={this.props.id} displayed={this.state.paramWindowDisplayed} callback={this.updateParam} closeWindow={this.closeParamWindow} />
				<DeleteParamWindow id={this.props.id} displayed={this.state.deleteParamWindowDisplayed} callback={this.deleteParam} closeWindow={this.closeDeleteParamWindow} />
			</div>
		);
	}
}

class Data extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource: this.props.source, // 数据源
			dataKeyword: this.props.keyword, // 设置关键字
			dataComment: this.props.comment, // 数据源备注
			focused: false, // 焦点（鼠标移至上方）状态
			deleted: false, // 数据源删除状态
			dataWindowDisplayed: false, // 数据源窗口显示状态
			deleteDataWindowDisplayed: false, // 删除数据源窗口显示状态
		};
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
		this.renderIcon = this.renderIcon.bind(this);
		this.openDataWindow = this.openDataWindow.bind(this);
		this.closeDataWindow = this.closeDataWindow.bind(this);
		this.updateData = this.updateData.bind(this);
		this.openDeleteDataWindow = this.openDeleteDataWindow.bind(this);
		this.closeDeleteDataWindow = this.closeDeleteDataWindow.bind(this);
		this.deleteData = this.deleteData.bind(this);
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
			<div className={setStyle.icon} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon}>
				<img src={`/static/img/v2/interface/icon-${name}.png`} title={title} />
			</div>
		);
	}

	/**
	 * 打开数据源窗口
	 */
	openDataWindow() {
		this.setState({
			dataWindowDisplayed: true,
		});
	}

	/**
	 * 关闭数据源窗口
	 */
	closeDataWindow() {
		this.setState({
			dataWindowDisplayed: false,
		});
	}

	/**
	 * 更新数据源
	 * @param source 数据源
	 * @param keyword 设置关键字
	 * @param comment 数据源备注
	 */
	updateData(source, keyword, comment) {
		this.setState({
			dataSource: source,
			dataKeyword: keyword,
			dataComment: comment,
			dataWindowDisplayed: false,
		});
	}

	/**
	 * 打开删除数据源窗口
	 */
	openDeleteDataWindow() {
		this.setState({
			deleteDataWindowDisplayed: true,
		});
	}

	/**
	 * 关闭删除数据源窗口
	 */
	closeDeleteDataWindow() {
		this.setState({
			deleteDataWindowDisplayed: false,
		});
	}

	/**
	 * 删除数据源
	 */
	deleteData() {
		this.setState({
			deleted: true,
			deleteDataWindowDisplayed: false,
		});
	}

	render() {
		if (this.state.deleted) { // 已删除数据源返回空
			return null;
		}
		const focusStateClassName = this.state.focused ? setStyle.focused : '';
		const newStateClassName = this.props.new === undefined ? '' : setStyle.new;
		return (
			<div>
				<div className={`${setStyle.data} ${focusStateClassName} ${newStateClassName}`} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState}>
					<div className={setStyle.idCol}><span className={globalStyle.autoHidden}>{this.props.id}</span></div>
					<div className={setStyle.sourceCol}><span className={globalStyle.autoHidden}>{this.state.dataSource}</span></div>
					<div className={setStyle.keywordCol}><span className={globalStyle.autoHidden}>{this.state.dataKeyword}</span></div>
					<div className={setStyle.commentCol}><span className={globalStyle.autoHidden}>{this.state.dataComment}</span></div>
					<div className={setStyle.optionCol}>
						{
							this.props.userInfo.auth.indexOf('V2.Api.Data.Update') === -1 ? null : (() => {
								return (
									<div onClick={this.openDataWindow}>{this.renderIcon('edit', '编辑')}</div>
								);
							})()
						}
						{
							this.props.userInfo.auth.indexOf('V2.Api.Data.Remove') === -1 ? null : (() => {
								return (
									<div onClick={this.openDeleteDataWindow}>{this.renderIcon('delete', '删除')}</div>
								);
							})()
						}
					</div>
				</div>
				<DataWindow id={this.props.id} displayed={this.state.dataWindowDisplayed} callback={this.updateData} closeWindow={this.closeDataWindow} />
				<DeleteDataWindow id={this.props.id} displayed={this.state.deleteDataWindowDisplayed} callback={this.deleteData} closeWindow={this.closeDeleteDataWindow} />
			</div>
		);
	}
}