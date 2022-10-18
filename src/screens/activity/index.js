import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Topbar from '../../components/topbar/Topbar';
import SearchBar from '../../components/search-bar/SearchBar';
import TopTabs from '../activity/TopTabs';
import images from '../../libs/images';
import colors from '../../libs/colors';
import routes from '../../libs/routes';
import Footer from '../../libs/footer';

import {
  widthPercentage,
  heightPercentage,
  cameraItem,
} from '../../services/util';
import {
  dialogOpenSelect,
  dialogOpenMessage,
} from '../../redux/dialog/DialogActions';

export default function Activity({route, navigation}) {
  //alert(route.params.type);
  const [keyword, setKeyword] = useState('');
  const dispatch = useDispatch();
  const inputRef = useRef();

  useEffect(() => {
    return () => {
      setKeyword('');
    };
  }, []);

  const handleSearch = () => {
    if (keyword?.replace(/ /g, '')?.length < 1) {
      dispatch(dialogOpenMessage({message: '한글자 이상 입력해주세요. \n*공백은 제거됩니다.'}));
    } else {
      setKeyword('');
      navigation.navigate(routes.searchBook, {keyword: keyword});
    }
  };

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
        inputRef={inputRef}
        onChange={setKeyword}
        style={styles.searchBar}
        placeholder="책제목, 저자, 출판사를 입력해주세요. "
        optionComponent={
          keyword ? (
            <TouchableOpacity
              onPress={() => {
                setKeyword('');
                inputRef.current?.focus();
              }}>
              <Image style={styles.x} source={images.delete} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                inputRef.current?.focus();
              }}>
              <Image style={styles.cameraIcon} source={images.search} />
            </TouchableOpacity>
          )
        }
        onSearch={handleSearch}
      />
      <TopTabs
        type={route.params.type ? route.params.type : 'main'}
        rank={route.params.rank}
      />
      <Footer page={route.params.type} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginHorizontal: 18,
    backgroundColor: '#ececec',
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  x: {
    marginRight: 5,
    width: widthPercentage(18),
    height: heightPercentage(18),
    resizeMode: 'cover',
  },
});
