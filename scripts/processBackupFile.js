import csv from "csvtojson";
import path from "node:path";
import fs from "node:fs/promises";
import writeXlsxFile from "write-excel-file/node";
import { getTransactionInfo } from "../dist/lib";

const root = new URL("..", import.meta.url);

const smsBackupsPath = new URL("data/csv", root);
// console.log(smsBackupsPath);

const output = new URL("data/filtred.xlsx", root);
const ignored = new URL("data/ignored.xlsx", root);

const isTransaction = (transactionObj) => {
  const {
    account: { type, name, number },
    transactionAmount,
    transactionType,
  } = transactionObj;

  if (type || name || number || transactionAmount || transactionType) {
    return true;
  } else {
    return false;
  }
};

const headers = [
  {
    value: "name",
  },
  {
    value: "message",
  },
  {
    value: "accountType",
  },
  {
    value: "accountName",
  },
  {
    value: "accountNo",
  },
  {
    value: "transactionAmount",
  },
  {
    value: "transactionType",
  },
  {
    value: "balanceAvailable",
  },
  {
    value: "balanceOutstanding",
  },
];

async function processSMS(dirPath) {
  const files = await fs.readdir(dirPath);
  const csvObjs = [];

  for (const file of files) {
    if (file.endsWith(".csv")) {
      const jsonArr = await csv().fromFile(
        path.join(smsBackupsPath.pathname, file),
      );
      // console.log(jsonArr)
      csvObjs.push(...jsonArr);
    }
  }

  const filteredData = [];
  filteredData.push(headers);
  const ignoredData = [];

  // console.log(csvObjs);

  csvObjs.forEach((obj, index) => {
    const isPersonalMessage = /\d+/.test(obj.phoneNumber);
    const containsOtp = /otp/gi.test(obj.message?.toLowerCase());
    const transactionObj = getTransactionInfo(obj.message);

    if (index === 0) {
      ignoredData.push(Object.keys(obj).map((key) => ({ value: key })));
    }

    if (!isPersonalMessage && !containsOtp && isTransaction(transactionObj)) {
      filteredData.push([
        { value: "" },
        { value: obj.message },
        { value: transactionObj.account.type },
        { value: transactionObj.account.name },
        { value: transactionObj.account.number },
        { value: transactionObj.transactionAmount },
        { value: transactionObj.transactionType },
        { value: transactionObj.balance.available },
        { value: transactionObj.balance.outstanding },
      ]);
    } else {
      ignoredData.push(Object.values(obj).map((val) => ({ value: val })));
    }
  });

  // console.log(filteredData);

  writeXlsxFile(filteredData, {
    filePath: output,
  });

  writeXlsxFile(ignoredData, {
    filePath: ignored,
  });
}

processSMS(smsBackupsPath);
