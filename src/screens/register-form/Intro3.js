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
  dialogError,
  dialogOpenMessage,
  dialogOpenAction,
} from '../../redux/dialog/DialogActions';

export default function Intro3({route, navigation}) {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const user = useSelector(s => s.user, shallowEqual);
  const [pressButtonArr, setPressButtonArr] = useState([]);
  const [loading, setLoading] = useState(false);

  const pressButton = e => {
    if (pressButtonArr.indexOf(e) === -1) {
      setPressButtonArr([...pressButtonArr, e]);
    } else {
      setPressButtonArr(pressButtonArr.filter(item => item !== e));
    }
  };

  const handleInfoRegister = async () => {
    if (pressButtonArr.length <= 2) {
      dispatch(
        dialogOpenMessage({message: '관신분야를 3개 이상 선택해주세요.'}),
      );
      return;
    } else {
      try {
        setLoading(true);
        const update = await requestGet({
          url: consts.apiUrl + '/memberIntro',
          query: {
            member_id: user.member_id,
            platform_type: await getItem('platformType'),
            grade: route.params.grade * 1,
            interest_field: pressButtonArr.toString(),
            avg_reading_month: route.params.reading * 1,
          },
        });
        if (update.valid) {
          setLoading(false);
          reset(routes.home);
        } else {
          setLoading(false);
          dispatch(dialogOpenMessage({message: 'info update failed'}));
        }
      } catch (error) {
        setLoading(false);
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
        contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
        <TextWrap
          font={fonts.barlowRegular}
          fontStyle={styles.buttonBox}
          style={styles.headerTitle}>
          관심있는 분야는?
        </TextWrap>
        <TextWrap
          font={fonts.barlowRegular}
          fontStyle={styles.buttonBox}
          style={[styles.head, styles.buttonBoxParagraph]}>
          나(자녀)는 어떤 분야를 좋아하는지 알려주세요.
        </TextWrap>
        <TextWrap
          font={fonts.barlowRegular}
          fontStyle={styles.buttonBox}
          style={styles.headCheck}>
          *3개 선택
        </TextWrap>
        <View style={styles.buttonBoxContainer}>
          <View style={styles.buttonBoxRow}>
            {/* 1은 유야기 제외 */}
            <ButtonBox
              grade={'소설'}
              pressButtonArr={pressButtonArr}
              style={styles.buttonBox}
              fontStyle={styles.buttonBox}
              // onPress={() => setPressButtonArr([...pressButtonArr, '소설'])}>
              onPress={() => pressButton('소설')}>
              소설
            </ButtonBox>
          </View>
          <View style={styles.buttonBoxRow}>
            <ButtonBox
              grade={'시'}
              pressButtonArr={pressButtonArr}
              style={styles.buttonBox}
              fontStyle={styles.buttonBox}
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
              fontStyle={styles.buttonBox}
              onPress={() => pressButton('에세이')}>
              에세이
            </ButtonBox>
          </View>
          <View style={styles.buttonBoxRow}>
            <ButtonBox
              grade={'인문학'}
              pressButtonArr={pressButtonArr}
              style={styles.buttonBox}
              fontStyle={styles.buttonBox}
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
              fontStyle={styles.buttonBox}
              onPress={() => pressButton('역사')}>
              역사
            </ButtonBox>
          </View>
          <View style={styles.buttonBoxRow}>
            <ButtonBox
              grade={'수학'}
              pressButtonArr={pressButtonArr}
              style={styles.buttonBox}
              fontStyle={styles.buttonBox}
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
              fontStyle={styles.buttonBox}
              onPress={() => pressButton('과학')}>
              과학
            </ButtonBox>
          </View>
          <View style={styles.buttonBoxRow}>
            <ButtonBox
              grade={'사회'}
              pressButtonArr={pressButtonArr}
              style={styles.buttonBox}
              fontStyle={styles.buttonBox}
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
              fontStyle={styles.buttonBox}
              onPress={() => pressButton('경제')}>
              경제
            </ButtonBox>
          </View>
          <View style={styles.buttonBoxRow}>
            <ButtonBox
              grade={'정치'}
              pressButtonArr={pressButtonArr}
              style={styles.buttonBox}
              fontStyle={styles.buttonBox}
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
              fontStyle={styles.buttonBox}
              onPress={() => pressButton('운동')}>
              운동
            </ButtonBox>
          </View>
          <View style={styles.buttonBoxRow}>
            <ButtonBox
              grade={'자기계발'}
              pressButtonArr={pressButtonArr}
              style={styles.buttonBox}
              fontStyle={styles.buttonBox}
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
              fontStyle={styles.buttonBox}
              onPress={() => pressButton('만들기')}>
              만들기
            </ButtonBox>
          </View>
          <View style={styles.buttonBoxRow}>
            <ButtonBox
              grade={'외국어'}
              pressButtonArr={pressButtonArr}
              style={styles.buttonBox}
              fontStyle={styles.buttonBox}
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
              fontStyle={styles.buttonBox}
              onPress={() => pressButton('여행')}>
              여행
            </ButtonBox>
          </View>
          <View style={styles.buttonBoxRow}>
            <ButtonBox
              grade={'만화'}
              pressButtonArr={pressButtonArr}
              style={styles.buttonBox}
              fontStyle={styles.buttonBox}
              onPress={() => pressButton('만화')}>
              만화
            </ButtonBox>
          </View>
        </View>

        <View style={styles.paginationContainer}>
          <View>
            <ButtonBox
              pressButtonArr={pressButtonArr}
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
              pressButtonArr={pressButtonArr}
              style={styles.buttonBox2}
              disabled={pressButtonArr.length === 0}
              disabledStyle={
                pressButtonArr.length > 0
                  ? styles.disabledStyle
                  : styles.disabledStyle2
              }
              onPress={handleInfoRegister}
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
    // flex: 1,
    marginVertical: 4,
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
