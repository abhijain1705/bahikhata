import {View, StyleSheet} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import InputBox from '../../../common/components/inputBox';
import {UserContext} from '../../../context/userContext';
import {RootStackParamList} from '../../../common/interface/types';
import Button from '../../../common/components/button';
import SnackbarComponent from '../../../common/components/snackbar';
import {createNewCustLierUser} from '../../../firebase/methods';
import {StackNavigationProp} from '@react-navigation/stack';
import {UseApiCallContext} from '../../../context/recallTheApi';

const AddDataScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'AddDataScreen'>>();
  const [userData, setuserData] = useState({
    name: '',
    address: '',
    gst: '',
    phoneNumber: '',
  });
  const [loading, setloading] = useState(false);
  const [snackBarVisible, setsnackBarVisible] = useState(false);
  const [snackBarMessage, setsnackBarMessage] = useState('');
  const [snackBarMessageType, setsnackBarMessageType] = useState<
    'error' | 'success'
  >('error');

  const navigate = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    setuserData({
      ...userData,
      phoneNumber: route.params.selectedContact?.phoneNumbers[0].number ?? '',
      name: route.params.selectedContact?.displayName ?? '',
    });
  }, [route]);

  const {user} = useContext(UserContext);

  const {setApiIsCalled} = UseApiCallContext();

  async function createNewCustLier() {
    if (userData.name.length === 0 || userData.phoneNumber.length === 0) return;

    if (userData.phoneNumber.length < 10) {
      setsnackBarVisible(true);
      setsnackBarMessage('write correct phone number');
      setsnackBarMessageType('error');
      return;
    } else if (
      userData.phoneNumber.length > 10 &&
      !userData.phoneNumber.startsWith('+91')
    ) {
      setsnackBarVisible(true);
      setsnackBarMessage('write correct phone number');
      setsnackBarMessageType('error');
      return;
    } else if (userData.phoneNumber.length > 13) {
      setsnackBarVisible(true);
      setsnackBarMessage('write correct phone number');
      setsnackBarMessageType('error');
      return;
    }

    await createNewCustLierUser({
      timeCallback: value => {
        setloading(value);
      },
      callingSnackBar: (type: 'error' | 'success', message: string) => {
        setsnackBarVisible(true);
        setsnackBarMessage(message);
        setsnackBarMessageType(type);
      },
      userid: user!.uid,
      businessid: user!.business[user!.currentFirmId].firmid,
      custLierUser: {
        ...userData,
        payable: 0,
        receivable: 0,
        accountCreatedDate: new Date(),
        docId: '',
        userType: route.params.screenType!,
        phoneNumber: userData.phoneNumber.startsWith('+91')
          ? userData.phoneNumber
          : '+91' + userData.phoneNumber,
      },
      whatIfFail: () => {
        setTimeout(() => {
          navigate.navigate('HomeScreen');
        }, 1000);
      },
      whatIfSucceedd: () => {
        setApiIsCalled(false);
        setTimeout(() => {
          navigate.navigate('HomeScreen');
        }, 1000);
      },
      ifAlreadyExists: () => {
        navigate.navigate('SingleUserAccountScreen');
        // navigate to single account
      },
    });
  }

  return (
    <View style={styles.wrapper}>
      <View>
        <InputBox
          value={userData.name}
          setValue={value => setuserData({...userData, name: value})}
          placeholder="Enter Name"
          label="Enter Name"
        />
        <InputBox
          value={userData.phoneNumber}
          setValue={value => {
            setuserData({...userData, phoneNumber: value});
          }}
          placeholder="Enter Contact Number"
          label="Enter Contact Number"
        />
        <InputBox
          value={userData.address}
          setValue={value => setuserData({...userData, address: value})}
          placeholder="Enter Address"
          label="Enter Address (optional)"
        />
        <InputBox
          value={userData.gst}
          setValue={value => setuserData({...userData, gst: value})}
          placeholder="Enter GST Number"
          label="Enter GST Number (optional)"
        />
        <Button
          label={'Save'}
          onPress={createNewCustLier}
          loading={loading}
          color={'white'}
          customBtnStyle={{width: '90%'}}
        />
      </View>
      <SnackbarComponent
        message={snackBarMessage}
        type={snackBarMessageType}
        close={() => {
          setsnackBarVisible(false);
        }}
        visible={snackBarVisible}
      />
    </View>
  );
};

export default AddDataScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
});
