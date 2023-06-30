import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../common/interface/types';
import {StackNavigationProp} from '@react-navigation/stack';

const EntryScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'EntryScreen'>>();
  const navigate = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {type, userid, username} = route.params;
  return (
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
            color: type === 'debit' ? 'red' : 'green',
          }}>
          Write {type} for {username}
        </Text>
      </View>
    </View>
  );
};

export default EntryScreen;

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-evenly',
  },
  headerText: {
    fontWeight: '700',
    fontSize: 15,
  },
});
