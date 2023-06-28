/* eslint-disable react-native/no-inline-styles */
import React, {ReactNode} from 'react';
import {View, StyleSheet} from 'react-native';
import {Snackbar} from 'react-native-paper';

interface SnackBarProps {
  message: string;
  visible: boolean;
  type: 'error' | 'success';
  close: () => void;
  children: ReactNode;
}

const SnackbarComponent = (props: SnackBarProps) => {
  const {message, type, close, visible, children} = props;
  return (
    <View style={styles.wrapper}>
      {children}
      <Snackbar
        visible={visible}
        style={{backgroundColor: type === 'error' ? 'red' : 'green'}}
        onDismiss={() => close()}
        duration={60000}
        action={{
          label: 'Dismiss',
          onPress: () => close(),
        }}>
        {message}
      </Snackbar>
    </View>
  );
};

export default SnackbarComponent;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
});
