import {StyleSheet, View, Image} from 'react-native';
import React from 'react';

const SplashScreen = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.centered}>
        <Image
          style={styles.logo}
          source={require('../../../assets/images/logo-1.png')}
        />
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 300,
  },
});
