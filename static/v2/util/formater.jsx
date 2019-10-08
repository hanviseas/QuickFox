import $ from 'jquery';

/**
 * JSON格式化
 * @param data 格式化数据
 * @param space 预留空白空间
 * @return result 格式化输出结果
 */
export function json_formater(data, space) {
	if (data.toString().trim() === '') { // 空字符串不做处理
		return '';
	}
	try {
		data = $.parseJSON(data.toString().trim());
	} catch (e) {
		return '<span>系统提示：非JSON格式字符串</span>';
	}
	const unitSpace = '<span style="margin-left:30px;"></span>'; // 单位空白
	const indentation = space; // 缩进空白
	let result = indentation + '<span>{</span><br/>';
	for (let key in data) {
		result += space + unitSpace + '<span style="color:#dd1c5d;">' + key.toString().htmlspecials() + '</span><span> : </span>';
		if (data[key] === null) {
			result += '<span style="color:#83b844;">null</span><br/>';
		} else if (data[key] instanceof Object) {
			result += '<br/>' + json_formater(JSON.stringify(data[key]), space + unitSpace + unitSpace);
		} else {
			result += '<span style="color:#83b844;">' + data[key].toString().htmlspecials() + '</span><br/>';
		}
	};
	result += indentation + '<span>}</span><br/>';
	return result;
}

/**
 * XML格式化
 * @param data 格式化数据
 * @param space 预留空白空间
 * @return result 格式化输出结果
 */
export function xml_formater(data, space) {
	if (data.toString().trim() === '') { // 空字符串不做处理
		return '';
	}
	try {
		data = $.parseXML(data.toString().trim());
	} catch (e) {
		return '<span>系统提示：非XML格式字符串</span>';
	}
	const unitSpace = '<span style="margin-left:30px;"></span>'; // 单位空白
	const indentation = space; // 缩进空白
	let result = indentation + '<span>&lt;</span><span style="color:#dd1c5d;">' + data.all[0].tagName.htmlspecials() + '</span>' + xml_attribute_formater(data.all[0]) + '<span>&gt;</span><br/>';
	for (let i = 0; i < data.all[0].children.length; i++) {
		const node = data.all[0].children[i];
		if (node.children.length > 0) {
			result += xml_formater((new XMLSerializer()).serializeToString(node), space + unitSpace);
		} else {
			result += space + unitSpace + '<span>&lt;</span><span style="color:#dd1c5d;">' + node.tagName.htmlspecials() + '</span>' + xml_attribute_formater(node) + '<span>&gt;</span><br/>';
			result += space + unitSpace + unitSpace + '<span>' + node.innerHTML.htmlspecials() + '</span><br/>';
			result += space + unitSpace + '<span>&lt;</span><span style="color:#dd1c5d;">/' + node.tagName.htmlspecials() + '</span><span>&gt;</span><br/>';
		}
	};
	result += indentation + '<span>&lt;</span><span style="color:#dd1c5d;">/' + data.all[0].tagName.htmlspecials() + '</span><span>&gt;</span><br/>';
	return result;
}

/**
 * XML属性格式化
 * @param node 节点元素
 * @return result 格式化输出结果
 */
export function xml_attribute_formater(node) {
	let result = '';
	for (let i = 0; i < node.attributes.length; i++) {
		result += ' <span style="color:#f2b606;">' + node.attributes[i].name.toString().htmlspecials() + '</span><span>="</span><span  style="color:#83b844;">' + node.attributes[i].value.toString().htmlspecials() + '</span><span>"</span>';
	}
	return result;
}