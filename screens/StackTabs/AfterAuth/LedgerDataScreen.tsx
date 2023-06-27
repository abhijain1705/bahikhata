import {StyleSheet, Text, View, PermissionsAndroid} from 'react-native';
import React, {useState} from 'react';
import MoneyBox from '../../../components/Ledger/moneyBox';
import Contacts from 'react-native-contacts';
import Button from '../../../common/components/button';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  CustLierUser,
  RootStackParamList,
} from '../../../common/interface/types';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {ActivityIndicator} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import {TouchableOpacity} from '@gorhom/bottom-sheet';

type LedgerDataScreenProp = {
  loadMore: () => void;
  screenType: 'customer' | 'supplier';
  custlierData: {[key: string]: CustLierUser[]};
  loadingForMore: boolean;
  erroMsg: string;
  loadingInFetching: boolean;
  lastDocument: {
    customer: FirebaseFirestoreTypes.DocumentSnapshot<CustLierUser> | undefined;
    supplier: FirebaseFirestoreTypes.DocumentSnapshot<CustLierUser> | undefined;
  };
};

const LedgerDataScreen = ({
  screenType,
  loadingInFetching,
  loadMore,
  loadingForMore,
  erroMsg,
  lastDocument,
  custlierData,
}: LedgerDataScreenProp) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [loading, setloading] = useState(false);
  function readContacts() {
    setloading(true);
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    })
      .then(res => {
        console.log('Permission: ', res);
        Contacts.getAll()
          .then(contacts => {
            // work with contacts
            setloading(false);
            navigation.navigate('ContactScreen', {
              contacts: contacts,
              screenType,
            });
          })
          .catch(e => {
            setloading(false);
            console.log(e);
          });
      })
      .catch(error => {
        setloading(false);
        console.error('Permission error: ', error);
      });
  }

  return (
    <View style={styles.screenWrapper}>
      <MoneyBox />
      {erroMsg ? (
        <View>
          <Text style={styles.label}>{erroMsg}</Text>
        </View>
      ) : loadingInFetching ? (
        <ActivityIndicator size={'large'} color="#222222" />
      ) : Object.entries(custlierData).length === 0 ? (
        <View>
          <Text style={styles.label}>No {screenType} yet</Text>
          <Text style={styles.label}>Get started by adding {screenType}</Text>
        </View>
      ) : (
        <ScrollView style={{width: '100%'}}>
          {Object.entries(custlierData).map((itm, ind) => {
            return (
              <View key={ind}>
                <View style={styles.dateWrapper}>
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                    {itm[0]}
                  </Text>
                </View>
                {itm[1].map((us, index) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('SingleUserAccountScreen', {
                        custLierUser: us,
                      })
                    }
                    style={styles.custlierRow}
                    key={index}>
                    <View style={{flex: 1}}>
                      <Text style={styles.custlierName}>{us.name}</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.custlierDebit}>₹{us.payable}</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.custlierCredit}>
                        ₹{us.receivable}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })}
          {
            <TouchableOpacity onPress={() => loadMore()}>
              {loadingForMore ? (
                <ActivityIndicator size={'large'} color="#222222" />
              ) : (
                <Text style={styles.moreBtnLabel}>
                  {lastDocument[screenType] === undefined
                    ? 'No more data'
                    : 'load more'}
                </Text>
              )}
            </TouchableOpacity>
          }
        </ScrollView>
      )}
      <Button
        label={`Add ${screenType} +`}
        loading={loading}
        color={'white'}
        onPress={readContacts}
        customBtnStyle={{
          backgroundColor: screenType === 'customer' ? '#152c5b' : '#482121',
        }}
      />
    </View>
  );
};

export default LedgerDataScreen;

const styles = StyleSheet.create({
  label: {
    color: '#222222',
    textAlign: 'center',
  },
  screenWrapper: {
    backgroundColor: '#add0a0',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  moreBtnLabel: {
    color: '#222222',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
  custlierRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    height: 60,
  },
  custlierName: {
    color: 'black',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'left',
  },
  custlierDebit: {
    color: 'red',
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
  },
  custlierCredit: {
    color: 'green',
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
  },
  dateWrapper: {
    backgroundColor: '#222222',
    width: 120,
    padding: 6,
    borderRadius: 12,
    alignSelf: 'center',
  },
});
