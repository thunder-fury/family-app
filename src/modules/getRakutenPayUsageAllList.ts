import { RakutenUsageType } from "../type";

/**
 *
 * @param body
 * @returns
 * 함수 사용법 : parseRakutenUsage(body)
 */
const getRakutenPayUsageAllList = (body: string): RakutenUsageType[] => {
  const lines = body.split('\n');
  const usages: RakutenUsageType[] = [];
  let currentUsage: Partial<RakutenUsageType> = {};

  lines.forEach(line => {
    if (line.includes('■利用日:')) {
      currentUsage.date = line.split('■利用日:')[1]?.trim();
    } else if (line.includes('■利用先:')) {
      currentUsage.whereToUse = line.split('■利用先:')[1]?.trim();
    } else if (line.includes('■利用者:')) {
      currentUsage.user = line.split('■利用者:')[1]?.trim();
    } else if (line.includes('■利用金額:')) {
      currentUsage.amount = line.split('■利用金額:')[1]?.trim();
    } else if (line.includes('■支払月:')) {
      currentUsage.paymentMonth = line.split('■支払月:')[1]?.trim();
    } else if (line.trim() === '') {
      // 空行を検出したら、現在の使用情報をリストに追加し、リセット
      if (Object.keys(currentUsage).length > 0) {
        usages.push(currentUsage as RakutenUsageType);
        currentUsage = {};
      }
    }
  });

  if (Object.keys(currentUsage).length > 0) {
    usages.push(currentUsage as RakutenUsageType);
  }
  return usages;
};


export default getRakutenPayUsageAllList;
