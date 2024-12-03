import { NotionRequest } from "../services/notionRequset";
import {
  NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_DATABASE_ID,
  NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_API_TOKEN,
  NOTION_JCB_DB_API_ID,
  NOTION_JCB_DB_API_TOKEN
} from "../config/notionVariables";
import FetchNotion from "../services/fetchNotion";
import GetMailList from "../services/getMailList";
import extractNumber from "./extractNumber";
import generateUniqueId from "./generateUniqueId";
import getLastCardUsageAmountValue from "./getLastCardUsageAmountValue";
import { RakutenMonthTotalAmountType, CardUseType } from "../type";

const getRakutenMail = () => {
  const jcb = new GetMailList('subject:"JCBカード／ショッピングご利用のお知らせ"');
  const rakuten = new GetMailList('subject:"【楽天カード】カードご請求金額のご案内"');

  jcb.getBody().forEach((body) => {
    const dateString = getLastCardUsageAmountValue('ご利用日時(日本時間)', body);
    const date = new Date(dateString.replace(/-/g, '/')).toISOString();
    const whereToUse = getLastCardUsageAmountValue('ご利用先', body);
    const amount = getLastCardUsageAmountValue('ご利用金額', body);
    const id = generateUniqueId(date);
    const getJCBCardList = new FetchNotion(
      NOTION_JCB_DB_API_TOKEN,
      NOTION_JCB_DB_API_ID
    );
    const getId = getJCBCardList.context().results.map(({ properties }: CardUseType) => {
      return {
        id: properties.id.title[0].text.content
      };
    });
    const idCheck = !getId.some(item => item.id === id);
    if (whereToUse && date && amount && id) {
      if (idCheck) {
        const JCBCardNotionRequset = new NotionRequest(
          { id, date, amount: extractNumber(amount), whereToUse },
          NOTION_JCB_DB_API_TOKEN,
          NOTION_JCB_DB_API_ID)
        JCBCardNotionRequset.fetch()
      } else {
        console.log('이미 등록된 아이디입니다');
        return;
      }
    }
  })

  rakuten.getBody().forEach((body) => {
    const amount = getLastCardUsageAmountValue('ご請求金額', body);
    const paymentDate = getLastCardUsageAmountValue('お支払い日', body);
    const id = generateUniqueId(paymentDate);
    const getRakutenTotalList = new FetchNotion(
      NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_API_TOKEN,
      NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_DATABASE_ID
    );
    const getId = getRakutenTotalList.context().results.map(({ properties }: RakutenMonthTotalAmountType) => {
      return {
        id: properties.id.title[0].text.content
      };
    });
    const idCheck = !getId.some(item => item.id === id);
    if (idCheck) {
      const rakutenTotalNotionRequset = new NotionRequest({
        id: generateUniqueId(paymentDate),
        date: paymentDate ?? '',
        amount: extractNumber(amount)
      },
        NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_API_TOKEN,
        NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_DATABASE_ID
      );
      rakutenTotalNotionRequset.fetch()
    } else {
      console.log('이미 등록된 아이디입니다');
      return;
    }
  })
}

  export default getRakutenMail
