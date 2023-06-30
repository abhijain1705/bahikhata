import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  CustLierUser,
  RootStackParamList,
} from '../../../common/interface/types';
import {UseLederDataContext} from '../../../context/ledgerContext';
import Button from '../../../common/components/button';
import {getFormatedDate} from 'react-native-modern-datepicker';
import {fetchCustlierUsersByDateRange} from '../../../firebase/methods';
import RenderData from '../../../components/Ledger/renderData';
import {UserContext} from '../../../context/userContext';
import SnackbarComponent from '../../../common/components/snackbar';
import {aggregate} from '../../../constants/utils';
import {ActivityIndicator} from 'react-native-paper';
import DateComponent from '../../../common/components/date';

const ViewReport = () => {
  const navigate = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ViewReport'>>();
  const {type, loadMore} = route.params;
  const [openDatePicker, setopenDatePicker] = useState(false);

  const {lederData, lastDocument, loadingForMore} = UseLederDataContext();

  const startDate = getFormatedDate(new Date(1947, 0, 1), 'YYYY/MM/DD');
  const endDate = getFormatedDate(new Date(), 'YYYY/MM/DD');
  const [currentType, setcurrentType] = useState<'end' | 'start'>('start');
  const [selectedDate, setselectedDate] = useState({
    start: getFormatedDate(new Date(), 'YYYY/MM/DD'),
    end: getFormatedDate(new Date(), 'YYYY/MM/DD'),
  });

  const handleOnPressDate = () => {
    setopenDatePicker(!openDatePicker);
  };

  const [loaderWhileFetching, setloaderWhileFetching] = useState(false);
  const [snackBarVisible, setsnackBarVisible] = useState(false);
  const [snackBarMessage, setsnackBarMessage] = useState('');
  const [snackBarMessageType, setsnackBarMessageType] = useState<
    'error' | 'success'
  >('error');
  const [dataBetweenDates, setdataBetweenDates] = useState<{
    [key: string]: CustLierUser[];
  }>({});

  const {user} = useContext(UserContext);

  async function queryDate() {
    const firstDate = new Date(
      Number(selectedDate['start'].split('/')[0]),
      Number(selectedDate['start'].split('/')[1]),
      Number(selectedDate['start'].split('/')[2])
    );
    const secondDate = new Date(
      Number(selectedDate['end'].split('/')[0]),
      Number(selectedDate['end'].split('/')[1]),
      Number(selectedDate['end'].split('/')[2])
    );
    if (secondDate.getTime() - firstDate.getTime() === 0) {
      setsnackBarVisible(true);
      setsnackBarMessage('the date range should be 1 day longer atleast.');
      setsnackBarMessageType('error');
      return;
    }
    const snapshot = await fetchCustlierUsersByDateRange({
      userType: type,
      userid: user?.uid ?? '',
      timeCallback: (value: boolean) => {
        setloaderWhileFetching(value);
      },
      callingSnackBar: (type: 'error' | 'success', message: string) => {
        setsnackBarVisible(true);
        setsnackBarMessage(message);
        setsnackBarMessageType(type);
      },
      startDate: firstDate,
      endDate: secondDate,
    });

    if (!snapshot.empty) {
      const data: CustLierUser[] = [];
      snapshot.forEach(doc => {
        // Convert each document to a CustLierUser object and add it to the data array
        const custlierUser: CustLierUser = doc.data() as CustLierUser;
        data.push(custlierUser);
      });
      const finalFormattedObj = aggregate(data);
      setdataBetweenDates(finalFormattedObj);
    }
  }
  return (
    <SnackbarComponent
      message={snackBarMessage}
      type={snackBarMessageType}
      close={() => {
        setsnackBarVisible(false);
      }}
      visible={snackBarVisible}>
      <View style={styles.headerWrapper}>
        <View style={styles.Child}>
          <TouchableOpacity
            onPress={() => navigate.goBack()}
            style={{backgroundColor: 'white', borderRadius: 20, padding: 10}}>
            <Image
              source={require('../../../assets/icons/back-button.png')}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
          <View style={styles.textWrapper}>
            <Text style={styles.name}>Ledger Report</Text>
            <Text style={styles.profile}>{type}</Text>
          </View>
        </View>
        <View style={{...styles.Child, gap: 0}}>
          <Button
            label={selectedDate['start']}
            onPress={() => {
              handleOnPressDate();
              setcurrentType('start');
            }}
            loading={false}
            color={'#222222'}
            customBtnStyle={styles.dateBtn}
            customTextStyle={{color: '#222222', alignSelf: 'center'}}
          />
          <Button
            label={selectedDate['end']}
            onPress={() => {
              handleOnPressDate();
              setcurrentType('end');
            }}
            loading={false}
            color={'#222222'}
            customBtnStyle={styles.dateBtn}
            customTextStyle={{color: '#222222', alignSelf: 'center'}}
          />
          <TouchableOpacity
            onPress={queryDate}
            style={{backgroundColor: 'white', borderRadius: 20, padding: 10}}>
            {loaderWhileFetching ? (
              <ActivityIndicator size={'small'} color="#222222" />
            ) : (
              <Image
                source={require('../../../assets/icons/back-button.png')}
                style={{width: 30, height: 30, transform: [{rotate: '180deg'}]}}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {Object.keys(lederData[type]).length === 0 ? (
        <View>
          <Text style={styles.label}>No {type} yet</Text>
          <Text style={styles.label}>Get started by adding {type}</Text>
        </View>
      ) : (
        <RenderData
          data={
            Object.keys(dataBetweenDates).length === 0
              ? lederData[type]
              : dataBetweenDates
          }
          customViewStyle={{marginVertical: 10}}
          onRowPres={() => {}}
          screenType={type}
          noNeedLoadMore={Object.keys(dataBetweenDates).length > 0 && true}
          loadMore={
            Object.keys(dataBetweenDates).length === 0 ? loadMore : () => {}
          }
          loadingForMore={
            Object.keys(dataBetweenDates).length === 0 ? loadingForMore : false
          }
          lastDocument={
            Object.keys(dataBetweenDates).length === 0
              ? lastDocument[type]
              : undefined
          }
        />
      )}

      <Modal animationType="slide" transparent={true} visible={openDatePicker}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <DateComponent
              minDate={
                currentType === 'start' ? startDate : selectedDate['start']
              }
              maxDate={endDate}
              onDateChange={date => {
                setselectedDate(prev => {
                  return {...prev, [currentType]: date};
                });
                handleOnPressDate();
              }}
            />
            <TouchableOpacity onPress={handleOnPressDate}>
              <Text style={{color: 'white'}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SnackbarComponent>
  );
};

export default ViewReport;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#080516',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 35,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  profile: {
    textDecorationColor: 'white',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
  headerWrapper: {
    padding: 8,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  Child: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
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
  },
  dateBtn: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    width: 120,
    backgroundColor: 'white',
  },
  label: {
    color: '#222222',
    textAlign: 'center',
  },
});
