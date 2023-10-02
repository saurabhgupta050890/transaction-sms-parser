// import { upiKeywords } from '../constants';
import { upiKeywords } from '../constants';
import { TMessageType } from '../interface';
import { getNextWords, getProcessedMessage, isNumber } from '../utils';

const extractMerchantInfo = (message: TMessageType) => {
  const processedMessage = getProcessedMessage(message);
  const messageString = processedMessage.join(' ');
  const merchantInfo = {
    merchantName: null,
    transactionId: null,
  };
  if (processedMessage.includes('vpa')) {
    const idx = processedMessage.indexOf('vpa');
    // if keyword vpa is not the last one
    if (idx < processedMessage.length - 1) {
      const nextStr = processedMessage[idx + 1];
      const [name] = nextStr.replaceAll(/\(|\)/gi, ' ').split(' ');
      merchantInfo.merchantName = name;
    }
  }

  let match = '';
  for (let i = 0; i < upiKeywords.length; i += 1) {
    const keyword = upiKeywords[i];
    const idx = messageString.indexOf(keyword);
    if (idx > 0) {
      match = keyword;
    }
  }

  if (match) {
    const nextWord = getNextWords(messageString, match);
    if (isNumber(nextWord)) {
      merchantInfo.transactionId = nextWord;
    } else if (merchantInfo.merchantName) {
      const [longestNumeric] = nextWord
        .split(/[^0-9]/gi)
        .sort((a, b) => b.length - a.length)[0];
      if (longestNumeric) {
        merchantInfo.transactionId = longestNumeric;
      }
    } else {
      merchantInfo.merchantName = nextWord;
    }
  }

  /* const additionalKeywords = ['at', 'to', 'info'];
  if (!merchantInfo.merchantName && !merchantInfo.transactionId) {
    for (let i = 0; i < additionalKeywords.length; i += 1) {
      const nextWord = getNextWords(messageString, additionalKeywords[i], 2);

      if (nextWord) {
        merchantInfo.merchantName = nextWord;
        break;
      }
    }
  } */
  return merchantInfo;
};

export default extractMerchantInfo;
