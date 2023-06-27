import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

type ButtonProp = {
  label: string;
  onPress: () => void;
  customBtnStyle?: any;
  customTextStyle?: any;
  loading: boolean;
  color: string;
};

const Button = ({
  onPress,
  label,
  customBtnStyle,
  customTextStyle,
  loading,
  color,
}: ButtonProp) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{...styles.addBtn, ...customBtnStyle}}>
      {loading ? (
        <ActivityIndicator size={'large'} color={color} />
      ) : (
        <Text style={{...styles.btnText, ...customTextStyle}}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  addBtn: {
    backgroundColor: '#222222',
    borderRadius: 15,
    paddingVertical: 20,
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    margin: 20,
  },
  btnText: {
    fontWeight: '700',
    textTransform: 'capitalize',
  },
});
