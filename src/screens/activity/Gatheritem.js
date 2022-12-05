import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {useDispatch} from 'react-redux';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import routes from '../../libs/routes';
import {navigate} from '../../services/navigation';
import {
  fontPercentage,
  heightPercentage,
  screenWidth,
  widthPercentage,
  screenHeight
} from '../../services/util';
import TextWrap from '../../components/text-wrap/TextWrap';
import {setTab} from '../../redux/tab/TabAction';
import GatherCarouselImage from './GatherCarouselImage';

export default function Gatheritem({item, index}) {
  const dispatch = useDispatch();
  const [gatheringCount, setGatheringCount] = useState(item.gatheringCount.split('|'));
  const [gatheringDate, setGatheringDate] = useState(item.gatheringDate.split('|'));
  //console.log(datest.length)
  //alert(JSON.stringify(item));
  return (
    <>
      <View style={styles.root}>
        <TouchableOpacity
          style={styles.main}
          onPress={() => {
            dispatch(
              setTab({
                tab: 'gatherdetail',
                num: item.num,
              }),
            );
            navigate(routes.topActivity, {
              type: 'gatherdetail',
              data: item,
              key: Date.now(),
            });
          }}>
          <View style={styles.mainContent}>
            <GatherCarouselImage item={item} style={styles.thumbnail} />
            <View style={styles.info}>
              <TextWrap
                font={fonts.kopubWorldDotumProMedium}
                style={styles.title}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.title}
              </TextWrap>
              <TextWrap
                style={styles.writer}
                font={fonts.kopubWorldDotumProLight}>
                [카테고리] {item.category}
              </TextWrap>
              <TextWrap
                style={styles.data}
                font={fonts.kopubWorldDotumProLight}>
                [신청기간] {item.applyStartDate} ~ {item.applyEndDate}
              </TextWrap>
              <TextWrap
                style={styles.data}
                font={fonts.kopubWorldDotumProLight}>
                [정원] {item.minimumHeadcount}명 | {item.maximumHeadcount}명
              </TextWrap>
              <TextWrap
                style={styles.data}
                font={fonts.kopubWorldDotumProLight}>
                [모임지역] {item.region1} {item.region2}
              </TextWrap>
              {gatheringCount.length > 1 
              ? gatheringCount.map((x, index) => {
                  if (index === 0) {
                    return (
                      <View key={index} style={{flexDirection:'row'}}>
                        <TextWrap
                          style={[styles.data,{width:widthPercentage(35)}]}
                          font={fonts.kopubWorldDotumProLight}>
                          [모임일시]
                        </TextWrap>
                        <TextWrap
                          
                          style={styles.data2}
                          font={fonts.kopubWorldDotumProLight}>
                          {item.gatheringDate.substring(0,11)} | {item.gatheringDate.substring(11,16)} {parseInt(item.gatheringDate.substring(11,13)) < 13 ? 'AM' : 'PM'}(1회)
                        </TextWrap>
                      </View>
                    )
                  } else {
                    return (
                      <View key={index} style={{flexDirection:'row'}}>
                        <View style={[styles.data,{width:widthPercentage(35)}]}/>
                        <TextWrap
                          key={index}
                          style={styles.data2}
                          font={fonts.kopubWorldDotumProLight}>
                          {gatheringDate[index].substring(0,11)} | {gatheringDate[index].substring(11,16)} {parseInt(gatheringDate[index].substring(11,13)) < 13 ? 'AM' : 'PM'}({x}회)
                        </TextWrap>
                      </View>
                    );
                  }
                }) 
              : <TextWrap
                  style={styles.data}
                  font={fonts.kopubWorldDotumProLight}>
                  [모임일시] {item.gatheringDate.substring(0,11)} | {item.gatheringDate.substring(11,16)} {parseInt(item.gatheringDate.substring(11,13)) < 13 ? 'AM' : 'PM'}(1회)
                </TextWrap>
              }
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    width:screenWidth,
    flexDirection: 'column',
    marginTop: heightPercentage(15),
    //paddingRight: widthPercentage(10),
    backgroundColor: colors.white,
  },
  main: {
    alignSelf:'center',
    width:'90%',
    flexDirection: 'column',
  },
  mainContent: {
    width:'100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  date: {
    marginTop: 5,
    fontWeight: '700',
  },
  title: {
    color: colors.black,
    marginVertical: 3,
    fontSize: fontPercentage(16),
    lineHeight: fontPercentage(20),
    fontWeight:'bold',
    textAlign: 'left',
    marginTop:heightPercentage(32)
  },
  writer: {
    marginTop:heightPercentage(15),
    color: colors.black,
    fontSize: fontPercentage(9),
    lineHeight: fontPercentage(17),
    textAlign: 'left',
  },
  data: {
    color: colors.black,
    marginVertical: heightPercentage(1),
    fontSize: fontPercentage(9),
    lineHeight: fontPercentage(13),
    textAlign: 'left',
  },
  data: {
    
    color: colors.black,
    marginVertical: heightPercentage(1),
    fontSize: fontPercentage(9),
    lineHeight: fontPercentage(13),
    textAlign: 'left',
  },
  data2: {
    color: colors.black,
    marginVertical: heightPercentage(1),
    fontSize: fontPercentage(9),
    lineHeight: fontPercentage(13),
    textAlign: 'center',
    marginLeft:'1%'
  },
  divider: {
    marginHorizontal: 16,
    borderWidth: 0.3,
    borderColor: '#ccc',
  },
  thumbnail: {
    flex: 1,
    resizeMode: 'contain',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
      },
      android: {
        backgroundColor: 'white',
      },
    }),
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'flex-start',
    alignItems:'flex-start',
    justifyContent:'center',
    marginLeft: widthPercentage(12)
  },
  buttonContainer: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
  button1: {
    width: 40,
    height: 40,
    flex: 1,
    resizeMode: 'contain',
    marginRight: 10,
  },
  button2: {
    width: 40,
    height: 40,
    flex: 1,
    resizeMode: 'contain',
  },
  headerContainer: {
    marginVertical: 15,
    backgroundColor: colors.white,
  },
  header: {
    fontSize: fontPercentage(14),
    lineHeight: fontPercentage(18),
    color: colors.black,
    // fontWeight: '700',
  },
  subHeader: {
    color: colors.black,
    fontSize: fontPercentage(13),
    marginTop: 10,
  },
  cardHeaderTitle: {
    color: colors.black,
    fontSize: fontPercentage(14),
    lineHeight: fontPercentage(18),
  },
  blueText: {
    color: colors.blue,
  },
});
