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
import {useRoute} from '@react-navigation/native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import ListHeader from '../../components/list-header/ListHeader';
import Footer from '../../libs/footer';
import NoFound from '../../components/no-found/NoFound';
import SearchBar from '../../components/search-bar/SearchBar';
import TextWrap from '../../components/text-wrap/TextWrap';
import Avatar from '../../components/avatar/Avatar';
import SearchListItem from '../../components/search-listitem/SearchListItem';
import SearchListItemLocal from '../../components/search-listitem-local/SearchListItemLocal';
import RootLayout from '../../layouts/root-layout/RootLayout';
import consts from '../../libs/consts';
import routes from '../../libs/routes';
import colors from '../../libs/colors';
import images from '../../libs/images';
import {
  dialogError,
  dialogOpenMessage,
  dialogOpenSelect,
} from '../../redux/dialog/DialogActions';
import {navigate} from '../../services/navigation';
import {requestGet} from '../../services/network';
import {getItem, setItem} from '../../services/preference';
import {
  cameraItem,
  widthPercentage,
  heightPercentage,
  fontPercentage,
  screenWidth,
} from '../../services/util';
import fonts from '../../libs/fonts';
import Tabs from '../../components/tabs/Tabs';

export default function Search({route, navigation}) {
  const {params} = useRoute();
  const dispatch = useDispatch();
  const user = useSelector(s => s.user, shallowEqual);
  const inputRef = useRef();

  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [hashTagData, setHashTagData] = useState([]);
  const [text, setText] = useState('');
  const [tabIndex, setTabIndex] = useState(0); // 0 계정 1 해시태그

  // text 초기화
  useEffect(() => {
    if (!text?.length) {
      setSearched(false);
      getItem('accountLocal').then(d => {
        if (d) {
          let list = JSON.parse(d);
          list = [...new Set(list.map(JSON.stringify))].map(JSON.parse);
          setAccountData([...list.reverse()]);
          if (tabIndex === 0) {
            setData([...list.reverse()]);
          }
        }
      });
      getItem('hashTagLocal').then(d => {
        if (d) {
          let list = JSON.parse(d);
          list = [...new Set(list.map(JSON.stringify))].map(JSON.parse);
          setHashTagData([...list.reverse()]);
          if (tabIndex === 1) {
            setData([...list.reverse()]);
          }
        }
      });
    }
  }, [text]);

  // 탭변경시 초기화
  useEffect(() => {
    setText('');
    setSearched(false);
    getItem('accountLocal').then(d => {
      if (d) {
        let list = JSON.parse(d);
        list = [...new Set(list.map(JSON.stringify))].map(JSON.parse);
        setAccountData([...list.reverse()]);
        if (tabIndex === 0) {
          setData([...list.reverse()]);
        }
      }
    });
    getItem('hashTagLocal').then(d => {
      if (d) {
        let list = JSON.parse(d);
        list = [...new Set(list.map(JSON.stringify))].map(JSON.parse);
        setHashTagData([...list.reverse()]);
        if (tabIndex === 1) {
          setData([...list.reverse()]);
        }
      }
    });
  }, [params?.timeKey, tabIndex]);

  const fetchAccount = historyText => {
    setSearched(true);
    setLoading(true);
    requestGet({
      url: consts.apiUrl + '/mypage/feedBook/search',
      query: {
        type: 'member',
        word: historyText ? historyText : text,
      },
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          setData(res.data?.memberList);
        } else if (data.status === 'FAIL') {
          dispatch(dialogError('fail'));
        } else {
          dispatch(dialogError('fail'));
        }
      })
      .catch(error => {
        dispatch(dialogError(error));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchHashTag = historyText => {
    setSearched(true);
    setLoading(true);
    requestGet({
      url: consts.apiUrl + '/mypage/feedBook/search',
      query: {
        type: 'hashTag',
        word: historyText ? historyText : text,
      },
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          const newArr = res.data?.hashTagList.map(v => ({
            ...v,
            hashTagList: v.hashTagList.toString(),
          }));
          const result = newArr.reduce((unique, o) => {
            if (!unique.some(obj => obj.hashTagList === o.hashTagList)) {
              unique.push(o);
            }
            return unique;
          }, []);
          setData(result);
        } else if (data.status === 'FAIL') {
          dispatch(dialogError('fail'));
        } else {
          dispatch(dialogError('fail'));
        }
      })
      .catch(error => {
        dispatch(dialogError(error));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = () => {
    if (text.replace(/ /g, '')?.length < 1) {
      dispatch(
        dialogOpenMessage({
          message: '한글자 이상 입력해주세요. \n*공백은 제거됩니다.',
        }),
      );
    } else {
      if (tabIndex === 0) {
        fetchAccount();
        getItem('accountLocal').then(d => {
          let list = [];
          if (d) {
            list = JSON.parse(d);
            list = [...new Set(list.map(JSON.stringify))].map(JSON.parse);
          }
          list.push({memberId: text.replace(/ /g, '')});
          setItem('accountLocal', JSON.stringify(list));
        });
      } else if (tabIndex === 1) {
        fetchHashTag();
        getItem('hashTagLocal').then(d => {
          let list = [];
          if (d) {
            list = JSON.parse(d);
            list = [...new Set(list.map(JSON.stringify))].map(JSON.parse);
          }
          list.push({memberId: text.replace(/ /g, '')});
          setItem('hashTagLocal', JSON.stringify(list));
        });
      }
    }
  };

  // member 누룰경우 최근 검색에 추가
  const handleItemPress = obj => e => {
    if (tabIndex === 0) {
      getItem('accountLocal').then(d => {
        let list = [];
        if (d) {
          list = JSON.parse(d);
          list = [...new Set(list.map(JSON.stringify))].map(JSON.parse);
        }
        list.push({memberId: obj.memberId});
        setItem('accountLocal', JSON.stringify(list));
      });
      navigation.navigate(routes.feedBookImage, {
        screen: routes.feedBookUserImage,
        params: {
          memberId: obj.memberId,
          memberIdx: obj.memberIdx,
          key: Date.now(),
        },
      });
    } else if (tabIndex === 1) {
      getItem('hashTagLocal').then(d => {
        let list = [];
        if (d) {
          list = JSON.parse(d);
          list = [...new Set(list.map(JSON.stringify))].map(JSON.parse);
        }
        list.push({memberId: obj.hashTagList?.toString()});
        setItem('hashTagLocal', JSON.stringify(list));
        navigate(routes.hashTagImage, {
          screen: routes.hashTagPopularImage,
          params: {
            hashTag: e,
            infoType: 'popular',
            key: Date.now(),
          },
        });
      });
    }
  };

  return (
    <RootLayout
      topbar={{
        title:
          user.member_id?.split('@')[0]?.length > 10
            ? user.member_id?.split('@')[0]?.substring(0, 10) + '...'
            : user.member_id?.split('@')[0],
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
        optionsSearch: {
          component: (
            <Image style={styles.cameraIcon} source={images.feedCamera} />
          ),
          name: 'search',
          onPress: () => navigation.navigate(routes.search, {}),
        },
        optionsAvator: {
          component: (
            <Avatar
              size={29}
              style={styles.avator}
              path={
                user?.profile_path
                  ? user?.profile_path
                  : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
              }
            />
          ),
          name: 'avator',
          onPress: () =>
            navigation.navigate(routes.feedBookImage, {
              screen: routes.feedBookUserImage,
              params: {
                memberId: user.member_id,
                memberIdx: user.member_idx,
                key: Date.now(),
              },
            }),
        },
      }}>
      <SearchBar
        value={text}
        inputRef={inputRef}
        onChange={setText}
        style={styles.searchBar}
        placeholder="검색어를 입력해주세요."
        optionComponent={
          text && (
            <TouchableOpacity
              onPress={() => {
                inputRef.current?.focus();
                setText('');
              }}>
              <Image style={styles.x} source={images.delete} />
            </TouchableOpacity>
          )
        }
        onSearch={handleSearch}
      />
      <Tabs
        style={styles.tabs}
        index={tabIndex}
        onIndexChange={t => {
          if (tabIndex !== t) {
            setData([]);
          }
          setText('');
          setSearched(false);
          setTabIndex(t);
        }}
        data={['계정', '해시태그']}
      />
      <View style={styles.container}>
        {!searched && Boolean(data?.length) && (
          <ListHeader
            label="최근 검색어"
            button={
              !searched && tabIndex === 0
                ? Boolean(accountData?.length)
                : Boolean(hashTagData?.length)
            }
            buttonLabel="전체삭제"
            onPress={() => {
              if (tabIndex === 0) {
                setItem('accountLocal', JSON.stringify([]));
                setAccountData([]);
                setData([]);
              } else if (tabIndex === 1) {
                setItem('hashTagLocal', JSON.stringify([]));
                setHashTagData([]);
                setData([]);
              }
            }}
          />
        )}
        {!searched && !data?.length ? (
          <NoFound message="최근 검색어가 없습니다." />
        ) : searched && !data?.length ? (
          <NoFound message="검색 결과가 없습니다." />
        ) : loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <ActivityIndicator
              size="large"
              style={{
                alignSelf: 'center',
              }}
              color={colors.blue}
            />
          </View>
        ) : (
          <FlatList
            data={data}
            extraData={data}
            keyExtractor={(item, index) => {
              return item.memberId + '' + item.userId + index;
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
              if (searched) {
                return (
                  <SearchListItem
                    {...item}
                    tabIndex={tabIndex}
                    index={index}
                    onItemPress={handleItemPress(item)}
                  />
                );
              } else {
                return (
                  <SearchListItemLocal
                    {...item}
                    tabIndex={tabIndex}
                    fetchAccount={fetchAccount}
                    fetchHashTag={fetchHashTag}
                    setText={setText}
                    index={index}
                    onDelete={() => {
                      const d = [
                        ...data.filter(x => x.memberId !== item.memberId),
                      ];
                      setData(d);
                      if (tabIndex === 0) {
                        setItem('accountLocal', JSON.stringify(d));
                      } else if (tabIndex === 1) {
                        setItem('hashTagLocal', JSON.stringify(d));
                      }
                    }}
                  />
                );
              }
            }}
          />
        )}
      </View>
      <Footer page="feed" />
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    backgroundColor: '#ececec',
  },
  noFound: {
    fontSize: fontPercentage(14),
    alignSelf: 'center',
    marginTop: 100,
    lineHeight: fontPercentage(21),
    color: '#999',
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
  tabs: {
    marginTop: 10,
  },
});
