import { IAccountType, ICombinedWords } from './interface';

export const balanceKeywords = [
  'avbl bal',
  'available balance',
  'available limit',
  'limit available',
  'a/c bal',
  'ac bal',
  'available bal',
  'avl bal',
  'updated balance',
  'total balance',
  'new balance',
  'bal',
];

export const wallets = ['paytm', 'simpl', 'lazypay', 'amazon_pay'];

export const combinedWords: ICombinedWords[] = [
  {
    regex: /credit\scard/g,
    word: 'c_card',
    type: IAccountType.CARD,
  },
  {
    regex: /amazon\spay/g,
    word: 'amazon_pay',
    type: IAccountType.WALLET,
  },
  {
    regex: /uni\scard/g,
    word: 'uni_card',
    type: IAccountType.CARD,
  },
  {
    regex: /niyo\scard/g,
    word: 'niyo',
    type: IAccountType.ACCOUNT,
  },
];
