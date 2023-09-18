import { TMessageType, TTransactionType } from './interface';

function getTransactionType(message: TMessageType): TTransactionType {
  const messageStr = typeof message !== 'string' ? message.join(' ') : message;
  const creditPattern =
    /(?:credited|credit|deposited|added|received|refund|repayment)/gi;
  const debitPattern = /(?:debited|debit|deducted)/gi;
  const miscPattern =
    /(?:payment|spent|paid|used\s+at|charged|transaction\son|transaction\sfee|transfer|booked|purchased|sent\s+to|purchase\s+of)/gi;

  if (debitPattern.test(messageStr)) {
    return 'debit';
  }
  if (creditPattern.test(messageStr)) {
    return 'credit';
  }
  if (miscPattern.test(messageStr)) {
    return 'debit';
  }

  return null;
}

export default getTransactionType;
