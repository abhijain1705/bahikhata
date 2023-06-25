import {
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import MoneyBox from '../components/Ledger/moneyBox';

const CustomerScreen = () => {
  return (
    <View>
      <MoneyBox />
    </View>
  );
};

export default CustomerScreen;
