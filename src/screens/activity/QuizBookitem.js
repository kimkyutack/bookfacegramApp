import React from 'react';
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
} from '../../services/util';
import TextWrap from '../../components/text-wrap/TextWrap';
import BookQuizCarouselImage from '../activity/BookQuizCarouselImage';
import {setTab} from '../../redux/tab/TabAction';

export default function QuizBookitem({item, index}) {
  const dispatch = useDispatch();
  //alert(JSON.stringify(item));
  return (
    <>
      <View style={styles.headerContainer} />
      <View style={styles.root}>
        <TouchableOpacity
          style={styles.main}
          onPress={() => {
            dispatch(
              setTab({
                tab: 'detail',
                selectedBook: item.bookCd,
                viewType: 'kbs',
                selectType: 'quiz',
              }),
            );
            navigate(routes.homeDetail, {
              type: 'detail',
            });
          }}>
          <View style={styles.mainContent}>
            <BookQuizCarouselImage item={item} style={styles.thumbnail} />
            <View style={styles.info}>
              <TextWrap
                font={fonts.kopubWorldDotumProMedium}
                style={styles.title}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.bookNm}
              </TextWrap>
              <TextWrap
                style={styles.writer}
                font={fonts.kopubWorldDotumProLight}>
                {item.publisherNm} | {item.writer}
              </TextWrap>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 20,
    margin: 5,
    top: 0,
    //paddingRight: widthPercentage(10),
    justifyContent: 'space-between',
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
  date: {
    marginTop: 5,
    fontWeight: '700',
  },
  title: {
    color: colors.black,
    marginVertical: 3,
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(17),
    textAlign: 'center',
    top: 10,
  },
  writer: {
    color: colors.black,
    marginVertical: heightPercentage(5),
    fontSize: fontPercentage(9),
    lineHeight: fontPercentage(17),
    textAlign: 'center',
  },
  divider: {
    marginHorizontal: 16,
    borderWidth: 0.3,
    borderColor: '#ccc',
  },
  thumbnail: {
    height: screenWidth / 2.8,
    width: screenWidth / 4,
    resizeMode: 'cover',
    flexDirection: 'row',
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
    alignSelf: 'center',
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
