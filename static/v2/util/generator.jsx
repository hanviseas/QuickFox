/**
 * 生成随机字符串
 * @param length 字符串长度
 * @return string 随机字符串
*/
export function generateRandString(length) {
    length = Number.parseInt(length) ? Number.parseInt(length) : 32;
    const $chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZ1234567890';
    let randString = '';
    for (let i = 0; i < length; i++) {
        randString += $chars.charAt(Math.floor(Math.random() * $chars.length));
    }
    return randString;
}