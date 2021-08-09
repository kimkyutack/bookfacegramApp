import React, {useEffect} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';

export default function TabsBack({route, navigation}) {
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      e.preventDefault();
      navigation.goBack();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.root}>
      <TextWrap />
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
