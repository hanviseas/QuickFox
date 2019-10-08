import React from 'react';
import $ from 'jquery';
import Label from '../../component/label.jsx';
import Load from '../../component/load.jsx';
import globalStyle from '../../public/global.css';
import logStyle from './log.css';

export default class LogList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			logs: this.props.logs, // 日志数据
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			logs: nextProps.logs,
		});
	}

	render() {
		const idFieldOrderStyle = this.props.currentOrderField === 'id' ? (this.props.currentOrderType === 'asc' ? logStyle.arrowUp : logStyle.arrowDown) : '';
		return (
			<div>
				<div>
					<Label text='操作日志' />
				</div>
				<div className={globalStyle.clear}></div>
				<div className={`${logStyle.log} ${logStyle.head}`}>
					<div className={`${logStyle.idCol} ${idFieldOrderStyle}`} onClick={this.props.setOrder.bind(null, 'id')}><span className={globalStyle.autoHidden}>编号</span></div>
					<div className={logStyle.sourceCol}><span className={globalStyle.autoHidden}>日志来源</span></div>
					<div className={logStyle.operatorCol}><span className={globalStyle.autoHidden}>操作人</span></div>
					<div className={logStyle.actionCol}><span className={globalStyle.autoHidden}>事件</span></div>
					<div className={logStyle.timeCol}><span className={globalStyle.autoHidden}>触发时间</span></div>
				</div>
				{
					this.props.loading ? (() => {
						return <Load />;
					})() : (() => {
						return (
							this.state.logs.map((log) => {
								return (
									<Log key={log.id} id={log.id} source={log.source} avatar={log.operator_avatar} name={log.operator_name} action={log.action} time={log.time} />
								);
							})
						);
					})()
				}
			</div>
		);
	}
}

class Log extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		let sourceName = '未定义';
		if (this.props.source === 'user') {
			sourceName = '用户';
		} else if (this.props.source === 'app') {
			sourceName = '应用';
		}
		return (
			<div>
				<div className={logStyle.log}>
					<div className={logStyle.idCol}><span className={globalStyle.autoHidden}>{this.props.id}</span></div>
					<div className={logStyle.sourceCol}><span className={globalStyle.autoHidden}>{sourceName}</span></div>
					<div className={logStyle.operatorCol}>
						<img src={this.props.avatar} />
						<div><span className={globalStyle.autoHidden}>{this.props.name}</span></div>
					</div>
					<div className={logStyle.actionCol}><span className={globalStyle.autoHidden}>{this.props.action}</span></div>
					<div className={logStyle.timeCol}><span className={globalStyle.autoHidden}>{this.props.time}</span></div>
				</div>
			</div>
		);
	}
}