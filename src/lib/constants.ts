import { IAccountType, ICombinedWords } from './interface';

export const availableBalanceKeywords = [
  'avbl bal',
  'available balance',
  'available limit',
  'available credit limit',
  'limit available',
  'a/c bal',
  'ac bal',
  'available bal',
  'avl bal',
  'updated balance',
  'total balance',
  'new balance',
  'bal',
  'avl lmt',
  'available',
];

export const outstandingBalanceKeywords = ['outstanding'];

export const wallets = ['paytm', 'simpl', 'lazypay', 'amazon_pay'];

export const combinedWords: ICombinedWords[][] = [
  [
    {
      regex: /icici\s(?:\w+\s)?card/g,
      word: 'icici_card',
      type: IAccountType.CARD,
    },
  ],
  [
    {
      regex: /amex\scard/g,
      word: 'amex_card',
      type: IAccountType.CARD,
    },
  ],
  [
    {
      regex: /hdfc\scard/g,
      word: 'hdfc_card',
      type: IAccountType.CARD,
    },
    {
      regex: /hdfc\s(?:\w+\s)card/g,
      word: 'hdfc_card',
      type: IAccountType.CARD,
    },
    {
      regex: /hdfc/g,
      word: 'hdfc_bank',
      type: IAccountType.ACCOUNT,
    },
  ],
  [
    {
      regex: /sbi\s(?:\w+\s)?card/g,
      word: 'sbi_card',
      type: IAccountType.CARD,
    },
    {
      regex: /sbi/g,
      word: 'sbi_bank',
      type: IAccountType.ACCOUNT,
    },
  ],
  [
    {
      regex: /amazon\spay/g,
      word: 'amazon_pay',
      type: IAccountType.WALLET,
    },
  ],
  [
    {
      regex: /uni\scard/g,
      word: 'uni_card',
      type: IAccountType.CARD,
    },
  ],
  [
    {
      regex: /niyo\scard/g,
      word: 'niyo',
      type: IAccountType.ACCOUNT,
    },
  ],
  [
    {
      regex: /slice\scard/g,
      word: 'slice_card',
      type: IAccountType.CARD,
    },
  ],
  [
    {
      regex: /one\s*card/g,
      word: 'one_card',
      type: IAccountType.CARD,
    },
  ],
];
