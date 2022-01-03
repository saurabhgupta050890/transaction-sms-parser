import { combinedWords } from './constants';
import { TMessageType } from './interface';

export const trimLeadingAndTrailingChars = (str: string): string => {
  const [first, last] = [str[0], str[str.length - 1]];

  if (isNaN(Number(last))) {
    str = str.slice(0, -1);
  }
  if (isNaN(Number(first))) {
    str = str.slice(1);
  }

  return str;
};

export const extractBondedAccountNo = (accountNo: string): string => {
  const strippedAccountNo = accountNo.replace('ac', '');
  return isNaN(Number(strippedAccountNo)) ? '' : strippedAccountNo;
};

export const processMessage = (message: string): string[] => {
  // convert to lower case
  message = message.toLowerCase();
  // remove '-'
  message = message.replace(/-/g, '');
  // remove ':'
  message = message.replace(/:/g, ' ');
  // remove '/'
  message = message.replace(/\//g, '');
  // remove '='
  message = message.replace(/=/g, ' ');
  // remove '{}'
  message = message.replace(/[{}]/g, ' ');
  // remove \n
  message = message.replace(/\n/g, ' ');
  // remove 'ending'
  message = message.replace(/ending /g, '');
  // replace 'x'
  message = message.replace(/x|[*]/g, '');
  // // remove 'is' 'with'
  // message = message.replace(/\bis\b|\bwith\b/g, '');
  // replace 'is'
  message = message.replace(/is /g, '');
  // replace 'with'
  message = message.replace(/with /g, '');
  // remove 'no.'
  message = message.replace(/no. /g, '');
  // replace all ac, acct, account with ac
  message = message.replace(/\bac\b|\bacct\b|\baccount\b/g, 'ac');
  // replace all 'rs' with 'rs. '
  message = message.replace(/rs(?=\w)/g, 'rs. ');
  // replace all 'rs ' with 'rs. '
  message = message.replace(/rs /g, 'rs. ');
  // replace all inr with rs.
  message = message.replace(/inr(?=\w)/g, 'rs. ');
  //
  message = message.replace(/inr /g, 'rs. ');
  // replace all 'rs. ' with 'rs.'
  message = message.replace(/rs. /g, 'rs.');
  // replace all 'rs.' with 'rs. '
  message = message.replace(/rs.(?=\w)/g, 'rs. ');
  // combine words
  combinedWords.forEach((word) => {
    message = message.replace(word.regex, word.word);
  });
  return message.split(' ').filter((str) => str !== '');
};

export const getProcessedMessage = (message: TMessageType) => {
  let processedMessage: string[] = [];
  if (typeof message === 'string') {
    processedMessage = processMessage(message);
  } else {
    processedMessage = message;
  }

  return processedMessage;
};

export const padCurrencyValue = (val: string): string => {
  const [lhs, rhs] = val.split('.');
  return rhs === null || rhs === undefined ? `${lhs}.00` : val;
};
