import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {
  ScrollView,
  Image,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Button,
} from 'react-native';
import colors from '../../../libs/colors';
import SearchBar from '../../../components/search-bar/SearchBar';
import Topbar from '../../../components/topbar/Topbar';
import images from '../../../libs/images';
import TextWrap from '../../../components/text-wrap/TextWrap';
import {
  dialogOpenSelect,
  dialogOpenMessage,
} from '../../../redux/dialog/DialogActions';
import TopTabs from './activityTopTab';
import Footer from '../../../libs/footer';
import {
  screenHeight,
  widthPercentage,
  heightPercentage,
  fontPercentage,
  cameraItem,
} from '../../../services/util';
import routes from '../../../libs/routes';

export default function Kbstest({route, navigation}) {
  const [keyword, setKeyword] = useState('');
  const dispatch = useDispatch();
  const inputRef = useRef();

  useEffect(() => {
    return () => {
      setKeyword('');
    };
  }, []);

  const handleSearch = () => {
    if (keyword?.length < 2) {
      dispatch(dialogOpenMessage({message: '두글자 이상 입력해주세요.'}));
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
        type={route.params?.params?.type ? route.params?.params?.type : 'main'}
      />

      <ScrollView style={styles.root}>
        <TextWrap style={styles.font}>
          책과함께, KBS한국어능력시험 대비하기!
        </TextWrap>
        <View style={styles.root2}>
          <Image style={styles.img1} source={images.title_img} />
        </View>
        <View style={styles.button}>
          <Button
            title="시험 응시하기"
            color="black"
            onPress={() => Alert.alert('시험 기간이 아닙니다.')}
          />
        </View>
      </ScrollView>
      <Footer page="kbstest" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingBottom: screenHeight / 1.7,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  button: {
    left: '5%',
    width: '90%',
    bottom: '1%',
  },
  root2: {
    width: '90%',
    flexDirection: 'row',
  },
  font: {
    left: 42,
    top: 20,
    fontSize: 25,
    fontWeight: 'bold',
  },
  img1: {
    resizeMode: 'contain',
    width: '100%',
    height: 2400,
    marginLeft: 35,
  },
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
