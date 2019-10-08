import { combineReducers } from 'redux';

const shade = (state = false, action) => { // 处理遮罩
	switch (action.type) {
		case 'SET_SHADE':
			return action.shade;
			break;
		default:
			return state;
	}
}

const information = (state = null, action) => { // 处理通知
	switch (action.type) {
		case 'SET_INFORMATION':
			return action.information;
			break;
		default:
			return state;
	}
}

const globalData = (state = {}, action) => { // 处理全局数据
	switch (action.type) {
		case 'SET_GLOBAL_DATA':
			return action.globalData;
			break;
		default:
			return state;
	}
}

const pageTitle = (state = '', action) => { // 处理页面标题
	switch (action.type) {
		case 'SET_PAGE_TITLE':
			return action.pageTitle;
			break;
		default:
			return state;
	}
}

const activeIndex = (state = 0, action) => { // 处理页面标题
	switch (action.type) {
		case 'SET_ACTIVE_INDEX':
			return action.activeIndex;
			break;
		default:
			return state;
	}
}

const reducer = combineReducers({
	shade,
	information,
	globalData,
	pageTitle,
	activeIndex,
});

export default reducer;