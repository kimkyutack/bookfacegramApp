import React, {useEffect, useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {dialogOpenSelect} from '../../../redux/dialog/DialogActions';
import TextWrap from '../../../components/text-wrap/TextWrap';
import Topbar from '../../../components/topbar/Topbar';
import SearchBar from '../../../components/search-bar/SearchBar';
import TopTabs from './TopTabs';
import images from '../../../libs/images';
import colors from '../../../libs/colors';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
  cameraItem,
} from '../../../services/util';

export default function HomeDetail({route, navigation}) {
  const [keyword, setKeyword] = useState('');
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <Topbar
        title="TOAPING"
        navigation={navigation}
        options={{
          component: <Image style={styles.cameraIcon} source={images.camera} />,
          name: 'camera',
          onPress: () =>
            dispatch(
              dialogOpenSelect({
                item: cameraItem(),
              }),
            ),
        }}
      />
      {<StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />}

      <SearchBar
        value={keyword}
        onChange={setKeyword}
        style={styles.input}
        placeholder=""
        optionComponent={
          <Image style={styles.cameraIcon} source={images.search} />
        }
        onSearch={() => {
          // fetch();
        }}
      />
      <TopTabs
        type={
          route.params?.params?.type ? route.params?.params?.type : 'detail'
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginHorizontal: 16,
    // marginTop: 6,
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  input: {
    marginHorizontal: 18,
    backgroundColor: '#ececec',
  },
});
