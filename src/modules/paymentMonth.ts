import { NotionRequest } from "../services/notionRequset";
import {
  NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_DATABASE_ID,
  NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_API_TOKEN,
  NOTION_JCB_DB_API_ID,
  NOTION_JCB_DB_API_TOKEN,
  NOTION_RAKUTEN_REAL_TIME_AMOUNT_API_TOKEN,
  NOTION_RAKUTEN_REAL_TIME_AMOUNT_DATABASE_ID
} from "../config/notionVariables";
import FetchNotion from "../services/fetchNotion";
import GetMailList from "../services/getMailList";
import extractNumber from "./extractNumber";
import generateUniqueId from "./generateUniqueId";
import getLastCardUsageAmountValue from "./getLastCardUsageAmountValue";
import { RakutenMonthTotalAmountType, CardUseType, RakutenUsageType } from "../type";
import getRakutenPayUsageAllList from "./getRakutenPayUsageAllList"
class Registration {
  constructor(
    private token: string,
    private dbId: string,
    private subject: string,
    private getMailList: GetMailList = new GetMailList(`subject:"${this.subject}"`),
    private useCardList: FetchNotion = new FetchNotion(this.token,this.dbId),
  ) { }
  private getJcbMailList() {
    return this.getMailList.getBody().map((body) => {
      const dateString = getLastCardUsageAmountValue('ご利用日時(日本時間)', body);
      const date = new Date(dateString.replace(/-/g, '/')).toISOString();
      const whereToUse = getLastCardUsageAmountValue('ご利用先', body);
      const amount = getLastCardUsageAmountValue('ご利用金額', body);
      const id = generateUniqueId(date);
      return {
        id,
        date,
        amount,
        whereToUse
      }
    });
  }
  private getJcbNotionDbId() {
    return this.useCardList.context().results.map(({ properties }: CardUseType) => {
      return {
        id: properties.id.title[0].text.content
      };
    });
   }
  private getRakutenMailList() { }
}



