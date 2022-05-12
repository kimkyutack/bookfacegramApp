import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, ScrollView, TouchableHighlight} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';

import ButtonBox from '../../components/button-box/ButtonBox';
import TextWrap from '../../components/text-wrap/TextWrap';
import fonts from '../../libs/fonts';
import colors from '../../libs/colors';
import routes from '../../libs/routes';
import consts from '../../libs/consts';
import {getItem, setItem} from '../../services/preference';
import {goBack, navigate, reset} from '../../services/navigation';
import RootLayout from '../../layouts/root-layout/RootLayout';
import {requestGet, requestPost} from '../../services/network';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../services/util';
import {
  dialogError,
  dialogOpenMessage,
  dialogOpenAction,
} from '../../redux/dialog/DialogActions';
import {userUpdate} from '../../redux/user/UserActions';

export default function Intro3({route, navigation}) {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const [pressButtonArr, setPressButtonArr] = useState([]);

  const pressButton = e => {
    if (pressButtonArr.length >= 3) {
      if (pressButtonArr.indexOf(e) !== -1) {
        setPressButtonArr(pressButtonArr.filter(item => item !== e));
      } else {
        return;
      }
    } else {
      if (pressButtonArr.indexOf(e) === -1) {
        setPressButtonArr([...pressButtonArr, e]);
      } else {
        setPressButtonArr(pressButtonArr.filter(item => item !== e));
      }
    }
  };

  const handleInfoRegister = async () => {
    if (pressButtonArr.length <= 2) {
      dispatch(dialogOpenMessage({message: '관심분야를 3개 선택해주세요.'}));
      return;
    } else {
      try {
        const {data, status} = await requestPost({
          url: consts.apiUrl + '/auth/memberIntro',
          body: {
            grade: route.params.grade * 1,
            interestField: pressButtonArr.toString(),
            avgReadingMonth: route.params?.reading * 1,
          },
        });
        if (status === 'SUCCESS') {
          dispatch(userUpdate);
          reset(routes.home);
        } else {
          dispatch(dialogOpenMessage({message: 'info update failed'}));
        }
      } catch (error) {
        dispatch(dialogError(error));
      }
    }
  };

  return (
    <RootLayout style={styles.root}>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.paragraphContainer}>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            fontStyle={styles.buttonBox}
            style={styles.headerTitle}>
            관심있는 분야는?
          </TextWrap>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            fontStyle={styles.buttonBox}
            style={styles.head}>
            나(자녀)는 어떤 분야를 좋아하는지 알려주세요.
          </TextWrap>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            fontStyle={styles.buttonBox}
            style={styles.headCheck}>
            *3개 선택
          </TextWrap>
        </View>
        <View style={styles.buttonBoxFlexContainer}>
          <View style={styles.buttonBoxContainer}>
            <View style={styles.buttonBoxRow}>
              {/* 1은 유야기 제외 */}
              <ButtonBox
                grade={'소설'}
                pressButtonArr={pressButtonArr}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonArr.indexOf('소설') !== -1
                    ? styles.buttonBox3Selected
                    : styles.buttonBox3
                }
                onPress={() => pressButton('소설')}>
                소설
              </ButtonBox>
            </View>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={'시'}
                pressButtonArr={pressButtonArr}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonArr.indexOf('시') !== -1
                    ? styles.buttonBox3Selected
                    : styles.buttonBox3
                }
                onPress={() => pressButton('시')}>
                시
              </ButtonBox>
            </View>
          </View>
          <View style={styles.buttonBoxContainer}>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={'에세이'}
                pressButtonArr={pressButtonArr}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonArr.indexOf('에세이') !== -1
                    ? styles.buttonBox3Selected
                    : styles.buttonBox3
                }
                onPress={() => pressButton('에세이')}>
                에세이
              </ButtonBox>
            </View>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={'인문학'}
                pressButtonArr={pressButtonArr}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonArr.indexOf('인문학') !== -1
                    ? styles.buttonBox3Selected
                    : styles.buttonBox3
                }
                onPress={() => pressButton('인문학')}>
                인문학
              </ButtonBox>
            </View>
          </View>
          <View style={styles.buttonBoxContainer}>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={'역사'}
                pressButtonArr={pressButtonArr}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonArr.indexOf('역사') !== -1
                    ? styles.buttonBox3Selected
                    : styles.buttonBox3
                }
                onPress={() => pressButton('역사')}>
                역사
              </ButtonBox>
            </View>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={'수학'}
                pressButtonArr={pressButtonArr}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonArr.indexOf('수학') !== -1
                    ? styles.buttonBox3Selected
                    : styles.buttonBox3
                }
                onPress={() => pressButton('수학')}>
                수학
              </ButtonBox>
            </View>
          </View>
          <View style={styles.buttonBoxContainer}>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={'과학'}
                pressButtonArr={pressButtonArr}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonArr.indexOf('과학') !== -1
                    ? styles.buttonBox3Selected
                    : styles.buttonBox3
                }
                onPress={() => pressButton('과학')}>
                과학
              </ButtonBox>
            </View>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={'사회'}
                pressButtonArr={pressButtonArr}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonArr.indexOf('사회') !== -1
                    ? styles.buttonBox3Selected
                    : styles.buttonBox3
                }
                onPress={() => pressButton('사회')}>
                사회
              </ButtonBox>
            </View>
          </View>
          <View style={styles.buttonBoxContainer}>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={'경제'}
                pressButtonArr={pressButtonArr}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonArr.indexOf('경제') !== -1
                    ? styles.buttonBox3Selected
                    : styles.buttonBox3
                }
                onPress={() => pressButton('경제')}>
                경제
              </ButtonBox>
            </View>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={'정치'}
                pressButtonArr={pressButtonArr}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonArr.indexOf('정치') !== -1
                    ? styles.buttonBox3Selected
                    : styles.buttonBox3
                }
                onPress={() => pressButton('정치')}>
                정치
              </ButtonBox>
            </View>
          </View>
          <View style={styles.buttonBoxContainer}>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={'운동'}
                pressButtonArr={pressButtonArr}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonArr.indexOf('운동') !== -1
                    ? styles.buttonBox3Selected
                    : styles.buttonBox3
                }
                onPress={() => pressButton('운동')}>
                운동
              </ButtonBox>
            </View>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={'자기계발'}
                pressButtonArr={pressButtonArr}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonArr.indexOf('자기계발') !== -1
                    ? styles.buttonBox3Selected
                    : styles.buttonBox3
                }
                onPress={() => pressButton('자기계발')}>
                자기계발
              </ButtonBox>
            </View>
          </View>
          <View style={styles.buttonBoxContainer}>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={'만들기'}
                pressButtonArr={pressButtonArr}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonArr.indexOf('만들기') !== -1
                    ? styles.buttonBox3Selected
                    : styles.buttonBox3
                }
                onPress={() => pressButton('만들기')}>
                만들기
              </ButtonBox>
            </View>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={'외국어'}
                pressButtonArr={pressButtonArr}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonArr.indexOf('외국어') !== -1
                    ? styles.buttonBox3Selected
                    : styles.buttonBox3
                }
                onPress={() => pressButton('외국어')}>
                외국어
              </ButtonBox>
            </View>
          </View>
          <View style={styles.buttonBoxContainer}>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={'여행'}
                pressButtonArr={pressButtonArr}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonArr.indexOf('여행') !== -1
                    ? styles.buttonBox3Selected
                    : styles.buttonBox3
                }
                onPress={() => pressButton('여행')}>
                여행
              </ButtonBox>
            </View>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={'만화'}
                pressButtonArr={pressButtonArr}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonArr.indexOf('만화') !== -1
                    ? styles.buttonBox3Selected
                    : styles.buttonBox3
                }
                onPress={() => pressButton('만화')}>
                만화
              </ButtonBox>
            </View>
          </View>
        </View>

        <View style={styles.paginationContainer}>
          <View>
            <ButtonBox
              pressButtonArr={pressButtonArr}
              style={styles.buttonBox2}
              onPress={() => goBack()}
              disabled={route.name === 'intro1' ? true : false}
              // disabledStyle={
              //   route.name === 'intro1'
              //     ? styles.disabledStyle2
              //     : styles.disabledStyle
              // }
              disabledStyle={styles.disabledStyle2}
              fontStyle={styles.buttonBox3}>
              이전
            </ButtonBox>
          </View>
          <View style={styles.paginationRow}>
            <TouchableHighlight
              style={
                route.name === 'intro1'
                  ? styles.paginationCircleActive
                  : styles.paginationCircle
              }
              underlayColor="#ccc"
              disabled>
              <TextWrap />
            </TouchableHighlight>
            <TouchableHighlight
              style={
                route.name === 'intro2'
                  ? styles.paginationCircleActive
                  : styles.paginationCircle
              }
              underlayColor="#ccc"
              disabled>
              <TextWrap />
            </TouchableHighlight>
            <TouchableHighlight
              style={
                route.name === 'intro3'
                  ? styles.paginationCircleActive
                  : styles.paginationCircle
              }
              underlayColor="#ccc"
              disabled>
              <TextWrap />
            </TouchableHighlight>
          </View>
          <View>
            <ButtonBox
              pressButtonArr={pressButtonArr}
              style={styles.buttonBox2}
              disabled={pressButtonArr.length === 0}
              disabledStyle={
                pressButtonArr.length > 0
                  ? styles.disabledStyle
                  : styles.disabledStyle2
              }
              onPress={handleInfoRegister}
              fontStyle={styles.buttonBox3}>
              다음
            </ButtonBox>
          </View>
        </View>
      </ScrollView>
    </RootLayout>
  );
}
const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.backgroundGray,
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 16,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  paragraphContainer: {
    height: heightPercentage(136),
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  buttonBoxFlexContainer: {
    flex: 1,
  },
  buttonBoxContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: heightPercentage(5),
    // backgroundColor: 'blue',
  },
  paginationContainer: {
    height: heightPercentage(77),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'green',
  },
  headerTitle: {
    fontSize: fontPercentage(25),
    color: colors.black,
    alignSelf: 'flex-start',
    width: '100%',
  },
  head: {
    color: colors.black,
    fontSize: fontPercentage(12),
    width: '100%',
    marginTop: 7,
  },
  headCheck: {
    marginTop: 4,
    color: colors.prussianBlue,
    fontSize: fontPercentage(9),
  },

  buttonBoxRow: {
    width: widthPercentage(156),
    height: heightPercentage(46),
  },
  buttonBox: {
    color: colors.black,
    fontSize: fontPercentage(11),
  },
  buttonBoxSelected: {
    color: colors.white,
    fontSize: fontPercentage(11),
  },
  buttonBox3: {
    color: colors.black,
    fontSize: fontPercentage(11),
    lineHeight: heightPercentage(46),
  },
  buttonBox3Selected: {
    color: colors.white,
    fontSize: fontPercentage(11),
    lineHeight: heightPercentage(46),
  },
  buttonBox2: {
    color: colors.black,
    backgroundColor: 'transparent',
  },
  disabledStyle: {
    color: colors.blue,
    backgroundColor: 'transparent',
  },
  disabledStyle2: {
    color: colors.black,
    backgroundColor: 'transparent',
  },
  paginationCircleActive: {
    marginHorizontal: 2,
    borderRadius: 10,
    width: 8,
    height: 8,
    backgroundColor: '#60b8f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationCircle: {
    marginHorizontal: 2,
    borderRadius: 10,
    width: 8,
    height: 8,
    backgroundColor: '#d8d8d8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
