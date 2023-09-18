import { combinedWords } from './constants';
import { ICombinedWords, TMessageType } from './interface';

export const trimLeadingAndTrailingChars = (str: string): string => {
  const [first, last] = [str[0], str[str.length - 1]];

  let finalStr = Number.isNaN(Number(last)) ? str.slice(0, -1) : str;
  finalStr = Number.isNaN(Number(first)) ? finalStr.slice(1) : finalStr;

  return finalStr;
};

export const extractBondedAccountNo = (accountNo: string): string => {
  const strippedAccountNo = accountNo.replace('ac', '');
  return Number.isNaN(Number(strippedAccountNo)) ? '' : strippedAccountNo;
};

export const processMessage = (message: string): string[] => {
  // convert to lower case
  let messageStr = message.toLowerCase();
  // remove '-'
  messageStr = messageStr.replace(/-/g, '');
  // remove '@'
  messageStr = messageStr.replace(/@/g, '');
  // remove '!'
  messageStr = messageStr.replace(/!/g, '');
  // remove ':'
  messageStr = messageStr.replace(/:/g, ' ');
  // remove '/'
  messageStr = messageStr.replace(/\//g, '');
  // remove '='
  messageStr = messageStr.replace(/=/g, ' ');
  // remove '{}'
  messageStr = messageStr.replace(/[{}]/g, ' ');
  // remove \n
  messageStr = messageStr.replace(/\n/g, ' ');
  // remove \r
  messageStr = messageStr.replace(/\r/g, ' ');
  // remove 'ending'
  messageStr = messageStr.replace(/ending /g, '');
  // replace 'x'
  messageStr = messageStr.replace(/xx|[*]/g, '');
  // // remove 'is' 'with'
  // message = message.replace(/\bis\b|\bwith\b/g, '');
  // replace 'is'
  messageStr = messageStr.replace(/is /g, '');
  // replace 'with'
  messageStr = messageStr.replace(/with /g, '');
  // remove ' no. '
  messageStr = messageStr.replace(/ no. /g, ' ');
  // replace all ac, acct, account with ac
  messageStr = messageStr.replace(/\bac\b|\bacct\b|\baccount\b/g, 'ac');
  // replace all 'ac', ' ac '
  messageStr = messageStr.replace(/ac/g, ' ac ');
  // replace all 'rs' with 'rs. '
  messageStr = messageStr.replace(/rs(?=\w)/g, 'rs. ');
  // replace all 'rs ' with 'rs. '
  messageStr = messageStr.replace(/rs /g, 'rs. ');
  // replace all inr with rs.
  messageStr = messageStr.replace(/inr(?=\w)/g, 'rs. ');
  //
  messageStr = messageStr.replace(/inr /g, 'rs. ');
  // replace all 'rs. ' with 'rs.'
  messageStr = messageStr.replace(/rs. /g, 'rs.');
  // replace all 'rs.' with 'rs. '
  messageStr = messageStr.replace(/rs.(?=\w)/g, 'rs. ');

  // replace all 'debited' with ' debited '
  messageStr = messageStr.replace(/debited/g, ' debited ');
  // replace all 'credited' with ' credited '
  messageStr = messageStr.replace(/credited/g, ' credited ');
  // combine words
  combinedWords.forEach((category) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const { word, regex } of category) {
      if (regex.test(messageStr)) {
        messageStr = messageStr.replace(regex, word);
        break;
      }
    }
  });
  return messageStr.split(' ').filter((str) => str !== '');
};

export const getMatchedCombindedWord = (message: string[]) => {
  const combinedWord = combinedWords
    .flatMap((x) => x)
    .find((cword) => message.some((x) => x === cword.word));

  return (
    combinedWord ?? ({ word: null, type: null, regex: null } as ICombinedWords)
  );
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
  return `${lhs}.${(rhs ?? '').padEnd(2, '0')}`;
};
