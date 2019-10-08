import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom';
import { domainPath } from '../config/system.jsx';
import reducer from './reducer.jsx';
import Login from './login.jsx';
import Config from '../page/config.jsx';
import PageNotAuthed from '../page/pageNotAuthed.jsx';
import PageNotFound from '../page/pageNotFound.jsx';
import UnsupportedBrowser from '../page/unsupportedBrowser.jsx';
import checkEnvironment from '../page/checkEnvironment.jsx';
import Teambition from '../third/teambition.jsx';
import Background from './background.jsx';

/**
 * 浏览器检测
 */
(function () {
	var path_name = window.document.location.pathname;
	var user_agent = navigator.userAgent;
	if (/(Trident|MSIE)/.test(user_agent)) {
		path_name === domainPath + '/browser' || (window.location.href = domainPath + '/browser');
	} else {
		path_name === domainPath + '/browser' && (window.location.href = domainPath);
	}
})();

/**
 * 字符串正则替换
 */
String.prototype.replaceAll = function (s1, s2) {
	return this.replace(new RegExp(s1, 'gm'), s2);
}

/**
 * 字符串指定长度截取
 */
String.prototype.limit = function (length) {
	var string = this.toString();
	return string.length > length ? string.substring(0, length) + '...' : string;
}

/**
 * HTML特殊字符转义
 */
String.prototype.htmlspecials = function () {
	let string = this.toString();
	if (string.length > 0) {
		string = string.replaceAll('&', '&amp;');
		string = string.replaceAll('>', '&gt;');
		string = string.replaceAll('<', '&lt;');
		string = string.replaceAll(String.valueOf(39), '\'');
		string = string.replaceAll(String.valueOf(34), '&quot;');
	}
	return string;
}

export default class Body extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const store = createStore(reducer);
		return (
			<Provider store={store}>
				<BrowserRouter>
					<Switch>
						<Route exact path={domainPath + '/config'} component={Config} /> {/* 配置页面 */}
						<Route exact path={domainPath + '/403'} component={PageNotAuthed} /> {/* 403页面 */}
						<Route exact path={domainPath + '/404'} component={PageNotFound} /> {/* 404页面 */}
						<Route exact path={domainPath + '/browser'} component={UnsupportedBrowser} /> {/* 浏览器不支持页面 */}
						<Route exact path={domainPath + '/check'} component={checkEnvironment} /> {/* 环境检查页面 */}
						<Route exact path={domainPath + '/v2/g/login'} component={Login} /> {/* 登录页面 */}
						<Route exact path={domainPath + '/v2/g/third/teambition'} component={Teambition} /> {/* Teambition登录页面 */}
						<Route exact path={domainPath + '/v2/u/*'} component={Background} /> {/* 管理后台 */}
						<Route exact path={domainPath + '/v2/u'} component={Background} /> {/* 管理后台默认页面 */}
						<Route exact path={domainPath + '/'} component={Background} /> {/* 默认页面 */}
						<Route exact path='/' component={Background} /> {/* 默认页面 */}
						<Redirect to={domainPath + '/404'} /> {/* 404页面 */}
					</Switch>
				</BrowserRouter>
			</Provider>
		);
	}
}