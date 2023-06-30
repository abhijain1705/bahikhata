import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import Contacts from 'react-native-contacts';
import React, {useState, useEffect, useContext} from 'react';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  CustLierUser,
  RootStackParamList,
} from '../../../common/interface/types';
import SnackbarComponent from '../../../common/components/snackbar';
import {
  checkIfCustlierUserExists,
  updateCustlierUser,
} from '../../../firebase/methods';
import {UserContext} from '../../../context/userContext';
import {ActivityIndicator} from 'react-native-paper';
import Button from '../../../common/components/button';
import {UseApiCallContext} from '../../../context/recallTheApi';
import InputBox from '../../../common/components/inputBox';
import { commonAlignment } from '../../../common/styles/styles';

const ContactScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ContactScreen'>>();
  const navigate = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [contactList, setContactList] = useState<Contacts.Contact[]>([]);
  const {user} = useContext(UserContext);
  const [loading, setloading] = useState(false);
  const [snackBarVisible, setsnackBarVisible] = useState(false);
  const [snackBarMessage, setsnackBarMessage] = useState('');
  const [snackBarMessageType, setsnackBarMessageType] = useState<
    'error' | 'success'
  >('error');

  const [showModal, setshowModal] = useState(false);
  const [selectedCon, setselectedCon] = useState<CustLierUser[]>([]);
  useEffect(() => {
    if (route.params) {
      setContactList(route.params.contacts);
    }
  }, [route]);

  async function check(selectedContact?: Contacts.Contact) {
    if (selectedContact === undefined) return;
    const number = (selectedContact.phoneNumbers[0].number ?? '') as any;
    const querySnapshot = await checkIfCustlierUserExists({
      userid: user!.uid,
      phoneNumber: number.startsWith('+91') ? number : '+91' + number,
      timeCallback: value => {
        setloading(value);
      },
      callingSnackBar: (type: 'error' | 'success', message: string) => {
        setsnackBarVisible(true);
        setsnackBarMessage(message);
        setsnackBarMessageType(type);
      },
    });
    if (!querySnapshot.empty) {
      const data: CustLierUser[] = [];
      querySnapshot.forEach(doc => {
        // Convert each document to a CustLierUser object and add it to the data array
        const custlierUser = doc.data() as CustLierUser;
        data.push(custlierUser);
      });
      setselectedCon(data);
      if (data[0].userType !== route.params.screenType) {
        setshowModal(true);
      } else {
        setshowModal(false);
        navigate.navigate('SingleUserAccountScreen', {custLierUser: data[0]});
      }
      return;
    } else {
      navigate.navigate('AddDataScreen', {
        type: 'account',
        selectedContact: selectedContact,
        screenType: route.params.screenType,
      });
      return;
    }
  }

  const {setApiIsCalled} = UseApiCallContext();

  async function updateType(cuser: CustLierUser) {
    await updateCustlierUser({
      docId: cuser.docId,
      userid: user?.uid ?? '',
      timeCallback: value => {
        setloading(value);
      },
      dataToUpdate: (() => {
        return {userType: route.params.screenType};
      })(),
      callingSnackBar: (type, msg) => {
        setsnackBarVisible(true);
        setsnackBarMessageType(type);
        setsnackBarMessage(msg);
      },
      endCallback: () => {
        setApiIsCalled(false);
        setshowModal(false);
        navigate.navigate('SingleUserAccountScreen', {
          custLierUser: cuser,
        });
      },
    });
  }

  function navigateToDetailScreen(selectedContact?: Contacts.Contact) {
    if (selectedContact?.phoneNumbers.length === 0) {
      setsnackBarVisible(true);
      setsnackBarMessageType('error');
      setsnackBarMessage('No number found!');
      return;
    }

    check(selectedContact);
  }

  const [searchContact, setsearchContact] = useState('');

  return (
    <SnackbarComponent
      message={snackBarMessage}
      type={snackBarMessageType}
      close={() => {
        setsnackBarVisible(false);
      }}
      visible={snackBarVisible}>
      <Modal animationType="slide" transparent={true} visible={showModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>
              Current User Is Already{' '}
              {route.params.screenType === 'customer' ? 'Supplier' : 'Customer'}
            </Text>
            <Text>Would you like to change it {route.params.screenType} ?</Text>
            <Text style={{textAlign: 'center'}}>
              We will smoothly transfer all his Entries to{' '}
              {route.params.screenType} Account
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Button
                label={"No I don't want"}
                onPress={() => {
                  if (loading) return;
                  setshowModal(false);
                  navigate.navigate('SingleUserAccountScreen', {
                    custLierUser: selectedCon[0],
                  });
                }}
                loading={false}
                color={'white'}
                customBtnStyle={{
                  width: 100,
                  borderColor: '#fff',
                  borderWidth: 2,
                }}
              />
              <Button
                label={'Yes I want'}
                onPress={() => updateType(selectedCon[0])}
                loading={loading}
                color={'#222222'}
                customBtnStyle={{width: 100, backgroundColor: 'white'}}
                customTextStyle={{color: '#222222'}}
              />
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView style={styles.container}>
        <View
          style={{...styles.searchWrapper, ...commonAlignment.centerAligned}}>
          <InputBox
            label={''}
            placeholder={'Search By Name'}
            value={searchContact}
            customInputContainer={{width: '100%'}}
            setValue={value => {
              setsearchContact(value);
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigateToDetailScreen()}
          style={styles.contactContainer}>
          <View style={styles.icon}>
            <Text style={styles.iconText}>+</Text>
          </View>
          <Text style={styles.contactName}>Add New</Text>
        </TouchableOpacity>
        {contactList
          .filter(itm => {
            if (!searchContact) {
              return itm;
            }

            if (itm.displayName.includes(searchContact)) {
              return itm;
            }
          })
          .sort((a, b) => a.displayName.localeCompare(b.displayName))
          .map(contact => (
            <TouchableOpacity
              onPress={() => navigateToDetailScreen(contact)}
              key={contact.recordID}
              style={styles.contactContainer}>
              <View style={styles.icon}>
                <Text style={styles.iconText}>
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    contact.displayName.substring(0, 1)
                  )}
                </Text>
              </View>
              <Text style={styles.contactName}>{contact.displayName}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </SnackbarComponent>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  searchWrapper: {
    width: '90%',
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#080516',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 35,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
