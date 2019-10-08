import { domainPath } from './system.jsx';
import frameStyle from '../public/frame.css';

export const menuItems = {
	_new: {
		index: 11,
		name: '新的测试',
		target: domainPath + '/v2/u/new',
		icon: frameStyle.iconNew,
		auth: 'V2.Page.User.New',
	},
	_task: {
		index: 12,
		name: '定时任务',
		target: domainPath + '/v2/u/task',
		icon: frameStyle.iconTask,
		auth: 'V2.Page.User.Task',
	},
	_report: {
		index: 13,
		name: '任务报告',
		target: domainPath + '/v2/u/report',
		icon: frameStyle.iconReport,
		auth: 'V2.Page.User.Report',
	},
	_environment: {
		index: 21,
		name: '测试环境',
		target: domainPath + '/v2/u/environment',
		icon: frameStyle.iconEnvironment,
		auth: 'V2.Page.User.Environment',
	},
	_param: {
		index: 22,
		name: '环境参数',
		target: domainPath + '/v2/u/param',
		icon: frameStyle.iconParam,
		auth: 'V2.Page.User.Param',
	},
	_space: {
		index: 23,
		name: '项目空间',
		target: domainPath + '/v2/u/space',
		icon: frameStyle.iconSpace,
		auth: 'V2.Page.User.Space',
	},
	_interface: {
		index: 24,
		name: '接口用例',
		target: domainPath + '/v2/u/interface',
		icon: frameStyle.iconInterface,
		auth: 'V2.Page.User.Interface',
	},
	_document: {
		index: 25,
		name: '接口文档',
		target: domainPath + '/v2/u/document',
		icon: frameStyle.iconDocument,
		auth: 'V2.Page.User.Document',
	},
	_account: {
		index: 31,
		name: '用户帐号',
		target: domainPath + '/v2/u/account',
		icon: frameStyle.iconAccount,
		auth: 'V2.Page.User.Account',
	},
	_permission: {
		index: 32,
		name: '应用权限',
		target: domainPath + '/v2/u/permission',
		icon: frameStyle.iconPermission,
		auth: 'V2.Page.User.Permission',
	},
	_set: {
		index: 41,
		name: '全局设置',
		target: domainPath + '/v2/u/set',
		icon: frameStyle.iconSet,
		auth: 'V2.Page.User.Set',
	},
	_application: {
		index: 42,
		name: '应用接入',
		target: domainPath + '/v2/u/application',
		icon: frameStyle.iconApplication,
		auth: 'V2.Page.User.Application',
	},
	_log: {
		index: 43,
		name: '操作日志',
		target: domainPath + '/v2/u/log',
		icon: frameStyle.iconLog,
		auth: 'V2.Page.User.Log',
	},
	_info: {
		index: 44,
		name: '系统信息',
		target: domainPath + '/v2/u/info',
		icon: frameStyle.iconInfo,
		auth: 'V2.Page.User.Info',
	},
}

export default [{
	name: '开始',
	index: 10,
	items: [menuItems._new, menuItems._task, menuItems._report],
},
{
	name: '项目',
	index: 20,
	items: [menuItems._environment, menuItems._param, menuItems._space, menuItems._interface, menuItems._document],
},
{
	name: '用户',
	index: 30,
	items: [menuItems._account, menuItems._permission],
},
{
	name: '系统',
	index: 40,
	items: [menuItems._set, menuItems._application, menuItems._log, menuItems._info],
},
];