import fs from "node:fs";
import path from "node:path";
import excelToJson from "convert-excel-to-json";

const root = new URL("..", import.meta.url);

const testCasesJSONPath = path.join(
  __dirname,
  "..",
  "src",
  "tests",
  "testCases.json",
);

const result = excelToJson({
  sourceFile: path.join(__dirname, "..", "src", "tests", "testCases.xlsx"),
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
