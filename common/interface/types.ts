import BottomSheet from '@gorhom/bottom-sheet';
import Contacts from 'react-native-contacts';

export interface UserInterface {
  email: string;
  name: string;
  dateOfJoin: Date;
  currentFirmId: string;
  business: {
    [key: string]: {
      firmid: string;
      phoneNumber: string;
      name: string;
      address: string;
      gst: string;
      category: string;
      type: string;
      dateOfCreation: Date;
      customer: {payable: number; recieviable: number};
      supplier: {payable: number; recieviable: number};
      invoice: {
        sales: {
          count: number;
          value: number;
        };
        purchase: {
          count: number;
          value: number;
        };
      };
    };
  };
  uid: string;
}

export type RootStackParamList = {
  SignInScreen: undefined;
  HomeScreen: undefined;
  SettingScreen: undefined;
  ViewReport: {
    type: 'customer' | 'supplier';
    loadMore: (screenType: 'customer' | 'supplier') => void;
  };
  EntryScreen: {
    type: 'debit' | 'credit';
    custLierUser: CustLierUser;
  };
  EditScreen: {type: string; custlierUser?: CustLierUser};
  AddDataScreen: {
    type: 'data' | 'account';
    selectedContact?: Contacts.Contact;
    screenType?: 'customer' | 'supplier';
  };
  ContactScreen: {
    contacts: Contacts.Contact[];
    screenType: 'customer' | 'supplier';
  };
  SingleUserAccountScreen: {custLierUser: CustLierUser} | undefined;
  UserProfile: {custLierUser: CustLierUser};
};

export type TabParamList = {
  LedgerScreen: {bottomSheetRef: React.RefObject<BottomSheet>};
  BillScreen: undefined;
  ProfileScreen: undefined;
};

// customer + supplier
export interface CustLierUser {
  name: string;
  address: string;
  phoneNumber: string;
  gst: string;
  accountCreatedDate: Date;
  payable: number;
  receivable: number;
  userType: 'customer' | 'supplier';
  docId: string;
  businessId: string;
}

export type Ledger = {
  docid: string;
  dateOfLedger: Date;
  billNo: string;
  msg: string;
  entryType: 'debit' | 'credit';
  amount: string;
  wroteAgainst: string;
  wroteBy: string;
  billPhoto: string;
};
