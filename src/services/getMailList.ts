export default class GetMailList {
  constructor(private query: string = '') { }
  private search() {
    return GmailApp.search(this.query);
  }
  private getMessages(): GoogleAppsScript.Gmail.GmailMessage[] {
    return this.search().flatMap(mail => mail.getMessages())
  }
  private getThelast5emails(): GoogleAppsScript.Gmail.GmailMessage[] {
    return this.getMessages().slice(-5).reverse()
  }
  public getBody(): string[] {
    return this.getThelast5emails().map((mail) => mail.getPlainBody())
  }
}
