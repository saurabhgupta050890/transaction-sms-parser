import fs from "node:fs";
import excelToJson from "convert-excel-to-json";

const root = new URL("..", import.meta.url);

const testCasesJSONPath = new URL('tests/testCases.json', root);

const result = excelToJson({
  sourceFile: (new URL("tests/testCases.xlsx", root)).pathname,
  header: {
    rows: 1,
  },
  columnToKey: {
    A: "name",
    B: "message",
    C: "accountType",
    D: "accountName",
    E: "accountNumber",
    F: "transactionAmount",
    G: "transactionType",
    H: "balanceAvailable",
    I: "balanceOutstanding",
    J: "merchantName",
    K: "transactionId",
  },
});

console.log(result);

fs.writeFileSync(
  testCasesJSONPath,
  JSON.stringify(result.Sheet1, null, 4),
  "utf-8",
);
