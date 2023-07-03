import {
  StyleSheet,
  BackHandler,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Ledger, RootStackParamList} from '../../../common/interface/types';
import Header from '../../../components/SingleUser/Header';
import Button from '../../../common/components/button';
import {getAllLedgerOfSingleUser} from '../../../firebase/methods';
import {UserContext} from '../../../context/userContext';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {calculateEntryAge} from '../../../constants/utils';
import {aggregate} from '../../../constants/utils';

const SingleUserAccountScreen = () => {
  const navigate = useNavigation<StackNavigationProp<RootStackParamList>>();

  const route =
    useRoute<RouteProp<RootStackParamList, 'SingleUserAccountScreen'>>();

  const {custLierUser} = route.params!;
  // Inside your component
  useLayoutEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Perform any additional logic or navigation here before going back
        navigate.navigate('HomeScreen'); // Specify the screen you want to navigate to on back
        return true; // Prevent default back button behavior
      }
    );
    return () => backHandler.remove(); // Clean up the event listener on component unmount
  }, []);

  const [loadingInFetching, setloadingInFetching] = useState(false);
  const [erroMsg, seterroMsg] = useState('');
  const [loadingMore, setloadingMore] = useState(false);
  const {user} = useContext(UserContext);
  const [lastDocument, setlastDocument] = useState<
    FirebaseFirestoreTypes.DocumentSnapshot<Ledger> | undefined
  >(undefined);
  const [userledger, setUserledger] = useState<{
    [key: string]: Ledger[];
  }>({});

  const fetchData = async () => {
    const snapshot = await getAllLedgerOfSingleUser({
      userid: user?.uid ?? '',
      businessid: custLierUser.docId,
      timeCallback: value => {
        setloadingInFetching(value);
      },
      setErrorMsg: value => {
        seterroMsg(value);
      },
    });
    if (!snapshot.empty) {
      const data: Ledger[] = [];
      snapshot.forEach(doc => {
        // Convert each document to a CustLierUser object and add it to the data array
        const custlierUser: Ledger = doc.data() as Ledger;
        data.push(custlierUser);
      });
      const finalObj = aggregate({b: data, type: 'ledger'});
      setUserledger(finalObj['ledger']);
      const lastVisible = snapshot.docs[
        snapshot.docs.length - 1
      ] as FirebaseFirestoreTypes.DocumentSnapshot<Ledger>;
      setlastDocument(lastVisible);
    } else {
      setlastDocument(undefined);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadMore = async () => {
    const snapshot = await getAllLedgerOfSingleUser({
      userid: user?.uid ?? '',
      businessid: custLierUser.docId,
      timeCallback: value => {
        setloadingMore(value);
      },
      setErrorMsg: value => {
        seterroMsg(value);
      },
      lastDocument: lastDocument,
    });
    if (!snapshot.empty) {
      const data: Ledger[] = [];
      snapshot.forEach(doc => {
        // Convert each document to a CustLierUser object and add it to the data array
        const custlierUser: Ledger = doc.data() as Ledger;
        data.push(custlierUser);
      });
      const finalObj = aggregate({b: data, type: 'ledger'});
      setUserledger(prev => {
        return {...prev, ...finalObj['ledger']};
      });
      const lastVisible = snapshot.docs[
        snapshot.docs.length - 1
      ] as FirebaseFirestoreTypes.DocumentSnapshot<Ledger>;
      setlastDocument(lastVisible);
    } else {
      setlastDocument(undefined);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Header wantCalls={true} custLierUser={custLierUser} />
      <View style={styles.screenWrapper}>
        {erroMsg ? (
          <View>
            <Text style={styles.label}>{erroMsg}</Text>
          </View>
        ) : loadingInFetching ? (
          <ActivityIndicator size={'large'} color="#222222" />
        ) : Object.entries(userledger).length === 0 ? (
          <View>
            <Text style={styles.label}>No ledgers yet</Text>
            <Text style={styles.label}>Get started by adding entries</Text>
          </View>
        ) : (
          <ScrollView style={{width: '100%'}} horizontal={false}>
            {Object.entries(userledger).map((itm, ind) => (
              <View key={ind}>
                <View style={styles.dateWrapper}>
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                    {calculateEntryAge(itm[0])}
                  </Text>
                </View>
                {itm[1].map((ent, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigate.navigate('ViewLedger', {
                        entry: ent,
                        custlier: custLierUser,
                      });
                    }}
                    style={styles.ledgerRow}
                    key={index}>
                    <View style={{flex: 1}}>
                      <Text style={{color: '#222222', textAlign: 'center'}}>
                        {ent.cleared ? 'cleared' : 'pending'}
                      </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={{color: 'red', textAlign: 'center'}}>
                        {ent.entryType === 'debit' ? '₹' + ent.amount : '₹ 0'}
                      </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={{color: 'green', textAlign: 'center'}}>
                        {ent.entryType === 'credit' ? '₹' + ent.amount : '₹ 0'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            <TouchableOpacity onPress={() => loadMore()}>
              {loadingMore ? (
                <ActivityIndicator size={'large'} color="#222222" />
              ) : (
                <Text style={styles.moreBtnLabel}>
                  {lastDocument === undefined ? 'No more data' : 'load more'}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          label={'Debit'}
          onPress={() => {
            navigate.navigate('EntryScreen', {
              type: 'debit',
              custLierUser,
              // userid: custLierUser.docId,
              // username: custLierUser.name,
              // usernumber: custLierUser.phoneNumber,
            });
          }}
          loading={false}
          color={'white'}
          customBtnStyle={{
            backgroundColor: 'red',
            width: '40%',
            padding: 0,
            height: 60,
          }}
          customTextStyle={{
            fontWeight: '700',
            fontSize: 15,
            padding: 0,
            color: 'white',
          }}
        />
        <Button
          label={'Credit'}
          onPress={() => {
            navigate.navigate('EntryScreen', {
              type: 'credit',
              custLierUser,
              // userid: custLierUser.docId,
              // username: custLierUser.name,
              // usernumber: custLierUser.phoneNumber,
            });
          }}
          loading={false}
          color={'white'}
          customBtnStyle={{
            backgroundColor: 'green',
            width: '40%',
            padding: 0,
            height: 60,
          }}
          customTextStyle={{
            fontWeight: '700',
            fontSize: 15,
            padding: 0,
            color: 'white',
          }}
        />
      </View>
    </View>
  );
};

export default SingleUserAccountScreen;

const styles = StyleSheet.create({
  moreBtnLabel: {
    color: '#222222',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
  wrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
  dateWrapper: {
    backgroundColor: '#222222',
    width: 120,
    padding: 6,
    borderRadius: 12,
    alignSelf: 'center',
  },
  ledgerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    height: 60,
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  screenWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  label: {
    color: '#222222',
    textAlign: 'center',
  },
});
