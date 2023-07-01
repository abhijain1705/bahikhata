import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {CustLierUser, Ledger, UserInterface} from '../common/interface/types';

interface CommonFunctionType {
  timeCallback: (value: boolean) => void;
  callingSnackBar?: (type: 'error' | 'success', mesage: string) => void;
  setErrorMsg?: (value: string) => void;
}

const showSnackBar = (
  callingSnackBar: (type: 'error' | 'success', mesage: string) => void,
  type: 'error' | 'success',
  message: string
) => {
  callingSnackBar(type, message);
};

interface AddUserToDatabaseProp extends CommonFunctionType {
  user: FirebaseAuthTypes.User;
  userData: UserInterface;
}

const addUserToDatabase = ({
  user,
  userData,
  timeCallback,
  callingSnackBar,
}: AddUserToDatabaseProp) => {
  const db = firebase.firestore();
  db.collection('appusers')
    .doc(user.uid)
    .set({
      ...userData,
      // add any other user data that you want to store
    })
    .then(() => {
      showSnackBar(callingSnackBar!, 'success', 'Account Created Successfully');
      timeCallback(false);
    })
    .catch(err => {
      console.log(err, 'err');
      showSnackBar(callingSnackBar!, 'error', 'Error occured try again later');
      timeCallback(false);
      return;
    });
};

interface UpdateUserDoc extends CommonFunctionType {
  updateState: (userData: Partial<UserInterface>) => void;
  userData: Partial<UserInterface>;
}

export const updateUserDoc = ({
  updateState,
  userData,
  timeCallback,
  callingSnackBar,
}: UpdateUserDoc) => {
  timeCallback(true);
  const db = firebase.firestore();
  db.collection('appusers')
    .doc(userData.uid)
    .update({...userData})
    .then(() => {
      showSnackBar(callingSnackBar!, 'success', 'Profile Updated Successfully');
      timeCallback(false);
      setTimeout(() => {
        updateState(userData);
      }, 2000);
    })
    .catch(err => {
      console.log(err, 'err');
      showSnackBar(callingSnackBar!, 'error', 'Error Occured, Try Again Later');
      timeCallback(false);
      return;
    });
};

interface SignInProp extends CommonFunctionType {
  setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>;
}

export const signIn = async ({
  timeCallback,
  callingSnackBar,
  setUser,
}: SignInProp) => {
  try {
    timeCallback(true);
    console.log('started');

    const permission = await GoogleSignin.hasPlayServices();
    if (permission) {
      console.log(permission, 'permission');
      // await GoogleSignin.signOut();
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();
      console.log('idToken', idToken);
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredentials = auth().signInWithCredential(googleCredential);
      const userCreated = await (await userCredentials).user;
      console.log('half done', userCreated);
      if ((await userCredentials).additionalUserInfo?.isNewUser) {
        const firstBusiness = uuid.v4();
        addUserToDatabase({
          user: userCreated,
          timeCallback,
          callingSnackBar,
          userData: {
            name: userCreated.displayName ?? '',
            email: userCreated.email ?? '',
            dateOfJoin: new Date(),
            currentFirmId: firstBusiness.toString() + userCreated.uid,
            business: {
              [firstBusiness.toString() + userCreated.uid]: {
                firmid: firstBusiness.toString() + userCreated.uid,
                name: 'Business 1',
                address: 'Jaipur Rajasthan , India',
                phoneNumber: '+919876543210',
                gst: 'business gst',
                category: 'Agriculture',
                type: 'Retailer',
                dateOfCreation: new Date(),
                customer: {payable: 0, recieviable: 0},
                supplier: {payable: 0, recieviable: 0},
                invoice: {
                  sales: {count: 0, value: 0},
                  purchase: {count: 0, value: 0},
                },
              },
            },
            uid: userCreated.uid,
          },
        });
      } else {
        console.log('already found');
        await fetchUserData({setUserValue: setUser, user: userCreated});
      }
      timeCallback(false);
    }
  } catch (error: any) {
    console.log(error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      showSnackBar(callingSnackBar!, 'error', 'Sign in Popup cancelled');
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      showSnackBar(callingSnackBar!, 'error', 'Signing is in progress');
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      showSnackBar(
        callingSnackBar!,
        'error',
        'We are sorry, currently that service is unavailable'
      );
      // play services not available or outdated
    } else {
      console.log('error', error);

      showSnackBar(callingSnackBar!, 'error', 'Error occured try again later');
      // some other error happened
    }
    timeCallback(false);
  }
};

interface fetchUserInterface {
  setUserValue: (value: UserInterface | null) => void;
  user: FirebaseAuthTypes.User | null;
}

