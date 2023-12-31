import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {
  RootStackParamList,
  UserInterface,
} from '../../../common/interface/types';
import {StackNavigationProp} from '@react-navigation/stack';
import {getFormatedDate} from 'react-native-modern-datepicker';
import InputBox from '../../../common/components/inputBox';
import DateComponent from '../../../common/components/date';
import SnackbarComponent from '../../../common/components/snackbar';
import {commonAlignment} from '../../../common/styles/styles';
import * as ImagePicker from 'react-native-image-picker';
import Button from '../../../common/components/button';
import {
  addNewLedger,
  updateCustlierUser,
  updateUserDoc,
} from '../../../firebase/methods';
import {UserContext} from '../../../context/userContext';
import {UseApiCallContext} from '../../../context/recallTheApi';
import ModalComponent from '../../../common/components/Modal';

const EntryScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'EntryScreen'>>();
  const navigate = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {type, custLierUser} = route.params;
  const {user, setUser} = useContext(UserContext);
  const [billAmt, setbillAmt] = useState('');
  const [billNo, setbillNo] = useState('');
  const [msg, setmsg] = useState('');
  const endDate = getFormatedDate(new Date(), 'YYYY/MM/DD');
  const [billDate, setbillDate] = useState(
    getFormatedDate(new Date(), 'YYYY/MM/DD')
  );
  // const [pickedImage, setpickedImage] = useState('');
  const [loading, setloading] = useState(false);
  const [snackBarVisible, setsnackBarVisible] = useState(false);
  const [snackBarMessage, setsnackBarMessage] = useState('');
  const [snackBarMessageType, setsnackBarMessageType] = useState<
    'error' | 'success'
  >('error');

  function renderColor() {
    return type === 'debit' ? 'red' : 'green';
  }

  // async function pickBillPhoto() {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //       {
  //         title: 'App Camera Permission',
  //         message: 'App needs access to your camera ',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('Camera permission given');
  //       const im = await ImagePicker.launchCamera({
  //         mediaType: 'photo',
  //       });
  //       console.log(im);
  //       if (im.didCancel) {
  //         setsnackBarVisible(true);
  //         setsnackBarMessage('camera is closed');
  //         setsnackBarMessageType('error');
  //         return;
  //       } else if (im.errorCode || im.errorMessage) {
  //         setsnackBarVisible(true);
  //         setsnackBarMessage(
  //           im.errorMessage ?? 'Error occured, try again later'
  //         );
  //         setsnackBarMessageType('error');
  //         return;
  //       }
  //       if (im === undefined) return;
  //       const uri = im.assets![0].uri;
  //       if (uri) {
  //         setpickedImage(uri);
  //         console.log(uri);
  //       }
  //     } else {
  //       console.log('Camera permission denied');
  //       setsnackBarVisible(true);
  //       setsnackBarMessage('Camera permission denied');
  //       setsnackBarMessageType('error');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const {setApiIsCalled} = UseApiCallContext();

  function updateState(userData?: Partial<UserInterface>) {
    setUser({...user!, ...userData!});
  }

  async function addLedger() {
    if (!billAmt || !custLierUser.docId || !custLierUser.phoneNumber) {
      setsnackBarVisible(true);
      setsnackBarMessage('Details are not filled');
      setsnackBarMessageType('error');
      return;
    }
    if (loading) return;

    await addNewLedger({
      timeCallback: value => {
        setloading(value);
      },
      callingSnackBar: (type: 'error' | 'success', message: string) => {
        setsnackBarVisible(true);
        setsnackBarMessage(message);
        setsnackBarMessageType(type);
      },
      // imagePath: pickedImage,
      userid: user?.uid ?? '',
      businessid: custLierUser.docId,
      ledgerData: {
        cleared: false,
        docid: '',
        billPhoto: '',
        accountCreatedDate: new Date(
          Number(billDate.split('/')[0]),
          Number(billDate.split('/')[1]) - 1,
          Number(billDate.split('/')[2])
        ),
        billNo: billNo,
        amount: Number(billAmt),
        msg: msg,
        entryType: type,
        wroteAgainst: custLierUser.phoneNumber,
        wroteBy: user?.business[user.currentFirmId].phoneNumber ?? '',
      },
    });

    await updateCustlierUser({
      userid: user?.uid ?? '',
      docId: custLierUser.docId,
      timeCallback: value => {
        setloading(value);
      },
      dataToUpdate: {
        receivable:
          type === 'credit'
            ? custLierUser.receivable + Number(billAmt)
            : custLierUser.receivable,
        payable:
          type === 'debit'
            ? custLierUser.payable + Number(billAmt)
            : custLierUser.payable,
      },
      callingSnackBar: (type, msg) => {
        setsnackBarVisible(true);
        setsnackBarMessageType(type);
        setsnackBarMessage(msg);
      },
      endCallback: () => {
        setApiIsCalled(false);
      },
    });

    await updateUserDoc({
      updateState,
      timeCallback: (value: boolean) => {
        setloading(value);
      },
      callingSnackBar: (type: 'error' | 'success', message: string) => {
        setsnackBarVisible(true);
        setsnackBarMessage(message);
        setsnackBarMessageType(type);
        navigate.navigate('SingleUserAccountScreen', {custLierUser});
      },
      userData: (() => {
        return {
          uid: user?.uid,
          business: {
            ...user!.business,
            [user!.currentFirmId]: {
              ...user!.business[user!.currentFirmId],
              customer:
                custLierUser.userType === 'customer'
                  ? {
                      recieviable:
                        type === 'credit'
                          ? user!.business[user!.currentFirmId].customer
                              .recieviable + Number(billAmt)
                          : user!.business[user!.currentFirmId].customer
                              .recieviable,
                      payable:
                        type === 'debit'
                          ? user!.business[user!.currentFirmId].customer
                              .payable + Number(billAmt)
                          : user!.business[user!.currentFirmId].customer
                              .payable,
                    }
                  : {...user!.business[user!.currentFirmId].customer},
              supplier:
                custLierUser.userType === 'supplier'
                  ? {
                      recieviable:
                        type === 'credit'
                          ? user!.business[user!.currentFirmId].supplier
                              .recieviable + Number(billAmt)
                          : user!.business[user!.currentFirmId].supplier
                              .recieviable,
                      payable:
                        type === 'debit'
                          ? user!.business[user!.currentFirmId].supplier
                              .payable + Number(billAmt)
                          : user!.business[user!.currentFirmId].supplier
                              .payable,
                    }
                  : {...user!.business[user!.currentFirmId].supplier},
            },
          },
        };
      })(),
    });
  }

  const [openDatePicker, setopenDatePicker] = useState(false);
  return (
    <KeyboardAvoidingView style={styles.wrapper}>
      <SnackbarComponent
        message={snackBarMessage}
        type={snackBarMessageType}
        close={() => {
          setsnackBarVisible(false);
        }}
        visible={snackBarVisible}>
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigate.goBack()}
              style={{backgroundColor: 'white', borderRadius: 20, padding: 10}}>
              <Image
                source={require('../../../assets/icons/back-button.png')}
                style={{width: 30, height: 30}}
              />
            </TouchableOpacity>
            <Text
              style={{
                ...styles.headerText,
                color: renderColor(),
              }}>
              Write {type} for{' '}
              {custLierUser.name.length > 25
                ? custLierUser.name.substring(0, 25) + '...'
                : custLierUser.name}
            </Text>
          </View>
          <InputBox
            label={'Enter Amount'}
            placeholder={'Enter Amount'}
            value={billAmt}
            customInputStyle={{borderWidth: 2, borderColor: renderColor()}}
            customLabelStyle={{color: renderColor()}}
            setValue={value => {
              setbillAmt(value);
            }}
          />
          <InputBox
            label={'Enter Bill No.'}
            placeholder={'Enter Bill No.'}
            value={billNo}
            customInputStyle={{borderWidth: 2, borderColor: renderColor()}}
            customLabelStyle={{color: renderColor()}}
            setValue={value => {
              setbillNo(value);
            }}
          />
          <InputBox
            label={'Enter Message'}
            placeholder={'Enter Message'}
            value={msg}
            customInputStyle={{borderWidth: 2, borderColor: renderColor()}}
            customLabelStyle={{color: renderColor()}}
            setValue={value => {
              setmsg(value);
            }}
          />
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              ...commonAlignment.centerAligned,
            }}>
            <View style={{width: '50%'}}>
              <Text
                style={{color: renderColor(), fontWeight: '600', fontSize: 20}}>
                Bill Date
              </Text>
              <TouchableOpacity
                style={{
                  borderColor: renderColor(),
                  ...styles.dateBtn,
                  ...commonAlignment.centerAligned,
                }}
                onPress={() => setopenDatePicker(true)}>
                <Text style={{color: '#222222'}}>{billDate}</Text>
              </TouchableOpacity>
            </View>
            <View style={{width: '50%'}}>
              <Text
                style={{color: renderColor(), fontWeight: '600', fontSize: 20}}>
                Bill Photo
              </Text>
              {/* <TouchableOpacity
                style={{
                  borderColor: renderColor(),
                  ...styles.dateBtn,
                  ...commonAlignment.centerAligned,
                }}
                onPress={() => pickBillPhoto()}>
                <Image
                  source={require('../../../assets/icons/camera.png')}
                  style={{width: 30, height: 30}}
                />
                <Text style={{color: '#222222'}}>
                  {pickedImage ? 'Change Photo' : 'Pick Photo'}
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
          {/* <Text style={{color: '#222222', width: '90%', alignSelf: 'center'}}>
            {pickedImage}
          </Text> */}
        </View>

        <Button
          label={'Save'}
          onPress={() => addLedger()}
          loading={loading}
          color={'white'}
          customTextStyle={{color: 'white'}}
          customBtnStyle={{
            backgroundColor: renderColor(),
            width: '90%',
            borderRadius: 5,
            padding: 0,
          }}
        />

        <ModalComponent visible={openDatePicker}>
          <DateComponent
            minDate={'1901/01/01'}
            maxDate={endDate}
            onDateChange={date => {
              setbillDate(date);
              setopenDatePicker(false);
            }}
          />
          <TouchableOpacity onPress={() => setopenDatePicker(false)}>
            <Text style={{color: 'white'}}>Close</Text>
          </TouchableOpacity>
        </ModalComponent>
      </SnackbarComponent>
    </KeyboardAvoidingView>
  );
};

export default EntryScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-evenly',
  },
  headerText: {
    fontWeight: '700',
    fontSize: 15,
    width: '90%',
  },
  dateBtn: {
    width: '90%',
    height: 50,
    borderWidth: 2,
    borderRadius: 12,
    gap: 5,
  },
});
