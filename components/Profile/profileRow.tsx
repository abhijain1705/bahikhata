import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {ReactNode} from 'react';
import {useNavigation} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

type ProfileRowProp = {
  prefixIcon: ReactNode;
  label: string;
  header: string;
  type: string;
};

const ProfileRow = ({prefixIcon, type, label, header}: ProfileRowProp) => {
  const navigation = useNavigation<any>();

  const handleEditPress = (key: string) => {
    navigation.navigate('EditScreen', {type: key});
  };

  return (
    <View style={styles.row}>
      <View style={styles.nameWrapper}>
        {prefixIcon}
        <View style={styles.contentWrapper}>
          <Text style={styles.header}>{header}</Text>
          <Text style={styles.text}>{label}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          handleEditPress(type);
        }}>
        <FeatherIcon name="chevron-right" size={30} color={'#222222'} />
      </TouchableOpacity>
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