export const fetchUserData = async ({
  setUserValue,
  user,
}: fetchUserInterface) => {
  try {
    if (user) {
      const docRef = firebase.firestore().collection('appusers').doc(user.uid);
      docRef.onSnapshot(doc => {
        if (doc.exists) {
          const userData = doc.data() as UserInterface;
          setUserValue(userData);
        } else {
          setUserValue(null);
        }
      });
    } else {
      setUserValue(null);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

interface FetchCustlierUsersByDateRangeProps extends CommonFunctionType {
  userType: 'customer' | 'supplier';
  userid: string;
  startDate: Date;
  endDate: Date;
  businessId: string;
}

export const fetchCustlierUsersByDateRange = async ({
  userType,
  userid,
  timeCallback,
  callingSnackBar,
  startDate,
  endDate,
  businessId,
}: FetchCustlierUsersByDateRangeProps) => {
  try {
    timeCallback(true);
    const db = firebase.firestore();
    const collectionRef = db
      .collection('appusers')
      .doc(userid)
      .collection('custlierusers');

    // Convert start and end dates to Firebase Timestamps
    const startTimestamp = firebase.firestore.Timestamp.fromDate(startDate);
    const endTimestamp = firebase.firestore.Timestamp.fromDate(endDate);

    let query = collectionRef
      .where('userType', '==', userType)
      .where('businessId', '==', businessId)
      .orderBy('accountCreatedDate', 'desc')
      .startAt(startTimestamp)
      .endAt(endTimestamp);

    const snapshot = await query.get();
    console.log('snapshot', snapshot.empty, snapshot.docs);
    timeCallback(false);
    showSnackBar(callingSnackBar!, 'success', 'successfully fetched data');
    return snapshot;
  } catch (error) {
    timeCallback(false);
    showSnackBar(callingSnackBar!, 'error', 'Error occured try again later');
    // Handle the error appropriately (e.g., logging, displaying an error message)
    console.error('Error fetching custlier users:', error);
    throw error;
  }
};

interface FetchCustlierUsersProps extends CommonFunctionType {
  userid: string;
  lastDocument?: FirebaseFirestoreTypes.DocumentSnapshot<CustLierUser>;
  name?: string;
  userType: 'customer' | 'supplier';
  businessid: string;
}

export const fetchCustierUserByName = async ({
  userid,
  timeCallback,
  setErrorMsg,
  name,
  userType,
  businessid,
}: FetchCustlierUsersProps) => {
  try {
    timeCallback(true);
    const db = firebase.firestore();
    const collectionRef = db
      .collection('appusers')
      .doc(userid)
      .collection('custlierusers');

    let query = collectionRef
      .where('userType', '==', userType!)
      .where('businessId', '==', businessid)
      .where('name', '>=', name)
      .where('name', '<=', name + '\uf8ff');

    const snapshot = await query.get();
    timeCallback(false);
    return snapshot;
  } catch (error) {
    timeCallback(false);
    setErrorMsg!(`Error occured while fetching users`);
    // Handle the error appropriately (e.g., logging, displaying an error message)
    console.error('Error fetching custlier users:', error);
    throw error;
  }
};

export const fetchCustlierUsers = async ({
  lastDocument,
  userid,
  timeCallback,
  businessid,
  userType,
  setErrorMsg,
}: FetchCustlierUsersProps) => {
  try {
    timeCallback(true);
    const db = firebase.firestore();
    const collectionRef = db
      .collection('appusers')
      .doc(userid)
      .collection('custlierusers');

    let query = collectionRef
      // .orderBy('accountCreatedDate', 'desc')
      .where('userType', '==', userType)
      .where('businessId', '==', businessid)
      .limit(10); // Order the documents by 'name' field and limit to 10 documents

    if (lastDocument) {
      query = query.startAfter(lastDocument);
    }

    const snapshot = await query.get();
    timeCallback(false);
    return snapshot;
  } catch (error) {
    console.error('Error fetching custlier users:', error);
    timeCallback(false);
    setErrorMsg!(`Error occured while fetching users`);
    // Handle the error appropriately (e.g., logging, displaying an error message)
    throw error;
  }
};

interface CheckIfCustlierUserExistsProp extends CommonFunctionType {
  userid: string;
  phoneNumber: any;
}

export const checkIfCustlierUserExists = async ({
  phoneNumber,
  userid,
  timeCallback,
  callingSnackBar,
}: CheckIfCustlierUserExistsProp) => {
  try {
    timeCallback(true);
    const db = firebase.firestore();
    const appUsersCollectionRef = db
      .collection('appusers')
      .doc(userid)
      .collection('custlierusers'); // Replace 'subcollection' with the desired name of the subcollection
    // Check if user with mobile number already exists
    const querySnapshot = await appUsersCollectionRef
      .where('phoneNumber', '==', phoneNumber)
      .get();
    timeCallback(false);
    return querySnapshot;
  } catch (error) {
    timeCallback(false);
    // Handle the error appropriately (e.g., logging, displaying an error message)
    console.error('Error creating app user:', error);
    showSnackBar(callingSnackBar!, 'error', 'Error in saving User');
    throw error;
  }
};

interface CreateNewCustLierUserProp extends CommonFunctionType {
  custLierUser: CustLierUser;
  userid: string;
  businessid: string;
  whatIfFail: () => void;
  whatIfSucceedd: () => void;
}

export const createNewCustLierUser = async ({
  custLierUser,
  userid,
  businessid,
  timeCallback,
  callingSnackBar,
  whatIfFail,
  whatIfSucceedd,
}: CreateNewCustLierUserProp): Promise<void> => {
  try {
    timeCallback(true);
    const db = firebase.firestore();
    const appUsersCollectionRef = db
      .collection('appusers')
      .doc(userid)
      .collection('custlierusers'); // Replace 'subcollection' with the desired name of the subcollection

    await appUsersCollectionRef.doc(businessid + Date.now()).set({
      ...custLierUser,
      docId: businessid + Date.now(),
      businessId: businessid,
    });
    timeCallback(false);
    showSnackBar(callingSnackBar!, 'success', 'User Account Created');
    whatIfSucceedd();
  } catch (error) {
    timeCallback(false);
    // Handle the error appropriately (e.g., logging, displaying an error message)
    console.error('Error creating app user:', error);
    showSnackBar(callingSnackBar!, 'error', 'Error in saving User');
    whatIfFail();
    throw error;
  }
};

interface CustlierUserDocRefer extends CommonFunctionType {
  userid: string;
  docId: string;
  endCallback: () => void;
  dataToUpdate?: Partial<CustLierUser>;
}

export async function updateCustlierUser(
  options: CustlierUserDocRefer
): Promise<void> {
  const {
    docId,
    userid,
    dataToUpdate,
    timeCallback,
    endCallback,
    callingSnackBar,
  } = options;

  try {
    timeCallback(true);
    await firebase
      .firestore()
      .collection('appusers')
      .doc(userid)
      .collection('custlierusers')
      .doc(docId)
      .update({...dataToUpdate});
    timeCallback(false);
    showSnackBar(callingSnackBar!, 'success', 'Update Made Successfully');
    endCallback();
  } catch (error) {
    timeCallback(false);
    showSnackBar(callingSnackBar!, 'error', 'Error occured, Try again later!');
    endCallback();
    throw error; // Rethrow the error to handle it in the calling code
  }
}

export async function deleteCustlierUser(
  options: CustlierUserDocRefer
): Promise<void> {
  const {docId, userid, timeCallback, endCallback, callingSnackBar} = options;

  try {
    timeCallback(true);
    await firebase
      .firestore()
      .collection('appusers')
      .doc(userid)
      .collection('custlierusers')
      .doc(docId)
      .delete();
    timeCallback(false);
    console.log(`USer Account Deleted`);
    showSnackBar(callingSnackBar!, 'success', 'User Account Created');
    endCallback();
  } catch (error) {
    timeCallback(false);
    showSnackBar(callingSnackBar!, 'error', 'Error occured, Try again later!');
    console.error(`Error deleting document with ID ${docId}:`, error);
    endCallback();
    throw error; // Rethrow the error to handle it in the calling code
  }
}

interface AddNewLedgerProp extends CommonFunctionType {
  userid: string;
  businessid: string;
  ledgerData: Ledger;
  imagePath: string;
}

export const addNewLedger = async ({
  userid,
  businessid,
  ledgerData,
  timeCallback,
  imagePath,
  callingSnackBar,
}: AddNewLedgerProp) => {
  try {
    let accountid = uuid.v4();
    accountid = accountid.toString() + Date.now();
    timeCallback(true);

    let downloadURL = '';
    if (imagePath) {
      // Create a reference to the Firebase Storage bucket
      const reference = storage().ref('ledgerReference/' + accountid);

      // Upload the image to Firebase Storage
      await reference.putFile(imagePath);

      // Get the download URL of the uploaded image
      downloadURL = await reference.getDownloadURL();
    }

    await firebase
      .firestore()
      .collection('appusers')
      .doc(userid)
      .collection('custlierusers')
      .doc(businessid)
      .collection('ledger')
      .doc(accountid)
      .set({...ledgerData, docid: accountid, billPhoto: downloadURL});
    timeCallback(false);
    showSnackBar(callingSnackBar!, 'success', 'Entry Added to Ledger');
  } catch (error) {
    timeCallback(false);
    showSnackBar(callingSnackBar!, 'error', 'Error occured, Try again later!');
    console.error(`Error occured:`, error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};
