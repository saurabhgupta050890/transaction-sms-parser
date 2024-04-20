import getAccount from "./library/account";
import getBalance from "./library/balance";
import * as engine from "./library/engine";
import extractMerchantInfo from "./library/merchant";

export { IAccountType, IBalanceKeyWordsType } from "./library/interface";
export type {
  IAccountInfo,
  IBalance,
  ICombinedWords,
  ITransaction,
  ITransactionInfo,
  TMessageType,
  TTransactionType,
} from "./library/interface";
export const getAccountInfo = getAccount;
export const getBalanceInfo = getBalance;
export const getMerchantInfo = extractMerchantInfo;
export const getTransactionInfo = engine.getTransactionInfo;
export const getTransactionAmount = engine.getTransactionAmount;
export const getTransactionType = engine.getTransactionType;
