import React, {useEffect, useState, useRef} from 'react';
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
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
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
import {requestGet, requestPost} from '../../services/network';

export default function SearchBook({route, navigation}) {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const scrollRef = useRef();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [rednerData, setRenderData] = useState([]);

  const fetchRequested = async searchKeyword => {
    try {
      setLoading(true);
      const {data, status} = await requestGet({
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
    if (search?.length < 2) {
      dispatch(dialogOpenMessage({message: '두글자 이상 입력해주세요.'}));
    } else {
      fetchRequested(search);
    }
  };

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
            rednerData.length === 0 && {flex: 1, justifyContent: 'center'},
          ]}>
          {rednerData.length === 0 ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
                        style={{color: colors.blue}}
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
              renderItem={({item, index}) => {
                return <SearchBookItem item={item} />;
              }}
            />
          )}
        </View>
      )}
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
