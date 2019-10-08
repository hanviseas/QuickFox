import React from 'react';
import Button from '../component/button.jsx';
import pageNotFoundStyle from './pageNotFound.css';

export default class PageNotFound extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={pageNotFoundStyle.message}>
				<div>
					<img src='/static/img/v2/public/page-not-found.png' />
				</div>
				<div>
					<Button size='big' text='返回首页' onClick={() => { window.location.href = '/' }} />
				</div>
			</div>
		);
	}
}