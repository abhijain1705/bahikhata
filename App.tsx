/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, {useState, useEffect, JSX} from 'react';
import SignInScreen from './screens/StackTabs/BeforeAuth/SignInScreen';
import {SafeAreaView} from 'react-native';
import {UserContext} from './context/userContext';
import MyStack from './screenNavigator';
import auth from '@react-native-firebase/auth';
import {fetchUserData} from './firebase/methods';
import {ContextApiCallProvider} from './context/recallTheApi';
import {CustLierUser, UserInterface} from './common/interface/types';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ContextLedgerDataProvider} from './context/ledgerContext';
import SplashScreen from './screens/StackTabs/BeforeAuth/SplashScreen';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

function App(): JSX.Element {
  const [userData, setUserData] = useState<UserInterface | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [isError, setisError] = useState(true);
  const [apiIsCalled, setApiIsCalled] = useState(false);
  const [custlierData, setcustlierData] = useState<{
    customer: {[key: string]: CustLierUser[]};
    supplier: {[key: string]: CustLierUser[]};
  }>({customer: {}, supplier: {}});

  const [loadingForMore, setloadingForMore] = useState(false);
  const [lastDocument, setlastDocument] = useState<{
    customer: FirebaseFirestoreTypes.DocumentSnapshot<CustLierUser> | undefined;
    supplier: FirebaseFirestoreTypes.DocumentSnapshot<CustLierUser> | undefined;
  }>({customer: undefined, supplier: undefined});

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        try {
          await fetchUserData({
            setUserValue: (value: UserInterface | null) => {
              setUserData(value);
            },
            user: user,
          });
          setTimeout(() => {
            setInitializing(false);
          }, 1200);
          setisError(false);
        } catch (error) {
          setTimeout(() => {
            setInitializing(false);
          }, 1200);
          setisError(true);
          console.error('Error fetching user data:', error);
          // Handle error state here, such as displaying an error message
        }
      } else {
        setUserData(null);
        setTimeout(() => {
          setInitializing(false);
        }, 1200);
      }
    });
    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{flex: 1}}>
          <SplashScreen />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (isError) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{flex: 1}}>
          <SignInScreen />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        <UserContext.Provider value={{user: userData, setUser: setUserData}}>
          <ContextApiCallProvider.Provider
            value={{apiIsCalled: apiIsCalled, setApiIsCalled: setApiIsCalled}}>
            <ContextLedgerDataProvider.Provider
              value={{
                loadingForMore,
                setloadingForMore,
                lederData: custlierData,
                lastDocument,
                setlastDocument,
                setlederData: setcustlierData,
              }}>
              <MyStack />
            </ContextLedgerDataProvider.Provider>
          </ContextApiCallProvider.Provider>
        </UserContext.Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
