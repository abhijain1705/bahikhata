import {StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import {UserContext} from '../../context/userContext';

interface MoneyBoxProp {
  screenType: 'customer' | 'supplier';
}

const MoneyBox = ({screenType}: MoneyBoxProp) => {
  const {user} = useContext(UserContext);

  const debit = user?.business[user.currentFirmId][screenType].payable;
  const credit = user?.business[user.currentFirmId][screenType].recieviable;

  return (
    <View style={styles.boxWrapper}>
      <View style={styles.sideWrapper}>
        <Text style={styles.label}>Debit</Text>
        <Text style={{...styles.money, color: 'red'}}>₹ {debit}</Text>
      </View>
      <View style={styles.sideWrapper}>
        <Text style={styles.label}>Credit</Text>
        <Text style={{...styles.money, color: 'green'}}>₹ {credit}</Text>
      </View>
    </View>
  );
};

export default MoneyBox;

const styles = StyleSheet.create({
  boxWrapper: {
    width: '90%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#222222',
    alignSelf: 'center',
    marginVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
  },
  sideWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    padding: 15,
  },
  label: {
    color: '#222222',
    alignSelf: 'flex-start',
  },
  money: {
    fontWeight: '800',
    fontSize: 20,
  },
});
