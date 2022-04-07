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
  widthPercentage,
  heightPercentage,
  fontPercentage,
  cameraItem,
} from '../../../services/util';
import routes from '../../../libs/routes';

export default function Examtest({route, navigation}) {
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
        <View style={styles.root2}>
          <Image style={styles.img1} source={images.exam_title} />
        </View>
        <TextWrap style={styles.font}>
          위의 대화는 오랜만에 만난 유정이와 미진이의 대화입니다. 밑줄친 '
          <TextWrap style={styles.font3}>얼굴이 피다</TextWrap>' 의 뜻은 무슨
          의미일까요?
        </TextWrap>
        <TextWrap style={styles.font2}>
          ① 얼굴에 피가 나고 있다.{'\n'}② 얼굴에 주름이 없다.{'\n'}③ 얼굴에
          화색이 돌다.{'\n'}④ 얼굴이 빨개지다.{'\n\n'}
        </TextWrap>
        <View style={styles.button}>
          <Button
            title="정답 제출하기"
            color="black"
            onPress={() => Alert.alert('정답 페이지 제작중...')}
          />
        </View>
      </ScrollView>
      <Footer page="kbstest" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingBottom: '100%',
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
    marginRight: 50,
    left: 35,
    top: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  font3: {
    margin: 20,
    left: 15,
    top: 0,
    fontSize: 24,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  font2: {
    margin: 20,
    left: 15,
    top: 20,
    fontSize: 20,
  },
  img1: {
    resizeMode: 'contain',
    width: '100%',
    height: 800,
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
