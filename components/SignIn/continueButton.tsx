import {StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import React from 'react';

type ContinueButtonProp = {
  icon: 'fb' | 'google';
  title: string;
  onClick: () => void;
};

const ContinueButton = ({icon, title, onClick}: ContinueButtonProp) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onClick}>
      {icon === 'fb' ? (
        <Image
          style={styles.icon}
          source={require('../../assets/images/fb-icon.png')}
        />
      ) : (
        <Image
          style={styles.icon}
          source={require('../../assets/images/google-icon.png')}
        />
      )}
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ContinueButton;

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '90%',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'gray',
    backgroundColor: '#222222',
  },
  label: {
    color: 'white',
  },
});
