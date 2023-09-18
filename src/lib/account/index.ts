import { combinedWords, wallets } from '../constants';
import { IAccountInfo, IAccountType, TMessageType } from '../interface';
import { getProcessedMessage } from '../utils';

import getAccount from './getAccount';
import getCard from './getCard';

const getAccountDetails = (message: TMessageType): IAccountInfo => {
  const processedMessage = getProcessedMessage(message);
  let account = getAccount(processedMessage);

  // No occurence of the word "ac". Check for "card"
  if (!account.type) {
    account = getCard(processedMessage);
  }

  // Check for wallets
  if (!account.type) {
    const wallet = processedMessage.find((word) => {
      return wallets.includes(word);
    });
    if (wallet) {
      account.type = IAccountType.WALLET;
      account.name = wallet;
    }
  }

  // Check for special accounts
  if (!account.type) {
    const specialAccount = combinedWords
      .flatMap((x) => x)
      .find((w) => processedMessage.includes(w.word));

    account.type = specialAccount?.type;
    account.name = specialAccount?.word ?? null;
  }

  // Extract last 4 digits of account number
  // E.g. 4334XXXXX4334
  if (account.number && account.number.length > 4) {
    account.number = account.number.slice(-4);
  }

  return account;
};

export default getAccountDetails;
