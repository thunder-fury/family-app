const properties = PropertiesService.getScriptProperties();
const NOTION_RAKUTEN_REAL_TIME_AMOUNT_API_TOKEN = properties.getProperty('NOTION_RAKUTEN_REAL_TIME_AMOUNT_API_TOKEN');
const NOTION_RAKUTEN_REAL_TIME_AMOUNT_DATABASE_ID = properties.getProperty('NOTION_RAKUTEN_REAL_TIME_AMOUNT_DATABASE_ID');
const NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_DATABASE_ID = properties.getProperty('NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_DATABASE_ID');
const NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_API_TOKEN = properties.getProperty('NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_API_TOKEN');
const NOTION_JCB_DB_API_TOKEN = properties.getProperty('NOTION_JCB_DB_API_TOKEN');
const NOTION_JCB_DB_API_ID = properties.getProperty('NOTION_JCB_DB_API_ID');
const postNotionURL = 'https://api.notion.com/v1/pages/';

const headers = (token: string) => {
  return {
    Accept: 'application/json',
    'Notion-Version': '2021-05-13',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
};


export {
  NOTION_RAKUTEN_REAL_TIME_AMOUNT_API_TOKEN,
  NOTION_RAKUTEN_REAL_TIME_AMOUNT_DATABASE_ID,
  NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_DATABASE_ID,
  NOTION_RAKITEN_TOTAL_MONTH_AMOUNT_API_TOKEN,
  NOTION_JCB_DB_API_ID,
  NOTION_JCB_DB_API_TOKEN,
  postNotionURL,
  headers,
}
