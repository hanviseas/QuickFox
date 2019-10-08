import React from 'react';
import { connect } from 'react-redux';
import { domainPath } from '../../../config/system.jsx';
import Window from '../../../component/window.jsx';
import Select from '../../../component/select.jsx';
import Input from '../../../component/input.jsx';
import Button from '../../../component/button.jsx';
import saveStyle from './save.css';

class SaveWindow extends React.Component {

	static defaultProps = {
		id: 0, // 数据源ID
		spaceId: 0, // 空间ID
		moduleId: 0, // 模块ID
		caseId: 0, // 用例ID
		itemName: '', // 接口名称
		caseName: '', // 用例名称
		displayed: false, // 显示状态
		callback: () => { }, // 回调函数
		closeWindow: () => { }, // 关闭窗口
	};

	constructor(props) {
		super(props);
		this.defaultModuleOption = {
			index: 0,
			value: '不设置模块',
		}; // 默认模块选项
		this.state = {
			spaces: [], // 空间数据
			modules: [], // 模块数据
			spaceId: this.props.spaceId, // 空间ID
			moduleId: this.props.moduleId, // 模块ID
			caseId: this.props.caseId, // 用例ID
			itemName: this.props.itemName, // 接口名称
			caseName: this.props.caseName, // 用例名称
		};
		this.fetchSpaces = this.fetchSpaces.bind(this);
		this.fetchModules = this.fetchModules.bind(this);
		this.switchSpace = this.switchSpace.bind(this);
		this.switchModule = this.switchModule.bind(this);
		this.setItemName = this.setItemName.bind(this);
		this.setCaseName = this.setCaseName.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			spaces: [],
			modules: [],
			spaceId: nextProps.spaceId,
			moduleId: nextProps.moduleId,
			caseId: nextProps.caseId,
			itemName: nextProps.itemName,
			caseName: nextProps.caseName,
		}, () => { this.fetchSpaces() });
	}

	/**
	 * 获取空间数据
	 */
	fetchSpaces() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/spaces`, {
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
			let spaces = [];
			json.map((space) => {
				spaces.push({
					index: Number.parseInt(space.id),
					value: space.name,
				});
			});
			_this.setState({
				spaces: spaces,
			}, () => { _this.fetchModules() });
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 获取模块数据
	 */
	fetchModules() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/api/space/${this.state.spaceId}/modules`, {
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
			let modules = [_this.defaultModuleOption];
			json.map((module) => {
				modules.push({
					index: Number.parseInt(module.id),
					value: module.name,
				});
			});
			_this.setState({
				modules: modules,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	/**
	 * 切换空间
	 * @param space 空间信息
	 */
	switchSpace(space) {
		this.setState({
			modules: [],
			spaceId: space.index,
		}, () => {
			this.switchModule(this.defaultModuleOption);
			this.fetchModules(space.index);
		}); // 切换空间时更新模块列表
	}

	/**
	 * 切换模块
	 * @param module 模块信息	 
	 */
	switchModule(module) {
		this.setState({
			moduleId: module.index,
		});
	}

	/**
	 * 设置接口名称
	 * @param name 接口名称
	 */
	setItemName(name) {
		this.setState({
			itemName: name,
		});
	}

	/**
	 * 设置用例名称
	 * @param name 用例名称
	 */
	setCaseName(name) {
		this.setState({
			caseName: name,
		});
	}

	render() {
		return (
			<Window displayed={this.props.displayed} height='430' title='保存用例' submitHandler={<Button text='保存' callback={this.props.callback.bind(null, this.state.spaceId, this.state.moduleId, this.state.itemName, this.state.caseName)} />} closeWindow={this.props.closeWindow}>
				<div>
					<Select width='500' name='spaceId' index={this.state.spaceId} options={this.state.spaces} disabled={this.props.caseId === 0 ? false : true} callback={this.switchSpace} />
				</div>
				<div>
					<Select width='500' name='moduleId' index={this.state.moduleId} options={this.state.modules} disabled={this.props.caseId === 0 ? false : true} callback={this.switchModule} />
				</div>
				<div>
					<Input width='500' name='itemName' value={this.state.itemName} maxLength='30' placeholder='接口名称' required={true} disabled={this.props.caseId === 0 ? false : true} callback={this.setItemName} />
				</div>
				<div>
					<Input width='500' name='caseName' value={this.state.caseName} maxLength='30' placeholder='用例名称' disabled={this.props.caseId === 0 ? false : true} callback={this.setCaseName} />
				</div>
			</Window>
		);
	}
}

export default connect()(SaveWindow);