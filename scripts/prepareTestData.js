const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const path = require('path');

const testCasesJSONPath = path.join(
  __dirname,
  '..',
  'src',
  'tests',
  'testCases.json'
);

const result = excelToJson({
  sourceFile: path.join(__dirname, '..', 'src', 'tests', 'testCases.xlsx'),
  header: {
    rows: 1,
  },
  columnToKey: {
    A: 'name',
    B: 'message',
    C: 'accountType',
    D: 'accountName',
    E: 'accountNumber',
    F: 'transactionAmount',
    G: 'transactionType',
    H: 'balanceAvailable',
    I: 'balanceOutstanding',
  },
});

fs.writeFileSync(
  testCasesJSONPath,
  JSON.stringify(result.Sheet1, null, 4),
  'utf-8'
);
