import React from 'react';
import { connect } from 'react-redux';
import Window from '../../../component/window.jsx';
import Input from '../../../component/input.jsx';
import Textarea from '../../../component/textarea.jsx';
import Button from '../../../component/button.jsx';
import dataStepStyle from './dataStep.css';

class DataStepWindow extends React.Component {

	static defaultProps = {
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.state = {
			stepName: this.props.name, // 步骤名称
			prepositionFliter: this.props.preposition_fliter, // 前置过滤器
			postpositionFliter: this.props.postposition_fliter, // 后置过滤器
			dataConfig: this.props.command.replace(/^config\:/g, ''), // 存储查询配置
			dataStatement: this.props.value, // 存储查询语句
		};
		this.setStepName = this.setStepName.bind(this);
		this.setPrepositionFliter = this.setPrepositionFliter.bind(this);
		this.setPostpositionFliter = this.setPostpositionFliter.bind(this);
		this.setDataConfig = this.setDataConfig.bind(this);
		this.setDataStatement = this.setDataStatement.bind(this);
		this.saveStep = this.saveStep.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.setState({
				stepName: nextProps.name,
				prepositionFliter: nextProps.preposition_fliter,
				postpositionFliter: nextProps.postposition_fliter,
				dataConfig: nextProps.command.replace(/^config\:/g, ''),
				dataStatement: nextProps.value,
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
	 * 设置存储查询配置
	 * @param config 配置值
	 */
	setDataConfig(config) {
		this.setState({
			dataConfig: config,
		});
	}

	/**
	 * 设置存储查询语句
	 * @param statement 查询语句
	 */
	setDataStatement(statement) {
		this.setState({
			dataStatement: statement,
		});
	}

	/**
	 * 保存步骤
	 */
	saveStep() {
		const stepData = {
			name: this.state.stepName,
			command: 'config:' + this.state.dataConfig,
			preposition_fliter: this.state.prepositionFliter,
			postposition_fliter: this.state.postpositionFliter,
			value: this.state.dataStatement,
		}
		if (this.state.stepName.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '步骤名称不能为空' },
			}); // 发送通知
			return;
		}
		if (!this.state.dataConfig) { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '数据配置不能为空' },
			}); // 发送通知
			return;
		}
		if (!this.state.dataStatement) { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '查询语句不能为空' },
			}); // 发送通知
			return;
		}
		this.props.callback.bind(null, this.props.index, stepData)();
	}

	render() {
		return (
			<Window displayed={this.props.displayed} width='600' height='520' level={2} title={'编辑存储查询步骤'} submitHandler={<Button text='保存' callback={this.saveStep} />} closeWindow={this.props.closeWindow}>
				<div>
					<Input width='500' name='stepName' value={this.state.stepName} maxLength='30' placeholder='步骤名称，如：查询用户信息' required={true} callback={this.setStepName} />
				</div>
				<div>
					<Input width='500' name='prepositionFliter' value={this.state.prepositionFliter} maxLength='100' placeholder='前置过滤器' callback={this.setPrepositionFliter} />
				</div>
				<div>
					<Input width='500' name='command' value={this.state.dataConfig} maxLength='30' placeholder='数据配置，如：localdb' required={true} callback={this.setDataConfig} />
				</div>
				<div>
					<Textarea width='500' name='value' value={this.state.dataStatement} placeholder='查询语句，如：select * from user where userId = 1' required={true} callback={this.setDataStatement} />
				</div>
			</Window>
		);
	}
}

export default connect()(DataStepWindow);