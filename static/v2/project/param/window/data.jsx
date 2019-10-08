import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import { encodeParams } from '../../../util/http.jsx';
import { dataSource } from '../../../config/common.jsx';
import Window from '../../../component/window.jsx';
import Select from '../../../component/select.jsx';
import Input from '../../../component/input.jsx';
import Textarea from '../../../component/textarea.jsx';
import Button from '../../../component/button.jsx';
import dataStyle from './data.css';

class DataWindow extends React.Component {

	static defaultProps = {
		id: 0, // 数据源ID
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.state = {
			dataSource: 'mysql', // 数据源
			dataKeyword: '', // 配置关键字
			dataValue: '', // 配置值
			dataComment: '', // 数据源备注
		};
		this.fetchData = this.fetchData.bind(this);
		this.setDataSource = this.setDataSource.bind(this);
		this.setDataKeyword = this.setDataKeyword.bind(this);
		this.setDataValue = this.setDataValue.bind(this);
		this.setDataComment = this.setDataComment.bind(this);
		this.saveData = this.saveData.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.displayed) {
			this.setState({
				dataSource: 'mysql',
				dataKeyword: '',
				dataValue: '',
				dataComment: '',
			}, () => { this.fetchData() });
		}
	}

	/**
	 * 获取数据源信息
	 */
	fetchData() {
		if (this.props.id === 0) { // 无id属性传入时，代表新建，无需获取信息
			return;
		}
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/data/${this.props.id}`, {
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
				dataSource: json.source,
				dataKeyword: json.keyword,
				dataValue: json.value,
				dataComment: json.comment,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 设置数据源
	 * @param source 数据源
	 */
	setDataSource(source) {
		this.setState({
			dataSource: source.index,
		});
	}

	/**
	 * 设置配置关键字
	 * @param keyword 配置关键字
	 */
	setDataKeyword(keyword) {
		this.setState({
			dataKeyword: keyword,
		});
	}

	/**
	 * 设置配置值
	 * @param value 配置值
	 */
	setDataValue(value) {
		this.setState({
			dataValue: value,
		});
	}

	/**
	 * 设置数据源备注
	 * @param comment 数据源备注
	 */
	setDataComment(comment) {
		this.setState({
			dataComment: comment,
		});
	}

	/**
	 * 保存数据源
	 */
	saveData() {
		if (this.state.dataKeyword.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '配置关键字不能为空' },
			}); // 发送通知
			return;
		}
		if (this.state.dataValue.trim() === '') { // 参数检查
			this.props.dispatch({
				type: 'SET_INFORMATION',
				information: { type: 0, content: '配置值不能为空' },
			}); // 发送通知
			return;
		}
		const _this = this;
		if (this.props.id > 0) { // 更新数据源
			const result = fetch(`${domainPath}/v2/post/api/data/${this.props.id}`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					data_source: this.state.dataSource,
					data_keyword: this.state.dataKeyword,
					data_value: this.state.dataValue,
					data_comment: this.state.dataComment,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				if (json.code === '000000') { // 请求成功
					_this.props.callback.bind(null, _this.state.dataSource, _this.state.dataKeyword, _this.state.dataComment)();
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
		} else { // 新建数据源
			const result = fetch(`${domainPath}/v2/put/api/data`, {
				method: 'post',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: encodeParams({
					environment_id: this.props.environmentId,
					data_source: this.state.dataSource,
					data_keyword: this.state.dataKeyword,
					data_value: this.state.dataValue,
					data_comment: this.state.dataComment,
				}),
			});
			result.then(function (response) {
				// console.log(response);
				return response.json();
			}).then(function (json) {
				if (json.code === '000000') { // 请求成功
					_this.props.callback.bind(null, Number.parseInt(json.message), _this.state.dataSource, _this.state.dataKeyword, _this.state.dataComment)();
					_this.props.dispatch({
						type: 'SET_INFORMATION',
						information: { type: 1, content: `数据源创建成功：${json.message}` },
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
			<Window displayed={this.props.displayed} height='520' title={this.props.id === 0 ? '创建数据源' : '更新数据源'} submitHandler={<Button text='保存' callback={this.saveData} />} closeWindow={this.props.closeWindow}>
				<div>
					<Select width='500' name='dataSource' index={this.state.dataSource} options={dataSource} required={true} callback={this.setDataSource} />
				</div>
				<div>
					<Input width='500' name='dataKeyword' value={this.state.dataKeyword} maxLength='30' placeholder='配置关键字，如：product' required={true} callback={this.setDataKeyword} />
				</div>
				<div>
					<Textarea width='500' name='dataValue' value={this.state.dataValue} placeholder='配置值，如：server=myserver;database=mydb;user=admin;password=123456;charset=utf8' required={true} callback={this.setDataValue} />
				</div>
				<div>
					<Input width='500' name='dataComment' value={this.state.dataComment} maxLength='30' placeholder='备注信息' callback={this.setDataComment} />
				</div>
			</Window>
		);
	}
}

export default connect()(DataWindow);