import {StyleSheet, BackHandler, View} from 'react-native';
import React, {useEffect} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../common/interface/types';
import Header from '../../../components/SingleUser/Header';
import Button from '../../../common/components/button';

const SingleUserAccountScreen = () => {
  const navigate = useNavigation<StackNavigationProp<RootStackParamList>>();

  const route =
    useRoute<RouteProp<RootStackParamList, 'SingleUserAccountScreen'>>();

  const {custLierUser} = route.params!;
  // Inside your component
  useEffect(() => {
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

  return (
    <View style={styles.wrapper}>
      <Header wantCalls={true} custLierUser={custLierUser} />
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
          customTextStyle={{fontWeight: '700', fontSize: 15, padding: 0}}
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
          customTextStyle={{fontWeight: '700', fontSize: 15, padding: 0}}
        />
      </View>
    </View>
  );
};

export default SingleUserAccountScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
