import React from 'react';
import { connect } from 'react-redux';
import globalStyle from '../public/global.css';
import informationStyle from './information.css';

class Information extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			informations: new Map(), // 消息列表
		};
		this.removeInformation = this.removeInformation.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.information === null) { // 空通知不做处理
			return;
		}
		const informationKey = Date.parse(new Date()) + Math.random() * 10 + Math.random() * 10 + Math.random() * 10; // 使用时间戳加3位随机数做索引
		this.state.informations.set(informationKey, nextProps.information); // 写入通知
		this.setState({ // 通知更新
			informations: this.state.informations,
		}, () => {
			setInterval(() => {
				this.state.informations.delete(informationKey);
				this.setState({ // 通知更新
					informations: this.state.informations,
				});
			}, 5000); // 5秒后清除通知
		});
	}

	/**
	 * 移除通知
	 * @param key 通知索引
	 */
	removeInformation(key) {
		this.state.informations.delete(key);
		this.setState({ // 通知更新
			informations: this.state.informations,
		});
	}

	render() {
		return (
			<div className={informationStyle.board}>
				{
					[...this.state.informations.keys()].map((key) => {
						let statusClassName = informationStyle.success;
						switch (this.state.informations.get(key).type) {
							case 1:
								statusClassName = informationStyle.success;
								break;
							case 0:
								statusClassName = informationStyle.error;
								break;
						}
						return (
							<div key={key} className={statusClassName}>
								<span className={globalStyle.autoHidden}>{this.state.informations.get(key).content}</span>
								<img src='/static/img/v2/component/close.png' onClick={this.removeInformation.bind(null, key)} />
							</div>
						);
					})
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		information: state.information || null,
	};
}

export default connect(
	mapStateToProps
)(Information);