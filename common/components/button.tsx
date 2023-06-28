import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {ReactNode} from 'react';

type ButtonProp = {
  label: string;
  onPress: () => void;
  customBtnStyle?: any;
  customTextStyle?: any;
  loading: boolean;
  color: string;
  img?: ReactNode;
};

const Button = ({
  onPress,
  label,
  customBtnStyle,
  customTextStyle,
  loading,
  color,
  img,
}: ButtonProp) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{...styles.addBtn, ...customBtnStyle}}>
      {img}
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
    flexDirection: 'row',
    gap: 15,
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
