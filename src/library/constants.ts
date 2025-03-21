import { IAccountType, type ICombinedWords } from "./interface";

export const availableBalanceKeywords = [
	"avbl bal",
	"available balance",
	"available limit",
	"available credit limit",
	"avbl. credit limit",
	"limit available",
	"a/c bal",
	"ac bal",
	"available bal",
	"avl bal",
	"updated balance",
	"total balance",
	"new balance",
	"bal",
	"avl lmt",
	"available",
];

export const outstandingBalanceKeywords = ["outstanding"];

export const wallets = ["paytm", "simpl", "lazypay", "amazon_pay"];

export const upiKeywords = ["upi", "ref no", "upi ref", "upi ref no"];

export const combinedWords: ICombinedWords[] = [
	{
		regex: /credit\scard/g,
		word: "c_card",
		type: IAccountType.CARD,
	},
	{
		regex: /amazon\spay/g,
		word: "amazon_pay",
		type: IAccountType.WALLET,
	},
	{
		regex: /uni\scard/g,
		word: "uni_card",
		type: IAccountType.CARD,
	},
	{
		regex: /niyo\scard/g,
		word: "niyo",
		type: IAccountType.ACCOUNT,
	},
	{
		regex: /slice\scard/g,
		word: "slice_card",
		type: IAccountType.CARD,
	},
	{
		regex: /one\s*card/g,
		word: "one_card",
		type: IAccountType.CARD,
	},
];

export const upiHandles = [
	"@BARODAMPAY",
	"@rbl",
	"@idbi",
	"@upi",
	"@aubank",
	"@axisbank",
	"@bandhan",
	"@dlb",
	"@indus",
	"@kbl",
	"@federal",
	"@sbi",
	"@uco",
	"@citi",
	"@citigold",
	"@dlb",
	"@dbs",
	"@freecharge",
	"@okhdfcbank",
	"@okaxis",
	"@oksbi",
	"@okicici",
	"@yesg",
	"@hsbc",
	"@idbi",
	"@icici",
	"@indianbank",
	"@allbank",
	"@kotak",
	"@ikwik",
	"@unionbankofindia",
	"@uboi",
	"@unionbank",
	"@paytm",
	"@ybl",
	"@axl",
	"@ibl",
	"@sib",
	"@yespay",
];
