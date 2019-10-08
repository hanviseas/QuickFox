import React from 'react';
import Window from '../window.jsx';
import suiteStyle from './suite.css';

export default class Suite extends React.Component {

	static defaultProps = {
		tabs: [], // 选项卡数据
		callback: () => { }, // 回调函数
	};

	constructor(props) {
		super(props);
		this.state = {
			currentIndex: this.props.tabs.length > 0 ? this.props.tabs[0].index : '', // 当前菜单索引（默认选中第一个）
		};
		this.setCurrentIndex = this.setCurrentIndex.bind(this);
	}

	/**
	 * 设置当前选项卡索引
	 * @param index 索引
	 */
	setCurrentIndex(index) {
		this.setState({
			currentIndex: index,
		}, () => {
			this.props.callback.bind(null, index)(); // 索引值传到回调函数
		});
	}

	render() {
		if (!this.props.displayed) { // 非显示状态返回空
			return null;
		}
		const _this = this;
		return (
			<Window {...this.props}>
				<div className={suiteStyle.content}>
					<div>
						{
							this.props.tabs.map((tab) => {
								return (
									<div key={tab.index} className={`${suiteStyle.tab} ${tab.index === _this.state.currentIndex ? suiteStyle.selected : ''}`} onClick={this.setCurrentIndex.bind(null, tab.index)}>
										<img src={tab.index === _this.state.currentIndex ? tab.icon.replace('.png', '-actived.png') : tab.icon} />
										<span>{tab.name}</span>
									</div>
								);
							})
						}
					</div>
					<div>
						{
							React.Children.map(this.props.children, function (child) {
								if (child.props.name === _this.state.currentIndex) {
									return child;
								}
							})
						}
					</div>
				</div>
			</Window>
		);
	}
}