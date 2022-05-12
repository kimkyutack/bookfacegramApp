import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, ScrollView, TouchableHighlight} from 'react-native';
import ButtonBox from '../../components/button-box/ButtonBox';
import TextWrap from '../../components/text-wrap/TextWrap';
import fonts from '../../libs/fonts';
import colors from '../../libs/colors';
import routes from '../../libs/routes';
import {goBack, navigate} from '../../services/navigation';
import RootLayout from '../../layouts/root-layout/RootLayout';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../services/util';

export default function Intro2({route, navigation}) {
  const scrollRef = useRef();
  const [pressButtonIdx, setPressButtonIdx] = useState(null);

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
            한 달 평균 독서량은?
          </TextWrap>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            fontStyle={styles.buttonBox}
            style={styles.head}>
            나(자녀)는 한 달 동안 몇 권의 책을 읽고 있는지 알려주세요.
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
                grade={0}
                pressButtonIdx={pressButtonIdx}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonIdx !== 0
                    ? styles.buttonBox3
                    : styles.buttonBox3Selected
                }
                onPress={() => setPressButtonIdx(0)}>
                0권
              </ButtonBox>
            </View>
          </View>
          <View style={styles.buttonBoxContainer}>
            <View style={styles.buttonBoxRow}>
              <ButtonBox
                grade={1}
                pressButtonIdx={pressButtonIdx}
                style={styles.buttonBox}
                fontStyle={
                  pressButtonIdx !== 1
                    ? styles.buttonBox3
                    : styles.buttonBox3Selected
                }
                onPress={() => setPressButtonIdx(1)}>
                1권 ~ 2권
              </ButtonBox>
            </View>
          </View>
          <View style={styles.buttonBoxContainer}>
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
                3권 ~ 5권
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
                6권 ~ 9권
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
                10권 이상
              </ButtonBox>
            </View>
          </View>
        </View>

        <View style={styles.paginationContainer}>
          <View>
            <ButtonBox
              pressButtonIdx={pressButtonIdx}
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
              pressButtonIdx={pressButtonIdx}
              style={styles.buttonBox2}
              disabled={Boolean(pressButtonIdx === null)}
              disabledStyle={
                pressButtonIdx !== null
                  ? styles.disabledStyle
                  : styles.disabledStyle2
              }
              onPress={() =>
                navigate('intro3', {...route.params, reading: pressButtonIdx})
              }
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
    width: '100%',
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
