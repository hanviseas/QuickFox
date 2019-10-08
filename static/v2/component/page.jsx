import React from 'react';
import $ from 'jquery';
import pageStyle from './page.css';

export default class Page extends React.Component {

	static defaultProps = {
		maxPageNumber: 1, // 最大页数
		currentPageNumber: 1, // 当前页号
		callback: () => { }, // 回调函数
	};

	constructor(props) {
		super(props);
		this.state = {
			currentPageNumber: this.props.currentPageNumber, // 当前页号
		};
		this.jumpTo = this.jumpTo.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			maxPageNumber: nextProps.maxPageNumber,
			currentPageNumber: nextProps.currentPageNumber,
		});
	}

	/**
	 * 激活图标
	 */
	activateIcon(event) {
		$(event.currentTarget).attr('src', $(event.currentTarget).attr('src').replace('.png', '-actived.png'));
	}

	/**
	 * 不激活图标
	 */
	deactivateIcon(event) {
		$(event.currentTarget).attr('src', $(event.currentTarget).attr('src').replace('-actived.png', '.png'));
	}

	/**
	 * 跳转到指定页号
	 * @param page 目标页号
	 */
	jumpTo(page) {
		page > this.props.maxPageNumber && (page = this.props.maxPageNumber); // 超过最大页数，则跳转到最大页号
		page < 1 && (page = 1); // 低于最小页数，则跳转到最小页号
		this.setState({
			currentPageNumber: page,
		}, () => {
			this.props.callback.bind(null, page)(); // 页号传到回调函数
		});
	}

	render() {
		let minPageNumber = 1;
		let maxPageNumber = 1;
		if (this.props.maxPageNumber <= 10) { // 总页数在10页之内的，显示页号区间为[1-最大页号]
			maxPageNumber = this.props.maxPageNumber;
		} else { // 总页数超过10页
			if (this.state.currentPageNumber > 5) { // 当前页号大于5
				if (this.props.maxPageNumber - this.state.currentPageNumber > 5) { // 最大页号与当前页号相差大于5，显示页号区间为[当前页号-4，当前页号+5]
					minPageNumber = this.state.currentPageNumber - 4;
					maxPageNumber = this.state.currentPageNumber + 5;
				} else { // 最大页号与当前页号相差小等于5，显示页号区间为[最大页号-9，最大页号]
					minPageNumber = this.props.maxPageNumber - 9;
					maxPageNumber = this.props.maxPageNumber;
				}
			} else { // 当前页号小于5，最小显示页号为1，最大显示页号为10
				maxPageNumber = 10;
			}
		}
		let pageArray = []; // 将最小到最大页数之间的所有页号存成数组
		for (let i = minPageNumber; i <= maxPageNumber; i++) {
			pageArray.push(i);
		}
		return (
			<div className={pageStyle.pageList}>
				<a href='javascript:void(0);' onClick={this.jumpTo.bind(null, 1)}>
					<img title='第一页' src='/static/img/v2/component/first.png' onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon} />
				</a>
				<a href='javascript:void(0);' onClick={this.jumpTo.bind(null, this.state.currentPageNumber - 1)}>
					<img title='上一页' src='/static/img/v2/component/previous.png' onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon} />
				</a>
				{
					pageArray.map((page) => {
						const selectStateClassName = (page === this.state.currentPageNumber) ? pageStyle.selected : '';
						return <a key={page} href='javascript:void(0);' onClick={this.jumpTo.bind(null, page)}><span className={selectStateClassName}>{page}</span></a>
					})
				}
				<a href='javascript:void(0);' onClick={this.jumpTo.bind(null, this.state.currentPageNumber + 1)}>
					<img title='下一页' src='/static/img/v2/component/next.png' onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon} />
				</a>
				<a href='javascript:void(0);' onClick={this.jumpTo.bind(null, this.props.maxPageNumber)}>
					<img title='最后一页' src='/static/img/v2/component/last.png' onMouseEnter={this.activateIcon} onMouseLeave={this.deactivateIcon} />
				</a>
			</div>
		);
	}
}