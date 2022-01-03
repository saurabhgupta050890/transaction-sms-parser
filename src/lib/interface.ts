export enum IAccountType {
  CARD = 'CARD',
  WALLET = 'WALLET',
  ACCOUNT = 'ACCOUNT',
}

export interface IAccountInfo {
  type: IAccountType | null;
  number?: string;
  name?: string;
}

export type TMessageType = string | string[];

export interface ITransactionInfo {
  account: IAccountInfo;
  transactionAmount: string;
  balance?: string;
  transactionType: 'debit' | 'credit' | '';
}

export interface ICombinedWords {
  regex: RegExp;
  word: string;
  type: IAccountType;
}
