import {
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React, {
  useCallback,
  useMemo,
  useContext,
  useState,
  useEffect,
} from 'react';
import {UserContext} from '../../context/userContext';
import {UseLederDataContext} from '../../context/ledgerContext';
import LedgerDataScreen from '../StackTabs/AfterAuth/LedgerDataScreen';
// import EntypoIcon from 'react-native-vector-icons/Entypo';
import {
  TabView,
  SceneMap,
  TabBar,
  TabBarIndicator,
} from 'react-native-tab-view';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import uuid from 'react-native-uuid';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {RadioButton} from 'react-native-paper';
import SnackbarComponent from '../../common/components/snackbar';
import {
  fetchCustierUserByName,
  fetchCustlierUsers,
  updateUserDoc,
} from '../../firebase/methods';
import {
  CustLierUser,
  RootStackParamList,
  TabParamList,
  UserInterface,
} from '../../common/interface/types';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {UseApiCallContext} from '../../context/recallTheApi';
import {StackNavigationProp} from '@react-navigation/stack';
import {aggregate} from '../../constants/utils';
import InputBox from '../../common/components/inputBox';
import {commonAlignment} from '../../common/styles/styles';

type CustomTabBarProps = {
  loadMore: (screenType: 'customer' | 'supplier') => void;
  props: any;
};

const CustomTabBar = ({props, loadMore}: CustomTabBarProps) => {
  const navigate = useNavigation<StackNavigationProp<RootStackParamList>>();

  function navigateToReport() {
    navigate.navigate('ViewReport', {
      type: props.navigationState.index === 0 ? 'customer' : 'supplier',
      loadMore,
    });
  }
  return (
    <View style={styles.tabBarWrapper}>
      <TabBar
        {...props}
        renderIndicator={prop => (
          <TabBarIndicator {...prop} style={styles.tabBarIndicator} />
        )}
        labelStyle={{color: 'white'}}
        activeColor="#222222"
        style={styles.tabBar}
      />
      <TouchableOpacity
        onPress={navigateToReport}
        style={{...commonAlignment.centerAligned}}>
        <Text style={styles.reportText}>View Report</Text>
        {/* <EntypoIcon name="chevron-right" color={'blue'} size={20} /> */}
        <Image
          source={require('../../assets/icons/chevron.png')}
          style={{width: 30, height: 30}}
        />
      </TouchableOpacity>
    </View>
  );
};

const LedgerScreen = () => {
  const route = useRoute<RouteProp<TabParamList, 'LedgerScreen'>>();
  const {
    params: {bottomSheetRef},
  } = route;

  const [loading, setloading] = useState(false);
  const [snackBarVisible, setsnackBarVisible] = useState(false);
  const [snackBarMessage, setsnackBarMessage] = useState('');
  const [snackBarMessageType, setsnackBarMessageType] = useState<
    'error' | 'success'
  >('error');

  const {user, setUser} = useContext(UserContext);
  const [checked, setChecked] = useState(user?.currentFirmId ?? '');

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} />,
    []
  );

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  function updateState(userData: Partial<UserInterface>) {
    setUser({...user!, ...userData});
    closeBottomSheet();
  }

  async function createNewBusiness() {
    if (user === null) return;

    if (Object.entries(user.business).length === 10) {
      setsnackBarVisible(true);
      setsnackBarMessage(
        'You have reached the maximum limit of creating businesses.'
      );
      setsnackBarMessageType('error');
      return;
    }

    const newBusinessId = uuid.v4().toString() + user?.uid;
    await updateUser(updateState, {
      uid: user!.uid,
      currentFirmId: newBusinessId,
      business: {
        ...user!.business,
        [newBusinessId]: {
          firmid: newBusinessId,
          name: `business ${Object.entries(user!.business).length + 1}`,
          address: 'Jaipur Rajasthan , India',
          phoneNumber: '+919876543210',
          gst: 'business gst',
          category: 'Agriculture',
          type: 'Retailer',
          dateOfCreation: new Date(),
          customer: {payable: 0, recieviable: 0},
          supplier: {payable: 0, recieviable: 0},
          invoice: {
            sales: {count: 0, value: 0},
            purchase: {count: 0, value: 0},
          },
        },
      },
    });
  }

  async function updateUser(
    updateState: (userData: Partial<UserInterface>) => void,
    userData: Partial<UserInterface>
  ) {
    await updateUserDoc({
      updateState,
      timeCallback: (value: boolean) => {
        setloading(value);
      },
      callingSnackBar: (type: 'error' | 'success', message: string) => {
        setsnackBarVisible(true);
        setsnackBarMessage(message);
        setsnackBarMessageType(type);
      },
      userData: userData,
    });
  }

  const {setlederData, setloadingForMore, lastDocument, setlastDocument} =
    UseLederDataContext();

  const [loadingInFetching, setloadingInFetching] = useState(false);
  const [erroMsg, seterroMsg] = useState('');

  const [searchUser, setsearchUser] = useState('');
  const [searchedData, setsearchedData] = useState<{
    [key: string]: CustLierUser[];
  }>({});
  const implementSearchByName = useCallback(
    debounce((screenType: 'customer' | 'supplier', name: string) => {
      if (!name) return;
      fetchCustierUserByName({
        name: name,
        userid: user!.uid,
        userType: screenType,
        setErrorMsg: value => {
          seterroMsg(value);
        },
        businessid: user!.currentFirmId,
        timeCallback: value => {
          setloadingInFetching(value);
        },
      }).then(snapshot => {
        if (!snapshot.empty) {
          const data: CustLierUser[] = [];
          snapshot.forEach(doc => {
            // Convert each document to a CustLierUser object and add it to the data array
            const custlierUser: CustLierUser = doc.data() as CustLierUser;
            data.push(custlierUser);
          });
          const finalFormattedObj = aggregate({a: data, type: 'custlier'});
          setsearchedData(finalFormattedObj['custlier']);
        }
      });
    }, 500),
    []
  );

  function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null;

    return function (this: unknown, ...args: Parameters<T>): void {
      const context = this;
      clearTimeout(timeout as NodeJS.Timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, delay);
    };
  }

  const fetchData = async (screenType: 'customer' | 'supplier') => {
    const snapshot = await fetchCustlierUsers({
      setErrorMsg: value => {
        seterroMsg(value);
      },
      timeCallback: value => {
        setloadingInFetching(value);
      },
      userid: user!.uid,
      userType: screenType,
      businessid: user!.currentFirmId,
    });
    setApiIsCalled(true);
    if (!snapshot.empty) {
      const data: CustLierUser[] = [];
      snapshot.forEach(doc => {
        // Convert each document to a CustLierUser object and add it to the data array
        const custlierUser: CustLierUser = doc.data() as CustLierUser;
        data.push(custlierUser);
      });
      const finalObj = aggregate({a: data, type: 'custlier'});
      setlederData(prev => {
        return {...prev, [screenType]: finalObj['custlier']};
      });
      const lastVisible = snapshot.docs[
        snapshot.docs.length - 1
      ] as FirebaseFirestoreTypes.DocumentSnapshot<CustLierUser>;
      setlastDocument(prev => {
        return {...prev, [screenType]: lastVisible};
      });
    } else {
      setlastDocument(prev => {
        return {...prev, [screenType]: undefined};
      });
    }
  };

  async function loadMore(screenType: 'customer' | 'supplier') {
    if (lastDocument[screenType] === undefined) return;
    console.log('i get calledsfd');
    const snapshot = await fetchCustlierUsers({
      setErrorMsg: value => {
        seterroMsg(value);
      },
      timeCallback: value => {
        setloadingForMore(value);
      },
      userid: user!.uid,
      userType: screenType,
      lastDocument: lastDocument[screenType],
      businessid: user!.currentFirmId,
    });
    if (!snapshot.empty) {
      const data: CustLierUser[] = [];
      snapshot.forEach(doc => {
        // Convert each document to a CustLierUser object and add it to the data array
        const custlierUser: CustLierUser = doc.data() as CustLierUser;
        data.push(custlierUser);
      });
      const finalObj = aggregate({a: data, type: 'custlier'});
      setlederData(prev => {
        return {...prev, [screenType]: finalObj['custlier']};
      });
    } else {
      setlastDocument(prev => {
        return {...prev, [screenType]: undefined};
      });
    }
  }
  const {apiIsCalled, setApiIsCalled} = UseApiCallContext();
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {key: 'first', title: 'CUSTOMER'},
    {key: 'second', title: 'SUPPLIER'},
  ]);

  useEffect(() => {
    if (!apiIsCalled) {
      console.log('i get called');
      fetchData('supplier');
      fetchData('customer');
    }
  }, [apiIsCalled, index]);

  const FirstRoute = () => (
    <LedgerDataScreen
      screenType="customer"
      loadMore={loadMore}
      loadingInFetching={loadingInFetching}
      erroMsg={erroMsg}
      searchedData={searchedData}
      searchUser={searchUser}
    />
  );

  const SecondRoute = () => (
    <LedgerDataScreen
      loadMore={loadMore}
      screenType="supplier"
      loadingInFetching={loadingInFetching}
      erroMsg={erroMsg}
      searchedData={searchedData}
      searchUser={searchUser}
    />
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <SnackbarComponent
      message={snackBarMessage}
      type={snackBarMessageType}
      close={() => {
        setsnackBarVisible(false);
      }}
      visible={snackBarVisible}>
      <View style={styles.container}>
        <View
          style={{...styles.searchWrapper, ...commonAlignment.centerAligned}}>
          <InputBox
            label={''}
            placeholder={'Search By Name'}
            value={searchUser}
            customInputContainer={{width: '100%'}}
            setValue={value => {
              implementSearchByName(
                index === 0 ? 'customer' : 'supplier',
                value
              );
              setsearchUser(value);
            }}
          />
        </View>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={indx => {
            setIndex(indx);
            setsearchUser('');
            setsearchedData({});
          }}
          initialLayout={{width: layout.width}}
          renderTabBar={props => (
            <CustomTabBar props={props} loadMore={loadMore} />
          )} // Use the custom tab bar component
        />
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          onChange={handleSheetChanges}>
          <BottomSheetScrollView>
            {user !== null &&
              Object.entries(user!.business).map((itm, ind) => {
                return (
                  <TouchableOpacity key={ind} style={styles.businessTab}>
                    <View
                      style={{
                        ...styles.businessTabContent,
                        ...commonAlignment.centerAligned,
                      }}>
                      <Image
                        style={styles.businessImg}
                        source={require('../../assets/images/category/shop.png')}
                      />
                      <Text style={styles.businessLabel}>{itm[1].name}</Text>
                    </View>
                    <RadioButton
                      value="first"
                      color="green"
                      status={
                        checked === itm[1].firmid ? 'checked' : 'unchecked'
                      }
                      onPress={async () => {
                        await updateUser(
                          () => updateState({currentFirmId: itm[1].firmid}),
                          {uid: user.uid, currentFirmId: itm[1].firmid}
                        );
                        setChecked(itm[1].firmid);
                        setApiIsCalled(false);
                        closeBottomSheet();
                      }}
                    />
                  </TouchableOpacity>
                );
              })}
            <TouchableOpacity
              onPress={createNewBusiness}
              style={{...styles.moreButton, ...commonAlignment.centerAligned}}>
              {loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <Text style={{color: 'white'}}>Register Another Business</Text>
              )}
            </TouchableOpacity>
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </SnackbarComponent>
  );
};

export default LedgerScreen;

const styles = StyleSheet.create({
  searchWrapper: {
    width: '90%',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  businessImg: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  businessTabContent: {
    gap: 15,
  },
  businessTab: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
    width: '100%',
    padding: 10,
    marginTop: 10,
  },
  businessLabel: {
    color: '#222222',
    fontWeight: '600',
    fontSize: 20,
  },
  moreButton: {
    minHeight: 40,
    width: '90%',
    paddingVertical: 20,
    marginTop: 10,
    backgroundColor: 'green',
    alignSelf: 'center',
    borderRadius: 12,
  },
  tabBarWrapper: {
    width: '100%',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBarIndicator: {
    backgroundColor: 'white',
    height: 50,
    borderRadius: 12,
    marginVertical: 5,
    width: '45%',
    position: 'absolute',
    left: '5%',
    alignSelf: 'center',
  },
  tabBar: {
    backgroundColor: '#222222',
    width: '65%',
    alignSelf: 'flex-start',
    borderRadius: 12,
    margin: 10,
    padding: 5,
    position: 'relative',
  },
  reportText: {
    color: 'blue',
    width: '35%',
    fontSize: 15,
    fontWeight: '600',
  },
});
