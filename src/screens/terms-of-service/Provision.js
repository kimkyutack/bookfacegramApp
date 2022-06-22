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

export default function Provision({ route, navigation }) {

  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 300;
  const listRef = useRef();

  return (
    <RootLayout
      topbar={{
        title: '개인정보처리방침',
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
            <TextWrap style={styles.title2}>
              1. 개인정보의 수집 및 이용 목적
            </TextWrap>
            <TextWrap style={styles.contents}>
              ㈜피씨엔씨가 운영하는 ‘토핑’ 앱 서비스는 다음의 목적을 위해
              개인정보를 수집·이용합니다. 수집한 개인정보는 다음의 목적 이외의
              용도로는 사용되지 않으며, 이용 목적이 변경되는 경우에는 별도의
              동의를 받는 등 필요한 조치를 이행할 예정입니다.{'\n'}
              {'\n'}- 본인 식별·인증, 회원자격 유지·관리, 각종 고지·통지 등을
              목적으로 개인정보를 이용합니다.{'\n'}- 콘텐츠 제공, 서비스 개선을
              위한 이용자의 관심 및 패턴 등의 추정에 따른 맞춤형 컨텐츠 추천
              등을 목적으로 개인정보를 이용합니다. {'\n'}- 토핑스토어에 등록된
              상품의 결제, 환불 등의 관리를 목적으로 개인정보를 이용합니다.{' '}
              {'\n'}- 이벤트 정보 및 광고성 정보 제공 등 마케팅 및 프로모션,
              접속 빈도 파악 등을 목적으로 개인정보를 이용합니다. {'\n'}
              {'\n'}
              이용자는 위 개인정보의 수집 및 이용을 반드시 동의해야 하며
              개인정보의 수집 및 이용을 거부할 경우 서비스 이용이 어렵습니다.{' '}
              {'\n'}
            </TextWrap>
            <TextWrap style={styles.title}>
              2. 개인정보 수집 항목 및 방법
            </TextWrap>
            <TextWrap style={styles.contents}>
              ㈜피씨엔씨가 운영하는 ‘토핑’ 앱 서비스는 회원가입 및 서비스 제공을
              위해 필요한 최소한의 개인정보를 수집하고 있습니다. {'\n'}
              {'\n'}
              개인정보 수집 항목은 아래와 같습니다. {'\n'}- 일반 회원가입 :
              이름, 아이디, 비밀번호, 핸드폰 번호, 이메일 주소, 암호화된 이용자
              확인 값(CI), 중복가입확인정보(DI){'\n'}- 토핑 회원가입 : 로그인
              정보 식별 값, 토핑 웹 아이디, 토핑 웹 비밀번호, 이름, 핸드폰 번호,
              이메일 주소{'\n'}- 카카오톡 회원가입 : 로그인 정보 식별 값, 카카오
              계정(이메일 주소), 필명, 카카오톡 프로필 사진{'\n'}- 네이버
              회원가입 : 로그인 정보 식별 값, 필명, 네이버 계정(이메일 주소),
              네이버 프로필 사진{'\n'}- 페이스북 회원가입 : 로그인 정보 식별 값,
              필명, 페이스북 계정(이메일 주소), 페이스북 프로필 사진{'\n'}- 구글
              회원가입 : 로그인 정보 식별 값, 필명, 구글 계정(이메일 주소), 구글
              프로필 사진{'\n'}- Apple 회원가입 : 로그인 정보 식별 값, Apple
              계정(이메일 주소), 필명{'\n'}
              {'\n'}
              개인정보 수집 방법은 아래와 같습니다. {'\n'}
              회원가입 또는 서비스 이용 시 개인정보수집 항목에 동의를 하면
              개인정보 수집에 대해 동의한 것으로 봅니다. 이를 위해 당사는
              개인정보를 수집하는 경우, 반드시 사전에 이용자에게 해당 사실을
              알리고 동의를 구하고 있으며, 아래의 방법을 통해 개인정보를
              수집합니다.{'\n'}
              {'\n'}- 회원가입 과정에서 이용자가 개인정보 수집에 대해 동의를
              하고 직접 입력하는 경우{'\n'}- 온·오프라인 이벤트에서 진행되는
              이벤트 등 참여{'\n'}
              {'\n'}
              또한, 서비스 이용 과정에서 아래와 같은 정보들이 자동으로 생성되어
              수집될 수 있습니다.{'\n'}- 모바일 기기 이용 시 단말기 식별번호,
              단말 OS 정보{'\n'}- 도서 선택, 독후활동 등 도서 추천 서비스를 위한
              데이터{'\n'}- 유료서비스 이용 시 발생한 구매/결제/취소/환불 내역
              {'\n'}
            </TextWrap>
            <TextWrap style={styles.title}>
              3. 개인정보의 보유 및 이용 기간
            </TextWrap>
            <TextWrap style={styles.contents}>
              ㈜피씨엔씨가 운영하는 ‘토핑’ 앱 서비스는 법령에 따른 개인정보 보유
              및 이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은
              개인정보 보유, 이용기간 내에서 개인정보를 처리, 보유합니다. {'\n'}
              {'\n'}
              이용자의 개인정보는 개인정보의 수집 목적 또는 제공받은 목적이
              달성되면 즉시 파기하는 것을 목적으로 합니다. 단, 다음의 정보에
              대해서는 아래의 사유로 명시한 기간 동안 보존합니다.{'\n'}
              {'\n'}· 회원 서비스 이용에 대한 근거자료{'\n'}- 보유정보 :
              아이디(ID), 이름, 이메일, 본인확인정보(di, 사회보장번호), 최종
              로그인 일시{'\n'}- 보유근거 : 정보주체 동의{'\n'}- 보유기간 : 탈퇴
              시{'\n'}
            </TextWrap>
            <TextWrap style={styles.title}>4. 개인정보의 파기</TextWrap>
            <TextWrap style={styles.contents}>
              ㈜피씨엔씨가 운영하는 ‘토핑’ 앱 서비스는 귀중한 이용자의
              개인정보를 안전하게 처리하며, 유출의 방지를 위하여 다음과 같은
              방법을 통하여 개인정보를 파기합니다.{'\n'}
              {'\n'}
              이용자가 제공한 정보는 목적이 달성된 후 별도의 DB로 옮겨져 내부
              방침 및 기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간
              저장된 후 파기됩니다. 별도 DB로 옮겨진 개인정보는 법률에 의한
              경우가 아니고서는 보유 목적 이외의 다른 목적으로 이용되지
              않습니다.{'\n'}
              {'\n'}
              전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적
              방법을 사용하여 삭제하며, 종이에 출력된 개인정보는 분쇄기로
              분쇄하거나 소각을 통하여 파기합니다.{'\n'}
              {'\n'}
              개인정보의 보유기간이 경과된 경우에는 보유기간의 종료일로부터 5일
              이내, 개인정보의 처리 목적 달성, 해당 서비스의 폐지, 사업의 종료
              등 그 개인정보가 불필요하게 되었을 때에는 개인정보의 처리가
              불필요한 것으로 인정되는 날로부터 5일 이내에 그 개인정보를
              파기합니다.{'\n'}
              {'\n'}
              또한 이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수
              있으며, 수집 및 이용에 대한 동의 철회(회원탈퇴)를 요청할 수
              있습니다. {'\n'}
              {'\n'}· 개인정보 조회 및 수정{'\n'}- 서비스 내 ‘개인정보수정’
              메뉴에서 자신의 개인정보를 조회하거나 수정할 수 있습니다. 처리가
              완료될 때까지 해당 정보를 이용하거나 타인에게 제공하지 않습니다.
              {'\n'}
              {'\n'}· 개인정보 수집 동의 철회(회원탈퇴){'\n'}- 서비스 내
              ‘개인정보수정’ 메뉴에서 계정 &gt; 회원탈퇴를 통해 탈퇴를 할 수
              있습니다.{'\n'}
            </TextWrap>
            <TextWrap style={styles.title}>5. 개인정보 자동수집</TextWrap>
            <TextWrap style={styles.contents}>
              당사는 온라인 맞춤형 광고 등 이용자에게 최적화된 맞춤형 서비스 및
              혜택을 제공하기 위하여 이용자의 ADID(Android OS)/IDFA(iOS) 모바일
              앱 이용자의 광고 식별 값을 수집할 수 있습니다. {'\n'}
              {'\n'}· 수집 방법 및 보유/이용 기간{'\n'}- 이용자의 앱 방문 시
              자동 수집하며 수집일로부터 1년간 보유/이용합니다. {'\n'}
              {'\n'}· 이용자 통제권 행사 방법{'\n'}- Android : 설정 &gt;
              구글(구글설정) &gt; 광고 &gt; 광고 맞춤설정 선택 해제{'\n'}- iOS :
              설정 &gt; 개인정보보호 &gt; 광고 &gt; 광고 추적 제한{'\n'}
            </TextWrap>
            <TextWrap style={styles.title}>
              6. 개인정보 관련 기술적, 관리적 대책
            </TextWrap>
            <TextWrap style={styles.contents}>
              당사는 개인정보를 처리함에 있어 개인정보가 분실, 도난, 누출, 변조
              또는 훼손되지 않도록 안전성 확보를 위하여 기술적, 관리적, 물리적
              조치를 강구하고 있습니다.{'\n'}
              {'\n'}· 기술적 대책{'\n'}– 암호화(encryption)를 이용하여
              개인정보를 안전하게 전송할 수 있는 보안장치{'\n'}– 기타 안전성
              확보를 위하여 필요한 기술적 장치 등{'\n'}
              {'\n'}· 관리적 대책{'\n'}- 개인정보에 대한 접근권한을 부여하고
              이를 확인할 수 있는 절차{'\n'}– 사용자의 개인정보를 처리하는
              시스템의 담당자를 지정하여 비밀번호를 부여하고 보안을 유지함{'\n'}
              – 개인정보의 안전한 처리를 위하여 내부관리계획을 수립 및 시행
              {'\n'}– 통신 관리를 위하여 온라인 회선과 설비상태에 대한 정기 점검
              및 점검 결과를 기록/유지하는 절차 등{'\n'}– 개인정보 보호에 대한
              정기적인 사내 교육 실시 등 {'\n'}
              {'\n'}
              회원 ID나 비밀번호에 대한 보안 유지는 개인정보의 보호를 위해 매우
              중요한 사항이며 회원 ID와 비밀번호의 보안유지 책임은 해당 회원
              본인에게 있습니다. 당사에서는 어떠한 경우에도 회원에게 직접적으로
              비밀번호를 질문하지는 않기 때문에 회원 여러분은 타인에게
              비밀번호가 유출되지 않도록 각별히 유의하셔야 합니다.{'\n'}
            </TextWrap>
            <TextWrap style={styles.title}>7. 개인정보 보호책임자</TextWrap>
            <TextWrap style={styles.contents}>
              서비스를 이용하시는 과정에서 발생하는 모든 개인정보보호 관련 문의,
              불만처리는 개인정보 보호책임자에게 연락해 주시기 바랍니다. 당사는
              이용자들의 목소리에 대해 신속하고 충분한 답변을 드릴 것입니다.
              {'\n'}
              {'\n'}· ㈜피씨엔씨, 02-2281-3322,{'\n'} pcncrekr@pcnc.dooray.com
              {'\n'}
            </TextWrap>
            <TextWrap style={styles.title}>
              8. 개인정보처리 정책 변경에 따른 고지
            </TextWrap>
            <TextWrap style={styles.contents}>
              본 개인정보처리방침은 관련 법률 및 정부 지침의 변경과 당사의 내부
              정책 변경에 의하여 수시로 변경될 수 있습니다. 당사의
              개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경
              내용의 추가, 삭제 및 정정이 있는 경우에는 가능한 변경사항의 시행
              7일 전부터 공지사항 또는 개별공지를 통하여 고지할 것입니다. {'\n'}
              {'\n'}· 고지일자: 2022년 1월 1일 {'\n'}· 시행일자: 2022년 1월 1일{' '}
              {'\n'}
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
  title2: {
    marginBottom: heightPercentage(5),
    fontWeight: 'bold',
    fontSize: fontPercentage(15),
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
