import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import Suite from '../../../component/window/suite.jsx';
import Page from '../../../component/page.jsx';
import CaseWindow from '../../../project/interface/window/case.jsx';
import CaseStepWindow from '../../../project/interface/window/caseStep.jsx';
import globalStyle from '../../../public/global.css';
import reportStyle from './report.css';

class ReportWindow extends React.Component {

	static defaultProps = {
		id: 0, // 报告ID
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.tabs = [
			{
				index: 'all',
				name: '全部报告',
				icon: '/static/img/v2/start/icon-all.png',
			},
			{
				index: 'preposition_output',
				name: '前置脚本',
				icon: '/static/img/v2/start/icon-preposition.png',
			},
			{
				index: 'postposition_output',
				name: '后置脚本',
				icon: '/static/img/v2/start/icon-postposition.png',
			},
			{
				index: 'pass',
				name: '仅看通过',
				icon: '/static/img/v2/start/icon-pass.png',
			},
			{
				index: 'fail',
				name: '仅看失败',
				icon: '/static/img/v2/start/icon-fail.png',
			},
		]; // 窗口选单
		this.state = {
			currentTabIndex: this.tabs[0].index, // 当前选项卡索引
			prepositionOutput: '', // 前置脚本输出
			postpositionOutput: '', // 后置脚本输出
			passedTestNumber: 0, // 已通过的测试数
			failedTestNumber: 0, // 已失败的测试数
			records: [], // 记录数据
		};
		this.fetchReport = this.fetchReport.bind(this);
		this.fetchRecords = this.fetchRecords.bind(this);
		this.setCurrentTabIndex = this.setCurrentTabIndex.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.fetchReport();
			this.fetchRecords(1);
		}
	}

	/**
	 * 获取报告信息
	 */
	fetchReport() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/report/${this.props.id}`, {
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
				prepositionOutput: json.preposition_output,
				postpositionOutput: json.postposition_output,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 获取记录数据
	 * @param page 页数
	 */
	fetchRecords(page) {
		let testResult = '';
		switch (this.state.currentTabIndex) {
			case 'pass': // 获取通过的记录
				testResult = 1;
				break;
			case 'fail': // 获取失败的记录
				testResult = 0;
				break;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/report/${this.props.id}/records`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				'page': page,
				'size': 30,
				result: testResult,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			let records = [];
			json.collection.map((record) => {
				records.push(record);
			});
			_this.setState({
				records: records,
				maxRecordListPageNumber: json.page,
				currentRecordListPageNumber: page,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 设置当前选项卡索引
	 * @param tabIndex 选项卡索引
	 */
	setCurrentTabIndex(tabIndex) {
		this.setState({
			currentTabIndex: tabIndex,
		}, () => {
			this.fetchRecords(1);
		}); // 切换选项卡时更新记录列表
	}

	render() {
		const prepositionOutput = this.state.prepositionOutput ? '<span>' + this.state.prepositionOutput.toString().htmlspecials().replaceAll('\n', '<br/>') + '</span>' : '';
		const postpositionOutput = this.state.postpositionOutput ? '<span>' + this.state.postpositionOutput.toString().htmlspecials().replaceAll('\n', '<br/>') + '</span>' : '';
		return (
			<Suite displayed={this.props.displayed} layout={'isolate'} width='800' height='650' title={'测试报告'} tabs={this.tabs} closeWindow={this.props.closeWindow} callback={this.setCurrentTabIndex}>
				<div name={'all'}>
					<RecordList userInfo={this.props.userInfo} reportId={this.props.id} records={this.state.records} />
					<div>
						<Page maxPageNumber={this.state.maxRecordListPageNumber} currentPageNumber={this.state.currentRecordListPageNumber} callback={this.fetchRecords} />
					</div>
				</div>
				<div name={'preposition_output'}>
					<div dangerouslySetInnerHTML={{ __html: prepositionOutput }}></div>
				</div>
				<div name={'postposition_output'}>
					<div dangerouslySetInnerHTML={{ __html: postpositionOutput }}></div>
				</div>
				<div className={reportStyle.records} name={'pass'}>
					<RecordList userInfo={this.props.userInfo} reportId={this.props.id} records={this.state.records} />
					<div>
						<Page maxPageNumber={this.state.maxRecordListPageNumber} currentPageNumber={this.state.currentRecordListPageNumber} callback={this.fetchRecords} />
					</div>
				</div>
				<div className={reportStyle.records} name={'fail'}>
					<RecordList userInfo={this.props.userInfo} reportId={this.props.id} records={this.state.records} />
					<div>
						<Page maxPageNumber={this.state.maxRecordListPageNumber} currentPageNumber={this.state.currentRecordListPageNumber} callback={this.fetchRecords} />
					</div>
				</div>
			</Suite>
		);
	}
}

class RecordList extends React.Component {

	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className={reportStyle.recordList}>
				{
					this.props.records.map((record) => {
						return (
							<Record key={record.id} userInfo={this.props.userInfo} reportId={this.props.reportId} itemId={record.item_id} name={record.name} pass={record.pass} />
						);
					})
				}
			</div>
		);
	}
}

