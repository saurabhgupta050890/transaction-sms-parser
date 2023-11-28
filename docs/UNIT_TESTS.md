# How to setup and run Unit Tests

Data driven unit testing setup is created for this project. I have chosen excel for the data input as its easy to use and setup.

## Project setup:

This project uses `vite` and `vitest` which requires `node` (currently >=18). Other supported runtime environments should also 
work but haven't tested. Feel free to modify and run with other environments.

1. Run `npm install` to install the dependencies. In case you use any other package management tool please remove `package-lock.json` unless its supported.
2. Run `npm run build` to generate a compiled build inside `dist` folder

## Steps to prepare and run unit tests:

1. Rename file `tests/testCases.example.xlsx` to `testCases.xlsx`.
2. Paste your test data in the excel sheet in the exact format. (DO NOT MODIFY EXCEL STRUCTURE)
3. Run script `node scripts/prepareTestData.js`
4. A json file will be generated at `tests/testCases.json`
5. Run command  `npm run test`


## Excel Guide

Test case excel has following columns:
1. name: name of the test case
2. message: Actual SMS
3. accountType: Expected account type (WALLET, BANK, CREDIT)
4. accountName: Expected account name
5. accountNumber: Expected account number
6. transactionAmount: Transaction amount
7. transactionType: Transaction type
8. balanceAvailable: Available balance (if present)
9. balanceOutstanding: Outstanding balance (in case of credit cards)
10. merchantName: Name of the merchant (in case of UPI if upi reference number is not present)
11. transactionId: Transaction reference number (currently only for UPI)

## Test Data preparation

1. On Android you can use [SMS, Call - XML, PDF, CSV(Super Backup & Restore)](https://play.google.com/store/apps/details?id=com.greenchills.superbackup) to export inbox as csv
2. Put the .csv files in `data/csv`
3. Run script `node scripts/prepareTestData.js`
4. 2 excel files will be generated `filtered.xlsx` and `ignored.xlsx` inside `data`
5. Append contents of `filtered.xlsx` to `testCases.xlsx`

Note: `ignored.xlsx` might also contain transaction messages which library was not able to parse. 