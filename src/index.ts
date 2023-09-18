import getAccountDetails from './lib/account';
import getBalance from './lib/balance';

export * from './lib/engine';
export * from './lib/interface';
export const getAccountInfo = getAccountDetails;
export const getBalanceInfo = getBalance;