const getRakutenMail = () => {
  const jcb = new GetMailList('subject:"JCBカード／ショッピングご利用のお知らせ"');
  const rakutenPay = new GetMailList('label:"楽天ペイ"');
  const rakuten = new GetMailList('label:"楽天カード利用明細-確定請求金額 "');
  const rakutenTotal = new GetMailList('label:"楽天カード利用明細"');

  const bodies = rakutenPay.rakutenGetBody();
  outerLoop: for (const body of bodies) {
    const usageList = getRakutenPayUsageAllList(body);
    for (const { date, amount, whereToUse, user, paymentMonth } of usageList) {
      const id = generateUniqueId(`${date}-${amount}`);
      const getRakutenCardUseList = new FetchNotion(
        NOTION_RAKUTEN_REAL_TIME_AMOUNT_API_TOKEN,
        NOTION_RAKUTEN_REAL_TIME_AMOUNT_DATABASE_ID
      );
      const getId = getRakutenCardUseList.context().results.map(({ properties }: CardUseType) => {
        return {
          id: properties.id.title[0].text.content
        };
      });
      const idCheck = !getId.some(item => item.id === id);
      if (idCheck) {
        const JCBCardNotionRequset = new NotionRequest<{
          id: string, date: string, amount: number, whereToUse: string, user: string, paymentMonth: string
        }>(
          { id, user, date, amount: extractNumber(amount), whereToUse, paymentMonth },
          NOTION_RAKUTEN_REAL_TIME_AMOUNT_API_TOKEN,
          NOTION_RAKUTEN_REAL_TIME_AMOUNT_DATABASE_ID
        );
        JCBCardNotionRequset.fetch();
      } else {
        console.log('이미 등록된 아이디입니다');
        break outerLoop; // 중복된 ID가 발견되면 루프를 중단
      }
    }
  }
  // rakutenPay.getBody().forEach((body) => {
  //   getRakutenPayUsageAllList(body).forEach(({ date, amount, whereToUse, user, paymentMonth }: RakutenUsageType) => {
  //     const id = generateUniqueId(`${date}-${amount}`)
  //     const getRakutenCardUseList = new FetchNotion(
  //       NOTION_RAKUTEN_REAL_TIME_AMOUNT_API_TOKEN,
  //       NOTION_RAKUTEN_REAL_TIME_AMOUNT_DATABASE_ID
  //     );
  //     const getId = getRakutenCardUseList.context().results.map(({ properties }: CardUseType) => {
  //       return {
  //         id: properties.id.title[0].text.content
  //       };
  //     });
  //     const idCheck = !getId.some(item => item.id === id);
  //     if (idCheck) {
  //       const JCBCardNotionRequset = new NotionRequest<{
  //         id: string, date: string, amount: number, whereToUse: string, user: string, paymentMonth: string
  //       }>(
  //         { id, user, date, amount: extractNumber(amount), whereToUse, paymentMonth },
  //         NOTION_RAKUTEN_REAL_TIME_AMOUNT_API_TOKEN,
  //         NOTION_RAKUTEN_REAL_TIME_AMOUNT_DATABASE_ID
  //       );
  //       JCBCardNotionRequset.fetch()
  //     } else {
  //       console.log('이미 등록된 아이디입니다');
  //     }
  //   });
  // });

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
        const JCBCardNotionRequset = new NotionRequest<{
          id: string, date: string, amount: number, whereToUse: string
        }>(
          { id, date, amount: extractNumber(amount), whereToUse },
          NOTION_JCB_DB_API_TOKEN,
          NOTION_JCB_DB_API_ID
        );
        JCBCardNotionRequset.fetch()
      } else {
        // console.log('이미 등록된 아이디입니다');
        return;
      }
    }
  })

  const rakutenBodies = rakuten.rakutenGetBody();
  const getRakutenTotalList = new FetchNotion(
    NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_API_TOKEN,
    NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_DATABASE_ID
  );

  const getId = getRakutenTotalList.context().results.map(({ properties }: CardUseType) => {
    return {
      id: properties.id.title[0].text.content
    };
  });
  outerLoop: for (const body of rakutenBodies) {
    const amountMatch = body.match(/(\d{1,3}(,\d{3})*)円/);
    if (!amountMatch) {
      console.log('金額が見つかりませんでした');
      continue;
    }
    const amount = amountMatch[1].replace(/,/g, '');

    const paymentDate = getLastCardUsageAmountValue('お支払い日', body);
    if (!paymentDate) {
      console.log('支払い日が見つかりませんでした');
      continue;
    }

    const id = generateUniqueId(`${paymentDate}-${amount}`);



    const idCheck = !getId.some(item => item.id === id);

  if (idCheck) {
    const rakutenTotalNotionRequest = new NotionRequest<{id: string, date: string, amount: number}>({
      id,
      date: paymentDate ?? '',
      amount: Number(amount)
    },
      NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_API_TOKEN,
      NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_DATABASE_ID
    );
    rakutenTotalNotionRequest.fetch();
  } else {
    console.log('이미 등록된 아이디입니다');
    break outerLoop;
  }
}
  // rakuten.getBody().forEach((body) => {
  //   const amount = getLastCardUsageAmountValue('ご請求金額', body);
  //   const paymentDate = getLastCardUsageAmountValue('お支払い日', body);
  //   const id = generateUniqueId(paymentDate);
  //   const getRakutenTotalList = new FetchNotion(
  //     NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_API_TOKEN,
  //     NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_DATABASE_ID
  //   );
  //   const getId = getRakutenTotalList.context().results.map(({ properties }: RakutenMonthTotalAmountType) => {
  //     return {
  //       id: properties.id.title[0].text.content
  //     };
  //   });
  //   const idCheck = !getId.some(item => item.id === id);
  //   if (idCheck) {
  //     const rakutenTotalNotionRequset = new NotionRequest<{id: string, date: string, amount: number}>({
  //       id: generateUniqueId(paymentDate),
  //       date: paymentDate ?? '',
  //       amount: extractNumber(amount)
  //     },
  //       NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_API_TOKEN,
  //       NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_DATABASE_ID
  //     );
  //     rakutenTotalNotionRequset.fetch()
  //   } else {
  //     // console.log('이미 등록된 아이디입니다');
  //     return;
  //   }
  // })
}

  export default getRakutenMail
