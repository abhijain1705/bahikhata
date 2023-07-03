import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import InputBox from '../../../common/components/inputBox';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {getFormatedDate} from 'react-native-modern-datepicker';
import ModalComponent from '../../../common/components/Modal';
import DateComponent from '../../../common/components/date';
import {
  RootStackParamList,
  UserInterface,
} from '../../../common/interface/types';
import {calculateEntryAge} from '../../../constants/utils';
import {commonAlignment} from '../../../common/styles/styles';
import {
  updateSingleLedger,
  deleteSingleLedger,
  updateCustlierUser,
  updateUserDoc,
} from '../../../firebase/methods';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import Button from '../../../common/components/button';
import {UserContext} from '../../../context/userContext';
import {UseApiCallContext} from '../../../context/recallTheApi';
import {StackNavigationProp} from '@react-navigation/stack';
import SnackbarComponent from '../../../common/components/snackbar';

const ViewLedger = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ViewLedger'>>();

  const {entry, custlier} = route.params;

  const dateOfCreation = (
    entry.accountCreatedDate as any as FirebaseFirestoreTypes.Timestamp
  ).toDate();

  const endDate = getFormatedDate(new Date(), 'YYYY/MM/DD');
  const startDate = getFormatedDate(new Date(1947, 0, 1), 'YYYY/MM/DD');
  const [selectedDate, setselectedDate] = useState<string>('');

  const [newValue, setnewValue] = useState({msg: '', billNo: ''});
  const [updateBill, setupdateBill] = useState(false);
  const [updateDate, setupdateDate] = useState(false);
  const [updateMsg, setupdateMsg] = useState(false);
  const navigate = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [openDatePicker, setopenDatePicker] = useState(false);
  const {user, setUser} = useContext(UserContext);
  const [loading, setloading] = useState(false);
  const [snackBarVisible, setsnackBarVisible] = useState(false);
  const [snackBarMessage, setsnackBarMessage] = useState('');
  const [snackBarMessageType, setsnackBarMessageType] = useState<
    'error' | 'success'
  >('error');

  function updateState(userData?: Partial<UserInterface>) {
    setUser({...user!, ...userData!});
  }

  const {setApiIsCalled} = UseApiCallContext();

  async function updateLedger() {
    if (loading) return;
    await updateSingleLedger({
      updateData: {
        accountCreatedDate:
          updateDate && selectedDate
            ? new Date(
                Number(selectedDate.split('/')[0]),
                Number(selectedDate.split('/')[1]) - 1,
                Number(selectedDate.split('/')[2])
              )
            : entry.accountCreatedDate,
        billNo: updateBill && newValue.billNo ? newValue.billNo : entry.billNo,
        msg: updateMsg && newValue.msg ? newValue.msg : entry.msg,
      },
      userid: user?.uid ?? '',
      businessid: custlier.docId,
      docId: entry.docid,
      timeCallback: value => {
        setloading(value);
      },
      callingSnackBar: (type: 'error' | 'success', message: string) => {
        setsnackBarVisible(true);
        setsnackBarMessage(message);
        setsnackBarMessageType(type);
        navigate.navigate('SingleUserAccountScreen', {custLierUser: custlier});
      },
    });
  }

  async function deleteTheLedger() {
    if (loading) return;
    await deleteSingleLedger({
      userid: user?.uid ?? '',
      businessid: custlier.docId,
      docId: entry.docid,
      timeCallback: value => {
        setloading(value);
      },
      callingSnackBar: (type: 'error' | 'success', message: string) => {
        setsnackBarVisible(true);
        setsnackBarMessage(message);
        setsnackBarMessageType(type);
      },
    });

    await updateCustlierUser({
      userid: user?.uid ?? '',
      docId: custlier.docId,
      timeCallback: value => {
        setloading(value);
      },
      dataToUpdate: {
        receivable:
          entry.entryType === 'credit'
            ? custlier.receivable - Number(entry.amount)
            : custlier.receivable,
        payable:
          entry.entryType === 'debit'
            ? custlier.payable - Number(entry.amount)
            : custlier.payable,
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
        navigate.navigate('SingleUserAccountScreen', {custLierUser: custlier});
      },
      userData: (() => {
        return {
          uid: user?.uid,
          business: {
            ...user!.business,
            [user!.currentFirmId]: {
              ...user!.business[user!.currentFirmId],
              customer:
                custlier.userType === 'customer'
                  ? {
                      recieviable:
                        entry.entryType === 'credit'
                          ? user!.business[user!.currentFirmId].customer
                              .recieviable - Number(entry.amount)
                          : user!.business[user!.currentFirmId].customer
                              .recieviable,
                      payable:
                        entry.entryType === 'debit'
                          ? user!.business[user!.currentFirmId].customer
                              .payable - Number(entry.amount)
                          : user!.business[user!.currentFirmId].customer
                              .payable,
                    }
                  : {...user!.business[user!.currentFirmId].customer},
              supplier:
                custlier.userType === 'supplier'
                  ? {
                      recieviable:
                        entry.entryType === 'credit'
                          ? user!.business[user!.currentFirmId].supplier
                              .recieviable - Number(entry.amount)
                          : user!.business[user!.currentFirmId].supplier
                              .recieviable,
                      payable:
                        entry.entryType === 'debit'
                          ? user!.business[user!.currentFirmId].supplier
                              .payable - Number(entry.amount)
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

  return (
    <ScrollView>
      <SnackbarComponent
        message={snackBarMessage}
        type={snackBarMessageType}
        close={() => {
          setsnackBarVisible(false);
        }}
        visible={snackBarVisible}>
        <View style={{...styles.ledgerRow, width: '75%', alignSelf: 'center'}}>
          <Text style={{color: '#222222'}}>Get this PDF {'->'}</Text>
          <TouchableOpacity>
            <Image
              source={require('../../../assets/icons/document.png')}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.ledgerRow}>
          <View style={{flex: 1}}>
            <Text style={{color: '#222222', textAlign: 'center'}}>
              {entry.cleared ? 'cleared' : 'pending'}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={{color: 'red', textAlign: 'center'}}>
              {entry.entryType === 'debit' ? '₹' + entry.amount : '₹ 0'}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={{color: 'green', textAlign: 'center'}}>
              {entry.entryType === 'credit' ? '₹' + entry.amount : '₹ 0'}
            </Text>
          </View>
        </View>
        <LedgerRow
          label={'Date'}
          onPress={() => setupdateDate(!updateDate)}
          value={dateOfCreation.toLocaleDateString()}
        />
        {updateDate && (
          <InputBox
            label={''}
            placeholder={'New Date'}
            value={selectedDate}
            setValue={value => {
              setupdateDate(true);
              setopenDatePicker(true);
            }}
          />
        )}
        <LedgerRow
          label={'Number Of Days'}
          value={calculateEntryAge(dateOfCreation.toLocaleDateString())}
        />
        <LedgerRow
          label={'Bill No.'}
          onPress={() => setupdateBill(!updateBill)}
          value={entry.billNo ? entry.billNo : '-'}
        />
        {updateBill && (
          <InputBox
            label={''}
            placeholder={'New Bill No.'}
            value={newValue.billNo}
            setValue={value => {
              setnewValue(prev => {
                return {...prev, billNo: value};
              });
            }}
          />
        )}
        <LedgerRow
          label={'Message'}
          onPress={() => setupdateMsg(!updateMsg)}
          value={entry.msg ? entry.msg : '-'}
        />
        {updateMsg && (
          <InputBox
            label={''}
            placeholder={'New Message'}
            value={newValue.msg}
            setValue={value => {
              setnewValue(prev => {
                return {...prev, msg: value};
              });
            }}
          />
        )}
        <View
          style={{
            ...styles.ledgerRow,
            width: '75%',
            alignSelf: 'center',
            marginTop: 75,
          }}>
          {entry.billPhoto && (
            <Image
              source={{uri: entry.billPhoto}}
              style={{width: 200, minHeight: 200, marginHorizontal: 'auto'}}
            />
          )}
        </View>
        <View
          style={{
            ...commonAlignment.centerAligned,
            width: '80%',
            alignSelf: 'center',
          }}>
          {(updateBill || updateDate || updateMsg) && (
            <Button
              label={'Update'}
              customTextStyle={{color: 'green'}}
              customBtnStyle={{
                // width: '40%',
                alignSelf: 'center',
                borderWidth: 2,
                borderColor: 'green',
                backgroundColor: 'white',
              }}
              onPress={() => updateLedger()}
              loading={loading}
              color={'#222222'}
            />
          )}
          <Button
            label={'Delete this ledger'}
            customTextStyle={{color: 'red'}}
            customBtnStyle={{
              minWidth: '40%',
              alignSelf: 'center',
              borderWidth: 2,
              borderColor: 'red',
              backgroundColor: 'white',
            }}
            onPress={() => deleteTheLedger()}
            loading={loading}
            color={'#222222'}
          />
        </View>
      </SnackbarComponent>
      <ModalComponent visible={openDatePicker}>
        <DateComponent
          minDate={startDate}
          maxDate={endDate}
          onDateChange={date => {
            setselectedDate(date);
            setupdateDate(true);
            setopenDatePicker(false);
          }}
        />
        <TouchableOpacity onPress={() => setopenDatePicker(false)}>
          <Text style={{color: 'white'}}>Close</Text>
        </TouchableOpacity>
      </ModalComponent>
    </ScrollView>
  );
};

export default ViewLedger;

const LedgerRow: React.FC<{
  label: string;
  value: string;
  onPress?: () => void;
}> = ({label, value, onPress}) => {
  return (
    <View style={{...styles.ledgerRow, width: '75%', alignSelf: 'center'}}>
      <Text>{label}</Text>
      <View style={{...commonAlignment.centerAligned, gap: 5}}>
        <Text style={{color: '#222222'}}>{value}</Text>
        {onPress && (
          <TouchableOpacity onPress={onPress}>
            <Image
              source={require('../../../assets/icons/edit.png')}
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ledgerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    height: 60,
  },
});
