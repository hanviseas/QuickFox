import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import Window from '../../../component/window.jsx';
import Input from '../../../component/input.jsx';
import Button from '../../../component/button.jsx';
import paramStyle from './param.css';

class ParamWindow extends React.Component {

	static defaultProps = {
		id: 0, // 参数ID
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.state = {
			paramKeyword: '', // 参数关键字
			paramValue: '', // 参数值
			paramComment: '', // 参数备注
		};
		this.fetchParam = this.fetchParam.bind(this);
		this.setParamKeyword = this.setParamKeyword.bind(this);
		this.setParamValue = this.setParamValue.bind(this);
		this.setParamComment = this.setParamComment.bind(this);
		this.saveParam = this.saveParam.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.setState({
				paramKeyword: '',
				paramValue: '',
				paramComment: '',
			}, () => { this.fetchParam() });
		}
	}

	/**
	 * 获取参数信息
	 */
	fetchParam() {
		if (this.props.id === 0) { // 无id属性传入时，代表新建，无需获取信息
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/param/${this.props.id}`, {
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
				paramKeyword: json.keyword,
				paramValue: json.value,
				paramComment: json.comment,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 设置参数关键字
	 * @param keyword 参数关键字
	 */
	setParamKeyword(keyword) {
		this.setState({
			paramKeyword: keyword,
		});
	}

	/**
	 * 设置参数值
	 * @param value 参数值
	 */
	setParamValue(value) {
		this.setState({
			paramValue: value,
		});
	}

	/**
	 * 设置参数备注
	 * @param comment 参数备注
	 */
	setParamComment(comment) {
		this.setState({
			paramComment: comment,
		});
	}

	/**
	 * 保存参数
	 */
	saveParam() {
		if (this.state.paramKeyword.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '参数关键字不能为空' },
			}); // 发送通知
			return;
		}
		const _this = this;
		if (this.props.id > 0) { // 更新参数
			const result = fetch(`${domainPath}/v2/post/api/param/${this.props.id}`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					param_keyword: this.state.paramKeyword,
					param_value: this.state.paramValue,
					param_comment: this.state.paramComment,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				if (json.code === '000000') { // 请求成功
					_this.props.callback.bind(null, _this.state.paramKeyword, _this.state.paramValue, _this.state.paramComment)();
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
		} else { // 新建参数
			const result = fetch(`${domainPath}/v2/put/api/param`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					environment_id: this.props.environmentId,
					param_keyword: this.state.paramKeyword,
					param_value: this.state.paramValue,
					param_comment: this.state.paramComment,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				if (json.code === '000000') { // 请求成功
					_this.props.callback.bind(null, Number.parseInt(json.message), _this.state.paramKeyword, _this.state.paramValue, _this.state.paramComment)();
					_this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 1, content: `参数创建成功：${json.message}` },
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
	}

	render() {
		return (
			<Window displayed={this.props.displayed} height='370' title={this.props.id === 0 ? '创建参数' : '更新参数'} submitHandler={<Button text='保存' callback={this.saveParam} />} closeWindow={this.props.closeWindow}>
				<div>
					<Input width='500' name='paramKeyword' value={this.state.paramKeyword} maxLength='30' placeholder='参数关键字，如：domain' required={true} callback={this.setParamKeyword} />
				</div>
				<div>
					<Input width='500' name='paramValue' value={this.state.paramValue} placeholder='参数值，如：http://www.lazybug.cn/' callback={this.setParamValue} />
				</div>
				<div>
					<Input width='500' name='paramComment' value={this.state.paramComment} maxLength='30' placeholder='备注信息' callback={this.setParamComment} />
				</div>
			</Window>
		);
	}
}

export default connect()(ParamWindow);