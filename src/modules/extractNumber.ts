/**
 * 숫자만 추출
 * @param text
 * @returns
 */
const extractNumber = (text: string): number => {
  const match = text.match(/\d{1,3}(,\d{3})*(\.\d+)?/);
  return match ? Number(match[0].replace(/,/g, '')) : 0;
};

export default extractNumber;
