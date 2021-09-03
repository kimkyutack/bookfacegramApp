import React, {useEffect, useState, useRef} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import ListHeader from '../../components/list-header/ListHeader';
import NoFound from '../../components/no-found/NoFound';
import SearchBar from '../../components/search-bar/SearchBar';
import TextWrap from '../../components/text-wrap/TextWrap';
import Avatar from '../../components/avatar/Avatar';
import SearchListItem from '../../components/search-listitem/SearchListItem';
import SearchListItemLocal from '../../components/search-listitem-local/SearchListItemLocal';
import RootLayout from '../../layouts/root-layout/RootLayout';
import consts from '../../libs/consts';
import routes from '../../libs/routes';
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

  const [searched, setSearched] = useState(false);
  const [data, setData] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [hashTagData, setHashTagData] = useState([]);
  const [text, setText] = useState('');
  const [tabIndex, setTabIndex] = useState(0); // 0 계정 1 해시태그

  useEffect(() => {
    if (!text.length) {
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

  const fetchAccount = () => {
    setData([
      {id: 1, name: '첫아디'},
      {id: 2, name: '둘아디'},
      {id: 3, name: '셋아디'},
    ]);
    setSearched(true);
    // requestGet({
    //   url: consts.apiUrl + '/users/' + user.userId + '/friends',
    //   query: {
    //     type: 'account',
    //   },
    // })
    //   .then(account => {
    //     setData([...account]);
    //     setSearched(true);
    //   })
    //   .catch(e => {
    //     dispatch(dialogError(e));
    //   });
  };

  const fetchHashTag = () => {
    setData([
      {id: 1, name: '첫태그'},
      {id: 2, name: '둘태그'},
      {id: 3, name: '셋태그'},
    ]);
    setSearched(true);
    // requestGet({
    //   url: consts.apiUrl + '/users/' + user.userId + '/report-messages',
    //   query: {
    //     type: 'hashtag',
    //   },
    // })
    //   .then(hastag => {
    //     setData([...hastag]);
    //     setSearched(true);
    //   })
    //   .catch(e => {
    //     dispatch(dialogError(e));
    //   });
  };
  const handleSearch = () => {
    if (text.length < 2) {
      dispatch(dialogOpenMessage({message: '두글자 이상 입력해주세요.'}));
    } else {
      if (tabIndex === 0) {
        getItem('accountLocal').then(d => {
          let list = [];
          if (d) {
            list = JSON.parse(d);
            list = [...new Set(list.map(JSON.stringify))].map(JSON.parse);
          }
          list.push({name: text});
          setItem('accountLocal', JSON.stringify(list));
        });
        fetchAccount();
      } else if (tabIndex === 1) {
        getItem('hashTagLocal').then(d => {
          let list = [];
          if (d) {
            list = JSON.parse(d);
            list = [...new Set(list.map(JSON.stringify))].map(JSON.parse);
          }
          list.push({name: text});
          setItem('hashTagLocal', JSON.stringify(list));
        });
        fetchHashTag();
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
        list.push({name: obj.name});
        setItem('accountLocal', JSON.stringify(list));
      });
    } else if (tabIndex === 1) {
      getItem('hashTagLocal').then(d => {
        let list = [];
        if (d) {
          list = JSON.parse(d);
          list = [...new Set(list.map(JSON.stringify))].map(JSON.parse);
        }
        list.push({name: obj.name});
        setItem('hashTagLocal', JSON.stringify(list));
      });
    }

    // 유저 피드이동
    // navigate(routes.profile, {
    //   userId: member.userId,
    // });
  };

  // console.log('data');
  // console.log(data);
  return (
    <RootLayout
      topbar={{
        title:
          user.member_id?.split('@')[0]?.length > 12
            ? user.member_id?.split('@')[0]?.substring(0, 12) + '...'
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
          component: <Image style={styles.cameraIcon} source={images.search} />,
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
              memberId: user.member_id,
              memberIdx: user.member_idx,
              platformType: user.platform_type,
              key: Date.now(),
            }),
        },
      }}>
      <SearchBar
        value={text}
        onChange={setText}
        style={styles.searchbar}
        placeholder="검색어를 입력해주세요."
        optionComponent={
          text && (
            <TouchableOpacity onPress={() => setText('')}>
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
        {!searched && Boolean(data.length) && (
          <ListHeader
            label="최근 검색어"
            button={
              !searched && tabIndex === 0
                ? Boolean(accountData.length)
                : Boolean(hashTagData.length)
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
        {!searched && !data.length ? (
          <NoFound message="최근 검색어가 없습니다." />
        ) : searched && !data.length ? (
          <NoFound message="검색 결과가 없습니다." />
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
                    primary
                    {...item}
                    index={index}
                    onItemPress={handleItemPress(item)}
                    search={{keyword: text}}
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
                      const d = [...data.filter(x => x.name !== item.name)];
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
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
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
