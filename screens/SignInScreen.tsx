import {StyleSheet, Image, View, Text, ActivityIndicator} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {fontStyles} from '../common/styles/fonts';
import ContinueButton from '../components/SignIn/continueButton';
import {signIn} from '../firebase/methods';
import SnackbarComponent from '../common/components/snackbar';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {web_client_id} from '../constants/utils';
import {UserContext} from '../userContext';

const SignInScreen = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: web_client_id,
      offlineAccess: false,
    });
  }, []);

  const {setUser} = useContext(UserContext);

  const [loading, setloading] = useState(false);
  const [snackBarVisible, setsnackBarVisible] = useState(false);
  const [snackBarMessage, setsnackBarMessage] = useState('');
  const [snackBarMessageType, setsnackBarMessageType] = useState<
    'error' | 'success'
  >('error');

  const signInFunction = async () => {
    await signIn(
      (value: boolean) => {
        setloading(value);
      },
      (type: 'error' | 'success', message: string) => {
        setsnackBarVisible(true);
        setsnackBarMessage(message);
        setsnackBarMessageType(type);
      },
      setUser
    );
  };

  return (
    <>
      {loading ? (
        <View style={styles.backdrop}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <View style={styles.signInWrapper}>
          <View style={styles.contentWrapper}>
            <Image
              style={styles.logo}
              source={require('../assets/images/logo-2.png')}
            />
            <Text style={styles.titleText}>
              Millions of accounts. Free on Bahikhata.
            </Text>
            <ContinueButton
              onClick={signInFunction}
              title="Continue with Google"
              icon="google"
            />
            <ContinueButton
              onClick={() => {}}
              title="Continue with Facebook"
              icon="fb"
            />
          </View>
          <SnackbarComponent
            message={snackBarMessage}
            type={snackBarMessageType}
            close={() => {
              setsnackBarVisible(false);
            }}
            visible={snackBarVisible}
          />
        </View>
      )}
    </>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  backdrop: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  signInWrapper: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    gap: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    height: 60,
    width: 200,
    marginHorizontal: 'auto',
  },
  titleText: {
    color: '#222222',
    fontWeight: 'bold',
    ...fontStyles.mediumFont,
    fontSize: 30,
    textAlign: 'center',
    width: '90%',
  },
});
