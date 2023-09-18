import { IAccountInfo, IAccountType } from '../interface';
import { getMatchedCombindedWord, trimLeadingAndTrailingChars } from '../utils';

function getAccount(processedMessage: string[]) {
  const combinedWord = getMatchedCombindedWord(processedMessage);
  const account: IAccountInfo = {
    number: null,
    name: combinedWord.word ?? null,
    type: combinedWord.type ?? null,
  };

  const acOrCardIndex = processedMessage.findIndex(
    (word) => word === 'ac' || word.includes('_card')
  );
  if (acOrCardIndex === -1) return account;

  for (let i = acOrCardIndex + 1; i < processedMessage.length; i += 1) {
    const accountNo = trimLeadingAndTrailingChars(processedMessage[i]);
    if (
      Number.isNaN(Number(accountNo)) ||
      Number(accountNo) === 0 ||
      accountNo.length < 3
    ) {
      // continue searching for a valid account number
      // eslint-disable-next-line no-continue
      continue;
    }

    account.number = accountNo;
    account.type = account.type ?? IAccountType.ACCOUNT;
    break;
  }

  return account;
}
export default getAccount;
