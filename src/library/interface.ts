export enum IAccountType {
	CARD = "CARD",
	WALLET = "WALLET",
	ACCOUNT = "ACCOUNT",
}

export enum IBalanceKeyWordsType {
	AVAILABLE = "AVAILABLE",
	OUTSTANDING = "OUTSTANDING",
}

export interface IAccountInfo {
	type: IAccountType | null;
	number: string | null;
	name: string | null;
}

export interface IBalance {
	available: string | null;
	outstanding: string | null;
}

export type TMessageType = string | string[];
export type TTransactionType = "debit" | "credit" | null;

export interface ITransaction {
	type: TTransactionType | null;
	amount: string | null;
	referenceNo: string | null;
	merchant: string | null;
}

export interface ITransactionInfo {
	account: IAccountInfo;
	balance: IBalance | null;
	transaction: ITransaction;
}

export interface ICombinedWords {
	regex: RegExp;
	word: string;
	type: IAccountType;
}
