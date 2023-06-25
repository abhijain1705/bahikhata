import React, {useContext, useRef, useCallback} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {TouchableOpacity, View, Text} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LedgerScreen from './LedgerScreen';
import FeatherIcon from 'react-native-vector-icons/Feather';
import BillScreen from './BillScreen';
import ProfileScreen from './ProfileScreen';
import {UserContext} from '../userContext';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

interface CustomHeaderProp {
  screenName: string;
  openBottomSheet?: () => void;
}

const CustomHeader = ({screenName, openBottomSheet}: CustomHeaderProp) => {
  const {user} = useContext(UserContext);
  const navigation = useNavigation<any>();

  const handleSettingPress = () => {
    navigation.navigate('SettingScreen');
  };

  return (
    <View style={styles.headerWrapper}>
      <TouchableOpacity
        onPress={() => {
          if (screenName === 'LedgerScreen') {
            openBottomSheet!();
          }
        }}
        style={styles.headerContent}>
        {screenName === 'LedgerScreen' && (
          <MaterialIcons name="account-switch" color={'#222222'} size={25} />
        )}
        <Text
          style={{
            fontWeight: '700',
            color: '#222222',
            fontSize:
              user!.business[user!.currentFirmId].name.length <= 15 ? 25 : 20,
          }}>
          {screenName === 'ProfileScreen'
            ? 'User Profile'
            : user!.business[user!.currentFirmId].name.length <= 15
            ? user?.business[user.currentFirmId].name
            : user?.business[user.currentFirmId].name.substring(0, 15) + '...'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSettingPress}>
        <AntIcon name="setting" size={30} color="#222222" />
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen = () => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: '#222222',
      }}>
      <Tab.Screen
        name="LedgerScreen"
        component={LedgerScreen}
        initialParams={{bottomSheetRef: bottomSheetRef}}
        options={{
          tabBarLabel: 'Ledger',
          headerShown: true,
          header: () => (
            <CustomHeader
              openBottomSheet={openBottomSheet}
              screenName="LedgerScreen"
            />
          ),
          tabBarIcon: ({size, color}) => (
            <FeatherIcon name="users" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BillScreen"
        component={BillScreen}
        options={{
          tabBarLabel: 'Bills',
          headerShown: false,
          tabBarIcon: ({size, color}) => (
            <FeatherIcon name="book" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: true,
          header: () => <CustomHeader screenName="ProfileScreen" />,
          tabBarLabel: 'Profile',
          tabBarIcon: ({size, color}) => (
            <AntIcon name="profile" size={30} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderBottomColor: '#222222',
    borderBottomWidth: 2
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
});
