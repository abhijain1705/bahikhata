import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {UserContext} from '../userContext';
import {useRoute} from '@react-navigation/native';
import SnackbarComponent from '../common/components/snackbar';
import {updateUserDoc} from '../firebase/methods';
import {useNavigation} from '@react-navigation/native';
import {UserInterface} from '../common/interface/types';

const images = [
  {
    img: require('../assets/images/category/agriculture.png'),
    label: 'Agriculture',
  },
  {img: require('../assets/images/category/digital.png'), label: 'Digital'},
  {
    img: require('../assets/images/category/education.png'),
    label: 'Education',
  },
  {
    img: require('../assets/images/category/finance.png'),
    label: 'Financial Services',
  },
  {img: require('../assets/images/category/grocery.png'), label: 'Grocery'},
  {
    img: require('../assets/images/category/insurance.png'),
    label: 'Insurance',
  },
  {
    img: require('../assets/images/category/laptop.png'),
    label: 'Communication',
  },
  {img: require('../assets/images/category/medical.png'), label: 'Medical'},
  {img: require('../assets/images/category/shirt.png'), label: 'Apparel'},
  {
    img: require('../assets/images/category/travels.png'),
    label: 'Tour & Travels',
  },
  {
    img: require('../assets/images/category/shop.png'),
    label: 'Other Business',
  },
];

const typeImages = [
  {img: require('../assets/images/type/agent.png'), label: 'Agent'},
  {
    img: require('../assets/images/type/manufacturing.png'),
    label: 'Manufacturer',
  },
  {
    img: require('../assets/images/type/supplier.png'),
    label: 'Supplier',
  },
  {
    img: require('../assets/images/type/wholesaler.png'),
    label: 'Wholesaler',
  },
  {
    img: require('../assets/images/category/shop.png'),
    label: 'Retailer',
  },
];

