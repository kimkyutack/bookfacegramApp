import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, ScrollView, TouchableHighlight} from 'react-native';
import ButtonBox from '../../components/button-box/ButtonBox';
import TextWrap from '../../components/text-wrap/TextWrap';
import fonts from '../../libs/fonts';
import colors from '../../libs/colors';
import routes from '../../libs/routes';
import {navigate} from '../../services/navigation';
import RootLayout from '../../layouts/root-layout/RootLayout';

export default function Intro1({route, navigation}) {
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
          몇 학년 인가요?
        </TextWrap>
        <TextWrap
          font={fonts.barlowRegular}
          fontStyle={styles.buttonBox}
          style={[styles.head, styles.buttonBoxParagraph]}>
          나(자녀)는 몇 학년인지 알려주세요.
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
              grade={2}
              pressButtonIdx={pressButtonIdx}
              style={styles.buttonBox}
              fontStyle={styles.buttonBox}
              onPress={() => setPressButtonIdx(2)}>
              유치원
            </ButtonBox>
          </View>
          <View style={styles.buttonBoxRow}>
            <ButtonBox
              grade={3}
              pressButtonIdx={pressButtonIdx}
              style={styles.buttonBox}
              fontStyle={styles.buttonBox}
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
              fontStyle={styles.buttonBox}
              onPress={() => setPressButtonIdx(4)}>
              초등학교 2학년
            </ButtonBox>
          </View>
          <View style={styles.buttonBoxRow}>
            <ButtonBox
              grade={5}
              pressButtonIdx={pressButtonIdx}
              style={styles.buttonBox}
              fontStyle={styles.buttonBox}
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
              fontStyle={styles.buttonBox}
              onPress={() => setPressButtonIdx(6)}>
              초등학교 4학년
            </ButtonBox>
          </View>
          <View style={styles.buttonBoxRow}>
            <ButtonBox
              grade={7}
              pressButtonIdx={pressButtonIdx}
              style={styles.buttonBox}
              fontStyle={styles.buttonBox}
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
              fontStyle={styles.buttonBox}
              onPress={() => setPressButtonIdx(8)}>
              초등학교 6학년
            </ButtonBox>
          </View>
          <View style={styles.buttonBoxRow}>
            <ButtonBox
              grade={9}
              pressButtonIdx={pressButtonIdx}
              style={styles.buttonBox}
              fontStyle={styles.buttonBox}
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
              fontStyle={styles.buttonBox}
              onPress={() => setPressButtonIdx(10)}>
              중학교 2학년
            </ButtonBox>
          </View>
          <View style={styles.buttonBoxRow}>
            <ButtonBox
              grade={11}
              pressButtonIdx={pressButtonIdx}
              style={styles.buttonBox}
              fontStyle={styles.buttonBox}
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
              onPress={() => setPressButtonIdx(12)}
              fontStyle={styles.buttonBox}>
              고등학교 1학년
            </ButtonBox>
          </View>
          <View style={styles.buttonBoxRow} fontStyle={styles.buttonBox} />
        </View>

        <View style={styles.paginationContainer}>
          <View>
            <ButtonBox
              pressButtonIdx={pressButtonIdx}
              style={styles.buttonBox2}
              // onPress={() => setPressButtonIdx(12)}
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
              disabled={pressButtonIdx === null}
              disabledStyle={
                pressButtonIdx !== null
                  ? styles.disabledStyle
                  : styles.disabledStyle2
              }
              onPress={() => navigate('intro2', {grade: pressButtonIdx})}
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
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
    // flex: 1,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonBoxRow: {
    width: '48%',
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
