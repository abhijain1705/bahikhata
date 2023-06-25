import {StyleSheet, View} from 'react-native';
import React, {useContext} from 'react';
// import Icon from 'react-native-vector-icons/AntDesign';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ProfileRow from '../components/Profile/profileRow';
// import FeatherIcon from 'react-native-vector-icons/Feather';
// import EntypoIcon from 'react-native-vector-icons/Entypo';
import {UserContext} from '../userContext';

const ProfileScreen = () => {
  const {user} = useContext(UserContext);
  return (
    <View></View>
    // <View style={styles.container}>
    //   <ProfileRow
    //     type="name"
    //     header="Name"
    //     label={user ? user.name : 'Your Name'}
    //     prefixIcon={<Icon name="user" size={30} color={'#222222'} />}
    //   />
    //   <ProfileRow
    //     type="bname"
    //     header="Business Name"
    //     label={
    //       user ? user.business[user.currentFirmId].name : 'Your Business Name'
    //     }
    //     prefixIcon={
    //       <MaterialIcon name="business" size={30} color={'#222222'} />
    //     }
    //   />
    //   <ProfileRow
    //     type="baddress"
    //     header="Business Address"
    //     label={
    //       user
    //         ? user.business[user.currentFirmId].address
    //         : 'Your Business Address'
    //     }
    //     prefixIcon={<EntypoIcon name="address" size={30} color={'#222222'} />}
    //   />
    //   <ProfileRow
    //     type="bcontact"
    //     header="Business Contact"
    //     label={
    //       user
    //         ? user.business[user.currentFirmId].phoneNumber
    //         : 'Your Business Contact'
    //     }
    //     prefixIcon={
    //       <EntypoIcon name="old-mobile" size={30} color={'#222222'} />
    //     }
    //   />
    //   <ProfileRow
    //     type="bgst"
    //     header="Business GST"
    //     label={
    //       user ? user.business[user.currentFirmId].gst : 'Your Business GST'
    //     }
    //     prefixIcon={<EntypoIcon name="documents" size={30} color={'#222222'} />}
    //   />
    //   <ProfileRow
    //     type="bcategory"
    //     header="Business Category"
    //     label={
    //       user
    //         ? user.business[user.currentFirmId].category
    //         : 'Business Category'
    //     }
    //     prefixIcon={
    //       <MaterialIcon name="category" size={30} color={'#222222'} />
    //     }
    //   />
    //   <ProfileRow
    //     type="btype"
    //     header="Business Type"
    //     label={user ? user.business[user.currentFirmId].type : 'Business Type'}
    //     prefixIcon={<FeatherIcon name="type" size={30} color={'#222222'} />}
    //   />
    // </View>
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
