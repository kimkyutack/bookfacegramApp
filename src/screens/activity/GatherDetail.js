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
import {useDispatch} from 'react-redux';
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

export default function GatheringDetail({route}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [item,setItme] = useState(route.params.data);

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
                {item?.bookNm}
              </TextWrap>
              <TextWrap
                style={styles.writer}
                font={fonts.kopubWorldDotumProLight}>
                [카테고리] {item?.publisherNm}
              </TextWrap>
              <TextWrap
                style={styles.data}
                font={fonts.kopubWorldDotumProLight}>
                [신청기간] {item?.publisherNm} ~ {item?.writer}
              </TextWrap>
              <TextWrap
                style={styles.data}
                font={fonts.kopubWorldDotumProLight}>
                [정원] {item?.publisherNm} | {item?.writer}
              </TextWrap>
              <TextWrap
                style={styles.data}
                font={fonts.kopubWorldDotumProLight}>
                [모임지역] {item?.publisherNm}
              </TextWrap>
              <TextWrap
                style={styles.data}
                font={fonts.kopubWorldDotumProLight}>
                [모임일시] {item?.publisherNm} | {item?.writer}
              </TextWrap>
              <TextWrap
                style={styles.price}
                font={fonts.kopubWorldDotumProLight}>
                무료
              </TextWrap>
              <TextWrap
                style={styles.discription}
                font={fonts.kopubWorldDotumProLight}>
                줄거리.......
              </TextWrap>
            </View>
          </View>

          <View style={styles.button}>
              <Pressable style={styles.buttons} onPress={() => dispatch(dialogOpenShinchung(''))}>
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
    marginTop:heightPercentage(70),
    color: colors.black,
    fontSize: fontPercentage(9),
    lineHeight: fontPercentage(17),
    textAlign: 'left',
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
  thumbnail: {
    height: screenHeight / 1.5,
    width: screenWidth,
    resizeMode: 'stretch',
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
