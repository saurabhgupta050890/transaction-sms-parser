export enum IAccountType {
  CARD = 'CARD',
  WALLET = 'WALLET',
  ACCOUNT = 'ACCOUNT',
}

export enum IBalanceKeyWordsType {
  AVAILABLE = 'AVAILABLE',
  OUTSTANDING = 'OUTSTANDING',
}

export interface IAccountInfo {
  type: IAccountType | null;
  number: string | null;
  name: string | null;
}

export interface IBalance {
  available: string | null;
  outstanding: string | null;
}

export type TMessageType = string | string[];
export type TTransactionType = 'debit' | 'credit' | null;

export interface ITransactionInfo {
  account: IAccountInfo;
  transactionAmount: string | null;
  transactionType: TTransactionType;
  balance: IBalance | null;
}

export interface ICombinedWords {
  regex: RegExp;
  word: string;
  type: IAccountType;
}
