import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {CustLierUser, RootStackParamList} from '../../common/interface/types';

type HeaderProp = {
  custLierUser: CustLierUser;
  wantCalls: boolean;
};

const Header = ({custLierUser, wantCalls}: HeaderProp) => {
  const navigate = useNavigation<StackNavigationProp<RootStackParamList>>();

  function makeCall() {
    Linking.openURL(`tel:${custLierUser.phoneNumber}`);
  }

  function openWhatsapp() {
    Linking.openURL(`http://wa.me/${custLierUser.phoneNumber}`);
  }

  function navigateToProfile() {
    navigate.navigate('UserProfile', {custLierUser: custLierUser});
  }
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.Child}>
        <TouchableOpacity
          onPress={() => navigate.goBack()}
          style={{backgroundColor: 'white', borderRadius: 20, padding: 10}}>
          <Image
            source={require('../../assets/icons/back-button.png')}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
        <View style={styles.textWrapper}>
          <Text style={styles.name}>
            {custLierUser.name.length > 25
              ? custLierUser.name.substring(0, 24) + '...'
              : custLierUser.name}
          </Text>
          {wantCalls && (
            <TouchableOpacity onPress={navigateToProfile}>
              <Text style={styles.profile}>View profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {wantCalls && (
        <View
          style={{
            ...styles.Child,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 10,
          }}>
          <TouchableOpacity onPress={makeCall}>
            <Image
              source={require('../../assets/icons/phone-call.png')}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={openWhatsapp}>
            <Image
              source={require('../../assets/icons/whatsapp.png')}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerWrapper: {
    padding: 8,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'blue',
    paddingHorizontal: 8
  },
  Child: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 5,
  },
  name: {
    fontSize: 20,
    width: 200,
    fontWeight: '700',
    color: 'white'
  },
  profile: {
    textDecorationColor: 'white',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    color: 'white'
  },
});
