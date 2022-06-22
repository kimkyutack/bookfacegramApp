import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import RootLayout from '../../layouts/root-layout/RootLayout';
import fonts from '../../libs/fonts';
import colors from '../../libs/colors';
import images from '../../libs/images';
import {
  fontPercentage,
  heightPercentage,
  widthPercentage,
  screenWidth
} from '../../services/util';
import Footer from '../../libs/footer';
import TextWrap from '../../components/text-wrap/TextWrap';

export default function PolicyHome({ route, navigation }) {

  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 300;
  const listRef = useRef();

  return (
    <RootLayout
      topbar={{
        title: '이용약관',
        back: true,
        navigation: navigation,
      }}>
      <ScrollView
        ref={listRef}
        style={styles.root}
        onScroll={event => {
          setContentVerticalOffset(event.nativeEvent.contentOffset.y);
        }}
      >
        <View style={styles.userInfoContainer}>
          <View>
            <TextWrap style={styles.contents}>
              본 약관은 ㈜피씨엔씨가 운영하는 ‘토핑’ 앱 회원으로 가입한 시점부터
              적용되므로 ‘토핑’ 앱 가입 및 서비스 이용전에 반드시 숙지하여
              주시기 바랍니다.
            </TextWrap>
            <TextWrap style={styles.title}>제 1조 목적</TextWrap>
            <TextWrap style={styles.contents}>
              본 약관은 ㈜피씨엔씨(이하 ‘당사’라 함.)가 운영하는 ‘토핑’
              어플리케이션(이하 ‘어플’이라 함.) 서비스 이용과 관련한 제반 사항을
              명확히 규제함으로써, 회원님에 대한 고객 서비스의 증진과 의무, 절차
              등을 명확히 규정함에 목적이 있습니다
            </TextWrap>
            <TextWrap style={styles.title}>
              제 2조 이용약관의 효력 및 변경
            </TextWrap>
            <TextWrap style={styles.contents}>
              1. 당사는 본 약관의 내용을 ‘회원’이 사전에 확인할 수 있도록
              회원가입 단계 페이지에 게시합니다. {'\n'}
              2. 당사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여
              현행 약관과 함께 제1항의 방식에 따라 그 개정약관의 적용일자 7일
              이전부터 적용일 이후 상당한 기간 동안 공지하며, 개정된 약관은 그
              적용 일에 효력이 발생합니다.{'\n'}
              3. 이 약관은 ‘회원’이 이 약관에 동의한 날로부터 회원 탈퇴 시까지
              적용하는 것을 원칙으로 합니다. {'\n'}
            </TextWrap>
            <TextWrap style={styles.title}>제 3조 용어의 정의</TextWrap>
            <TextWrap style={styles.contents}>
              본 약관에서 사용하는 용어의 정의는 아래 각 호와 같습니다. {'\n'}
              1. ‘토핑’ 어플이란 당사가 회원을 위해 제공하는 인공지능 기반의
              개인 맞춤 도서 추천 및 독후활동을 할 수 있는 독서 서비스입니다.
              {'\n'}
              2. ‘회원’이란 이 약관에서 당사의 회원가입 절차에 따라 ‘토핑’
              어플에 회원가입을 하여 독서 서비스를 이용할 수 있는 자를 말합니다.
              {'\n'}
              3. ‘소셜회원’이란 SNS나 포털 사이트의 계정을 이용해 ‘토핑’ 어플
              서비스 이용에 동의함으로써 서비스를 이용하는 자를 말합니다. {'\n'}
              4. ‘아이디(ID)’이란 회원의 식별과 서비스 이용을 위하여 회원이
              정하고 당사가 승인하는 영문, 숫자, 특수문자 등의 조합으로 이루어진
              정보를 말합니다. {'\n'}
              5. ‘비밀번호’란 회원이 부여받은 아이디(ID)와 일치되는 회원임을
              확인하고 회원의 비밀보호를 위해 회원 자신이 정한 영문, 숫자,
              특수문자 등의 조합을 말합니다. {'\n'}
              6. ‘피드북’이란 회원이 카메라 촬영을 통해 도서의 표지를
              업로드하고, 이를 공유할 수 있는 커뮤니티 공간을 의미합니다.{'\n'}
              7. ‘책서랍’이란 회원이 서비스를 이용하는 과정에서 도서 정보를
              저장한 가상의 공간을 의미합니다. {'\n'}
              8. ‘토핑톡’이란 회원이 작성한 도서에 대한 감상 및 별점을
              의미합니다. {'\n'}
              9. ‘게시물’이란 회원이 당사의 서비스를 이용함에 있어 서비스 상에
              게시한 부호, 문자, 글, 사진, 동영상 등을 의미합니다. {'\n'}
            </TextWrap>
            <TextWrap style={styles.title}>제 4조 이용계약의 체결</TextWrap>
            <TextWrap style={styles.contents}>
              1. 이용계약은 토핑 어플의 회원이 되고자 하는 자가 약관 내용에 대해
              동의 후 회원가입을 신청하고 당사가 이를 승낙함으로써 체결됩니다.{' '}
              {'\n'}
              2. 토핑은 다음 각 호에 해당하는 신청에 대하여는 가입 신청을
              거절하거나 취소할 수 있습니다. {'\n'}
              ㄱ.실명이 아니거나 타인의 명의를 이용하여 신청한 경우{'\n'}
              ㄴ.가입 내용이 허위이거나 미비한 경우 {'\n'}
              ㄷ.기타 규정한 제반 사항을 위반하며 신청하는 경우{'\n'}
              3. 이용계약의 성립 시기는 회원이 가입절차를 완료하여 최종 제출한
              시점부터로 합니다.{'\n'}
            </TextWrap>
            <TextWrap style={styles.title}>
              제 5조 회원탈퇴 및 이용계약의 해지
            </TextWrap>
            <TextWrap style={styles.contents}>
              1. 회원은 회원탈퇴를 통해 언제든지 서비스 이용계약 해지를 요청할
              수 있으며, 관련 정책에 따라 즉시 회원 탈퇴 처리를 합니다. 또한
              관련 법령 및 개인정보 처리방침 내 명시된 경우를 제외하고 해지 즉시
              개인정보를 삭제합니다.{'\n'}
              2. 당사는 회원이 다음 각 호의 사유에 해당하는 경우, 회원탈퇴를
              시킬 수 있습니다. {'\n'}
              ㄱ.다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 경우
              {'\n'}
              ㄴ.타인의 정보 등 부정한 방법으로 가입한 것이 확인된 경우{'\n'}
              ㄷ.당사 또는 제3자의 명예를 손상시키거나 업무를 방해하는 경우
              {'\n'}
              ㄹ.당사가 제공하는 서비스를 정상적인 용도 이외 또는 부당한
              방법으로 이용하는 경우{'\n'}
            </TextWrap>
            <TextWrap style={styles.title}>
              제 6조 정보의 제공 및 광고의 게재
            </TextWrap>
            <TextWrap style={styles.contents}>
              1. 당사는 서비스 운영과 관련하여 광고를 게재할 수 있습니다. 회원은
              서비스 이용 시 노출되는 맞춤 광고 게재에 대해 동의합니다.{'\n'}
              2. 당사는 서비스 이용 중 필요하다고 인정되는 다양한 정보를
              공지사항 등의 방법으로 회원에게 제공할 수 있고, 회원의 사전 동의를
              얻은 경우 문자, 이메일 등의 방법으로 제공할 수 있습니다. 다만,
              회원은 언제든지 어플 설정 메뉴를 통해 문자, 이메일, 팝업 메시지를
              수신거절 할 수 있습니다. {'\n'}
            </TextWrap>
            <TextWrap style={styles.title}>제 7조 회원에 대한 통지</TextWrap>
            <TextWrap style={styles.contents}>
              1. 당사는 회원에게 알려야 할 사항이 있는 경우 회원이 공개한
              연락처, 이메일 주소 등을 통해 개별 통지를 하거나, 어플 내의 팝업
              메시지를 통해 통지할 수 있습니다. 단, 회원이 어플을 삭제하거나
              이용하지 않는 상황 등으로 인하여 개별 통지가 어려운 경우에는
              공지사항에 게시함으로써 개별 통지를 갈음할 수 있습니다. {'\n'}
              2. 당사는 회원 전체에 대한 통지의 경우 7일 이상 어플 내 공지사항
              게시판에 게시함으로써 전항의 개별 통지를 갈음 할 수 있습니다.{' '}
              {'\n'}
            </TextWrap>
            <TextWrap style={styles.title}>부칙</TextWrap>
            <TextWrap style={styles.contents}>
              1. 본 약관은 2022년 1월 1일부터 시행합니다.{'\n'}
            </TextWrap>
          </View>
        </View>
      </ScrollView>
      {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
        <TouchableOpacity
          onPress={() => {
            listRef.current.scrollTo({ animated: true, offset: 0 });
          }}
          style={styles.topButton}>
          <Image source={images.scrollTop} style={styles.scrolltotop} />
        </TouchableOpacity>
      )}
      <Footer page={'home'} />
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#f9f9f9',
  },
  userInfoContainer: {
    alignItems: 'center',
    marginVertical: heightPercentage(30),
    backgroundColor: '#fff',
    paddingHorizontal: widthPercentage(10),
    paddingVertical: heightPercentage(15),
    marginHorizontal: widthPercentage(20),
  },
  title: {
    marginTop: heightPercentage(33),
    marginBottom: heightPercentage(5),
    fontWeight: 'bold',
    fontSize: fontPercentage(15),
  },
  contents: {
    fontSize: fontPercentage(13),
  },
  scrolltotop: {
    width: widthPercentage(35),
    height: heightPercentage(35),
    resizeMode: 'contain',
  },
  topButton: {
    alignItems: 'center',
    width: widthPercentage(35),
    height: heightPercentage(35),
    position: 'absolute',
    bottom: heightPercentage(65),
    left: screenWidth / 2.2,
    display: 'flex',
  },
});