class Record extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			focused: false, // 焦点（鼠标移至上方）状态
			folded: true, // 用例记录列表折叠状态
			caseRecords: [], // 用例记录数据
		};
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
		this.fetchCaseRecords = this.fetchCaseRecords.bind(this);
		this.switchCaseRecordListFoldState = this.switchCaseRecordListFoldState.bind(this);
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
	 * 获取用例记录数据
	 */
	fetchCaseRecords() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/report/${this.props.reportId}/records`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				item_id: this.props.itemId,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			let caseRecords = [];
			json.map((record) => {
				caseRecords.push(record);
			});
			_this.setState({
				caseRecords: caseRecords,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 切换用例记录列表显示状态
	 */
	switchCaseRecordListFoldState() {
		if (this.state.folded) { // 展开时更新用例记录列表
			this.fetchCaseRecords();
			this.setState({
				folded: false,
			});
		} else {
			this.setState({
				folded: true,
			});
		}
	}

	render() {
		const focusStateClassName = this.state.focused && this.state.folded ? reportStyle.focused : '';
		const selectStateClassName = this.state.folded ? '' : reportStyle.selected;
		const passStatusStyle = Number.parseInt(this.props.pass) ? reportStyle.passed : reportStyle.failed;
		return (
			<div>
				<div className={`${reportStyle.record} ${passStatusStyle} ${focusStateClassName} ${selectStateClassName}`} onClick={this.switchCaseRecordListFoldState} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState}><span className={globalStyle.autoHidden}>{this.props.name}</span></div>
				{
					this.state.folded ? null : (() => { // 折叠状态下不显示内容
						return (
							<CaseRecordList userInfo={this.props.userInfo} reportId={this.props.reportId} itemId={this.props.itemId} caseRecords={this.state.caseRecords} />
						);
					})()
				}
			</div>
		);
	}
}

class CaseRecordList extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={reportStyle.caseRecordList}>
				{
					this.props.caseRecords.map((record) => {
						return (
							<CaseRecord key={record.id} userInfo={this.props.userInfo} reportId={this.props.reportId} itemId={this.props.itemId} caseId={record.case_id} name={record.name} pass={record.pass} />
						);
					})
				}
			</div>
		);
	}
}

class CaseRecord extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			focused: false, // 焦点（鼠标移至上方）状态
			folded: true, // 步骤记录列表折叠状态
			stepRecords: [], // 步骤记录数据
			caseWindowDisplayed: false, // 用例窗口显示状态
			caseStepWindowDisplayed: false, // 用例步骤窗口显示状态
		};
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
		this.renderIcon = this.renderIcon.bind(this);
		this.fetchStepRecords = this.fetchStepRecords.bind(this);
		this.switchStepRecordListFoldState = this.switchStepRecordListFoldState.bind(this);
		this.openCaseWindow = this.openCaseWindow.bind(this);
		this.closeCaseWindow = this.closeCaseWindow.bind(this);
		this.openCaseStepWindow = this.openCaseStepWindow.bind(this);
		this.closeCaseStepWindow = this.closeCaseStepWindow.bind(this);
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
				<img src={`/static/img/v2/start/icon-${name}.png`} title={title} onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon} />
			</div>
		);
	}

	/**
	 * 获取步骤记录数据
	 */
	fetchStepRecords() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/report/${this.props.reportId}/records`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				item_id: this.props.itemId,
				case_id: this.props.caseId,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			let stepRecords = [];
			json.map((record) => {
				stepRecords.push(record);
			});
			_this.setState({
				stepRecords: stepRecords,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 切换步骤记录列表显示状态
	 */
	switchStepRecordListFoldState() {
		if (this.state.folded) { // 展开时更新步骤记录列表
			this.fetchStepRecords();
			this.setState({
				folded: false,
			});
		} else {
			this.setState({
				folded: true,
			});
		}
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

	render() {
		const focusStateClassName = this.state.focused ? reportStyle.focused : '';
		const selectStateClassName = this.state.folded ? '' : reportStyle.selected;
		const passStatusStyle = Number.parseInt(this.props.pass) ? reportStyle.passed : reportStyle.failed;
		return (
			<div>
				<div className={`${reportStyle.caseRecord} ${focusStateClassName} ${selectStateClassName}`} onClick={this.switchStepRecordListFoldState} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState}>
					<div className={passStatusStyle}><span className={globalStyle.autoHidden}>{this.props.name}</span></div>
					{
						this.props.userInfo.auth.indexOf('V2.Api.Case.Update') === -1 ? null : (() => {
							return (
								<div className={reportStyle.option} onClick={this.openCaseWindow}>{this.renderIcon('edit', '编辑')}</div>
							);
						})()
					}
					{
						this.props.userInfo.auth.indexOf('V2.Api.Case.Steps.Steps') === -1 ? null : (() => {
							return (
								<div className={reportStyle.option} onClick={this.openCaseStepWindow}>{this.renderIcon('step', '步骤')}</div>
							);
						})()
					}
				</div>
				{
					this.state.folded ? null : (() => { // 折叠状态下不显示内容
						return (
							<StepRecordList stepRecords={this.state.stepRecords} />
						);
					})()
				}
				<CaseWindow id={this.props.caseId} displayed={this.state.caseWindowDisplayed} callback={this.closeCaseWindow} closeWindow={this.closeCaseWindow} />
				<CaseStepWindow id={this.props.caseId} displayed={this.state.caseStepWindowDisplayed} userInfo={this.props.userInfo} closeWindow={this.closeCaseStepWindow} />
			</div>
		);
	}
}

class StepRecordList extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={reportStyle.stepRecordList}>
				{
					this.props.stepRecords.map((record) => {
						return (
							<StepRecord key={record.id} stepType={record.step_type} name={record.name} content={record.content} value1={record.value_1} value2={record.value_2} value3={record.value_3} value4={record.value_4} value5={record.value_5} value6={record.value_6} value7={record.value_7} value8={record.value_8} value9={record.value_9} value10={record.value_10} pass={record.pass} />
						);
					})
				}
			</div>
		);
	}
}

