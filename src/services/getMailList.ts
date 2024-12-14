export default class GetMailList {
  constructor(private query: string = '') { }
  private search() {
    return GmailApp.search(this.query);
  }
  private getMessages(): GoogleAppsScript.Gmail.GmailMessage[] {
    return this.search().flatMap(mail => mail.getMessages())
  }
  private getThelast5emails(): GoogleAppsScript.Gmail.GmailMessage[] {
    return this.getMessages().slice(0, 5)
  }
  public rakutenGetBody(): string[] {
    return this.getMessages().map((mail) => mail.getPlainBody())
  }
  public getBody(): string[] {
    return this.getThelast5emails().map((mail) => mail.getPlainBody())
  }
  public getSubject(): string[] {
    return this.getThelast5emails().map((mail) => mail.getSubject())
  }
}
