import React,{ useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  ActivityIndicator,
  Pressable,
  Text
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import {
  fontPercentage,
  heightPercentage,
  screenHeight,
  screenWidth,
  widthPercentage
} from '../../services/util';
import TextWrap from '../../components/text-wrap/TextWrap';
import GatherCarouselImage from './GatherCarouselImage';
import { dialogOpenShinchung } from '../../redux/dialog/DialogActions';
import HTMLView from 'react-native-htmlview';
import routes from '../../libs/routes';
import { navigate } from '../../services/navigation';

export default function GatheringDetail({route}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [item,setItme] = useState(route.params.data);
  const [gatheringCount, setGatheringCount] = useState(item.gatheringCount.split('|'));
  const [gatheringDate, setGatheringDate] = useState(item.gatheringDate.split('|'));
  const fee = item.fee != 0 ? item.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')+'원' : '무료';
  const showinfo = useSelector(s => s.showinfo);
  useEffect(() => {
    let mount = true;
    if (mount) {
      if(showinfo.what === 'info'){
        navigate(routes.topActivity, {
          type: 'gather',
        });
      }
    }
    return () => {
      mount = false;
    };
  },[showinfo.what]);

  useEffect(() => {
    let mount = true;
    if (mount) {
      setLoading(false);
    }
    return () => {
      setLoading(true);
      mount = false;
    };
  },[]);

  return (
    <>
    {!loading ? (
      <ScrollView style={styles.root}>
          <View style={styles.mainContent}>
            <GatherCarouselImage item={item} style={styles.thumbnail} />
            <View style={styles.info}>
              <TextWrap
                font={fonts.kopubWorldDotumProMedium}
                style={styles.title}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item?.title}
              </TextWrap>
              <TextWrap
                style={styles.writer}
                font={fonts.kopubWorldDotumProLight}>
                [카테고리] {item?.category}
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
                      <TextWrap
                        key={index}
                        style={styles.data}
                        font={fonts.kopubWorldDotumProLight}>
                        [모임일시] {item.gatheringDate.substring(0,11)} | {item.gatheringDate.substring(11,16)} {parseInt(item.gatheringDate.substring(11,13)) < 13 ? 'AM' : 'PM'}(1회)
                      </TextWrap>
                    )
                  } else {
                    return (
                      <TextWrap
                        key={index}
                        style={styles.data2}
                        font={fonts.kopubWorldDotumProLight}>
                        {gatheringDate[index].substring(0,11)} | {gatheringDate[index].substring(11,16)} {parseInt(gatheringDate[index].substring(11,13)) < 13 ? 'AM' : 'PM'}({x}회)
                      </TextWrap>
                    );
                  }
                }) 
              : <TextWrap
                  style={styles.data}
                  font={fonts.kopubWorldDotumProLight}>
                  [모임일시] {item.gatheringDate.substring(0,11)} | {item.gatheringDate.substring(11,16)} {parseInt(item.gatheringDate.substring(11,13)) < 13 ? 'AM' : 'PM'}(1회)
                </TextWrap>
              }
              <TextWrap
                style={styles.price}
                font={fonts.kopubWorldDotumProLight}>
                {fee}
              </TextWrap>
              <HTMLView 
                value={item.description}
                font={fonts.kopubWorldDotumProLight}
                style={styles.discription}
              />
            </View>
          </View>

          <View style={styles.button}>
              <Pressable style={styles.buttons} onPress={() => dispatch(dialogOpenShinchung(item.num))}>
                <Text style={styles.text}>신청하기</Text>
              </Pressable>
          </View>
      </ScrollView>
    ): <ActivityIndicator
          size="large"
          style={{
            alignSelf: 'center',
            top: -50,
          }}
          color={colors.blue}
        />
    }
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    top: 0,
    //paddingRight: widthPercentage(10),
    backgroundColor: colors.white,
  },
  main: {
    flex: 1,
  },
  mainContent: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  title: {
    color: colors.black,
    marginVertical: 3,
    fontSize: fontPercentage(16),
    lineHeight: fontPercentage(20),
    fontWeight:'bold',
    textAlign: 'left',
    top: 10,
  },
  discription: {
    marginTop:heightPercentage(30),
  },
  writer: {
    marginTop:heightPercentage(40),
    color: colors.black,
    fontSize: fontPercentage(9),
    lineHeight: fontPercentage(17),
    textAlign: 'left',
  },
  price: {
    marginTop:heightPercentage(30),
    color: colors.red,
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(17),
    textAlign: 'left',
    fontWeight:'bold'
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
    marginLeft:'1.5%'
  },
  thumbnail: {
    height: screenHeight / 1.5,
    width: screenWidth,
    resizeMode: 'contain',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'flex-start',
    marginLeft: widthPercentage(15)
  },
  button: {
    left: '5%',
    width: '90%',
    bottom: '1%',
    ...Platform.select({
      ios: {
        backgroundColor: '#3F3F3F',
      }
  }),
  },
  buttons: {
    paddingVertical:heightPercentage(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3F3F3F',
  },
  text: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(13),
    fontWeight: 'bold',
    ...Platform.select({
      android: {
        color: 'white',
      },
      ios: {
        color: 'black',
      }
  }),
  },
});
