import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useContext, useState} from 'react';
import Header from '../../../components/SingleUser/Header';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../common/interface/types';
import ProfileRow from '../../../components/Profile/profileRow';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {deleteCustlierUser} from '../../../firebase/methods';
import SnackbarComponent from '../../../common/components/snackbar';
import {StackNavigationProp} from '@react-navigation/stack';
import {UserContext} from '../../../context/userContext';
import Button from '../../../common/components/button';
import {UseApiCallContext} from '../../../context/recallTheApi';

const UserProfile = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'UserProfile'>>();
  const navigate = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [loading, setloading] = useState(false);
  const [snackBarVisible, setsnackBarVisible] = useState(false);
  const [snackBarMessage, setsnackBarMessage] = useState('');
  const [snackBarMessageType, setsnackBarMessageType] = useState<
    'error' | 'success'
  >('error');
  const {custLierUser} = route.params;

  const {setApiIsCalled} = UseApiCallContext();

  const {user} = useContext(UserContext);
  async function deleteUser() {
    await deleteCustlierUser({
      docId: custLierUser.docId,
      userid: user?.uid ?? '',
      timeCallback: value => {
        setloading(value);
      },
      callingSnackBar: (type, msg) => {
        setsnackBarVisible(true);
        setsnackBarMessageType(type);
        setsnackBarMessage(msg);
      },
      endCallback: () => {
        setApiIsCalled(false);
        setTimeout(() => {
          navigate.navigate('HomeScreen');
        }, 1000);
      },
    });
  }

  return (
    <SnackbarComponent
      message={snackBarMessage}
      type={snackBarMessageType}
      close={() => {
        setsnackBarVisible(false);
      }}
      visible={snackBarVisible}>
      <View style={styles.parent}>
        <View>
          <Header wantCalls={false} custLierUser={custLierUser} />
          <ProfileRow
            prefixIcon={
              <Image
                source={require('../../../assets/icons/user.png')}
                style={{width: 30, height: 30}}
              />
            }
            label={custLierUser.name}
            header={'User Name'}
            type={'CUname'}
            custlierUser={custLierUser}
            editable={true}
          />
          <ProfileRow
            prefixIcon={
              <Image
                source={require('../../../assets/icons/location.png')}
                style={{width: 30, height: 30}}
              />
            }
            label={
              custLierUser.address ? custLierUser.address : 'Not Available'
            }
            custlierUser={custLierUser}
            header={'User Address'}
            type={'CUaddress'}
            editable={true}
          />
          <ProfileRow
            prefixIcon={
              <Image
                source={require('../../../assets/icons/bill.png')}
                style={{width: 30, height: 30}}
              />
            }
            label={custLierUser.gst ? custLierUser.gst : 'Not Available'}
            header={'User GST'}
            custlierUser={custLierUser}
            type={'CUgst'}
            editable={true}
          />
          <ProfileRow
            prefixIcon={
              <Image
                source={require('../../../assets/icons/type.png')}
                style={{width: 30, height: 30}}
              />
            }
            label={custLierUser.userType}
            header={'User Is'}
            type={''}
            editable={false}
          />
          <ProfileRow
            prefixIcon={
              <Image
                source={require('../../../assets/icons/contract.png')}
                style={{width: 30, height: 30}}
              />
            }
            label={(
              custLierUser.accountCreatedDate as any as FirebaseFirestoreTypes.Timestamp
            )
              .toDate()
              .toLocaleDateString()}
            header={'Joined On'}
            type={''}
            editable={false}
          />
        </View>
        <Button
          label={'Delete Account'}
          onPress={deleteUser}
          loading={loading}
          customBtnStyle={{...styles.deleteBtn}}
          customTextStyle={{...styles.btnText}}
          color={'#222222'}
        />
      </View>
    </SnackbarComponent>
  );
};

export default UserProfile;
const styles = StyleSheet.create({
  parent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  btnText: {
    color: '#222222',
    fontSize: 20,
    fontWeight: '700',
  },
  deleteBtn: {
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 16,
    margin: 8,
  },
});
