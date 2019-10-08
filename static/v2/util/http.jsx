/**
 * 对参数集进行URI编码
 * @param params 参数集
 * @return URI 编码地址
*/
export function encodeParams(params) {
    if (!params instanceof Object) {
        return '';
    }
    let result = '';
    for (const key of Object.keys(params)) {
        if (params[key] === null || params[key] === undefined || params['key'] === NaN) { // 异常值置为空值
            params[key] = '';
        }
        result += `${key}=${encodeURIComponent(params[key])}&`;
    }
    return result.substring(0, result.length - 1);
}