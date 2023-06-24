import React, {useContext} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignInScreen from './screens/SignInScreen';
import HomeScreen from './screens/HomeScreen';
import {UserContext} from './userContext';
import EditScreen from './screens/EditScreen';
import SettingScreen from './screens/SettingScreen';

type RootStackParamList = {
  SignInScreen: undefined;
  HomeScreen: undefined;
  SettingScreen: undefined;
  EditScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function MyStack() {
  const {user} = useContext(UserContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user === null ? (
          <Stack.Screen
            name="SignInScreen"
            options={{headerShown: false}}
            component={SignInScreen}
          />
        ) : (
          <>
            <Stack.Screen
              name="HomeScreen"
              options={{headerShown: false}}
              component={HomeScreen}
            />
            <Stack.Screen
              name="SettingScreen"
              options={{headerShown: true, headerTitle: 'Settings'}}
              component={SettingScreen}
            />
            <Stack.Screen
              name="EditScreen"
              options={{headerShown: true, headerTitle: 'Edit Details'}}
              component={EditScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MyStack;
