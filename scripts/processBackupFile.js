const csv = require('csvtojson');
const path = require('path');
const fs = require('fs/promises');
const writeXlsxFile = require('write-excel-file/node');
const smsParser = require('../build/main');

const smsBackupsPath = path.join(__dirname, '..', 'data', 'csv');

// const smsBackupFile = path.join(__dirname, '..', 'data', 'sms_backup.csv');
const output = path.join(__dirname, '..', 'data', 'filtered.xlsx');
const ignored = path.join(__dirname, '..', 'data', 'ignored.xlsx');

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
    value: 'name',
  },
  {
    value: 'message',
  },
  {
    value: 'accountType',
  },
  {
    value: 'accountName',
  },
  {
    value: 'accountNo',
  },
  {
    value: 'transactionAmount',
  },
  {
    value: 'transactionType',
  },
  {
    value: 'balanceAvailable',
  },
  {
    value: 'balanceOutstanding',
  },
];

async function processSMS(dirPath) {
  const files = await fs.readdir(dirPath);
  const csvObjs = [];

  for (const file of files) {
    if (file.endsWith('.csv')) {
      const jsonArr = await csv().fromFile(path.join(smsBackupsPath, file));
      csvObjs.push(...jsonArr);
    }
  }

  const filteredData = [];
  filteredData.push(headers);
  const ignoredData = [];

  // console.log(csvObjs);

  csvObjs.forEach((obj, index) => {
    const isPersonalMessage = /^\d{10}$/.test(obj.phoneNumber);
    // otp is, otp for, your otp, otp to, this otp, is `word` otp, use otp, (otp), otp:, code is, One-Time Password
    const containsOtp =
      /otp\sis|otp\sfor|your\sotp|otp\sto|this\sotp|is\s(?:\w+\s)?otp|use\sotp|\(otp\)|otp\:|code\sis|One\-Time Password/gi.test(
        obj.message?.toLowerCase()
      );
    const transactionObj = smsParser.getTransactionInfo(obj.message);

    if (index === 0) {
      ignoredData.push(Object.keys(obj).map((key) => ({ value: key })));
    }

    if (!isPersonalMessage && !containsOtp && isTransaction(transactionObj)) {
      filteredData.push([
        { value: '' },
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
