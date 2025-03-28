import getAccount from "./account";
import getBalance from "./balance";
import {
	IAccountType,
	type IBalance,
	IBalanceKeyWordsType,
	type ITransactionInfo,
	type TMessageType,
	type TTransactionType,
} from "./interface";
import extractMerchantInfo from "./merchant";
import { getProcessedMessage, padCurrencyValue, processMessage } from "./utils";

export const getTransactionAmount = (message: TMessageType): string => {
	const processedMessage = getProcessedMessage(message);
	const index = processedMessage.indexOf("rs.");

	// If "rs." does not exist
	// Return ""
	if (index === -1) {
		return "";
	}
	let money = message[index + 1];

	money = money.replace(/,/g, "");

	// If data is false positive
	// Look ahead one index and check for valid money
	// Else return the found money
	if (Number.isNaN(Number(money))) {
		money = message[index + 2];
		money = money?.replace(/,/g, "");

		// If this is also false positive, return ""
		// Else return the found money
		if (Number.isNaN(Number(money))) {
			return "";
		}
		return padCurrencyValue(money);
	}
	return padCurrencyValue(money);
};

export const getTransactionType = (message: TMessageType): TTransactionType => {
	const creditPattern =
		/(?:credited|credit|deposited|added|received|refund|repayment)/gi;
	const debitPattern = /(?:debited|debit|deducted)/gi;
	const miscPattern =
		/(?:payment|spent|paid|used\s+at|charged|transaction\son|transaction\sfee|tran|booked|purchased|sent\s+to|purchase\s+of|spent\s+on)/gi;

	const messageStr = typeof message !== "string" ? message.join(" ") : message;

	if (debitPattern.test(messageStr)) {
		return "debit";
	}
	if (miscPattern.test(messageStr)) {
		return "debit";
	}
	if (creditPattern.test(messageStr)) {
		return "credit";
	}

	return null;
};

export const getTransactionInfo = (message: string): ITransactionInfo => {
	if (!message || typeof message !== "string") {
		return {
			account: {
				type: null,
				number: null,
				name: null,
			},
			balance: null,
			transaction: {
				type: null,
				amount: null,
				merchant: null,
				referenceNo: null,
			},
		};
	}

	const processedMessage = processMessage(message);
	const account = getAccount(processedMessage);
	const availableBalance = getBalance(
		processedMessage,
		IBalanceKeyWordsType.AVAILABLE,
	);
	const transactionAmount = getTransactionAmount(processedMessage);
	const isValid =
		[availableBalance, transactionAmount, account.number].filter(
			(x) => x !== "",
		).length >= 2;
	const transactionType = isValid ? getTransactionType(processedMessage) : null;
	const balance: IBalance = { available: availableBalance, outstanding: null };

	if (account && account.type === IAccountType.CARD) {
		balance.outstanding = getBalance(
			processedMessage,
			IBalanceKeyWordsType.OUTSTANDING,
		);
	}

	const { merchant, referenceNo } = extractMerchantInfo(message);

	// console.log(processedMessage);
	// console.log(account, balance, transactionAmount, transactionType);
	// console.log('-----------------------------------------------------');
	return {
		account,
		balance,
		transaction: {
			type: transactionType,
			amount: transactionAmount,
			merchant: merchant,
			referenceNo: referenceNo,
		},
	};
};
