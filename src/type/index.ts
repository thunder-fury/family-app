export type RakutenUsageType = {
  dateOfUse: string;
  user: string;
  usageAmount: string;
}

export type RakutenMonthTotalAmountType = {
  properties: {
    id: {
      title: [
        {
          text: {
            content: string
          },
        },
      ],
    },
    date: {
      date: { start: string },
    },
    amount: {
      number: number,
    },
  }
};

export type CardUseType = {
  properties: {
    id: {
      title: [
        {
          text: {
            content: string
          },
        },
      ],
    },
    date: {
      date: { start: string },
    },
    amount: {
      number: number,
    },
    whereToUse?: {
      rich_text: [
        {
          text: {
            content: string
          },
        },
      ]
    },
  }
};
