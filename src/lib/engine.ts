import { balanceKeywords, combinedWords, wallets } from './constants';
import {
  IAccountInfo,
  IAccountType,
  ITransactionInfo,
  TMessageType,
} from './interface';
import {
  extractBondedAccountNo,
  getProcessedMessage,
  padCurrencyValue,
  processMessage,
  trimLeadingAndTrailingChars,
} from './utils';

const getCard = (message: string[]): IAccountInfo => {
  //console.log('card check', message);
  let isCombinedCreditWordExists = false;
  const cardIndex = message.findIndex(
    (word) =>
      word === 'card' ||
      combinedWords //Any combined word of card type
        .filter((w) => w.type === IAccountType.CARD)
        .some((w) => {
          if (w.word === word) {
            isCombinedCreditWordExists = true;
            return true;
          } else {
            return false;
          }
        })
  );
  const card: IAccountInfo = { type: null };

  // Search for "card" and if not found return empty obj
  if (cardIndex !== -1) {
    card.number = message[cardIndex + 1];
    card.type = IAccountType.CARD;

    //console.log('card::', card);

    // If the data is false positive
    // return empty obj
    // Else return the card info
    if (isNaN(Number(card.number))) {
      return {
        type: isCombinedCreditWordExists ? card.type : null,
      };
    } else {
      return card;
    }
  } else {
    return { type: null };
  }
};

export const getAccountInfo = (message: TMessageType): IAccountInfo => {
  const processedMessage = getProcessedMessage(message);
  let accountIndex = -1;
  let account: IAccountInfo = {
    type: null,
    number: '',
  };

  for (const [index, word] of processedMessage.entries()) {
    if (word === 'ac') {
      if (index + 1 < processedMessage.length) {
        const accountNo = trimLeadingAndTrailingChars(
          processedMessage[index + 1]
        );

        if (isNaN(Number(accountNo))) {
          // continue searching for a valid account number
          continue;
        } else {
          accountIndex = index;
          account.type = IAccountType.ACCOUNT;
          account.number = accountNo;
          break;
        }
      } else {
        // continue searching for a valid account number
        continue;
      }
    } else if (word.includes('ac')) {
      const extractedAccountNo = extractBondedAccountNo(word);

      if (extractedAccountNo === '') {
        continue;
      } else {
        accountIndex = index;
        account.type = IAccountType.ACCOUNT;
        account.number = extractedAccountNo;
        break;
      }
    }
  }

  // No occurence of the word "ac". Check for "card"
  if (accountIndex === -1) {
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
      .filter((word) => word.type === IAccountType.ACCOUNT)
      .find((w) => {
        return processedMessage.includes(w.word);
      });
    account.type = specialAccount?.type;
    account.name = specialAccount?.word;
  }

  return account;
};

const extractBalance = (
  index: number,
  message: string,
  length: number
): string => {
  let balance = '';
  let saw_number = false;
  let invalid_char_count = 0;
  let char = '';

  while (index < length) {
    char = message[index];

    if ('0' <= char && char <= '9') {
      saw_number = true;
      // is_start = false;
      balance += char;
    } else {
      if (saw_number) {
        if (char === '.') {
          if (invalid_char_count === 1) {
            break;
          } else {
            balance += char;
            invalid_char_count += 1;
          }
        } else if (char !== ',') {
          break;
        }
      }
    }

    ++index;
  }

  return balance;
};

export const getBalance = (message: TMessageType) => {
  const processedMessage = getProcessedMessage(message);
  const messageString = processedMessage.join(' ');
  let index_of_keyword = -1;
  let balance = '';

  for (const word of balanceKeywords) {
    index_of_keyword = messageString.indexOf(word);

    if (index_of_keyword !== -1) {
      index_of_keyword += word.length;
      break;
    } else {
      continue;
    }
  }

  // found the index of keyword, moving on to finding 'rs.' occuring after index_of_keyword
  let index = index_of_keyword;
  let index_of_rs = -1;
  let nextThreeChars = messageString.substr(index, 3);

  index += 3;

  while (index < messageString.length) {
    // discard first char
    nextThreeChars = nextThreeChars.slice(1);
    // add the current char at the end
    nextThreeChars += messageString[index];

    if (nextThreeChars === 'rs.') {
      index_of_rs = index + 2;
      break;
    }

    ++index;
  }

  // no occurence of 'rs.'
  if (index_of_rs === -1) {
    return '';
  }

  balance = extractBalance(index_of_rs, messageString, messageString.length);

  return padCurrencyValue(balance);
};

export const getTransactionAmount = (message: TMessageType): string => {
  const processedMessage = getProcessedMessage(message);
  const index = processedMessage.indexOf('rs.');

  // If "rs." does not exist
  // Return ""
  if (index === -1) {
    return '';
  } else {
    let money = message[index + 1];

    money = money.replace(/,/g, '');

    // If data is false positive
    // Look ahead one index and check for valid money
    // Else return the found money
    if (isNaN(Number(money))) {
      money = message[index + 2];
      money = money?.replace(/,/g, '');

      // If this is also false positive, return ""
      // Else return the found money
      if (isNaN(Number(money))) {
        return '';
      } else {
        return padCurrencyValue(money);
      }
    } else {
      return padCurrencyValue(money);
    }
  }
};

export const getTransactionType = (message: TMessageType) => {
  const creditPattern = /(?:credited|credit|deposited|added|received|refund)/gi;
  const debitPattern = /(?:debited|debit|deducted)/gi;
  const miscPattern =
    /(?:payment|spent|paid|used\sat|charged|transaction\son|transaction\sfee|tran)/gi;

  if (typeof message !== 'string') {
    message = message.join(' ');
  }

  if (debitPattern.test(message)) {
    return 'debit';
  } else if (creditPattern.test(message)) {
    return 'credit';
  } else if (miscPattern.test(message)) {
    return 'debit';
  }

  return '';
};

export const getTransactionInfo = (message: string): ITransactionInfo => {
  if (!message || typeof message !== 'string') {
    return {
      account: {
        type: IAccountType.ACCOUNT,
      },
      transactionAmount: '',
      balance: '',
      transactionType: '',
    };
  }

  const processedMessage = processMessage(message);
  const account = getAccountInfo(processedMessage);
  const balance = getBalance(processedMessage);
  const transactionAmount = getTransactionAmount(processedMessage);
  const isValid =
    [balance, transactionAmount, account.number].filter((x) => x !== '')
      .length >= 2;
  const transactionType = isValid ? getTransactionType(processedMessage) : '';

  //console.log(processedMessage);
  //console.log(account, balance, transactionAmount, transactionType);
  //console.log('-----------------------------------------------------');
  return {
    account,
    balance,
    transactionAmount,
    transactionType,
  };
};
