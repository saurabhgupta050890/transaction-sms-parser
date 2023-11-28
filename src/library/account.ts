import { combinedWords, wallets } from "./constants";
import { IAccountInfo, IAccountType, TMessageType } from "./interface";
import {
  extractBondedAccountNo,
  getProcessedMessage,
  trimLeadingAndTrailingChars,
} from "./utils";

const getCard = (message: string[]): IAccountInfo => {
  let combinedCardName = "";
  const cardIndex = message.findIndex(
    (word) =>
      word === "card" ||
      combinedWords // Any combined word of card type
        .filter((w) => w.type === IAccountType.CARD)
        .some((w) => {
          if (w.word === word) {
            combinedCardName = w.word;
            return true;
          }
          return false;
        }),
  );
  const card: IAccountInfo = { type: null, name: null, number: null };

  // Search for "card" and if not found return empty obj
  if (cardIndex !== -1) {
    card.number = message[cardIndex + 1];
    card.type = IAccountType.CARD;

    // If the data is false positive
    // return empty obj
    // Else return the card info
    if (Number.isNaN(Number(card.number))) {
      return {
        type: combinedCardName ? card.type : null,
        name: combinedCardName,
        number: null,
      };
    }
    return card;
  }
  return { type: null, name: null, number: null };
};

const getAccount = (message: TMessageType): IAccountInfo => {
  const processedMessage = getProcessedMessage(message);
  let accountIndex = -1;
  let account: IAccountInfo = {
    type: null,
    name: null,
    number: null,
  };

  for (const [index, word] of processedMessage.entries()) {
    if (word === "ac") {
      if (index + 1 < processedMessage.length) {
        const accountNo = trimLeadingAndTrailingChars(
          processedMessage[index + 1],
        );

        if (Number.isNaN(Number(accountNo))) {
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
    } else if (word.includes("ac")) {
      const extractedAccountNo = extractBondedAccountNo(word);

      if (extractedAccountNo === "") {
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
    account.type = specialAccount?.type ?? null;
    account.name = specialAccount?.word ?? null;
  }

  // Extract last 4 digits of account number
  // E.g. 4334XXXXX4334
  if (account.number && account.number.length > 4) {
    account.number = account.number.slice(-4);
  }

  return account;
};

export default getAccount;
