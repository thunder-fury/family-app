export type RakutenUsageType = {
  id: string;
  date: string;
  user: string;
  amount: string;
  whereToUse: string;
  paymentMonth: string;
}

export type RakutenAmountType = {
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
    dateOfUse: {
      date: { start: string },
    },
    usageAmount: {
      number: number,
    },
    user: {
      rich_text: [
        {
          text: {
            content: string
          },
        },
      ]
    },
    whereToUse: {
      rich_text: [
        {
          text: {
            content: string
          },
        },
      ]
    },
    paymentMonth: {
      date: { start: string },
    },
  }
};

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
    paymentMonth?: {
      date: { start: string },
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
    user?: {
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
