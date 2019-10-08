import React from 'react';
import $ from 'jquery';
import Input from '../../component/input.jsx';
import Textarea from '../../component/textarea.jsx';
import requestParamStyle from './requestParam.css';

export default class RequestParamList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			requestParams: this.props.requestParam, //请求参数数据
		};
		this.addRequestParam = this.addRequestParam.bind(this);
		this.updateRequestParam = this.updateRequestParam.bind(this);
		this.deleteRequestParam = this.deleteRequestParam.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			requestParams: nextProps.requestParam,
		});
	}

	/**
	 * 添加请求参数
	 * @param position 添加位置
	 */
	addRequestParam(position) {
		let requestParams = this.state.requestParams;
		requestParams.splice(position + 1, 0, {
			key: '',
			value: '',
		});
		this.setState({
			requestParams: requestParams,
		}, () => {
			this.props.setRequestParam(requestParams); // 回写请求参数至上层
		});
	}

	/**
	 * 更新请求参数
	 * @param index 位置索引
	 * @param data 请求参数数据
	 */
	updateRequestParam(index, data) {
		let requestParams = this.state.requestParams;
		requestParams[index].key = data.fieldKey;
		requestParams[index].value = data.fieldValue;
		this.setState({
			requestParams: requestParams,
		}, () => {
			this.props.setRequestParam(requestParams); // 回写请求参数至上层
		});
	}

	/**
	 * 删除请求参数
	 * @param index 位置索引
	 */
	deleteRequestParam(index) {
		let requestParams = this.state.requestParams;
		requestParams.splice(index, 1);
		this.setState({
			requestParams: requestParams,
		}, () => {
			this.props.setRequestParam(requestParams); // 回写请求参数至上层
		});
	}

	render() {
		return (
			<div className={requestParamStyle.requestOption}>
				{
					this.state.requestParams.map((requestParam, index) => {
						return (
							<RequestParam key={index} index={index} fieldKey={requestParam.key} fieldValue={requestParam.value} addRequestParam={this.addRequestParam} updateRequestParam={this.updateRequestParam} deleteRequestParam={this.deleteRequestParam} />
						);
					})
				}
			</div>
		);
	}
}

class RequestParam extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			focused: false, // 焦点（鼠标移至上方）状态
		};
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
		this.renderIcon = this.renderIcon.bind(this);
		this.setFieldKey = this.setFieldKey.bind(this);
		this.setFieldValue = this.setFieldValue.bind(this);
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
			<div onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon}>
				<img src={`/static/img/v2/start/icon-${name}.png`} title={title} />
			</div>
		);
	}

	/**
	 * 设置字段关键字
	 * @param key 字段关键字
	 */
	setFieldKey(key) {
		this.props.updateRequestParam(this.props.index, {
			fieldKey: key,
			fieldValue: this.props.fieldValue,
		});
	}

	/**
	 * 设置字段值
	 * @param value 字段值
	 */
	setFieldValue(value) {
		this.props.updateRequestParam(this.props.index, {
			fieldKey: this.props.fieldKey,
			fieldValue: value,
		});
	}

	render() {
		const focusStateClassName = this.state.focused ? requestParamStyle.focused : '';
		return (
			<div className={`${requestParamStyle.field} ${focusStateClassName}`} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState}>
				<div>
					<Input width='200' name='fieldKey' value={this.props.fieldKey} placeholder='请求参数' required={true} callback={this.setFieldKey} />
				</div>
				<div>
					<Input width='250' name='fieldValue' value={this.props.fieldValue} placeholder='参数值' callback={this.setFieldValue} />
				</div>
				<div className={requestParamStyle.optionCol}>
					<div onClick={this.props.addRequestParam.bind(null, this.props.index)}>{this.renderIcon('add', '添加')}</div>
					<div onClick={this.props.deleteRequestParam.bind(null, this.props.index)}>{this.renderIcon('remove', '移除')}</div>
				</div>
			</div>
		);
	}
}

export class RequestParamString extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			requestParamString: this.props.requestParam //请求参数串
		};
		this.setRequestParamString = this.setRequestParamString.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			requestParamString: nextProps.requestParam,
		});
	}

	/**
	 * 设置请求参数串
	 * @param str 请求参数串
	 */
	setRequestParamString(str) {
		this.setState({
			requestParamString: str,
		}, () => {
			this.props.setRequestParam(str); // 回写请求参数至上层
		});
	}

	render() {
		return (
			<div className={requestParamStyle.requestOption}>
				<Textarea width='500' name='requestParamString' value={this.state.requestParamString} placeholder='请求参数字符串' callback={this.setRequestParamString} />
			</div>
		);
	}
}