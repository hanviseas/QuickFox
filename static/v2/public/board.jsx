import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { domainPath } from '../config/system.jsx';
import New from '../start/new.jsx';
import Task from '../start/task.jsx';
import Report from '../start/report.jsx';
import Space from '../project/space.jsx';
import Environment from '../project/environment.jsx';
import Interface from '../project/interface.jsx';
import Document from '../project/document.jsx';
import Param from '../project/param.jsx';
import Account from '../user/account.jsx';
import Permission from '../user/permission.jsx';
import Set from '../system/set.jsx';
import Application from '../system/application.jsx';
import Log from '../system/log.jsx';
import Info from '../system/info.jsx';
import Profile from '../home/profile.jsx';
import frameStyle from './frame.css';

class Board extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const scrollHidden = this.props.shade ? frameStyle.scrollHidden : '';
		return (
			<div className={`${frameStyle.board} ${scrollHidden}`}>
				<div>
					<Switch>
						<Route exact path={domainPath + '/v2/u/new'} component={New} /> {/* 新的测试 */}
						<Route excat path={domainPath + '/v2/u/load/:caseId'} component={New} /> {/* 载入测试 */}
						<Route exact path={domainPath + '/v2/u/task'} component={Task} /> {/* 定时任务 */}
						<Route exact path={domainPath + '/v2/u/report'} component={Report} /> {/* 任务报告 */}
						<Route exact path={domainPath + '/v2/u/space'} component={Space} /> {/* 项目空间 */}
						<Route exact path={domainPath + '/v2/u/environment'} component={Environment} /> {/* 测试环境 */}
						<Route exact path={domainPath + '/v2/u/interface'} component={Interface} /> {/* 接口用例 */}
						<Route exact path={domainPath + '/v2/u/document'} component={Document} /> {/* 接口文档 */}
						<Route exact path={domainPath + '/v2/u/param'} component={Param} /> {/* 参数配置 */}
						<Route exact path={domainPath + '/v2/u/account'} component={Account} /> {/* 用户帐号 */}
						<Route exact path={domainPath + '/v2/u/permission'} component={Permission} /> {/* 应用权限 */}
						<Route exact path={domainPath + '/v2/u/set'} component={Set} /> {/* 全局设置 */}
						<Route exact path={domainPath + '/v2/u/application'} component={Application} /> {/* 应用接入 */}
						<Route exact path={domainPath + '/v2/u/log'} component={Log} /> {/* 操作日志 */}
						<Route exact path={domainPath + '/v2/u/info'} component={Info} /> {/* 系统信息 */}
						<Route exact path={domainPath + '/v2/u/profile'} component={Profile} /> {/* 个人中心 */}
						<Route exact path={domainPath + '/v2/u'} component={New} /> {/* 管理后台默认页面 */}
						<Route exact path={domainPath + '/'} component={New} /> {/* 默认页面 */}
						<Route exact path='/' component={New} /> {/* 默认页面 */}
						<Redirect to={domainPath + '/404'} /> {/* 404页面 */}
					</Switch>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		shade: state.shade,
	};
}

export default withRouter(connect(
	mapStateToProps
)(Board));