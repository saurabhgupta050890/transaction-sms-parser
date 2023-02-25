const csv = require('csvtojson');
const path = require('path');
const fs = require('fs');
const smsParser = require('../build/main');

const smsBackupFile = path.join(__dirname, '..', 'data', 'sms_backup.csv');
const output = path.join(__dirname, '..', 'data', 'filtered.txt');

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

csv()
  .fromFile(smsBackupFile)
  .then((jsonObj) => {
    const filteredSms = jsonObj.filter((smsObj) => {
      const isPersonalMessage = /\d+/.test(smsObj.phoneNumber);
      const containsOtp = /otp/gi.test(smsObj.message.toLowerCase());
      const transactionObj = smsParser.getTransactionInfo(smsObj.message);
      // console.log(transactionObj);

      return (
        !isPersonalMessage && !containsOtp && isTransaction(transactionObj)
      );
    });

    fs.writeFileSync(
      output,
      filteredSms.map((obj) => obj.message).join('\n'),
      'utf-8'
    );
  });
