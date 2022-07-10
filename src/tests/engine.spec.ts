/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line import/no-unresolved
import test from 'ava';

import { getTransactionInfo } from '../lib/engine';
import { IAccountType, ITransactionInfo } from '../lib/interface';
import { padCurrencyValue } from '../lib/utils';

import testCases from './testCases.json';

testCases.forEach((testCase) => {
  test(testCase.name, (t) => {
    const expected: ITransactionInfo = {
      account: { type: testCase.accountType as IAccountType },
      transactionAmount: padCurrencyValue(`${testCase.transactionAmount}`),
      transactionType: testCase.transactionType as 'debit' | 'credit' | '',
    };

    if (testCase.balanceAvailable) {
      expected.balance = {
        available: padCurrencyValue(`${testCase.balanceAvailable}`),
      };
    }

    // @ts-ignore
    if (testCase.balanceOutstanding) {
      expected.balance.outstanding = padCurrencyValue(
        // @ts-ignore
        `${testCase.balanceOutstanding}`
      );
    }

    // @ts-ignore
    if (testCase.accountNumber) {
      // @ts-ignore
      expected.account.number = `${testCase.accountNumber}`;
    }

    // @ts-ignore
    if (testCase.accountName) {
      // @ts-ignore
      expected.account.name = testCase.accountName;
    }

    const actual = getTransactionInfo(testCase.message);

    t.deepEqual(actual, expected);
  });
});
