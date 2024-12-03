import { headers } from "../config/notionVariables";

export default class FetchNotion {
  constructor(
    private token: string,
    private databaseId: string
  ) { }
  private headers(): GoogleAppsScript.URL_Fetch.URLFetchRequestOptions {
    return {
      method: 'post',
      headers: headers(this.token)
    }
  }
  private fetch(): GoogleAppsScript.URL_Fetch.HTTPResponse{
    return UrlFetchApp.fetch(`https://api.notion.com/v1/databases/${this.databaseId}/query`, this.headers())
  }
  public context() {
    return JSON.parse(this.fetch().getContentText());
  }
};
