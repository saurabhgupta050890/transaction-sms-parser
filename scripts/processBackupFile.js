const csv = require('csvtojson');
const path = require('path');
const writeXlsxFile = require('write-excel-file/node');
const smsParser = require('../build/main');

const smsBackupFile = path.join(__dirname, '..', 'data', 'sms_backup.csv');
const output = path.join(__dirname, '..', 'data', 'filtered.xlsx');

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
    name: 'name',
  },
  {
    name: 'message',
  },
  {
    name: 'accountType',
  },
  {
    name: 'accountName',
  },
  {
    name: 'accountNo',
  },
  {
    name: 'transactionAmount',
  },
  {
    name: 'transactionType',
  },
  {
    name: 'balanceAvailable',
  },
  {
    name: 'balanceOutstanding',
  },
];

csv()
  .fromFile(smsBackupFile)
  .then((jsonObj) => {
    const filteredData = [];

    jsonObj.forEach((obj) => {
      const isPersonalMessage = /\d+/.test(obj.phoneNumber);
      const containsOtp = /otp/gi.test(obj.message.toLowerCase());
      const transactionObj = smsParser.getTransactionInfo(obj.message);

      filteredData.push(headers);

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
      }
    });

    writeXlsxFile(filteredData, {
      filePath: output,
    });
  });
