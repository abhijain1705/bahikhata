import {StyleSheet, View, Image} from 'react-native';
import React, {useContext} from 'react';
import ProfileRow from '../../components/Profile/profileRow';
// import Icon from 'react-native-vector-icons/AntDesign';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import FeatherIcon from 'react-native-vector-icons/Feather';
// import EntypoIcon from 'react-native-vector-icons/Entypo';
import {UserContext} from '../../context/userContext';

const ProfileScreen = () => {
  const {user} = useContext(UserContext);
  return (
    <View style={styles.container}>
      <ProfileRow
        editable={true}
        type="name"
        header="Name"
        label={user ? user.name : 'Your Name'}
        prefixIcon={
          <Image
            source={require('../../assets/icons/user.png')}
            style={{width: 30, height: 30}}
          />
        }
      />
      <ProfileRow
        editable={true}
        type="bname"
        header="Business Name"
        label={
          user ? user.business[user.currentFirmId].name : 'Your Business Name'
        }
        prefixIcon={
          <Image
            source={require('../../assets/icons/portfolio.png')}
            style={{width: 30, height: 30}}
          />
        }
      />
      <ProfileRow
        type="baddress"
        editable={true}
        header="Business Address"
        label={
          user
            ? user.business[user.currentFirmId].address
            : 'Your Business Address'
        }
        prefixIcon={
          <Image
            source={require('../../assets/icons/location.png')}
            style={{width: 30, height: 30}}
          />
        }
      />
      <ProfileRow
        type="bcontact"
        editable={true}
        header="Business Contact"
        label={
          user
            ? user.business[user.currentFirmId].phoneNumber
            : 'Your Business Contact'
        }
        prefixIcon={
          <Image
            source={require('../../assets/icons/phone-call.png')}
            style={{width: 30, height: 30}}
          />
        }
      />
      <ProfileRow
        editable={true}
        type="bgst"
        header="Business GST"
        label={
          user ? user.business[user.currentFirmId].gst : 'Your Business GST'
        }
        prefixIcon={
          <Image
            source={require('../../assets/icons/contract.png')}
            style={{width: 30, height: 30}}
          />
        }
      />
      <ProfileRow
        editable={true}
        type="bcategory"
        header="Business Category"
        label={
          user
            ? user.business[user.currentFirmId].category
            : 'Business Category'
        }
        prefixIcon={
          <Image
            source={require('../../assets/icons/document.png')}
            style={{width: 30, height: 30}}
          />
        }
      />
      <ProfileRow
        editable={true}
        type="btype"
        header="Business Type"
        label={user ? user.business[user.currentFirmId].type : 'Business Type'}
        prefixIcon={
          <Image
            source={require('../../assets/icons/type.png')}
            style={{width: 30, height: 30}}
          />
        }
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});
