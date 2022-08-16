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
} from 'react-native';
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
  const [state, setState] = useState({req: audiolist, playtime:playtime, page: 1});
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 300;
  const fetchRequested = async startpage => {
    try {
      setLoading(true);
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/audio/AudioBookList',
        query: {
          startPaging: startpage,
          endPaging: 20,
        },
      });
      setLoading(false);
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

  useEffect(() => {
    let mount = true;
    if (mount) {
      scrollRef.current?.scrollToOffset({y: 0.1, animated: false});
    }
    return () => {
      mount = false;
    };
  }, []);

  const renderFooter = () => {
    if (audiolist?.length === 0 || !loading || audiolist?.length < 20) {
      return <></>;
    } else {
      return (
        <ActivityIndicator
          size="large"
          style={{
            alignSelf: 'center',
            top: -50,
          }}
          color={colors.blue}
        />
      );
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
        <View style={{marginBottom:30}}>
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
            <TextWrap style={styles.font}>나만을 위한 토핑 오디오북</TextWrap>
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
  row: {
    height: screenHeight / 25,
    flexDirection: 'row',
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
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
  topButton: {
    alignItems: 'center',
    width: widthPercentage(35),
    height: heightPercentage(35),
    position: 'absolute',
    ...Platform.select({
      android: {
        bottom:heightPercentage(20),
      },
      ios: {
        bottom: heightPercentage(50),
      },
  }),
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
