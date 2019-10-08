import React from 'react';
import $ from 'jquery';
import Label from '../../component/label.jsx';
import Load from '../../component/load.jsx';
import ReportWindow from './window/report.jsx';
import globalStyle from '../../public/global.css';
import reportStyle from './report.css';

export default class ReportList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			reports: this.props.reports, // 报告数据
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			reports: nextProps.reports,
		});
	}

	render() {
		const idFieldOrderStyle = this.props.currentOrderField === 'id' ? (this.props.currentOrderType === 'asc' ? reportStyle.arrowUp : reportStyle.arrowDown) : '';
		const runtimeFieldOrderStyle = this.props.currentOrderField === 'runtime' ? (this.props.currentOrderType === 'asc' ? reportStyle.arrowUp : reportStyle.arrowDown) : '';
		return (
			<div>
				<div>
					<Label text='测试报告' />
				</div>
				<div className={globalStyle.clear}></div>
				<div className={`${reportStyle.report} ${reportStyle.head}`}>
					<div className={`${reportStyle.idCol} ${idFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'id')}><span className={globalStyle.autoHidden}>编号</span></div>
					<div className={`${reportStyle.nameCol}`}><span className={globalStyle.autoHidden}>任务名称</span></div>
					<div className={`${reportStyle.runtimeCol} ${runtimeFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'runtime')}><span className={globalStyle.autoHidden}>运行时间</span></div>
					<div className={`${reportStyle.passCol}`}><span className={globalStyle.autoHidden}>通过</span></div>
					<div className={`${reportStyle.failCol}`}><span className={globalStyle.autoHidden}>失败</span></div>
				</div>
				{
					this.props.loading ? (() => {
						return <Load />;
					})() : (() => {
						return (
							this.state.reports.map((report) => {
								return (
									<Report key={report.id} userInfo={this.props.userInfo} id={report.id} taskName={report.task_name} runtime={report.runtime} pass={report.pass} fail={report.fail} />
								);
							})
						);
					})()
				}
			</div>
		);
	}
}

class Report extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			focused: false, // 焦点（鼠标移至上方）状态
			reportWindowDisplayed: false, // 报告窗口显示状态
		};
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
		this.renderIcon = this.renderIcon.bind(this);
		this.openReportWindow = this.openReportWindow.bind(this);
		this.closeReportWindow = this.closeReportWindow.bind(this);
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
			<div className={reportStyle.icon} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon}>
				<img src={`/static/img/v2/start/icon-${name}.png`} title={title} />
			</div>
		);
	}

	/**
	 * 打开报告窗口
	 */
	openReportWindow(event) {
		event.stopPropagation();
		this.setState({
			reportWindowDisplayed: true,
		});
	}

	/**
	 * 关闭报告窗口
	 */
	closeReportWindow() {
		this.setState({
			reportWindowDisplayed: false,
		});
	}

	render() {
		const focusStateClassName = this.state.focused ? reportStyle.focused : '';
		return (
			<div>
				<div className={`${reportStyle.report} ${focusStateClassName}`} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState}>
					<div className={reportStyle.idCol}><span className={globalStyle.autoHidden}>{this.props.id}</span></div>
					<div className={reportStyle.nameCol}><span className={globalStyle.autoHidden}>{this.props.taskName}</span></div>
					<div className={reportStyle.runtimeCol}><span className={globalStyle.autoHidden}>{this.props.runtime}</span></div>
					<div className={reportStyle.passCol}><span className={globalStyle.autoHidden}>{this.props.pass}</span></div>
					<div className={reportStyle.failCol}><span className={globalStyle.autoHidden}>{this.props.fail}</span></div>
					<div className={reportStyle.optionCol}>
						<div onClick={this.openReportWindow}>{this.renderIcon('view', '查看')}</div>
					</div>
				</div>
				<ReportWindow id={this.props.id} displayed={this.state.reportWindowDisplayed} userInfo={this.props.userInfo} closeWindow={this.closeReportWindow} />
			</div>
		);
	}
}