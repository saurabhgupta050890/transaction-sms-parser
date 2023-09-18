import getAccountDetails from './account';
import getBalance from './balance';
import getTransactionType from './getTransactionType';
import {
  IAccountType,
  IBalance,
  IBalanceKeyWordsType,
  ITransactionInfo,
  TMessageType,
} from './interface';
import { getProcessedMessage, padCurrencyValue, processMessage } from './utils';

export const getTransactionAmount = (message: TMessageType): string => {
  const processedMessage = getProcessedMessage(message);
  const index = processedMessage.indexOf('rs.');

  // If "rs." does not exist
  // Return ""
  if (index === -1) {
    return '';
  }
  let money = message[index + 1];

  money = money.replace(/,/g, '');

  // If data is false positive
  // Look ahead one index and check for valid money
  // Else return the found money
  if (Number.isNaN(Number(money))) {
    money = message[index + 2];
    money = money?.replace(/,/g, '');

    // If this is also false positive, return ""
    // Else return the found money
    if (Number.isNaN(Number(money))) {
      return '';
    }
    return padCurrencyValue(money);
  }
  return padCurrencyValue(money);
};

export const getTransactionInfo = (message: string): ITransactionInfo => {
  if (!message || typeof message !== 'string') {
    return {
      account: {
        type: IAccountType.ACCOUNT,
        number: null,
        name: null,
      },
      transactionAmount: null,
      balance: null,
      transactionType: null,
    };
  }

  const processedMessage = processMessage(message);
  const account = getAccountDetails(processedMessage);
  const availableBalance = getBalance(
    processedMessage,
    IBalanceKeyWordsType.AVAILABLE
  );
  const transactionAmount = getTransactionAmount(processedMessage);
  const isValid =
    [availableBalance, transactionAmount, account.number].filter(
      (x) => x !== ''
    ).length >= 2;
  const transactionType = isValid ? getTransactionType(processedMessage) : null;
  const balance: IBalance = { available: availableBalance, outstanding: null };

  if (account && account.type === IAccountType.CARD) {
    balance.outstanding = getBalance(
      processedMessage,
      IBalanceKeyWordsType.OUTSTANDING
    );
  }

  // console.log(processedMessage);
  // console.log(account, balance, transactionAmount, transactionType);
  // console.log('-----------------------------------------------------');
  return {
    account,
    balance,
    transactionAmount,
    transactionType,
  };
};
