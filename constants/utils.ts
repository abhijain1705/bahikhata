import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {CustLierUser, Ledger} from '../common/interface/types';

export const web_client_id =
  '1052516404612-g41a49tejeq70io83c4i7didgerckvmk.apps.googleusercontent.com';

interface Aggregate {
  a?: CustLierUser[];
  b?: Ledger[];
  type: 'custlier' | 'ledger';
}

export function aggregate({a, b, type}: Aggregate) {
  const sortedArray = [type === 'custlier' ? [...a!] : [...b!]]
    .flat(1)
    .sort((x, y) => {
      const dateA = (
        x.accountCreatedDate as any as FirebaseFirestoreTypes.Timestamp
      )
        .toDate()
        .getTime();
      const dateB = (
        y.accountCreatedDate as any as FirebaseFirestoreTypes.Timestamp
      )
        .toDate()
        .getTime();
      return dateB - dateA;
    });

  let finalCustObj: {[key: string]: CustLierUser[]} = {};
  let finalLedgObj: {[key: string]: Ledger[]} = {};
  sortedArray.forEach(games => {
    if ('name' in games) {
      const custLierdata = games as CustLierUser;
      const timestamp =
        custLierdata.accountCreatedDate as any as FirebaseFirestoreTypes.Timestamp;
      let date = timestamp.toDate();
      let dateString = date.toLocaleDateString();
      if (finalCustObj[dateString]) {
        finalCustObj[dateString].push(custLierdata);
      } else {
        finalCustObj[dateString] = [custLierdata];
      }
    } else if ('entryType' in games) {
      const ledger = games as Ledger;
      // Process ledger object here
      const timestamp =
        games.accountCreatedDate as any as FirebaseFirestoreTypes.Timestamp;
      let date = timestamp.toDate();
      let dateString = date.toLocaleDateString();
      if (finalLedgObj[dateString]) {
        finalLedgObj[dateString].push(ledger);
      } else {
        finalLedgObj[dateString] = [ledger];
      }
    }
  });
  return {custlier: finalCustObj, ledger: finalLedgObj};
}

export function calculateEntryAge(dateString: string): string {
  const today = new Date();
  const dateParts = dateString.split('/');
  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Months are zero-based in JavaScript
  const year = parseInt(dateParts[2], 10);
  const date = new Date(year, month, day);

  const timeDiff = Math.abs(today.getTime() - date.getTime());
  const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return `${days} day old`;
}
