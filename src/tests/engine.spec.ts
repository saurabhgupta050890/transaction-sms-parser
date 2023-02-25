/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line import/no-unresolved
import test from 'ava';

import { getTransactionInfo } from '../lib/engine';
import { IAccountType, ITransactionInfo } from '../lib/interface';
import { padCurrencyValue } from '../lib/utils';

// eslint-disable-next-line import/no-unresolved
import testCases from './testCases.json';

testCases.forEach((testCase, index) => {
  test(`${index + 2}: ${testCase.name}`, (t) => {
    const expected: ITransactionInfo = {
      account: {
        type: testCase.accountType as IAccountType,
        number: testCase.accountNumber
          ? testCase.accountNumber.toString()
          : null,
        name: null,
      },
      transactionAmount: testCase.transactionAmount
        ? padCurrencyValue(testCase.transactionAmount.toString())
        : null,
      transactionType: testCase.transactionType as 'debit' | 'credit' | null,
      balance: {
        available: testCase.balanceAvailable
          ? padCurrencyValue(testCase.balanceAvailable.toString())
          : null,
        outstanding: null,
      },
    };

    // @ts-ignore
    if (testCase.balanceOutstanding) {
      expected.balance.outstanding = padCurrencyValue(
        // @ts-ignore
        testCase.balanceOutstanding
      );
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
