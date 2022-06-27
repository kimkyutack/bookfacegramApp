import React, { useEffect, useState, useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import ListHeader from '../../components/list-header/ListHeader';
import NoFound from '../../components/no-found/NoFound';
import SearchBar from '../../components/search-bar/SearchBar';
import TextWrap from '../../components/text-wrap/TextWrap';
import Avatar from '../../components/avatar/Avatar';
import RootLayout from '../../layouts/root-layout/RootLayout';
import consts from '../../libs/consts';
import routes from '../../libs/routes';
import colors from '../../libs/colors';
import images from '../../libs/images';
import fonts from '../../libs/fonts';
import Footer from '../../libs/footer';
import {
  dialogError,
  dialogOpenMessage,
  dialogOpenSelect,
} from '../../redux/dialog/DialogActions';
import {
  cameraItem,
  widthPercentage,
  heightPercentage,
  fontPercentage,
  screenWidth,
} from '../../services/util';
import SearchBookItem from './SearchBookItem';
import { requestGet, requestPost } from '../../services/network';
import { useIsFocused } from '@react-navigation/native';
import { navigate } from '../../services/navigation';
import { browsingTime } from '../../redux/session/SessionAction';

export default function SearchBook({ route, navigation }) {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const scrollRef = useRef();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [rednerData, setRenderData] = useState([]);
  const [sessionTime, setSessionTime] = useState('000000');
  const isFocused = useIsFocused();
  const user = useSelector(s => s.user, shallowEqual);

  const fetchRequested = async searchKeyword => {
    try {
      setLoading(true);
      const { data, status } = await requestGet({
        url: consts.apiUrl + '/book/search',
        query: {
          keyword: searchKeyword ? searchKeyword : route.params?.keyword,
        },
      });
      if (status === 'SUCCESS') {
        setRenderData(data?.searchBook);
      }
      return status;
    } catch (error) {
      dispatch(dialogError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (search?.replace(/ /g, '')?.length < 1) {
      dispatch(dialogOpenMessage({ message: '한글자 이상 입력해주세요. \n*공백은 제거됩니다.' }));
    } else {
      fetchRequested(search);
    }
  };

  let hour = 0, minute = 0, second = -1;

  function timeCount() {


    let dsp_hour, dsp_minute, dsp_second;

    second++;

    if (minute == 60) {
      hour++;
      minute = 0;
    }
    if (second == 60) {
      minute++;
      second = 0;
    }

    if (hour < 10)
      dsp_hour = '0' + hour;
    else
      dsp_hour = hour;

    if (minute < 10)
      dsp_minute = '0' + minute;
    else
      dsp_minute = minute;

    if (second < 10)
      dsp_second = '0' + second;
    else
      dsp_second = second;


    let date_state = dsp_hour + dsp_minute + dsp_second;


    setSessionTime(date_state);
  };

  //page 로그 찍는 로직
  useEffect(() => {
    if (isFocused) {
      var timer = setInterval(() => { timeCount() }, 1000);
    }

    if (!isFocused) {
      if (sessionTime !== '000000') {

        dispatch(browsingTime('도서 검색페이지', sessionTime, user.member_id));
      }
    }
    return () => {
      clearInterval(timer);
      setSessionTime('000000');
    }
  }, [isFocused]);


  useEffect(() => {
    fetchRequested();
    setSearch(route.params.keyword);
  }, [route.params.keyword]);

  return (
    <RootLayout
      topbar={{
        title: '검색',
        navigation: navigation,
        back: true,
        options: {
          component: <Image style={styles.cameraIcon} source={images.camera} />,
          name: 'camera',
          onPress: () =>
            dispatch(
              dialogOpenSelect({
                item: cameraItem(),
              }),
            ),
        },
      }}>
      <SearchBar
        value={search}
        onChange={setSearch}
        inputRef={inputRef}
        style={styles.searchBar}
        placeholder="책제목, 저자, 출판사를 입력해주세요. "
        optionComponent={
          search ? (
            <TouchableOpacity
              onPress={() => {
                setSearch('');
                inputRef.current?.focus();
              }}>
              <Image style={styles.x} source={images.delete} />
            </TouchableOpacity>
          ) : (
            <Image style={styles.cameraIcon} source={images.search} />
          )
        }
        onSearch={handleSearch}
      />
      {loading ? (
        <View
          style={[
            styles.root,
            {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : (
        <View
          style={[
            styles.root,
            rednerData.length === 0 && { flex: 1, justifyContent: 'center' },
          ]}>
          {rednerData.length === 0 ? (
            <View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TextWrap>검색결과가 없습니다.</TextWrap>
            </View>
          ) : (
            <FlatList
              ref={scrollRef}
              data={rednerData}
              extraData={rednerData}
              ListHeaderComponent={() => {
                return (
                  <View style={styles.headerContainer}>
                    <TextWrap
                      style={styles.header}
                      font={fonts.kopubWorldDotumProMedium}>
                      총 검색결과{' '}
                      <TextWrap
                        style={{ color: colors.blue }}
                        font={fonts.kopubWorldDotumProBold}>
                        {rednerData?.length}
                      </TextWrap>
                      건
                    </TextWrap>
                  </View>
                );
              }}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              renderItem={({ item, index }) => {
                return <SearchBookItem item={item} />;
              }}
            />
          )}
        </View>
      )}
      <Footer />
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
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
  headerContainer: {
    marginTop: 20,
    marginVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  header: {
    fontSize: fontPercentage(14),
    lineHeight: fontPercentage(18),
    color: colors.black,
  },
  subHeader: {
    color: colors.black,
    fontSize: fontPercentage(13),
    marginTop: 10,
  },
});
