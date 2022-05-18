import React, {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import TopMyBooksMain from './home-main/TopMybooksMain';
import TopNewBooksDetail from './home-detail/TopNewBooksDetail';

export default function TopMyBooks({route}) {
  const [loading, setLoading] = useState(false);
  return (
    <View style={styles.root}>
      {loading ? (
        <></>
      ) : !loading && route.params.type === 'main' ? (
        <TopMyBooksMain route={route} />
      ) : !loading && route.params.type === 'list' ? (
        <></>
      ) : !loading && route.params.type === 'detail' ? (
        <TopNewBooksDetail route={route} />
      ) : (
        <></>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
