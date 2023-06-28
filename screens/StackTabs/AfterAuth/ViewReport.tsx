import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../common/interface/types';
import Button from '../../../common/components/button';
import DatePicker from 'react-native-modern-datepicker';
import {getFormatedDate} from 'react-native-modern-datepicker';
import RenderData from '../../../components/Ledger/renderData';

const ViewReport = () => {
  const navigate = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ViewReport'>>();
  const {type, loadMore, loadingForMore, data, lastDocument} = route.params;

  const [openDatePicker, setopenDatePicker] = useState(false);

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

  return (
    <View style={styles.wrapper}>
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
            style={{backgroundColor: 'white', borderRadius: 20, padding: 10}}>
            <Image
              source={require('../../../assets/icons/back-button.png')}
              style={{width: 30, height: 30, transform: [{rotate: '180deg'}]}}
            />
          </TouchableOpacity>
        </View>
      </View>
      <RenderData
        data={data}
        customViewStyle={{marginVertical: 10}}
        onRowPres={() => {}}
        screenType={type}
        loadMore={loadMore}
        loadingForMore={loadingForMore}
        lastDocument={lastDocument}
      />
      <Modal animationType="slide" transparent={true} visible={openDatePicker}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <DatePicker
              mode="calendar"
              minimumDate={
                currentType === 'start' ? startDate : selectedDate['start']
              }
              maximumDate={endDate}
              selected={'12/12/2023'}
              onDateChange={date => {
                setselectedDate(prev => {
                  return {...prev, [currentType]: date};
                });
              }}
              options={{
                backgroundColor: '#080516',
                textHeaderColor: '#469ab6',
                textDefaultColor: '#FFFFFF',
                selectedTextColor: '#FFF',
                mainColor: '#469ab6',
                textSecondaryColor: '#FFFFFF',
                borderColor: 'rgba(122, 146, 165, 0.1)',
              }}
            />
            <TouchableOpacity onPress={handleOnPressDate}>
              <Text style={{color: 'white'}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  wrapper: {
    backgroundColor: 'white',
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
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
});
