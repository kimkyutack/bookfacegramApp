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
import {navigate} from '../../services/navigation';
import routes from '../../libs/routes';

export default function TabsHome({route, navigation}) {
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      e.preventDefault();
      navigate(routes.home);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.root}>
      <TextWrap>asd</TextWrap>
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
