import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {UserInterface} from '../common/interface/types';

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
        currentFirmId: firstBusiness.toString(),
        business: {
          [firstBusiness.toString() + userCreated.uid]: {
            firmid: firstBusiness.toString(),
            name: 'Business 1',
            address: 'Jaipur Rajasthan , India',
            phoneNumber: '+919876543210',
            gst: 'business gst',
            category: 'Agriculture',
            type: 'Retailer',
            dateOfCreation: new Date(),
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
