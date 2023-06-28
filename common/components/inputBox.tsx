import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';

type InputBoxProp = {
  label: string;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  customLabelStyle?: any;
  customInputStyle?: any;
  placeHolderColor?: string;
  customInputContainer?: any;
};

const InputBox = ({
  label,
  value,
  customInputStyle,
  customLabelStyle,
  setValue,
  placeholder,
  customInputContainer,
  placeHolderColor,
}: InputBoxProp) => {
  return (
    <View style={{...styles.inputContainer, ...customInputContainer}}>
      {label && (
        <Text style={{...styles.inputLabel, ...customLabelStyle}}>{label}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={text => setValue(text)}
        style={{...styles.inputText, ...customInputStyle}}
        placeholder={placeholder}
        placeholderTextColor={placeHolderColor ? placeHolderColor : '#000'}
      />
    </View>
  );
};

export default InputBox;

const styles = StyleSheet.create({
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 10,
    padding: 15,
  },
  inputLabel: {
    color: '#222222',
    fontWeight: '600',
    fontSize: 20,
  },
  inputText: {
    borderWidth: 2,
    borderRadius: 12,
    color: '#222222',
    fontSize: 16,
    borderColor: '#222222',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 6,
    minHeight: 60,
  },
});
