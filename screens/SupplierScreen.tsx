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

const SupplierScreen = () => {
  return (
    <View>
      <MoneyBox />
    </View>
  );
};

export default SupplierScreen;
