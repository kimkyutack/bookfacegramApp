import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import consts from '../../libs/consts';
import colors from '../../libs/colors';
import images from '../../libs/images';
import {
  screenWidth,
  screenHeight,
  widthPercentage,
  heightPercentage,
  fontPercentage
} from '../../services/util';
import fonts from '../../libs/fonts';
import {requestGet} from '../../services/network';
import {dialogError, dialogOpenCate, dialogOpenRegion} from '../../redux/dialog/DialogActions';
import GatherAllitem from './GatherAllitem';

export default function GatherAllList({
  route,
  rank,
  gatherlist,
  end
}) {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(20);
  const detailTab = useSelector(s => s.tab, shallowEqual);
  const [Rank, setRank] = useState(detailTab.detailTab.cate);
  const [Regions, setRegions] = useState(detailTab.region);
  const [grade, setGrade] = useState('전체학년');
  const [state, setState] = useState({req: gatherlist, page: 1});
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 300;
  const [Region, setRegion] = useState('전체지역');
  const url = end === 0 ? consts.apiUrl + '/village/member/urgency-list' : consts.apiUrl + '/village/member/list';
  
  const fetchRequested = async startpage => {
    try {
      setLoading(true);
      const {data, status} = await requestGet({
        url: url,
        query: {
          region: Regions == undefined ? 'all' : Regions,
          category: Rank == undefined ? 'all' : Rank,
          startPaging: startpage,
          endPaging: 20, 
        },
      });
      setLoading(false);
      if (status === 'SUCCESS') {
        if(startpage !== 0){
          setStart(start + 20);
          setState({
            req: state.req.concat([...data]), // 기존 data에 추가.
            page: state.page + 1,
          });
        }else{
          setStart(20);
          setState({
            req: [...data], // 기존 data 변경
            page: 1,
          });
        }
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
    switch (Rank) {
          case 'all':
            setGrade('전체학년');
            break;
          case '초1':
            setGrade('초등학교 1학년');
            break;
          case '초2':
            setGrade('초등학교 2학년');
            break;
          case '초3':
            setGrade('초등학교 3학년');
            break;
          case '초4':
            setGrade('초등학교 4학년');
            break;
          case '초5':
            setGrade('초등학교 5학년');
            break;
          case '초6':
            setGrade('초등학교 6학년');
            break;
          case '중1':
            setGrade('중학교 1학년');
            break;
          case '중2':
            setGrade('중학교 2학년');
            break;
          default:
            setGrade('전체학년');
            break;
        }
    }

    return () => {
      mount = false;
      setGrade('전체학년');
    };
  }, [Rank]);

  useEffect(() => {
    if(detailTab.detailTab.cate != undefined){
      setRank(detailTab.detailTab.cate);
    }else{
      setRank('all')
    }
  }, [detailTab.detailTab.cate]);

  


  useEffect(() => {
    let mount = true;
    if (mount) {
      scrollRef.current?.scrollToOffset({y: 0.1, animated: false});
      
      if(detailTab.region == undefined || detailTab.region == 'all'){
        setRegions('all');
        setRegion('전체지역');
      }else{
        setRegions(detailTab.region);
        setRegion(detailTab.region);
      }
    }
    return () => {
      mount = false;
    };
  }, [detailTab.region]);

  useEffect(() => {
      if(Rank != undefined && Region != undefined){
        setLoading(true);
        fetchRequested(0);
      }
    return () => {
      setLoading(true);
    }
  }, [Rank,Region]);

  useEffect(() => {
    let mount = true;
    if (mount) {
      setState({
          req: gatherlist, // 기존 data에 추가.
          page: 1,
        });
      scrollRef.current?.scrollToOffset({y: 0.1, animated: false});
    }
    return () => {
      mount = false;
    };
  }, []);

   const renderHeader = () => {
    if (gatherlist?.length === 0 || !loading || gatherlist?.length < 20) {
    return <View style={styles.root2}>
            <TextWrap
              style={styles.cardHeaderTitle2}
              font={fonts.kopubWorldDotumProBold}>
              {end === 0 ? '곧 마감하는 독서모임!' : '모집중인 독서모임'}
            </TextWrap>
            <View style={styles.row2}>
              <TouchableOpacity
                      style={{
                        flex: 1,
                        height: heightPercentage(25),
                        top: heightPercentage(5),
                        borderWidth: 0.3,
                        borderStyle: 'solid',
                        borderColor: '#c9c9c9',
                        position: 'relative',
                        zIndex: 1, // works on ios
                        elevation: 1,
                      }}
                      onPress={() => {
                        dispatch(dialogOpenRegion({ message: '준비중.', region: Region }));
                      }}>
                      <View style={{ width: '100%' }}>
                        <TextWrap style={styles.selectfont}>{Region}</TextWrap>
                        <Image source={images.selectbox} style={styles.select} />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flex: 1,
                        height: heightPercentage(25),
                        top: heightPercentage(5),
                        borderWidth: 0.3,
                        borderStyle: 'solid',
                        borderColor: '#c9c9c9',
                        position: 'relative',
                        zIndex: 1, // works on ios
                        elevation: 1,
                      }}
                      onPress={() => {
                        dispatch(dialogOpenCate({ message: '준비중.', grade: Rank }));
                      }}>
                      <View style={{ width: '100%' }}>
                        <TextWrap style={styles.selectfont}>{grade}</TextWrap>
                        <Image source={images.selectbox} style={styles.select} />
                      </View>
                    </TouchableOpacity>
            </View>
          </View>
    }else{
      return <></>;
    }
  };

  const renderFooter = () => {
    if (gatherlist?.length === 0 || !loading || gatherlist?.length < 20) {
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
    if(gatherlist.length >= 20){
      fetchRequested(start);
    }
    return () => {};
  };

  return (
    <View
      style={[
        styles.root,
        gatherlist.length === 0 && {flex: 1, justifyContent: 'center'},
      ]}>
      {gatherlist.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TextWrap>해당하는 독서모임이 없습니다.</TextWrap>
        </View>
      ) : (
        <View>
        <FlatList
          ref={scrollRef}
          data={state.req} 
          extraData={state.req} 
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            return <GatherAllitem item={item} index={index} />;
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.8}
          numColumns={2}
          ListHeaderComponent={renderHeader()}
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
  root2: {
    //flex: 1,
    marginTop:heightPercentage(40),
    width: screenWidth,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  root: {
    width: screenWidth,
    flexDirection: 'column',
    ...Platform.select({
      android: {
        bottom:heightPercentage(50),
      },
  }),
  },
  row: {
    height: screenHeight / 25,
    flexDirection: 'row',
  },
  row2: {
    width: screenWidth * 0.9,
    height: screenHeight / 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  select: {
    position: 'absolute',
    width: '100%',
    height: heightPercentage(28),
    resizeMode: 'stretch',
  },
  selectfont: {
    fontSize: fontPercentage(9),
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
  cardHeaderTitle2: {
    lineHeight: fontPercentage(17),
    fontSize: fontPercentage(13),
    width:'90%',
    textAlign:'left',
    fontWeight: 'bold',
    color: colors.black,
    marginTop:heightPercentage(20)
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
});
