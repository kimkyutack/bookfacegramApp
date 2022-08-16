import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Text,
  TouchableWithoutFeedback
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import consts from '../../libs/consts';
import colors from '../../libs/colors';
import images from '../../libs/images';
import routes from '../../libs/routes';
import Topbar from '../../components/topbar/Topbar';
import SearchBar from '../../components/search-bar/SearchBar';
import TopTabs from '../activity/TopTabs';
import AudioItem from '../activity/Audioitem';
import Footer from '../../libs/footer';
import TextButton from '../../components/text-button/TextButton';
import {navigate, navigationRef} from '../../services/navigation';
import MainQuiz from '../activity/MainQuiz';
import {
  screenWidth,
  screenHeight,
  widthPercentage,
  heightPercentage,
  fontPercentage,
  cameraItem,
} from '../../services/util';
import {requestGet, requestPost} from '../../services/network';
import {dialogError} from '../../redux/dialog/DialogActions';
import {
  dialogOpenSelect,
  dialogOpenMessage,
  dialogOpenGrade,
} from '../../redux/dialog/DialogActions';
import {relativeTimeRounding} from 'moment-timezone';
import {useHandler} from 'react-native-reanimated';

export default function AudioMain({
  route,
  audiolist,
  playtime,
  navigation,
}) {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const [scrolltop, setscrolltop] = useState(0);
  const [loading, setLoading] = useState(false);
  const listTab = useSelector(s => s.tab, shallowEqual);
  const [render, setRender] = useState([]);
  const [type, setType] = useState('kbs');
  const [start, setStart] = useState(20);
  const [banner, setBanner] = useState([]);
  const [banner2, setBanner2] = useState([]);
  const [state, setState] = useState({req: audiolist, playtime:playtime, page: 1});
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 300;
  const fetchRequested = async startpage => {
    try {
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/audio/AudioBookList',
        query: {
          startPaging: startpage,
          endPaging: 20,
        },
      });
      if (status === 'SUCCESS') {
        setStart(start + 20);
        setState({
          req: state.req.concat([...data.audioBookList]), // 기존 data에 추가.
          playtime: state.playtime.concat([...data.audioPlayTime]), // 기존 data에 추가.
          page: state.page + 1,
        });
        //setNotBook([...data.notKbsBookQuizs]);
        //setKbsBook([...data.kbsBookQuizs]);
      }
      return status;
    } catch (error) {
      setLoading(false);
      dispatch(dialogError(error));
    }
  };
  //배너 관련
  const fetchRequested2 = async () => {
    try {
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/banner',
        query: {
          bannerGroupCode: 'banner02',
        },
      });
      if (status === 'SUCCESS') {
        setBanner([...data.banner]);
      }
      return status;
    } catch (error) {
      dispatch(dialogError(error));
    }
  };

   const fetchRequested3 = async () => {
    try {
      
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/banner',
        query: {
          bannerGroupCode: 'banner03',
        },
      });
      if (status === 'SUCCESS') {
        setBanner2([...data.banner]);
        setLoading(false);
      }
      return status;
    } catch (error) {
      dispatch(dialogError(error));
    }
  };

  useEffect(() => {
    let mount = true;
    if (mount) {
      setLoading(true);
      fetchRequested2();
      fetchRequested3();
      scrollRef.current?.scrollToOffset({y: 0.1, animated: false});
    }
    return () => {
      mount = false;
      setBanner([]);
      setBanner2([]);
    };
  }, []);

  const renderFooter = () => {
      return <></>;
  };
  const hello = (bookCd) => {
    dispatch(
      setTab({
        tab: 'detail',
        selectedBook: bookCd,
        viewType: 'kbs',
      }),
    );
    navigate(routes.homeDetail, {
      type: 'detail',
    });

  }
  const eventBanner = async (idx) => {
    requestGet({
      url: consts.apiUrl + '/mypage/eventDetail',
      query: {
        ev_idx: idx,
      },
    })
      .then(data => {
        if (data.status === 'SUCCESS') {
          navigate(routes.eventDetail, data);
        } else {
          dispatch({
            type: bookActionType.allFailure,
            data: `error code : ${data?.code}`,
            allPage: page,
          });
        }
      })
      .catch(error => {
        dispatch({
          type: bookActionType.allFailure,
          data:
            error?.data?.msg ||
            error?.message ||
            (typeof error === 'object' ? JSON.stringify(error) : error),
          allPage: page,
        });
      });


  }
  const bannerRenderItem = (item, index, type) => {
    if (item) {
      return (
        <TouchableWithoutFeedback
          key={index}
          /*onPress={() => {
            type === 2 ? console.log('타입') 
            : item.bannerType === 'detail' && type === 1
              ? hello(item.bookCd)
              : item.bannerType === 'event' && type === 1
                ? eventBanner(item.idx)
                : item.bannerType === 'notice' && type === 1
                  ? navigate(routes.notice, { idx: item.idx })
                  : (dispatch(dialogError({ message: item.bannerType })));
          }}*/
          >
          <View style={styles.bannerContainer}>
            <FastImage
              source={{
                uri: consts.bannerUrl + '/banner/' + item.bannerImageName,
              }}
              resizeMode={FastImage.resizeMode.stretch}
              style={type === 1 ? styles.banner : styles.banner2}
              //onPress={() => Linking.openURL(item?.bannerLink)}
              onError={() => (item.title = 'bookDefault.gif')}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return;
    }
  };

  const loadMore = () => {
    if(audiolist.length >= 20){
      fetchRequested(start);
    }
    return () => {};
  };

  return (
    <View
      style={[
        styles.root,
        audiolist.length === 0 && {flex: 1, justifyContent: 'center'},
      ]}>
       
      {audiolist.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TextWrap>audiolist가 없습니다.</TextWrap>
        </View>
      ) : (
        <View style={{marginBottom:heightPercentage(0)}}>
        <FlatList
          ref={scrollRef}
          data={state.req} //morekbsbook
          extraData={state.req} //morekbsbook
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            return <AudioItem item={item} playtime={state.playtime} type={type} index={index} />;
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.8}
          numColumns={2}
          ListHeaderComponent={
            <View>
            <Swiper
              style={styles.wrapper}
              showsButtons={false}
              width={screenWidth}
              height={heightPercentage(300)}
              showsPagination={true}
              removeClippedSubviews={false}
              loop={true}
              autoplay={true}
              autoplayTimeout={3}
              pagingEnabled={true}
              dotStyle={{ top: 15 }}
              dotColor={colors.border}
              activeDotStyle={{ top: 15 }}
              activeDotColor={colors.blue}
              nextButton={<Text />}
              prevButton={<Text />}>
              {banner?.map((data, index) => {
                  return bannerRenderItem(data, index, 1);
              })}
            </Swiper>
           
            <View>
              {banner2?.map((data, index) => {
                  return bannerRenderItem(data, index, 2);
              })}
            </View>
            <View style={{marginTop:10}}>
            <TextWrap style={styles.font}>나만을 위한 토핑 오디오북</TextWrap>
            </View>
            </View>
          }
          ListFooterComponent={renderFooter}
          onScroll={event => {
            setContentVerticalOffset(event.nativeEvent.contentOffset.y);
          }}
        />
        {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
        <TouchableOpacity
        onPress={() => {
          scrollRef.current.scrollToOffset({ animated: true, offset: 0 });
        }}
        style={styles.topButton}>
        <Image source={images.scrollTop} style={styles.scrolltotop} />
      </TouchableOpacity>
        )}
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: screenWidth,
    flexDirection: 'column',
    ...Platform.select({
      android: {
        bottom:heightPercentage(10),
      },
  }),
  },
  wrapper: {},
  row: {
    height: screenHeight / 25,
    flexDirection: 'row',
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  bannerContainer: {
    alignSelf: 'center',
    marginTop: heightPercentage(15),
  },
  select: {
    position: 'absolute',
    width: widthPercentage(160),
    height: heightPercentage(28),
    zIndex: 3, // works on ios
    elevation: 3, // works on android
  },
  selectfont: {
    marginLeft: widthPercentage(5),
    top: heightPercentage(8),
    zIndex: 10, // works on ios
    elevation: 10,
  },
  scrolltotop: {
    width: widthPercentage(35),
    height: heightPercentage(35),
    resizeMode: 'contain',
  },
  banner: {
    width: widthPercentage(332),
    height: heightPercentage(300),
  },
  banner2: {
    width: widthPercentage(332),
    height: heightPercentage(100),
  },
  topButton: {
    alignItems: 'center',
    width: widthPercentage(35),
    height: heightPercentage(35),
    position: 'absolute',
    bottom: heightPercentage(0),
    left: screenWidth / 2.2,
    display: 'flex',
  },
  none_button: {
    display: 'none',
  },
  font: {
    left: widthPercentage(20),
    fontSize: fontPercentage(15),
    fontWeight: 'bold',
  },
});
