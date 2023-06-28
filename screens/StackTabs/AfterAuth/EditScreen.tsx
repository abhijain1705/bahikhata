import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {UserContext} from '../../../context/userContext';
import {RouteProp, useRoute} from '@react-navigation/native';
import SnackbarComponent from '../../../common/components/snackbar';
import {updateCustlierUser, updateUserDoc} from '../../../firebase/methods';
import InputBox from '../../../common/components/inputBox';
import {useNavigation} from '@react-navigation/native';
import {
  RootStackParamList,
  UserInterface,
} from '../../../common/interface/types';
import {StackNavigationProp} from '@react-navigation/stack';
import Button from '../../../common/components/button';
import {UseApiCallContext} from '../../../context/recallTheApi';

const images = [
  {
    img: require('../../../assets/images/category/agriculture.png'),
    label: 'Agriculture',
  },
  {
    img: require('../../../assets/images/category/digital.png'),
    label: 'Digital',
  },
  {
    img: require('../../../assets/images/category/education.png'),
    label: 'Education',
  },
  {
    img: require('../../../assets/images/category/finance.png'),
    label: 'Financial Services',
  },
  {
    img: require('../../../assets/images/category/grocery.png'),
    label: 'Grocery',
  },
  {
    img: require('../../../assets/images/category/insurance.png'),
    label: 'Insurance',
  },
  {
    img: require('../../../assets/images/category/laptop.png'),
    label: 'Communication',
  },
  {
    img: require('../../../assets/images/category/medical.png'),
    label: 'Medical',
  },
  {img: require('../../../assets/images/category/shirt.png'), label: 'Apparel'},
  {
    img: require('../../../assets/images/category/travels.png'),
    label: 'Tour & Travels',
  },
  {
    img: require('../../../assets/images/category/shop.png'),
    label: 'Other Business',
  },
];

const typeImages = [
  {img: require('../../../assets/images/type/agent.png'), label: 'Agent'},
  {
    img: require('../../../assets/images/type/manufacturing.png'),
    label: 'Manufacturer',
  },
  {
    img: require('../../../assets/images/type/supplier.png'),
    label: 'Supplier',
  },
  {
    img: require('../../../assets/images/type/wholesaler.png'),
    label: 'Wholesaler',
  },
  {
    img: require('../../../assets/images/category/shop.png'),
    label: 'Retailer',
  },
];

const EditScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {user, setUser} = useContext(UserContext);
  const route = useRoute<RouteProp<RootStackParamList, 'EditScreen'>>();
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
      : type === 'btype'
      ? user!.business[user!.currentFirmId].type
      : type === 'CUname'
      ? route.params.custlierUser!.name
      : type === 'CUaddress'
      ? route.params.custlierUser!.address
      : type === 'CUgst'
      ? route.params.custlierUser!.gst
      : '';
  }

  function placeholder() {
    return type === 'name'
      ? 'Name'
      : type === 'bname'
      ? 'Business Name'
      : type === 'baddress'
      ? 'Business Address'
      : type === 'bcontact'
      ? 'Contact Number'
      : type === 'bgst'
      ? 'GST Number'
      : type === 'CUname'
      ? 'User Name'
      : type === 'CUaddress'
      ? 'User Address'
      : type === 'CUgst'
      ? 'User GST'
      : '';
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
      : type === 'CUname' &&
        value.toLowerCase() === route.params.custlierUser!.name.toLowerCase()
      ? false
      : type === 'CUaddress' &&
        value.toLowerCase() === route.params.custlierUser!.address.toLowerCase()
      ? false
      : type === 'CUgst' &&
        value.toLowerCase() === route.params.custlierUser!.gst.toLowerCase()
      ? false
      : true;
  }

  const {setApiIsCalled} = UseApiCallContext();

  function updateState(userData?: Partial<UserInterface>) {
    if (type === 'CUname' || type === 'CUaddress' || type === 'CUgst') {
      setApiIsCalled(false);
      navigation.navigate('HomeScreen');
      return;
    } else {
      setUser({...user!, ...userData!});
      navigation.goBack();
      return;
    }
  }

  async function updateUser(value: string) {
    if (checkIfInputNeedsUpdate(value) === false) {
      console.log('not required');
      return;
    }

    if (type === 'CUname' || type === 'CUaddress' || type === 'CUgst') {
      await updateCustlierUser({
        docId: route.params.custlierUser!.docId,
        userid: user?.uid ?? '',
        timeCallback: value => {
          setloading(value);
        },
        dataToUpdate: (() => {
          if (type === 'CUname') {
            return {name: value};
          } else if (type === 'CUaddress') {
            return {address: value};
          } else if (type === 'CUgst') {
            return {gst: value};
          }
        })(),
        callingSnackBar: (type, msg) => {
          setsnackBarVisible(true);
          setsnackBarMessageType(type);
          setsnackBarMessage(msg);
        },
        endCallback: () => {
          updateState();
        },
      });
      return;
    } else {
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
      return;
    }
  }

  if (type === 'bcategory' || type === 'btype') {
    return (
      <SnackbarComponent
        message={snackBarMessage}
        type={snackBarMessageType}
        close={() => {
          setsnackBarVisible(false);
        }}
        visible={snackBarVisible}>
        <ScrollView horizontal={false} style={styles.categoryWrapper}>
          {((typeCategoryState !==
            user!.business[user!.currentFirmId].category &&
            type === 'bcategory') ||
            (typeCategoryState !== user!.business[user!.currentFirmId].type &&
              type === 'btype')) && (
            <View style={styles.buttonWrapper}>
              <Button
                onPress={() => updateUser(typeCategoryState)}
                label="Save"
                loading={loading}
                color="white"
                customBtnStyle={{
                  ...styles.twinButton,
                  backgroundColor: '#F86F03',
                }}
              />
              <Button
                onPress={() => updateState(user!)}
                label="Not now"
                loading={loading}
                color="white"
                customBtnStyle={{
                  ...styles.twinButton,
                  borderWidth: 2,
                  backgroundColor: 'white',
                }}
                customTextStyle={{color: '#222222'}}
              />
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
      </SnackbarComponent>
    );
  }
  return (
    <SnackbarComponent
      message={snackBarMessage}
      type={snackBarMessageType}
      close={() => {
        setsnackBarVisible(false);
      }}
      visible={snackBarVisible}>
      <View style={styles.editWrapper}>
        <InputBox
          placeholder={`Enter ${placeholder()}`}
          value={inputValue}
          setValue={value => setinputValue(value)}
          label={`Enter ${placeholder()}`}
          customInputStyle={{...styles.input}}
        />
        <Button
          onPress={() => updateUser(inputValue)}
          label="Submit"
          loading={loading}
          color="white"
          customBtnStyle={{...styles.button}}
        />
      </View>
    </SnackbarComponent>
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
    width: '80%',
    marginBottom: 10,
    marginHorizontal: 'auto',
  },
  twinButton: {
    width: '45%',
    borderColor: '#222222',
  },
  button: {
    backgroundColor: 'blue',
    width: '90%',
  },
  input: {
    borderColor: 'blue',
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
