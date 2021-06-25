import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import fonts from '../../libs/fonts';
import Topbar from '../../components/topbar/Topbar';
import image from '../../libs/image';
import SearchBar from '../../components/search-bar/SearchBar';
import TopTabs from '../../components/toptabs/TopTabs';

export default function TabsHome({navigation}) {
  const [keyword, setKeyword] = useState('');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Topbar
        title="BOOKPING"
        navigation={navigation}
        options={<Image style={styles.backIcon} source={image.camera} />}
      />
      <SearchBar
        value={keyword}
        onChange={setKeyword}
        style={styles.input}
        placeholder=""
        optionComponent={
          <Image style={styles.backIcon} source={image.search} />
        }
        onSearch={() => {
          // fetch();
        }}
      />
      <TopTabs />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginHorizontal: 16,
    marginTop: 6,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  input: {
    margin: 20,
    marginVertical: 0,
    backgroundColor: '#ececec',
  },
});