const EditScreen = () => {
  const navigation = useNavigation();
  const {user, setUser} = useContext(UserContext);
  const route = useRoute<any>();
  const type = route.params ? route.params?.type : '';
  const [loading, setloading] = useState(false);
  const [snackBarVisible, setsnackBarVisible] = useState(false);
  const [snackBarMessage, setsnackBarMessage] = useState('');
  const [snackBarMessageType, setsnackBarMessageType] = useState<
    'error' | 'success'
  >('error');

  function value() {
    return type === 'name'
      ? user!.name
      : type === 'bname'
      ? user!.business[user!.currentFirmId].name
      : type === 'baddress'
      ? user!.business[user!.currentFirmId].address
      : type === 'bcontact'
      ? user!.business[user!.currentFirmId].phoneNumber
      : type === 'bgst'
      ? user!.business[user!.currentFirmId].gst
      : type === 'bcategory'
      ? user!.business[user!.currentFirmId].category
      : user!.business[user!.currentFirmId].type;
  }
  const [inputValue, setinputValue] = useState(value());
  const [typeCategoryState, settypeCategoryState] = useState(value());

  function checkIfInputNeedsUpdate(value: string) {
    return type === 'name' && value.toLowerCase() === user!.name.toLowerCase()
      ? false
      : type === 'bname' &&
        value.toLowerCase() ===
          user!.business[user!.currentFirmId].name.toLowerCase()
      ? false
      : type === 'baddress' &&
        value.toLowerCase() ===
          user!.business[user!.currentFirmId].address.toLowerCase()
      ? false
      : type === 'bcontact' &&
        value.toLowerCase() ===
          user!.business[user!.currentFirmId].phoneNumber.toLowerCase()
      ? false
      : type === 'bgst' &&
        value.toLowerCase() ===
          user!.business[user!.currentFirmId].gst.toLowerCase()
      ? false
      : type === 'bcategory' &&
        value.toLowerCase() ===
          user!.business[user!.currentFirmId].category.toLowerCase()
      ? false
      : type === 'btype' &&
        value.toLowerCase() ===
          user!.business[user!.currentFirmId].type.toLowerCase()
      ? false
      : true;
  }

  function updateState(userData: Partial<UserInterface>) {
    setUser({...user!, ...userData});
    navigation.goBack();
  }

  async function updateUser(value: string) {
    if (checkIfInputNeedsUpdate(value) === false) {
      console.log('not required');
      return;
    }
    await updateUserDoc(
      updateState,
      (value: boolean) => {
        setloading(value);
      },
      (type: 'error' | 'success', message: string) => {
        setsnackBarVisible(true);
        setsnackBarMessage(message);
        setsnackBarMessageType(type);
      },
      (() => {
        if (type === 'name') {
          return {
            uid: user?.uid,
            name: value,
          };
        } else if (type === 'bname') {
          return {
            uid: user?.uid,
            business: {
              ...user!.business,
              [user!.currentFirmId]: {
                ...user!.business[user!.currentFirmId],
                name: value,
              },
            },
          };
        } else if (type === 'baddress') {
          return {
            uid: user?.uid,
            business: {
              ...user!.business,
              [user!.currentFirmId]: {
                ...user!.business[user!.currentFirmId],
                address: value,
              },
            },
          };
        } else if (type === 'bcontact') {
          return {
            uid: user?.uid,
            business: {
              ...user!.business,
              [user!.currentFirmId]: {
                ...user!.business[user!.currentFirmId],
                phoneNumber: value,
              },
            },
          };
        } else if (type === 'bgst') {
          return {
            uid: user?.uid,
            business: {
              ...user!.business,
              [user!.currentFirmId]: {
                ...user!.business[user!.currentFirmId],
                gst: value,
              },
            },
          };
        } else if (type === 'bcategory') {
          return {
            uid: user?.uid,
            business: {
              ...user!.business,
              [user!.currentFirmId]: {
                ...user!.business[user!.currentFirmId],
                category: value,
              },
            },
          };
        } else {
          return {
            uid: user?.uid,
            business: {
              ...user!.business,
              [user!.currentFirmId]: {
                ...user!.business[user!.currentFirmId],
                type: value,
              },
            },
          };
        }
      })()
    );
  }

  if (type === 'bcategory' || type === 'btype') {
    return (
      <View style={styles.wrapper}>
        <ScrollView horizontal={false} style={styles.categoryWrapper}>
          {((typeCategoryState !==
            user!.business[user!.currentFirmId].category &&
            type === 'bcategory') ||
            (typeCategoryState !== user!.business[user!.currentFirmId].type &&
              type === 'btype')) && (
            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                onPress={() => updateUser(typeCategoryState)}
                style={{...styles.twinButton, backgroundColor: '#F86F03'}}>
                {loading ? (
                  <ActivityIndicator color={'white'} size={'large'} />
                ) : (
                  <Text style={{color: 'white'}}>Save</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateState(user!)}
                style={{...styles.twinButton, borderWidth: 2}}>
                <Text style={{color: 'black'}}>Not now</Text>
              </TouchableOpacity>
            </View>
          )}
          {[type === 'bcategory' ? [...images] : [...typeImages]]
            .flat(1)
            .map((img, index) => (
              <TouchableOpacity
                onPress={() => {
                  settypeCategoryState(img.label);
                }}
                style={{
                  ...styles.categoryView,
                  borderWidth: img.label === typeCategoryState ? 2 : 0,
                }}
                key={index}>
                <Image style={styles.categoryImg} source={img.img} />
                <Text style={styles.categoryLabel}>{img.label}</Text>
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
  }
  return (
    <View style={styles.wrapper}>
      <View style={styles.editWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          value={inputValue}
          onChangeText={text => setinputValue(text)}
        />
        <TouchableOpacity
          onPress={() => updateUser(inputValue)}
          style={styles.button}>
          {loading ? (
            <ActivityIndicator color={'white'} size={'large'} />
          ) : (
            <Text style={styles.label}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
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

export default EditScreen;

const styles = StyleSheet.create({
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
    width: '90%',
    marginBottom: 10,
  },
  twinButton: {
    width: '50%',
    height: 60,
    borderRadius: 12,
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
  },
  wrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
  label: {
    color: 'white',
  },
  button: {
    backgroundColor: 'blue',
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 20,
  },
  input: {
    width: '90%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderColor: 'blue',
    borderWidth: 2,
    borderRadius: 12,
    color: '#222222',
  },
  editWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  categoryWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    padding: 10,
  },
  categoryView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    gap: 10,
    padding: 10,
    borderRadius: 8,
    borderColor: 'blue',
  },
  categoryImg: {
    width: 40,
    height: 40,
  },
  categoryLabel: {
    color: '#222222',
    fontSize: 20,
  },
});
