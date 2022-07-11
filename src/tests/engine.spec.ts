/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line import/no-unresolved
import test from 'ava';

import { getTransactionInfo } from '../lib/engine';
import { IAccountType, ITransactionInfo } from '../lib/interface';
import { padCurrencyValue } from '../lib/utils';

import testCases from './testCases.json';

testCases.forEach((testCase, index) => {
  test(`${testCase.name}-${index}`, (t) => {
    const expected: ITransactionInfo = {
      account: { type: testCase.accountType as IAccountType },
      transactionAmount: testCase.transactionAmount
        ? padCurrencyValue(`${testCase.transactionAmount}`)
        : '',
      transactionType: testCase.transactionType as 'debit' | 'credit' | '',
    };

    expected.balance = {
      available: testCase.balanceAvailable
        ? padCurrencyValue(`${testCase.balanceAvailable}`)
        : '',
    };

    // @ts-ignore
    if (testCase.balanceoutstanding) {
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
