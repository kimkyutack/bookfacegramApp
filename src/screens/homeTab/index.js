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
  StatusBar,
} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import fonts from '../../libs/fonts';
import Topbar from '../../components/topbar/Topbar';
import images from '../../libs/image';
import colors from '../../libs/colors';
import SearchBar from '../../components/search-bar/SearchBar';
import TopTabs from '../../components/toptabs/TopTabs';

export default function TabsHome({navigation}) {
  const [keyword, setKeyword] = useState('');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <Topbar
        title="BOOKPING"
        navigation={navigation}
        options={<Image style={styles.backIcon} source={images.camera} />}
      />
      {<StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />}

      <SearchBar
        value={keyword}
        onChange={setKeyword}
        style={styles.input}
        placeholder=""
        optionComponent={
          <Image style={styles.backIcon} source={images.search} />
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
