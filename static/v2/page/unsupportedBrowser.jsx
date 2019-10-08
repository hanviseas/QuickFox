import React from 'react';
import Button from '../component/button.jsx';
import unsupportedBrowserStyle from './unsupportedBrowser.css';

export default class UnsupportedBrowser extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={unsupportedBrowserStyle.message}>
				<div>
					<img src='/static/img/v2/public/unsupported-browser.png' />
				</div>
				<div>
					<Button size='big' text='返回首页' onClick={() => { window.location.href = '/' }} />
				</div>
			</div>
		);
	}
}