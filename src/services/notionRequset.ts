import {
  headers,
  postNotionURL,
} from '../config/notionVariables';
import { CardUseType, RakutenUsageType } from '../type';
import FetchNotion from './fetchNotion';

/**
 * @param id
 * @param date
 * @param amount
 * @returns null
 * request to Notion API
 * 함수 사용법 : rakutenTotalNotionRequset({ id, date, amount })
 */

interface NotionData {
  id: string;
  date: string;
  amount: number;
  whereToUse?: string;
}



class NotionRequest<T extends NotionData> {
  constructor(private token, private dbId, private data: T) {
  }
  private properties() {
    const properties: CardUseType & { parent: {database_id: string }} = {
      parent: { database_id: this.dbId },
      properties: {
        id: {
          title: [
            {
              text: {
                content: this.data.id
              },
            },
          ],
        },
        date: {
          date: { start: this.data.date.replace(/\//g, '-') },
        },
        amount: {
          number: this.data.amount,
        },
      }
    }
    if (this.data.whereToUse) {
      properties.properties.whereToUse = {
        rich_text: [
          {
            text: {
              content: this.data.whereToUse
            },
          },
        ]
      }
    }
    return properties
  }
  private options(): GoogleAppsScript.URL_Fetch.URLFetchRequestOptions {
    return {
      method: 'post',
      headers: headers(this.token),
      payload: JSON.stringify(this.properties()),
    }
  }
  public fetch() {
    return UrlFetchApp.fetch(postNotionURL, this.options());
  }
}


export {
  NotionRequest
}
