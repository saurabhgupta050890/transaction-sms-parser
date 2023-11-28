/* eslint-disable @typescript-eslint/ban-ts-comment */
import { test, expect } from "vitest";

import testCases from "./testCases.json";
import {
  IAccountType,
  ITransactionInfo,
  getTransactionInfo,
} from "../src/index";
import { padCurrencyValue } from "../src/library/utils";

testCases.forEach((testCase, index) => {
  test(`${index + 2}: ${testCase.name}`, () => {
    const expected: ITransactionInfo = {
      account: {
        type: testCase.accountType as IAccountType,
        number: testCase.accountNumber?.toString() ?? null,
        name: null,
      },
      transactionAmount: testCase.transactionAmount
        ? padCurrencyValue(testCase.transactionAmount.toString())
        : null,
      transactionType: testCase.transactionType as "debit" | "credit" | null,
      balance: {
        available: testCase.balanceAvailable
          ? padCurrencyValue(testCase.balanceAvailable.toString())
          : null,
        outstanding: null,
      },
      transactionDetails: {
        transactionId: testCase.transactionId?.toString() ?? null,
        merchantName: testCase.merchantName?.toLowerCase() ?? null,
      },
    };

    // @ts-ignore
    if (testCase.balanceOutstanding) {
      // @ts-ignore
      expected.balance.outstanding = padCurrencyValue(
        // @ts-ignore
        testCase.balanceOutstanding,
      );
    }

    // @ts-ignore
    if (testCase.accountName) {
      // @ts-ignore
      expected.account.name = testCase.accountName;
    }

    const actual = getTransactionInfo(testCase.message);

    expect(actual).to.deep.equal(expected);
  });
});
