import React, {
  useContext,
  useRef,
  useCallback,
  useState,
  useEffect,
} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {TouchableOpacity, View, Text, Image} from 'react-native';
// import AntIcon from 'react-native-vector-icons/AntDesign';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LedgerScreen from '../../bottomTabs/LedgerScreen';
// import FeatherIcon from 'react-native-vector-icons/Feather';
import BillScreen from '../../bottomTabs/BillScreen';
import ProfileScreen from '../../bottomTabs/ProfileScreen';
import {UserContext} from '../../../context/userContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../common/interface/types';
// import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

interface CustomHeaderProp {
  screenName: string;
  openBottomSheet?: () => void;
}

const CustomHeader = ({screenName, openBottomSheet}: CustomHeaderProp) => {
  const {user} = useContext(UserContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleSettingPress = () => {
    navigation.navigate('SettingScreen');
  };

  if (user === null) return;

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
          <Image
            source={require('../../../assets/icons/swap.png')}
            style={{width: 20, height: 20}}
          />
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
            ? user!.business[user!.currentFirmId].name
            : user!.business[user!.currentFirmId].name.substring(0, 15) + '...'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSettingPress}>
        <Image
          source={require('../../../assets/icons/setting.png')}
          style={{width: 20, height: 20}}
        />
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
        initialParams={{
          bottomSheetRef,
        }}
        options={{
          tabBarLabel: 'Ledger',
          headerShown: true,
          tabBarLabelStyle: {fontSize: 15, fontWeight: '700'},
          header: () => (
            <CustomHeader
              openBottomSheet={openBottomSheet}
              screenName="LedgerScreen"
            />
          ),
          tabBarIcon: ({size, color}) => (
            <Image
              source={require('../../../assets/icons/user.png')}
              style={{width: 20, height: 20}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="BillScreen"
        component={BillScreen}
        options={{
          tabBarLabel: 'Bills',
          headerShown: false,
          tabBarLabelStyle: {fontSize: 15, fontWeight: '700'},
          tabBarIcon: ({size, color}) => (
            <Image
              source={require('../../../assets/icons/bill.png')}
              style={{width: 20, height: 20}}
            />
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
          tabBarLabelStyle: {fontSize: 15, fontWeight: '700'},
          tabBarIcon: ({size, color}) => (
            <Image
              source={require('../../../assets/icons/app.png')}
              style={{width: 20, height: 20}}
            />
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
    borderBottomWidth: 2,
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
});
