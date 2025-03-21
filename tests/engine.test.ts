/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expect, test } from "vitest";

import {
	type IAccountType,
	type ITransactionInfo,
	getTransactionInfo,
} from "../src/index";
import { padCurrencyValue } from "../src/library/utils";

import testCases from "./testCases.json";

testCases.forEach((testCase, index) => {
	test(`${index + 2}: ${testCase.name}`, () => {
		const expected: ITransactionInfo = {
			account: {
				type: testCase.accountType as IAccountType,
				number: testCase.accountNumber?.toString() ?? null,
				name: null,
			},
			balance: {
				available: testCase.balanceAvailable
					? padCurrencyValue(testCase.balanceAvailable.toString())
					: null,
				outstanding: null,
			},
			transaction: {
				type: testCase.transactionType as "debit" | "credit" | null,
				amount: testCase.transactionAmount
					? padCurrencyValue(testCase.transactionAmount.toString())
					: null,
				referenceNo: testCase.transactionId?.toString() ?? null,
				merchant: testCase.merchantName?.toLowerCase() ?? null,
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
