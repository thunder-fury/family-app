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
      if (currentUsage.dateOfUse && currentUsage.user && currentUsage.usageAmount) {
        usages.push(currentUsage as RakutenUsageType);
        currentUsage = {};
      }
      currentUsage.dateOfUse = line.split('■利用日:')[1]?.trim();
    } else if (line.includes('■利用者:')) {
      currentUsage.user = line.split('■利用者:')[1]?.trim();
    } else if (line.includes('■利用金額:')) {
      currentUsage.usageAmount = line.split('■利用金額:')[1]?.trim();
    }
  });

  if (currentUsage.dateOfUse && currentUsage.user && currentUsage.usageAmount) {
    usages.push(currentUsage as RakutenUsageType);
  }

  return usages;
};


export default getRakutenPayUsageAllList;
