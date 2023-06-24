/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Snackbar} from 'react-native-paper';

interface SnackBarProps {
  message: string;
  visible: boolean;
  type: 'error' | 'success';
  close: () => void;
}

const SnackbarComponent = (props: SnackBarProps) => {
  const {message, type, close, visible} = props;
  return (
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
  );
};

export default SnackbarComponent;
