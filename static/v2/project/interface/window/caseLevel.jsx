import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import Window from '../../../component/window.jsx';
import Button from '../../../component/button.jsx';
import caseLevelStyle from './caseLevel.css';

class CaseLevelWindow extends React.Component {

	static defaultProps = {
		id: 0, // 用例ID
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.state = {
			caseLevel: 3, // 用例等级
		};
		this.fetchCase = this.fetchCase.bind(this);
		this.setCaseLevel = this.setCaseLevel.bind(this);
		this.saveCase = this.saveCase.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		nextProps.displayed && this.fetchCase();
	}

	/**
	 * 获取用例信息
	 */
	fetchCase() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/case/${this.props.id}`, {
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
				caseLevel: Number.parseInt(json.level),
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 设置用例等级
	 * @param level 用例等级
	 */
	setCaseLevel(level) {
		this.setState({
			caseLevel: level,
		});
	}

	/**
	 * 保存用例
	 */
	saveCase() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/post/api/case/${this.props.id}/level`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: encodeParams({
				case_level: this.state.caseLevel,
			}),
		});
		result.then(function (response) {
			// console.log(response);
			return response.json();
		}).then(function (json) {
			if (json.code === '000000') { // 请求成功
				_this.props.callback.bind(null, _this.state.caseLevel)();
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
		return (
			<Window displayed={this.props.displayed} height='290' title='设置用例等级' submitHandler={<Button text='保存' callback={this.saveCase} />} closeWindow={this.props.closeWindow}>
				<div className={caseLevelStyle.level}>
					<img src={`/static/img/v2/interface/level-a${this.state.caseLevel === 1 ? '-actived' : ''}.png`} onClick={this.setCaseLevel.bind(null, 1)} />
					<img src={`/static/img/v2/interface/level-b${this.state.caseLevel === 2 ? '-actived' : ''}.png`} onClick={this.setCaseLevel.bind(null, 2)} />
					<img src={`/static/img/v2/interface/level-c${this.state.caseLevel === 3 ? '-actived' : ''}.png`} onClick={this.setCaseLevel.bind(null, 3)} />
					<img src={`/static/img/v2/interface/level-d${this.state.caseLevel === 4 ? '-actived' : ''}.png`} onClick={this.setCaseLevel.bind(null, 4)} />
				</div>
				<div className={caseLevelStyle.helper}>
					<span>最高优先级</span>
					<span>>>></span>
					<span>最低优先级</span>
				</div>
			</Window>
		);
	}
}

export default connect()(CaseLevelWindow);