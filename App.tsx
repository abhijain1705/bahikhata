/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import SignInScreen from './screens/SignInScreen';
import {SafeAreaView} from 'react-native';
import {UserContext} from './userContext';
import MyStack from './screenNavigator';
import auth from '@react-native-firebase/auth';
import {fetchUserData} from './firebase/methods';
import {UserInterface} from './common/interface/types';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from './screens/SplashScreen';

function App(): JSX.Element {
  const [userData, setUserData] = useState<UserInterface | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [isError, setisError] = useState(true);

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
          <MyStack />
        </UserContext.Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
