import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, ScrollView, TouchableHighlight} from 'react-native';
import ButtonBox from '../../components/button-box/ButtonBox';
import TextWrap from '../../components/text-wrap/TextWrap';
import fonts from '../../libs/fonts';
import colors from '../../libs/colors';
import routes from '../../libs/routes';
import {navigate} from '../../services/navigation';
import RootLayout from '../../layouts/root-layout/RootLayout';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {clearItem, getItem} from '../../services/preference';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
  screenWidth,
} from '../../services/util';



export default function Intro1({route, navigation}) {
  const scrollRef = useRef();
  const [pressButtonIdx, setPressButtonIdx] = useState(null);
  const dispatch = useDispatch();
  const [level,setLevel] = useState(0);
  const age = route.params?.age * 1;
  let initGrade = route.params?.initGrade * 1;
  if(level !== 0){
    initGrade = level * 1;
  }
  const userlevelCheck = async () => {
  try {
   const platformType =  await getItem('platformType');
    if(platformType === 'toaping'){
      setLevel(await getItem('level'));
    }
  } catch (error) {
    console.log('fail')
  }
};
  useEffect(() => { 
    if (age) {
      if (age < 8) {
        setPressButtonIdx(2);
      } else if (age === 8) {
        setPressButtonIdx(3);
      } else if (age === 9) {
        setPressButtonIdx(4);
      } else if (age === 10) {
        setPressButtonIdx(5);
      } else if (age === 11) {
        setPressButtonIdx(6);
      } else if (age === 12) {
        setPressButtonIdx(7);
      } else if (age === 13) {
        setPressButtonIdx(8);
      } else if (age === 14) {
        setPressButtonIdx(9);
      } else if (age === 15) {
        setPressButtonIdx(10);
      } else if (age === 16) {
        setPressButtonIdx(11);
      } else if (age === 17) {
        setPressButtonIdx(12);
      }
    } else if (initGrade) {
      if (initGrade === 2) {
        setPressButtonIdx(2);
      } else if (initGrade === 3) {
        setPressButtonIdx(3);
      } else if (initGrade === 4) {
        setPressButtonIdx(4);
      } else if (initGrade === 5) {
        setPressButtonIdx(5);
      } else if (initGrade === 6) {
        setPressButtonIdx(6);
      } else if (initGrade === 7) {
        setPressButtonIdx(7);
      } else if (initGrade === 8) {
        setPressButtonIdx(8);
      } else if (initGrade === 9) {
        setPressButtonIdx(9);
      } else if (initGrade === 10) {
        setPressButtonIdx(10);
      } else if (initGrade === 11) {
        setPressButtonIdx(11);
      } else if (initGrade === 12) {
        setPressButtonIdx(12);
      }
    }
  }, [initGrade]);

  useEffect(() => {
    userlevelCheck();
  }, []);

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
            몇 학년 인가요?
          </TextWrap>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            fontStyle={styles.buttonBox}
            style={styles.head}>
            나(자녀)는 몇 학년인지 알려주세요.
          </TextWrap>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            fontStyle={styles.buttonBox}
            style={styles.headCheck}>
            *1개 선택
          </TextWrap>
        </View>

        <View style={styles.buttonBoxFlexContainer}>
          <View style={styles.buttonBoxContainer}>
            <View style={styles.buttonBoxRow}>
              {/* 1은 유야기 제외 */}
              <ButtonBox
                grade={2}
                pressButtonIdx={pressButtonIdx}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonIdx !== 2
                    ? styles.buttonBox3
                    : styles.buttonBox3Selected
                }
                onPress={() => setPressButtonIdx(2)}>
                유치원
              </ButtonBox>
            </View>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={3}
                pressButtonIdx={pressButtonIdx}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonIdx !== 3
                    ? styles.buttonBox3
                    : styles.buttonBox3Selected
                }
                onPress={() => setPressButtonIdx(3)}>
                초등학교 1학년
              </ButtonBox>
            </View>
          </View>
          <View style={styles.buttonBoxContainer}>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={4}
                pressButtonIdx={pressButtonIdx}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonIdx !== 4
                    ? styles.buttonBox3
                    : styles.buttonBox3Selected
                }
                onPress={() => setPressButtonIdx(4)}>
                초등학교 2학년
              </ButtonBox>
            </View>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={5}
                pressButtonIdx={pressButtonIdx}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonIdx !== 5
                    ? styles.buttonBox3
                    : styles.buttonBox3Selected
                }
                onPress={() => setPressButtonIdx(5)}>
                초등학교 3학년
              </ButtonBox>
            </View>
          </View>
          <View style={styles.buttonBoxContainer}>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={6}
                pressButtonIdx={pressButtonIdx}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonIdx !== 6
                    ? styles.buttonBox3
                    : styles.buttonBox3Selected
                }
                onPress={() => setPressButtonIdx(6)}>
                초등학교 4학년
              </ButtonBox>
            </View>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={7}
                pressButtonIdx={pressButtonIdx}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonIdx !== 7
                    ? styles.buttonBox3
                    : styles.buttonBox3Selected
                }
                onPress={() => setPressButtonIdx(7)}>
                초등학교 5학년
              </ButtonBox>
            </View>
          </View>
          <View style={styles.buttonBoxContainer}>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={8}
                pressButtonIdx={pressButtonIdx}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonIdx !== 8
                    ? styles.buttonBox3
                    : styles.buttonBox3Selected
                }
                onPress={() => setPressButtonIdx(8)}>
                초등학교 6학년
              </ButtonBox>
            </View>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={9}
                pressButtonIdx={pressButtonIdx}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonIdx !== 9
                    ? styles.buttonBox3
                    : styles.buttonBox3Selected
                }
                onPress={() => setPressButtonIdx(9)}>
                중학교 1학년
              </ButtonBox>
            </View>
          </View>
          <View style={styles.buttonBoxContainer}>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={10}
                pressButtonIdx={pressButtonIdx}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonIdx !== 10
                    ? styles.buttonBox3
                    : styles.buttonBox3Selected
                }
                onPress={() => setPressButtonIdx(10)}>
                중학교 2학년
              </ButtonBox>
            </View>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={11}
                pressButtonIdx={pressButtonIdx}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonIdx !== 11
                    ? styles.buttonBox3
                    : styles.buttonBox3Selected
                }
                onPress={() => setPressButtonIdx(11)}>
                중학교 3학년
              </ButtonBox>
            </View>
          </View>
          <View style={styles.buttonBoxContainer}>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={12}
                pressButtonIdx={pressButtonIdx}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonIdx !== 12
                    ? styles.buttonBox3
                    : styles.buttonBox3Selected
                }
                onPress={() => setPressButtonIdx(12)}>
                고등학교 1학년
              </ButtonBox>
            </View>
            <View style={styles.buttonBoxRow} fontStyle={styles.buttonBox} />
          </View>
        </View>

        <View style={styles.paginationContainer}>
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
              pressButtonIdx={pressButtonIdx}
              style={styles.buttonBox2}
              disabled={pressButtonIdx === null}
              disabledStyle={
                pressButtonIdx !== null
                  ? styles.disabledStyle
                  : styles.disabledStyle2
              }
              onPress={() => navigate('intro2', {grade: pressButtonIdx})}
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
    // backgroundColor: 'red',
    justifyContent: 'center',
  },
  buttonBoxFlexContainer: {
    flex: 1,
  },
  buttonBoxContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: heightPercentage(10),
    // backgroundColor: 'blue',
  },
  paginationContainer: {
    height: heightPercentage(77),
    width:screenWidth / 2,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf:'flex-end',
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
    height: heightPercentage(46),
  },
  buttonBox3: {
    color: colors.black,
    fontSize: fontPercentage(11),
    lineHeight: heightPercentage(46),
  },
  buttonBoxSelected: {
    color: colors.white,
    fontSize: fontPercentage(11),
    height: heightPercentage(46),
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
    color: colors.prussianBlue,
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
