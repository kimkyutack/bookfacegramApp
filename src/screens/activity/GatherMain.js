import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import {useDispatch , useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import consts from '../../libs/consts';
import colors from '../../libs/colors';
import images from '../../libs/images';
import routes from '../../libs/routes';
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
import Gatheritem from './Gatheritem';
import FastImage from 'react-native-fast-image';
import { navigate } from '../../services/navigation';
import { setTab } from '../../redux/tab/TabAction';
import GatheringMain from './GatheringMain';
import NoFound from '../../components/no-found/NoFound';


export default function GatherMain({
  endGather,
  ingGather
}) {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({req: endGather, page: 1});
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 300;
  const detailTab = useSelector(s => s.tab, shallowEqual);
  const [Rank, setRank] = useState(detailTab.detailTab.cate);
  const [grade, setGrade] = useState('전체학년');
  const [region, setregion] = useState('전체지역');
  useEffect(() => {
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
        setLoading(false);
    return () => {
      setLoading(true);
    };
  }, [Rank]);

  useEffect(() => {
    let mount = true;
    if (mount) {
      scrollRef.current?.scrollToOffset({y: 0.1, animated: false});
      if(detailTab.region != undefined && detailTab.region.length !== 0 && detailTab.region != ''){
        if(detailTab.region == 'all'){
          setregion('전체지역');
        }else{
          setregion(detailTab.region);
        }
      }
      setLoading(false);
    }
    return () => {
      mount = false;
      setLoading(true);
    };
  }, [detailTab.region]);

  useEffect(() => {
    let mount = true;
    if (mount) {
      scrollRef.current?.scrollToOffset({y: 0.1, animated: false});
    }
    return () => {
      mount = false;
    };
  }, []);

  const renderHeader = () => {
    if (endGather?.length === 0 || !loading || endGather?.length < 20) {
    return <View style={styles.root2}>
            <View style={styles.column}>
              <TouchableWithoutFeedback>
                <View style={styles.bannerContainer}>
                  <FastImage
                    source={images.gatherBanner}
                    resizeMode={FastImage.resizeMode.stretch}
                    style={styles.banner}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
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
                  dispatch(dialogOpenRegion({ message: '준비중.', region: region }));
                }}>
                <View style={{ width: '100%' }}>
                  <TextWrap style={styles.selectfont}>{region}</TextWrap>
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
            <View style={styles.cardHeaderTitle}>
            <TextWrap
              style={styles.cardHeaderTitle2}
              font={fonts.kopubWorldDotumProBold}>
              곧 마감하는 독서모임!
            </TextWrap>
            <TextWrap
                style={styles.cardHeaderSpreadSt1}
                font={fonts.kopubWorldDotumProMedium}
                onPress={() => {
                  dispatch(
                    setTab({
                      tab: 'gatherlist',
                      cate: grade,
                      region: region,
                    })
                  );

                  navigate(routes.homeList, {
                    screen: routes.topActivity,
                    params: {
                      rank:Rank,
                      region:region,
                      type: 'gatherlist',
                      key: Date.now(),
                      end: 0,
                    },
                  });

                }}>
                &gt; 전체보기
              </TextWrap>
              </View>
          </View>
    }else{
      return <></>;
    }
  };

  const renderFooter = () => {
    
    if (ingGather?.length !== 0 && !loading) {
      return <GatheringMain rank={Rank} ingGather={ingGather} />;
    }else{
      return <></>;
    }
  };


  return (
    <View
      style={
        styles.root
      }>
      {state.req.length === 0 ? (
        <ScrollView>
          <View style={[styles.root2,{flex:1}]}>
            <View style={styles.column}>
              <TouchableWithoutFeedback>
                <View style={styles.bannerContainer}>
                  <FastImage
                    source={images.gatherBanner}
                    resizeMode={FastImage.resizeMode.stretch}
                    style={styles.banner}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
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
                  dispatch(dialogOpenRegion({ message: '준비중.', region: region }));
                }}>
                <View style={{ width: '100%' }}>
                  <TextWrap style={styles.selectfont}>{region}</TextWrap>
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
            <View style={styles.cardHeaderTitle}>
            <TextWrap
              style={styles.cardHeaderTitle2}
              font={fonts.kopubWorldDotumProBold}>
              곧 마감하는 독서모임!
            </TextWrap>
            <TextWrap
                style={styles.cardHeaderSpreadSt1}
                font={fonts.kopubWorldDotumProMedium}
                onPress={() => {
                  dispatch(
                    setTab({
                      tab: 'gatherlist',
                      cate: grade,
                      region: region,
                    })
                  );

                  navigate(routes.homeList, {
                    screen: routes.topActivity,
                    params: {
                      rank:Rank,
                      region:region,
                      type: 'gatherlist',
                      key: Date.now(),
                      end: 0,
                    },
                  });

                }}>
                &gt; 전체보기
              </TextWrap>
              </View>
              <View style={{flex:1}}>
              <NoFound message="검색조건에 해당하는 독서모임이 없습니다." />
              </View>
              {ingGather?.length !== 0 && !loading ? (
                <GatheringMain rank={Rank} ingGather={ingGather} />
              ) : (
               <View style={[styles.root2,{marginTop:0}]}>
                <View>
                <View style={styles.cardHeaderTitle}>
                <TextWrap
                  style={styles.cardHeaderTitle2}
                  font={fonts.kopubWorldDotumProBold}>
                  모집중인 독서모임
                </TextWrap>
                <TextWrap
                    style={styles.cardHeaderSpreadSt1}
                    font={fonts.kopubWorldDotumProMedium}
                    onPress={() => {
                      dispatch(
                        setTab({
                          tab: 'gatherlist',
                          cate: Rank,
                          region: region,
                        })
                      );

                      navigate(routes.homeList, {
                        screen: routes.topActivity,
                        params: {
                          rank:Rank,
                          region:region,
                          type: 'gatherlist',
                          key: Date.now(),
                          end: 1,
                        },
                      });

                    }}>
                    &gt; 전체보기
                  </TextWrap>
                  </View>
              </View>
                <View>
                <NoFound message="검색조건에 해당하는 독서모임이 없습니다." />
                </View>
                </View>
              )
              }
          </View>
          
       </ScrollView> 
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
            return <Gatheritem item={item} index={index} />;
          }}
          numColumns={1}
          ListHeaderComponent={renderHeader()}
          ListFooterComponent={renderFooter()}
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
    marginTop:heightPercentage(20),
    width: screenWidth,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  noroot: {

  },
  root: {
    width: screenWidth,
    flexDirection: 'column',
    
  },
  cardHeaderTitleSt1: {
    lineHeight: fontPercentage(24),
    fontSize: fontPercentage(13),
  },
  cardHeaderSpreadSt1: {
    fontSize: fontPercentage(11),
    width: screenWidth * 0.9,
  },
  bannerContainer: {
    alignSelf: 'center',
    marginTop: heightPercentage(50),
  },
  banner: {
    width: screenWidth*0.9,
    height: heightPercentage(270),
  },
  row: {
    height: screenHeight / 25,
    flexDirection: 'row',
  },
  row2: {
    marginTop: heightPercentage(60),
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
  cardHeaderTitle: {
    alignContent:'space-between',
    marginTop:heightPercentage(30),
    width: screenWidth * 0.9,
    flexDirection:'row'
  },
  cardHeaderTitle2: {
    lineHeight: fontPercentage(17),
    fontSize: fontPercentage(13),
    width:'87%',
    fontWeight: 'bold',
    color: colors.black
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
    bottom:heightPercentage(5),
    left: screenWidth / 2.2,
    display: 'flex',

  },
  none_button: {
    display: 'none',
  },
  column: {
    marginTop:heightPercentage(20),
    width: screenWidth,
    height: screenHeight * 0.25,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
