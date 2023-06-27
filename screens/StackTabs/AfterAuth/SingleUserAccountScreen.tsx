import {StyleSheet, BackHandler, View} from 'react-native';
import React, {useEffect} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../common/interface/types';
import Header from '../../../components/SingleUser/Header';

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
    <View>
      <Header wantCalls={true} custLierUser={custLierUser} />
    </View>
  );
};

export default SingleUserAccountScreen;

const styles = StyleSheet.create({});
