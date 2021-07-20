import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, ScrollView, TouchableHighlight} from 'react-native';
import ButtonBox from '../../components/button-box/ButtonBox';
import TextWrap from '../../components/text-wrap/TextWrap';
import fonts from '../../libs/fonts';
import colors from '../../libs/colors';
import routes from '../../libs/routes';
import {goBack, navigate} from '../../services/navigation';
import RootLayout from '../../layouts/root-layout/RootLayout';

export default function Intro2({route, navigation}) {
  const scrollRef = useRef();
  const [pressButtonIdx, setPressButtonIdx] = useState(null);

  return (
    <RootLayout style={styles.root}>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
        <TextWrap
          font={fonts.barlowRegular}
          fontStyle={styles.buttonBox}
          style={styles.headerTitle}>
          한 달 평균 독서량은?
        </TextWrap>
        <TextWrap
          font={fonts.barlowRegular}
          fontStyle={styles.buttonBox}
          style={[styles.head, styles.buttonBoxParagraph]}>
          나(자녀)는 한 달 동안 몇 권의 책을 읽고 있는지 알려주세요.
        </TextWrap>
        <TextWrap
          font={fonts.barlowRegular}
          fontStyle={styles.buttonBox}
          style={styles.headCheck}>
          *1개 선택
        </TextWrap>
        <View style={styles.buttonBoxContainer}>
          <View style={styles.buttonBoxRow}>
            {/* 1은 유야기 제외 */}
            <ButtonBox
              grade={0}
              pressButtonIdx={pressButtonIdx}
              style={styles.buttonBox}
              fontStyle={styles.buttonBox}
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
              fontStyle={styles.buttonBox}
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
              fontStyle={styles.buttonBox}
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
              fontStyle={styles.buttonBox}
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
              fontStyle={styles.buttonBox}
              onPress={() => setPressButtonIdx(10)}>
              10권 이상
            </ButtonBox>
          </View>
        </View>

        <View style={styles.paginationContainer}>
          <View>
            <ButtonBox
              pressButtonIdx={pressButtonIdx}
              style={styles.buttonBox2}
              onPress={() => goBack()}
              disabled={route.name === 'intro1' ? true : false}
              disabledStyle={styles.disabledStyle2}
              fontStyle={styles.buttonBox}>
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
              <TextWrap>ㅇ</TextWrap>
            </TouchableHighlight>
            <TouchableHighlight
              style={
                route.name === 'intro2'
                  ? styles.paginationCircleActive
                  : styles.paginationCircle
              }
              underlayColor="#ccc"
              disabled>
              <TextWrap>ㅇ</TextWrap>
            </TouchableHighlight>
            <TouchableHighlight
              style={
                route.name === 'intro3'
                  ? styles.paginationCircleActive
                  : styles.paginationCircle
              }
              underlayColor="#ccc"
              disabled>
              <TextWrap>ㅇ</TextWrap>
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
              fontStyle={styles.buttonBox}>
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
    backgroundColor: colors.border,
    paddingVertical: 30,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.black,
    alignSelf: 'flex-start',
  },
  head: {
    color: colors.black,
    fontSize: 14,
    marginTop: 20,
  },
  headCheck: {
    marginTop: 10,
    color: colors.prussianBlue,
    fontSize: 12,
    top: -10,
  },
  buttonBoxContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonBoxRow: {
    width: '100%',
  },
  buttonBox: {
    color: colors.black,
  },
  buttonBoxParagraph: {
    fontWeight: '700',
  },
  buttonBox2: {
    color: colors.black,
    backgroundColor: 'transparent',
  },
  paginationContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    width: 10,
    height: 10,
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationCircle: {
    marginHorizontal: 2,
    borderRadius: 10,
    width: 10,
    height: 10,
    backgroundColor: '#cecece',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
