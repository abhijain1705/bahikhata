import {
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React, {useCallback, useMemo, useContext, useState} from 'react';
import {UserContext} from '../userContext';
import {TabView, SceneMap} from 'react-native-tab-view';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import uuid from 'react-native-uuid';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RadioButton} from 'react-native-paper';
import SnackbarComponent from '../common/components/snackbar';
import {updateUserDoc} from '../firebase/methods';
import {UserInterface} from '../common/interface/types';

// Define the type for the route params
type LedgerScreenRouteParams = {
  bottomSheetRef: any;
};

const LedgerScreen = () => {
  const route =
    useRoute<RouteProp<LedgerScreenRouteParams, 'bottomSheetRef'>>();
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
    await updateUserDoc(
      updateState,
      (value: boolean) => {
        setloading(value);
      },
      (type: 'error' | 'success', message: string) => {
        setsnackBarVisible(true);
        setsnackBarMessage(message);
        setsnackBarMessageType(type);
      },
      {
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
          },
        },
      }
    );
  }

  const FirstRoute = () => (
    <View style={{flex: 1, backgroundColor: '#ff4081'}} />
  );

  const SecondRoute = () => (
    <View style={{flex: 1, backgroundColor: '#673ab7'}} />
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'First'},
    {key: 'second', title: 'Second'},
  ]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        />
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          onChange={handleSheetChanges}>
          <BottomSheetScrollView>
            {user !== null &&
              Object.entries(user!.business).map((itm, ind) => (
                <TouchableOpacity key={ind} style={styles.businessTab}>
                  <View style={styles.businessTabContent}>
                    <Image
                      style={styles.businessImg}
                      source={require('../assets/images/category/shop.png')}
                    />
                    <Text style={styles.businessLabel}>{itm[1].name}</Text>
                  </View>
                  <RadioButton
                    value="first"
                    color="green"
                    status={checked === itm[1].firmid ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked(itm[1].firmid);
                      closeBottomSheet();
                      updateState({currentFirmId: itm[1].firmid});
                    }}
                  />
                </TouchableOpacity>
              ))}
            <TouchableOpacity
              onPress={createNewBusiness}
              style={styles.moreButton}>
              {loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <Text style={{color: 'white'}}>Register Another Business</Text>
              )}
            </TouchableOpacity>
          </BottomSheetScrollView>
        </BottomSheet>
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

export default LedgerScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
  },
  businessImg: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  businessTabContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: 'black',
    fontWeight: '600',
    fontSize: 20,
  },
  moreButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    width: '90%',
    paddingVertical: 20,
    marginTop: 10,
    backgroundColor: 'green',
    alignSelf: 'center',
    borderRadius: 12,
  },
});
