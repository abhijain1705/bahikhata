import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SettingRowProp {
  prefix: string;
  label: string;
  suffix: string;
}

const SettingRow = ({prefix, suffix, label}: SettingRowProp) => {
  return (
    <View
      style={{
        ...styles.rowParent,
        borderBottomColor: '#222222',
        borderBottomWidth: 1,
      }}>
      <View style={{...styles.rowParent, gap: 10}}>
        <Icon name={prefix} color={'#222222'} size={20} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <TouchableOpacity>
        <Icon name={suffix} color={'#222222'} size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default SettingRow;

const styles = StyleSheet.create({
  rowParent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  label: {
    color: '#222222',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
