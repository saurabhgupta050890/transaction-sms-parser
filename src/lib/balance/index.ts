import { balanceKeywords } from '../constants';
import { TMessageType } from '../interface';
import { getProcessedMessage, padCurrencyValue } from '../utils';

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
