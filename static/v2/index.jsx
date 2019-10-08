import React from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';
import Body from './public/frame.jsx';
import './public/global.css';

$(document).ready(function () {
	ReactDom.render(<Body />, $('#_div_lb_frame_body').get(0));
});