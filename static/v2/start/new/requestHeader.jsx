import React from 'react';
import $ from 'jquery';
import Select from '../../component/select.jsx';
import Input from '../../component/input.jsx';
import requestHeaderStyle from './requestHeader.css';

export default class RequestHeaderList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			requestHeaders: this.props.requestHeader, //请求头数据
		};
		this.addRequestHeader = this.addRequestHeader.bind(this);
		this.updateRequestHeader = this.updateRequestHeader.bind(this);
		this.deleteRequestHeader = this.deleteRequestHeader.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			requestHeaders: nextProps.requestHeader,
		});
	}

	/**
	 * 添加请求头
	 * @param position 添加位置
	 */
	addRequestHeader(position) {
		let requestHeaders = this.state.requestHeaders;
		requestHeaders.splice(position + 1, 0, {
			key: '',
			value: '',
			type: 'TEXT',
		});
		this.setState({
			requestHeaders: requestHeaders,
		}, () => {
			this.props.setRequestHeader(requestHeaders); // 回写请求头至上层
		});
	}

	/**
	 * 更新请求头
	 * @param index 位置索引
	 * @param data 请求头数据
	 */
	updateRequestHeader(index, data) {
		let requestHeaders = this.state.requestHeaders;
		requestHeaders[index].key = data.fieldKey;
		requestHeaders[index].value = data.fieldValue;
		requestHeaders[index].type = data.fieldType;
		this.setState({
			requestHeaders: requestHeaders,
		}, () => {
			this.props.setRequestHeader(requestHeaders); // 回写请求头至上层
		});
	}

	/**
	 * 删除请求头
	 * @param index 位置索引
	 */
	deleteRequestHeader(index) {
		let requestHeaders = this.state.requestHeaders;
		requestHeaders.splice(index, 1);
		this.setState({
			requestHeaders: requestHeaders,
		}, () => {
			this.props.setRequestHeader(requestHeaders); // 回写请求头至上层
		});
	}

	render() {
		return (
			<div className={requestHeaderStyle.requestOption}>
				{
					this.state.requestHeaders.map((requestHeader, index) => {
						return (
							<RequestHeader key={index} index={index} fieldKey={requestHeader.key} fieldValue={requestHeader.value} fieldType={requestHeader.type} addRequestHeader={this.addRequestHeader} updateRequestHeader={this.updateRequestHeader} deleteRequestHeader={this.deleteRequestHeader} />
						);
					})
				}
			</div>
		);
	}
}

class RequestHeader extends React.Component {

	constructor(props) {
		super(props);
		this.fieldType = [
			{ index: 'TEXT', value: 'TEXT' },
			{ index: 'NUM', value: 'NUM' },
		];
		this.state = {
			focused: false, // 焦点（鼠标移至上方）状态
		};
		this.setFocusState = this.setFocusState.bind(this);
		this.unsetFocusState = this.unsetFocusState.bind(this);
		this.renderIcon = this.renderIcon.bind(this);
		this.setFieldKey = this.setFieldKey.bind(this);
		this.setFieldValue = this.setFieldValue.bind(this);
		this.setFieldType = this.setFieldType.bind(this);
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
		this.props.updateRequestHeader(this.props.index, {
			fieldKey: key,
			fieldValue: this.props.fieldValue,
			fieldType: this.props.fieldType,
		});
	}

	/**
	 * 设置字段值
	 * @param value 字段值
	 */
	setFieldValue(value) {
		this.props.updateRequestHeader(this.props.index, {
			fieldKey: this.props.fieldKey,
			fieldValue: value,
			fieldType: this.props.fieldType,
		});
	}

	/**
	 * 设置字段类型
	 * @param type 字段类型
	 */
	setFieldType(type) {
		this.props.updateRequestHeader(this.props.index, {
			fieldKey: this.props.fieldKey,
			fieldValue: this.props.fieldValue,
			fieldType: type.index,
		});
	}

	render() {
		const focusStateClassName = this.state.focused ? requestHeaderStyle.focused : '';
		return (
			<div className={`${requestHeaderStyle.field} ${focusStateClassName}`} onMouseEnter={this.setFocusState} onMouseLeave={this.unsetFocusState}>
				<div>
					<Input width='200' name='fieldKey' value={this.props.fieldKey} placeholder='请求头' required={true} callback={this.setFieldKey} />
				</div>
				<div>
					<Input width='250' name='fieldValue' value={this.props.fieldValue} placeholder='头信息' callback={this.setFieldValue} />
				</div>
				<div>
					<Select width='100' name='fieldType' index={this.props.fieldType} options={this.fieldType} callback={this.setFieldType} />
				</div>
				<div className={requestHeaderStyle.optionCol}>
					<div onClick={this.props.addRequestHeader.bind(null, this.props.index)}>{this.renderIcon('add', '添加')}</div>
					<div onClick={this.props.deleteRequestHeader.bind(null, this.props.index)}>{this.renderIcon('remove', '移除')}</div>
				</div>
			</div>
		);
	}
}