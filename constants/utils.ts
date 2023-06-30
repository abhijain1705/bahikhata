import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {CustLierUser} from '../common/interface/types';

export const web_client_id =
  '1052516404612-g41a49tejeq70io83c4i7didgerckvmk.apps.googleusercontent.com';

export function aggregate(a: CustLierUser[]) {
  const sortedArray = a.sort((x, y) => {
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

  let finalObj: {[key: string]: CustLierUser[]} = {};
  sortedArray.forEach(games => {
    const timestamp =
      games.accountCreatedDate as any as FirebaseFirestoreTypes.Timestamp;
    let date = timestamp.toDate();
    let dateString = date.toLocaleDateString();
    if (finalObj[dateString]) {
      finalObj[dateString].push(games);
    } else {
      finalObj[dateString] = [games];
    }
  });
  return finalObj;
}
