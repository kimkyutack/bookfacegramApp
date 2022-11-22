import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import {useDispatch , useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
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
import { navigate } from '../../services/navigation';
import { setTab } from '../../redux/tab/TabAction';
import GatherAllitem from './GatherAllitem';
import consts from '../../libs/consts';
import { dialogError } from '../../redux/dialog/DialogActions';


export default function GatheringMain({
  rank,
  ingGather,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('kbs');
  const [start, setStart] = useState(20);
  const [state, setState] = useState({req: ingGather, page: 1});
  const detailTab = useSelector(s => s.tab, shallowEqual);
  const [Rank, setRank] = useState(detailTab.rank);
  const [Region, setRegion] = useState(detailTab.region);

  //모집중인 독서모임 api
  const fetchRequested = async (startpage) => {
    try {
      setLoading(true);
      const { data, status } = await requestGet({
        url: consts.apiUrl + '/book/quiz/activity',
        query: {
          rank: Rank,
          startPaging: startpage,
          endPaging: 20,
        },
      });
      if (status === 'SUCCESS') {
        setStart(start + 20);
        setState({
          req: state.req.concat([...data.kbsBookQuizs]), // 기존 data에 추가.
          page: state.page + 1,
        });
      }
      return status;
    } catch (error) {
      dispatch(dialogError(error));
    }
  };


  const renderFooter = () => {
    if (ingGather?.length === 0 || !loading || ingGather?.length < 20) {
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
    if(ingGather.length >= 20){
      fetchRequested(start);
    }
    return () => {};
  };

  return (
    <View
      style={[
        styles.root,
        ingGather.length === 0 && {flex: 1, justifyContent: 'center'},
      ]}>
      {ingGather.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TextWrap>모집중인 독서모임이 없습니다.</TextWrap>
        </View>
      ) : (
        <View>
          <View style={styles.root2}>
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
                      rank: Rank,
                      region: Region,
                    })
                  );

                  navigate(routes.homeList, {
                    screen: routes.topActivity,
                    params: {
                      rank:Rank,
                      region:Region,
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
        <FlatList
          data={state.req} 
          extraData={state.req} 
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            return <GatherAllitem item={item} type={type} index={index} />;
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.8}
          numColumns={2}
          ListFooterComponent={renderFooter}
        />
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root2: {
    //flex: 1,
    marginTop:heightPercentage(60),
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
  column: {
    marginTop:heightPercentage(20),
    width: screenWidth,
    height: screenHeight * 0.25,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
