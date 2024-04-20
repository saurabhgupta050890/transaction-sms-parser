# Transaction SMS Parser

A library to parse transaction sms text to extract relevant information from it. A naive implementation using mostly regular expressions.
Try the [Live App](https://transaction-tracker-9mqr.onrender.com) to check the functionality

## Installation

```
npm install transaction-sms-parser
```

## How to use

The main method to use be used is:

```ts
getTransactionInfo(message: string): ITransactionInfo
```

It takes sms text as input and will give an object of `ITransactionInfo` type

```ts
interface ITransactionInfo {
  account: IAccountInfo;
  balance: IBalance | null;
  transaction: ITransaction;
}

interface IBalance {
  available: string | null;
  outstanding: string | null;
}

interface IAccountInfo {
  type: IAccountType | null;
  number: string | null;
  name: string | null;
}

enum IAccountType {
  CARD = 'CARD',
  WALLET = 'WALLET',
  ACCOUNT = 'ACCOUNT',
}

interface ITransaction {
  type: TTransactionType | null;
  amount: string | null;
  referenceNo: string | null;
  merchant: string | null;
}

type TTransactionType = "debit" | "credit" | null;
```

### Example

```ts
import { getTransactionInfo } from 'transaction-sms-parser';

const sms =
  'INR 2000 debited from A/c no. XX3423 on 05-02-19 07:27:11 IST at ECS PAY. Avl Bal- INR 2343.23.';

const transactionInfo = getTransactionInfo(sms);
```

```js
//output
{
    account: {
      type: 'ACCOUNT',
      number: '3423',
      name: null,
    },
    balance: { available: '2343.23', outstanding: null },
    transaction: {
      type: 'debit',
      amount: '2343.23',
      referenceNo: null,
      merchant: null,
    }
}
```

## Testing

[How to unit test ?](./docs/UNIT_TESTS.md)

Tested with the SMS text from following banks/cards/wallets:

Banks:

- Axis
- ICICI
- Kotak
- HDFC
- Standard Charted
- IDFC
- Niyo global
- SBM Bank 
- Federal Bank

Credit Cards:

- HSBC
- Citi Bank
- Sodexo
- ICICI
- Uni Card
- Indusind Bank
- Slice
- One card
- HDFC
- IDFC

Wallets

- Paytm
- Amazon pay
- Lazypay
- Simpl
- Paytm postpaid
