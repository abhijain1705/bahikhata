import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {CustLierUser} from '../../common/interface/types';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

type RenderDataProp = {
  screenType: 'customer' | 'supplier';
  data: {
    [key: string]: CustLierUser[];
  };
  onRowPres: (itm: any) => void;
  customViewStyle?: any;
  loadMore: (screenType: 'customer' | 'supplier') => void;
  loadingForMore: boolean;
  lastDocument:
    | FirebaseFirestoreTypes.DocumentSnapshot<CustLierUser>
    | undefined;
  noNeedLoadMore?: boolean;
};

const RenderData = ({
  data,
  onRowPres,
  noNeedLoadMore,
  lastDocument,
  loadMore,
  customViewStyle,
  loadingForMore,
  screenType,
}: RenderDataProp) => {
  return (
    <ScrollView style={{width: '100%', ...customViewStyle}}>
      {Object.entries(data).map((itm, ind) => {
        return (
          <View key={ind}>
            <View style={styles.dateWrapper}>
              <Text style={{color: '#fff', textAlign: 'center'}}>{itm[0]}</Text>
            </View>
            {itm[1].map((us, index) => (
              <TouchableOpacity
                onPress={() => onRowPres(us)}
                style={styles.custlierRow}
                key={index}>
                <View style={{flex: 1}}>
                  <Text style={{...styles.custlierText, color: '#222222', textAlign: 'left'}}>{us.name}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{...styles.custlierText, color: 'red'}}>₹{us.payable}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{...styles.custlierText, color: 'green'}}>₹{us.receivable}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );
      })}
      {!noNeedLoadMore && (
        <TouchableOpacity onPress={() => loadMore(screenType)}>
          {loadingForMore ? (
            <ActivityIndicator size={'large'} color="#222222" />
          ) : (
            <Text style={styles.moreBtnLabel}>
              {lastDocument === undefined ? 'No more data' : 'load more'}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default RenderData;

const styles = StyleSheet.create({
  moreBtnLabel: {
    color: '#222222',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
  custlierRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    height: 60,
  },
  custlierText: {
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  dateWrapper: {
    backgroundColor: '#222222',
    width: 120,
    padding: 6,
    borderRadius: 12,
    alignSelf: 'center',
  },
});
