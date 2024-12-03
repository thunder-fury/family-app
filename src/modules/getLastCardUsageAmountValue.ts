/**
 *
 * @param key
 * @param body
 * @returns string | undefined
 * 카드 최신 값 가져오기.
 * 함수 사용법 : getLastCardUsageAmountValue('ご請求金額', body)
 */
const getLastCardUsageAmountValue = (key: string, body: string): string | undefined => {
  const lines = body.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`[${key}]`) || lines[i].includes(`【${key}】`)) {
      return lines[i].split('】')[1]?.trim() || lines[i + 1]?.trim();
    }
  }
  return undefined;
}


export default getLastCardUsageAmountValue;
