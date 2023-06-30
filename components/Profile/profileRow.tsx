import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {ReactNode} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {CustLierUser, RootStackParamList} from '../../common/interface/types';
import {commonAlignment} from '../../common/styles/styles';
// import FeatherIcon from 'react-native-vector-icons/Feather';

type ProfileRowProp = {
  prefixIcon: ReactNode;
  label: string;
  header: string;
  type: string;
  custlierUser?: CustLierUser;
  editable: boolean;
};

const ProfileRow = ({
  prefixIcon,
  type,
  editable,
  label,
  custlierUser,
  header,
}: ProfileRowProp) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleEditPress = (key: string) => {
    navigation.navigate('EditScreen', {type: key, custlierUser});
  };

  return (
    <View style={styles.row}>
      <View style={{...styles.nameWrapper, ...commonAlignment.centerAligned}}>
        {prefixIcon}
        <View style={styles.contentWrapper}>
          <Text style={styles.header}>{header}</Text>
          <Text style={styles.text}>{label}</Text>
        </View>
      </View>
      {editable && (
        <TouchableOpacity
          onPress={() => {
            handleEditPress(type);
          }}>
          <Image
            source={require('../../assets/icons/chevron.png')}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProfileRow;

const styles = StyleSheet.create({
  header: {
    color: 'blue',
    fontSize: 12,
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  text: {
    color: '#222222',
    fontSize: 20,
  },
  nameWrapper: {
    gap: 15,
  },
  row: {
    width: '90%',
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 75,
  },
});
