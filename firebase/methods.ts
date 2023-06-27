import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/firestore';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {CustLierUser, UserInterface} from '../common/interface/types';

const showSnackBar = (
  callingSnackBar: (type: 'error' | 'success', mesage: string) => void,
  type: 'error' | 'success',
  message: string
) => {
  callingSnackBar(type, message);
};

const addUserToDatabase = (
  user: FirebaseAuthTypes.User,
  timeCallback: (value: boolean) => void,
  callingSnackBar: (type: 'error' | 'success', mesage: string) => void,
  userData: UserInterface
) => {
  const db = firebase.firestore();
  db.collection('appusers')
    .doc(user.uid)
    .set({
      ...userData,
      // add any other user data that you want to store
    })
    .then(() => {
      showSnackBar(callingSnackBar, 'success', 'Account Created Successfully');
      timeCallback(false);
    })
    .catch(err => {
      console.log(err, 'err');
      showSnackBar(callingSnackBar, 'error', 'Error occured try again later');
      timeCallback(false);
      return;
    });
};

export const updateUserDoc = (
  updateState: (userData: Partial<UserInterface>) => void,
  timeCallback: (value: boolean) => void,
  callingSnackBar: (type: 'error' | 'success', mesage: string) => void,
  userData: Partial<UserInterface>
) => {
  timeCallback(true);
  const db = firebase.firestore();
  db.collection('appusers')
    .doc(userData.uid)
    .update({...userData})
    .then(() => {
      showSnackBar(callingSnackBar, 'success', 'Profile Updated Successfully');
      timeCallback(false);
      setTimeout(() => {
        updateState(userData);
      }, 2000);
    })
    .catch(err => {
      console.log(err, 'err');
      showSnackBar(callingSnackBar, 'error', 'Error Occured, Try Again Later');
      timeCallback(false);
      return;
    });
};

export const signIn = async (
  timeCallback: (value: boolean) => void,
  callingSnackBar: (type: 'error' | 'success', mesage: string) => void,
  setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>
) => {
  try {
    timeCallback(true);
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signOut();
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const userCredentials = auth().signInWithCredential(googleCredential);
    const userCreated = await (await userCredentials).user;
    if ((await userCredentials).additionalUserInfo?.isNewUser) {
      const firstBusiness = uuid.v4();
      addUserToDatabase(userCreated, timeCallback, callingSnackBar, {
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
      });
    } else {
      await fetchUserData({setUserValue: setUser, user: userCreated});
    }
    timeCallback(false);
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      showSnackBar(callingSnackBar, 'error', 'Sign in Popup cancelled');
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      showSnackBar(callingSnackBar, 'error', 'Signing is in progress');
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      showSnackBar(
        callingSnackBar,
        'error',
        'We are sorry, currently that service is unavailable'
      );
      // play services not available or outdated
    } else {
      console.log('error', error);

      showSnackBar(callingSnackBar, 'error', 'Error occured try again later');
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

interface FetchCustlierUsersProps {
  userid: string;
  lastDocument?: FirebaseFirestoreTypes.DocumentSnapshot<CustLierUser>;
  userType: 'customer' | 'supplier';
  timeToCall: (value: boolean) => void;
  setErrorMsg: (value: string) => void;
}

export const fetchCustlierUsers = async ({
  userType,
  lastDocument,
  userid,
  timeToCall,
  setErrorMsg,
}: FetchCustlierUsersProps) => {
  try {
    timeToCall(true);
    const db = firebase.firestore();
    const collectionRef = db
      .collection('appusers')
      .doc(userid)
      .collection('custlierusers');

    let query = collectionRef
      .orderBy('accountCreatedDate', 'desc')
      .where('userType', '==', userType)
      .limit(10); // Order the documents by 'name' field and limit to 10 documents

    if (lastDocument) {
      query = query.startAfter(lastDocument);
    }

    const snapshot = await query.get();
    timeToCall(false);
    return snapshot;
  } catch (error) {
    timeToCall(false);
    setErrorMsg(`Error occured while fetching ${userType}`);
    // Handle the error appropriately (e.g., logging, displaying an error message)
    console.error('Error fetching custlier users:', error);
    throw error;
  }
};

interface CreateNewCustLierUserProp {
  custLierUser: CustLierUser;
  userid: string;
  businessid: string;
  timeCallback: (value: boolean) => void;
  callingSnackBar: (type: 'error' | 'success', mesage: string) => void;
  whatIfFail: () => void;
  whatIfSucceedd: () => void;
  ifAlreadyExists: () => void;
}

export const createNewCustLierUser = async ({
  custLierUser,
  userid,
  businessid,
  timeCallback,
  callingSnackBar,
  whatIfFail,
  whatIfSucceedd,
  ifAlreadyExists,
}: CreateNewCustLierUserProp): Promise<void> => {
  try {
    timeCallback(true);
    const db = firebase.firestore();
    const appUsersCollectionRef = db
      .collection('appusers')
      .doc(userid)
      .collection('custlierusers'); // Replace 'subcollection' with the desired name of the subcollection

    // Check if user with mobile number already exists
    const querySnapshot = await appUsersCollectionRef
      .where('phoneNumber', '==', custLierUser.phoneNumber)
      .get();

    if (querySnapshot.empty) {
      await appUsersCollectionRef
        .doc(businessid + Date.now())
        .set({...custLierUser, docId: businessid + Date.now()});
      timeCallback(false);
      showSnackBar(callingSnackBar, 'success', 'User Account Created');
      whatIfSucceedd();
    } else {
      ifAlreadyExists();
    }
  } catch (error) {
    timeCallback(false);
    // Handle the error appropriately (e.g., logging, displaying an error message)
    console.error('Error creating app user:', error);
    showSnackBar(callingSnackBar, 'error', 'Error in saving User');
    whatIfFail();
    throw error;
  }
};

interface CustlierUserDocRefer {
  userid: string;
  docId: string;
  timeCallback: (value: boolean) => void;
  callingSnackBar: (type: 'error' | 'success', mesage: string) => void;
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
    showSnackBar(callingSnackBar, 'success', 'Update Made Successfully');
    endCallback();
  } catch (error) {
    timeCallback(false);
    showSnackBar(callingSnackBar, 'error', 'Error occured, Try again later!');
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
    showSnackBar(callingSnackBar, 'success', 'User Account Created');
    endCallback();
  } catch (error) {
    timeCallback(false);
    showSnackBar(callingSnackBar, 'error', 'Error occured, Try again later!');
    console.error(`Error deleting document with ID ${docId}:`, error);
    endCallback();
    throw error; // Rethrow the error to handle it in the calling code
  }
}
