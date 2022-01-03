import { combinedWords, wallets } from '../constants';
import { IAccountInfo, IAccountType, TMessageType } from '../interface';
import {
  extractBondedAccountNo,
  getProcessedMessage,
  trimLeadingAndTrailingChars,
} from '../utils';

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
