import React from 'react';
import { connect } from 'react-redux';
import Window from '../../../component/window.jsx';
import Input from '../../../component/input.jsx';
import Checkbox from '../../../component/checkbox.jsx';
import Textarea from '../../../component/textarea.jsx';
import Button from '../../../component/button.jsx';
import checkStepStyle from './checkStep.css';

class CheckStepWindow extends React.Component {

	static defaultProps = {
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		const options = [];
		this.props.command.split('|').map((option) => {
			options.push(option.trim()); // 数组中存储选中的选项
		});
		this.checkOptions = [
			{
				index: 'all',
				value: options.includes('all'),
				text: '完全匹配',
				mutex: ['begin', 'end'],
			},
			{
				index: 'begin',
				value: options.includes('begin'),
				text: '前段匹配',
				mutex: ['all'],
			},
			{
				index: 'end',
				value: options.includes('end'),
				text: '后段匹配',
				mutex: ['all'],
			},
			{
				index: 'reg',
				value: options.includes('reg'),
				text: '正则表达式',
			},
			{
				index: 'opposite',
				value: options.includes('opposite'),
				text: '取反',
			},
		]; // 检查点选项
		this.state = {
			stepName: this.props.name, // 步骤名称
			prepositionFliter: this.props.preposition_fliter, // 前置过滤器
			postpositionFliter: this.props.postposition_fliter, // 后置过滤器
			checkOption: this.props.command, // 检查点选项
			checkValidation: this.props.value, // 检查点校验值
		};
		this.setStepName = this.setStepName.bind(this);
		this.setPrepositionFliter = this.setPrepositionFliter.bind(this);
		this.setPostpositionFliter = this.setPostpositionFliter.bind(this);
		this.setCheckOption = this.setCheckOption.bind(this);
		this.setCheckValidation = this.setCheckValidation.bind(this);
		this.saveStep = this.saveStep.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			const options = [];
			this.props.command.split('|').map((option) => {
				options.push(option.trim()); // 数组中存储选中的选项
			});
			this.checkOptions = [
				{
					index: 'all',
					value: options.includes('all'),
					text: '完全匹配',
					mutex: ['begin', 'end'],
				},
				{
					index: 'begin',
					value: options.includes('begin'),
					text: '前段匹配',
					mutex: ['all'],
				},
				{
					index: 'end',
					value: options.includes('end'),
					text: '后段匹配',
					mutex: ['all'],
				},
				{
					index: 'reg',
					value: options.includes('reg'),
					text: '正则表达式',
				},
				{
					index: 'opposite',
					value: options.includes('opposite'),
					text: '取反',
				},
			]; // 检查点选项
			this.setState({
				stepName: nextProps.name,
				prepositionFliter: nextProps.preposition_fliter,
				postpositionFliter: nextProps.postposition_fliter,
				checkOption: nextProps.command,
				checkValidation: nextProps.value,
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
	 * 设置前置过滤器
	 * @param fliter 过滤器
	 */
	setPrepositionFliter(fliter) {
		this.setState({
			prepositionFliter: fliter,
		});
	}

	/**
	 * 设置后置过滤器
	 * @param fliter 过滤器
	 */
	setPostpositionFliter(fliter) {
		this.setState({
			postpositionFliter: fliter,
		});
	}

	/**
	 * 设置检查点选项
	 * @param values 选项值
	 */
	setCheckOption(values) {
		values.includes('all') || values.unshift('include'); // 非完全匹配模式，则设置为部分匹配
		this.setState({
			checkOption: values.join(' | '),
		});
	}

	/**
	 * 设置检查点校验值
	 * @param validation 校验值
	 */
	setCheckValidation(validation) {
		this.setState({
			checkValidation: validation,
		});
	}

	/**
	 * 保存步骤
	 */
	saveStep() {
		const stepData = {
			name: this.state.stepName,
			command: this.state.checkOption,
			preposition_fliter: this.state.prepositionFliter,
			postposition_fliter: this.state.postpositionFliter,
			value: this.state.checkValidation,
		}
		if (this.state.stepName.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '步骤名称不能为空' },
			}); // 发送通知
			return;
		}
		this.props.callback.bind(null, this.props.index, stepData)();
	}

	render() {
		return (
			<Window displayed={this.props.displayed} width='600' height='520' level={2} title={'编辑检查点步骤'} submitHandler={<Button text='保存' callback={this.saveStep} />} closeWindow={this.props.closeWindow}>
				<div>
					<Input width='500' name='stepName' value={this.state.stepName} maxLength='30' placeholder='步骤名称，如：检查用户状态' required={true} callback={this.setStepName} />
				</div>
				<div>
					<Input width='500' name='prepositionFliter' value={this.state.prepositionFliter} maxLength='100' placeholder='前置过滤器' callback={this.setPrepositionFliter} />
				</div>
				<div>
					<div className={checkStepStyle.checkbox}>
						<Checkbox name='command' options={this.checkOptions} callback={this.setCheckOption} />
					</div>
				</div>
				<div>
					<Textarea width='500' name='value' value={this.state.checkValidation} placeholder='检查内容，如："status":1' required={true} callback={this.setCheckValidation} />
				</div>
			</Window>
		);
	}
}

export default connect()(CheckStepWindow);