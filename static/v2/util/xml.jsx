/**
 * 根据标签名获取节点值
 * @param xmlDoc XML文档
 * @param tagName 标签名
 * @param index 索引值
 * @return value 节点值
*/
export function getNodeValueByTag(xmlDoc, tagName, index = 0) {
    const tag = xmlDoc.getElementsByTagName(tagName)[index];
    if (tag === undefined) { // 标签不存在
        return '';
    }
    const child = tag.childNodes[0];
    if (child === undefined) { // 标签无内容
        return '';
    }
    return child.nodeValue;
}