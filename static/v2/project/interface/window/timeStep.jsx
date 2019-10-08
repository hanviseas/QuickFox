import React from 'react';
import { connect } from 'react-redux';
import Window from '../../../component/window.jsx';
import Input from '../../../component/input.jsx';
import Checkbox from '../../../component/checkbox.jsx';
import Button from '../../../component/button.jsx';
import timeStepStyle from './timeStep.css';

class timeStepWindow extends React.Component {

	static defaultProps = {
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.state = {
			stepName: this.props.name, // 步骤名称
			delayTime: this.props.value, // 延时时长（毫秒）
		};
		this.setStepName = this.setStepName.bind(this);
		this.setDelayTime = this.setDelayTime.bind(this);
		this.saveStep = this.saveStep.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.setState({
				stepName: nextProps.name,
				delayTime: nextProps.value,
			});
		}
	}

	/**
	 * 设置步骤名称
	 * @param name 步骤名称
	 */
	setStepName(name) {
		this.setState({
			stepName: name,
		});
	}

	/**
	 * 设置延时时长
	 * @param time 延时时长
	 */
	setDelayTime(time) {
		this.setState({
			delayTime: time,
		});
	}

	/**
	 * 保存步骤
	 */
	saveStep() {
		const stepData = {
			name: this.state.stepName,
			value: this.state.delayTime.trim(),
		}
		if (this.state.stepName.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '步骤名称不能为空' },
			}); // 发送通知
			return;
		}
		if (this.state.delayTime.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '延时时长不能为空' },
			}); // 发送通知
			return;
		}
		if (parseInt(this.state.delayTime.trim()).toString() !== this.state.delayTime.trim()) { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '延时时长必须为整数' },
			}); // 发送通知
			return;
		}
		if (parseInt(this.state.delayTime.trim()) < 0 || parseInt(this.state.delayTime.trim()) > 60000) { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '延时时长必须在 0 ~ 60000 毫秒之间' },
			}); // 发送通知
			return;
		}
		this.props.callback.bind(null, this.props.index, stepData)();
	}

	render() {
		return (
			<Window displayed={this.props.displayed} width='600' height='320' level={2} title={'编辑延时器步骤'} submitHandler={<Button text='保存' callback={this.saveStep} />} closeWindow={this.props.closeWindow}>
				<div>
					<Input width='500' name='stepName' value={this.state.stepName} maxLength='30' placeholder='步骤名称，如：等待 5000 毫秒' required={true} callback={this.setStepName} />
				</div>
				<div>
					<Input width='500' name='delayTime' value={this.state.delayTime} maxLength='5' placeholder='延时时长，单位为毫秒' required={true} callback={this.setDelayTime} />
				</div>
			</Window>
		);
	}
}

export default connect()(timeStepWindow);