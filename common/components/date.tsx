import {StyleSheet} from 'react-native';
import React from 'react';
import DatePicker from 'react-native-modern-datepicker';

type DateComponentProp = {
  minDate: string;
  maxDate: string;
  onDateChange: (value: string) => void;
};

const DateComponent = ({maxDate, minDate, onDateChange}: DateComponentProp) => {
  return (
    <DatePicker
      mode="calendar"
      minimumDate={minDate}
      maximumDate={maxDate}
      selected={'12/12/2023'}
      onDateChange={onDateChange}
      options={{
        backgroundColor: '#080516',
        textHeaderColor: '#469ab6',
        textDefaultColor: '#FFFFFF',
        selectedTextColor: '#FFF',
        mainColor: '#469ab6',
        textSecondaryColor: '#FFFFFF',
        borderColor: 'rgba(122, 146, 165, 0.1)',
      }}
    />
  );
};

export default DateComponent;

const styles = StyleSheet.create({});