class StepRecord extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			folded: true, // 详情折叠状态
		};
		this.switchRecordDetailFoldState = this.switchRecordDetailFoldState.bind(this);
		this.renderRecordDetailArea = this.renderRecordDetailArea.bind(this);
	}

	/**
	 * 切换记录详情显示状态
	 */
	switchRecordDetailFoldState() {
		if (this.state.folded) { // 展开时更新步骤记录列表
			this.setState({
				folded: false,
			});
		} else {
			this.setState({
				folded: true,
			});
		}
	}

	/**
	 * 渲染记录详情区域
	 */
	renderRecordDetailArea() {
		if (this.props.stepType === 'request') {
			return (
				<div className={reportStyle.recordDetail}>
					<div className={reportStyle.detailTitle}><span>请求地址</span></div>
					<div><span>{this.props.value1}</span></div>
					<div className={reportStyle.detailTitle}><span>请求头</span></div>
					<div><span>{this.props.value2}</span></div>
					<div className={reportStyle.detailTitle}><span>请求参数</span></div>
					<div><span>{this.props.value3}</span></div>
					<div className={reportStyle.detailTitle}><span>响应头</span></div>
					<div><span>{this.props.value4}</span></div>
					<div className={reportStyle.detailTitle}><span>响应内容</span></div>
					<div><span>{this.props.content}</span></div>
				</div>
			);
		} else if (this.props.stepType === 'data') {
			return (
				<div className={reportStyle.recordDetail}>
					<div className={reportStyle.detailTitle}><span>查询语句</span></div>
					<div><span>{this.props.value1}</span></div>
					<div className={reportStyle.detailTitle}><span>数据返回</span></div>
					<div><span>{this.props.content}</span></div>
				</div>
			);
		} else if (this.props.stepType === 'check') {
			return (
				<div className={reportStyle.recordDetail}>
					<div className={reportStyle.detailTitle}><span>源文本</span></div>
					<div><span>{this.props.value1}</span></div>
					<div className={reportStyle.detailTitle}><span>匹配文本</span></div>
					<div><span>{this.props.value2}</span></div>
					<div className={reportStyle.detailTitle}><span>检查结果</span></div>
					<div><span>{this.props.content === 'PASS' ? '检查通过' : '检查未通过'}</span></div>
				</div>
			);
		} else if (this.props.stepType === 'time') {
			return (
				<div className={reportStyle.recordDetail}>
					<div className={reportStyle.detailTitle}><span>延时时长</span></div>
					<div><span>延时 {this.props.content} 毫秒</span></div>
				</div>
			);
		}
		return null;
	}

	render() {
		const stepTypeStyle = reportStyle[`${this.props.stepType}Step`];
		const passStatusStyle = Number.parseInt(this.props.pass) ? reportStyle.passed : reportStyle.failed;
		return (
			<div>
				<div className={`${reportStyle.stepRecord} ${stepTypeStyle} ${passStatusStyle}`} onClick={this.switchRecordDetailFoldState}><span className={globalStyle.autoHidden}>{this.props.name}</span></div>
				{
					this.state.folded ? null : (() => { // 折叠状态下不显示内容
						return this.renderRecordDetailArea();
					})()
				}
			</div>
		);
	}
}

export default connect()(ReportWindow);