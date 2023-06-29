import {StyleSheet, Image, View, Text, ActivityIndicator} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {signIn} from '../../../firebase/methods';
import SnackbarComponent from '../../../common/components/snackbar';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {web_client_id} from '../../../constants/utils';
import {UserContext} from '../../../context/userContext';
import Button from '../../../common/components/button';

const SignInScreen = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: web_client_id,
      offlineAccess: true,
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
    if (loading) return;
    await signIn({
      timeCallback: (value: boolean) => {
        setloading(value);
      },
      callingSnackBar: (type: 'error' | 'success', message: string) => {
        setsnackBarVisible(true);
        setsnackBarMessage(message);
        setsnackBarMessageType(type);
      },
      setUser,
    });
  };

  return (
    <SnackbarComponent
      message={snackBarMessage}
      type={snackBarMessageType}
      close={() => {
        setsnackBarVisible(false);
      }}
      visible={snackBarVisible}>
      <View style={styles.contentWrapper}>
        <Image
          style={styles.logo}
          source={require('../../../assets/images/logo-2.png')}
        />
        <Text style={styles.titleText}>
          Millions of accounts. Free on Bahikhata.
        </Text>
        <Button
          label={`Continue with Google`}
          loading={loading}
          color={'white'}
          img={
            <Image
              source={require('../../../assets/images/google-icon.png')}
              style={{width: 30, height: 30}}
            />
          }
          onPress={signInFunction}
          customBtnStyle={{
            backgroundColor: '#222222',
            borderRadius: 100,
            width: 250,
            alignSelf: 'center',
          }}
        />
      </View>
    </SnackbarComponent>
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
    backgroundColor: 'white',
  },
  contentWrapper: {
    display: 'flex',
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
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
    fontSize: 30,
    textAlign: 'center',
    width: '90%',
  },
});
