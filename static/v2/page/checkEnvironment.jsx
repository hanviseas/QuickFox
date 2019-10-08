import React from 'react';
import { domainPath } from '../config/system.jsx';
import Button from '../component/button.jsx';
import checkEnvironmentStyle from './checkEnvironment.css';

export default class CheckEnvironment extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			database: '', // 数据库连接
			curlModule: '', // Curl模块
			socketsModule: '', // Sockets模块
		}
		this.fetchEnvironments = this.fetchEnvironments.bind(this);
	}

	componentWillMount() {
		this.fetchEnvironments();
	}

	/**
	 * 获取环境信息
	 */
	fetchEnvironments() {
		const _this = this;
		const result = fetch(`${domainPath}/v2/get/etc/environments`, {
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
				database: json.database,
				curlModule: json.curl_module,
				socketsModule: json.sockets_module,
			});
		}).catch(function (e) {
			console.log(e);
		});
	}

	render() {
		const databasePassStatusStyle = this.state.database === 1 ? checkEnvironmentStyle.passed : checkEnvironmentStyle.failed;
		const curlModulePassStatusStyle = this.state.curlModule === 1 ? checkEnvironmentStyle.passed : checkEnvironmentStyle.failed;
		const socketsModulePassStatusStyle = this.state.socketsModule === 1 ? checkEnvironmentStyle.passed : checkEnvironmentStyle.failed;
		return (
			<div className={checkEnvironmentStyle.checkList}>
				<div className={checkEnvironmentStyle.title}><span>环境检查</span></div>
				<div className={`${checkEnvironmentStyle.checkItem} ${databasePassStatusStyle}`}><span>1. 数据库连接················································</span></div>
				<div className={`${checkEnvironmentStyle.checkItem} ${curlModulePassStatusStyle}`}><span>2. PHP-Curl模块················································</span></div>
				<div className={`${checkEnvironmentStyle.checkItem} ${socketsModulePassStatusStyle}`}><span>3. PHP-Sockets模块··········································</span></div>
				<div className={checkEnvironmentStyle.button}>
					<Button size='big' text='返回首页' onClick={() => { window.location.href = '/' }} />
				</div>
			</div>
		);
	}
}