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
import Gatheringitem from './Gatheringitem';


export default function GatheringMain({
  rank,
  ingGather,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('kbs');
  const detailTab = useSelector(s => s.tab, shallowEqual);
  const [Rank, setRank] = useState(detailTab.detailTab.cate);
  const [Region, setRegion] = useState(detailTab.region);

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
                      cate: Rank,
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
          data={ingGather} 
          extraData={ingGather} 
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            return <Gatheringitem item={item} type={type} index={index} />;
          }}
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
    width: screenWidth,
    alignItems: 'center',
    backgroundColor: colors.white,
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
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
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
});
