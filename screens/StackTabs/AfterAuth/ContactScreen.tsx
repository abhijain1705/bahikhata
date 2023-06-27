import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import Contacts from 'react-native-contacts';
import React, {useState, useEffect} from 'react';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../common/interface/types';
import SnackbarComponent from '../../../common/components/snackbar';

const ContactScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ContactScreen'>>();
  const navigate = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [contactList, setContactList] = useState<Contacts.Contact[]>([]);

  const [snackBarVisible, setsnackBarVisible] = useState(false);
  const [snackBarMessage, setsnackBarMessage] = useState('');
  const [snackBarMessageType, setsnackBarMessageType] = useState<
    'error' | 'success'
  >('error');

  useEffect(() => {
    if (route.params) {
      setContactList(route.params.contacts);
    }
  }, [route]);

  function navigateToDetailScreen(selectedContact: Contacts.Contact) {
    if (selectedContact.phoneNumbers.length === 0) {
      setsnackBarVisible(true);
      setsnackBarMessageType('error');
      setsnackBarMessage('No number found!');
      return;
    }

    navigate.navigate('AddDataScreen', {
      type: 'account',
      selectedContact: selectedContact,
      screenType: route.params.screenType,
    });
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
        {contactList.map(contact => (
          <TouchableOpacity
            onPress={() => navigateToDetailScreen(contact)}
            key={contact.recordID}
            style={styles.contactContainer}>
            <View style={styles.icon}>
              <Text style={styles.iconText}>
                {contact.displayName.substring(0, 1)}
              </Text>
            </View>
            <Text style={styles.contactName}>{contact.displayName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <SnackbarComponent
        message={snackBarMessage}
        type={snackBarMessageType}
        close={() => {
          setsnackBarVisible(false);
        }}
        visible={snackBarVisible}
      />
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
  container: {
    flexGrow: 1,
    paddingVertical: 12,
  },
  contactContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 15,
  },
  icon: {
    backgroundColor: '#00acee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    width: 50,
    borderRadius: 100,
  },
  iconText: {
    color: 'white',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222222',
  },
  contactPhoneNumber: {
    fontSize: 16,
    color: '#666',
  },
});
