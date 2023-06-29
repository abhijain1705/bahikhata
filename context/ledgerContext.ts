import {createContext, useContext} from 'react';
import {CustLierUser} from '../common/interface/types';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

interface LedgerDataContextType {
  lederData: {
    customer: {[key: string]: CustLierUser[]};
    supplier: {[key: string]: CustLierUser[]};
  };
  lastDocument: {
    customer: FirebaseFirestoreTypes.DocumentSnapshot<CustLierUser> | undefined;
    supplier: FirebaseFirestoreTypes.DocumentSnapshot<CustLierUser> | undefined;
  };
  setlastDocument: React.Dispatch<
    React.SetStateAction<{
      customer:
        | FirebaseFirestoreTypes.DocumentSnapshot<CustLierUser>
        | undefined;
      supplier:
        | FirebaseFirestoreTypes.DocumentSnapshot<CustLierUser>
        | undefined;
    }>
  >;
  setlederData: React.Dispatch<
    React.SetStateAction<{
      customer: {[key: string]: CustLierUser[]};
      supplier: {[key: string]: CustLierUser[]};
    }>
  >;
  loadingForMore: boolean;
  setloadingForMore: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ContextLedgerDataProvider = createContext<LedgerDataContextType>({
  lederData: {customer: {}, supplier: {}},
  setlederData: () => {},
  lastDocument: {customer: undefined, supplier: undefined},
  setlastDocument: () => {},
  loadingForMore: false,
  setloadingForMore: () => {},
});

export const UseLederDataContext = () => useContext(ContextLedgerDataProvider);
