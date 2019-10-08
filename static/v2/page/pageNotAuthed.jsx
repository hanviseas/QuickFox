import React from 'react';
import Button from '../component/button.jsx';
import pageNotAuthedStyle from './pageNotAuthed.css';

export default class PageNotAuthed extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={pageNotAuthedStyle.message}>
				<div>
					<img src='/static/img/v2/public/page-not-authed.png' />
				</div>
				<div>
					<Button size='big' text='返回首页' onClick={() => { window.location.href = '/' }} />
				</div>
			</div>
		);
	}
}