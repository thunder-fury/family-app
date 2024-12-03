/**
 *
 * @param str
 * @returns
 * 함수 사용법 : generateUniqueId(str)
 * 유니크한 아이디를 생성.
 */
const generateUniqueId = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `id-${hash.toString(16)}`;
}

export default generateUniqueId;
