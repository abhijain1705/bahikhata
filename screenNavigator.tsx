import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignInScreen from './screens/StackTabs/BeforeAuth/SignInScreen';
import HomeScreen from './screens/StackTabs/AfterAuth/HomeScreen';
import {UserContext} from './context/userContext';
import ContactScreen from './screens/StackTabs/AfterAuth/ContactScreen';
import AddDataScreen from './screens/StackTabs/AfterAuth/AddDataScreen';
import EditScreen from './screens/StackTabs/AfterAuth/EditScreen';
import SettingScreen from './screens/StackTabs/AfterAuth/SettingScreen';
import {RootStackParamList} from './common/interface/types';
import SingleUserAccountScreen from './screens/StackTabs/AfterAuth/SingleUserAccountScreen';
import UserProfile from './screens/StackTabs/AfterAuth/UserProfile';
import ViewReport from './screens/StackTabs/AfterAuth/ViewReport';
import EntryScreen from './screens/StackTabs/AfterAuth/EntryScreen';

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
              name="ContactScreen"
              options={{headerShown: true, headerTitle: 'Select from Contact'}}
              component={ContactScreen}
            />
            <Stack.Screen
              name="EditScreen"
              options={{headerShown: true, headerTitle: 'Edit Details'}}
              component={EditScreen}
            />
            <Stack.Screen
              name="AddDataScreen"
              options={{headerShown: true, headerTitle: 'Add Details'}}
              component={AddDataScreen}
            />
            <Stack.Screen
              name="SingleUserAccountScreen"
              options={{
                headerShown: false,
              }}
              component={SingleUserAccountScreen}
            />
            <Stack.Screen
              name="UserProfile"
              options={{
                headerShown: false,
              }}
              component={UserProfile}
            />
            <Stack.Screen
              name="ViewReport"
              options={{
                headerShown: false,
              }}
              component={ViewReport}
            />
            <Stack.Screen
              name="EntryScreen"
              options={{
                headerShown: false,
              }}
              component={EntryScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MyStack;
