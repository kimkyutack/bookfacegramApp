import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CheckBox from '../../components/check-box/CheckBox';
import TextWrap from '../../components/text-wrap/TextWrap';
import InputWrap from '../../components/input-wrap/InputWrap';
import fonts from '../../libs/fonts';
import colors from '../../libs/colors';
import routes from '../../libs/routes';
import {navigate} from '../../services/navigation';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../services/util';

export default function Policy({
  agree,
  onAgreeChange,
  term,
  setTerm,
  privacy,
  setPrivacy,
  allowEmail,
  setAllowEmail,
  sms,
  setSms,
  appPush,
  setAppPush,
}) {
  useEffect(() => {
    if (term && privacy) {
      onAgreeChange(true);
    } else if (
      (!term || !privacy || !allowEmail || !sms || !appPush) &&
      agree
    ) {
      onAgreeChange(false);
    }
  }, [term, privacy, allowEmail, sms, appPush]);

  const handleChange = set => v => {
    set(v);
  };
  return (
    <View style={styles.root}>
      <CheckBox
        style={styles.cb2}
        label="전체동의(선택항목 포함)"
        labelStyle={styles.label}
        checked={term && privacy && allowEmail && sms && appPush}
        onCheckedChange={v => {
          setTerm(v);
          setAllowEmail(v);
          setPrivacy(v);
          setSms(v);
          setAppPush(v);
        }}
      />
      <CheckBox
        style={styles.cb}
        label={
          <>
            <TextWrap
              font={fonts.kopubWorldDotumProMedium}
              style={styles.label}>
              이용약관 동의
            </TextWrap>
            <TextWrap
              font={fonts.kopubWorldDotumProMedium}
              style={styles.labelRequire}>
              (필수)
            </TextWrap>
          </>
        }
        labelStyle={styles.label}
        checked={term}
        onCheckedChange={handleChange(setTerm)}
      />
      <InputWrap
        style={styles.input}
        inputStyle={styles.valueStyle}
        // inputFlex={{flex: 1}}
        value={
          '본 약관은 ㈜피씨엔씨가 운영하는 ‘토핑’ 앱 회원으로 가입한 시점부터 적용되므로 ‘토핑’ 앱 가입 및 서비스 이용전에 반드시 숙지하여 주시기 바랍니다.\n\n제 1조 목적\n본 약관은 ㈜피씨엔씨(이하 ‘당사’라 함.)가 운영하는 ‘토핑’ 어플리케이션(이하 ‘어플’이라 함.) 서비스 이용과 관련한 제반 사항을 명확히 규제함으로써, 회원님에 대한 고객 서비스의 증진과 의무, 절차 등을 명확히 규정함에 목적이 있습니다.\n\n제 2조 이용약관의 효력 및 변경\n1. 당사는 본 약관의 내용을 ‘회원’이 사전에 확인할 수 있도록 회원가입 단계 페이지에 게시합니다.\n 2. 당사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행 약관과 함께 제1항의 방식에 따라 그 개정약관의 적용일자 7일 이전부터 적용일 이후 상당한 기간 동안 공지하며, 개정된 약관은 그 적용 일에 효력이 발생합니다.\n3. 이 약관은 ‘회원’이 이 약관에 동의한 날로부터 회원 탈퇴 시까지 적용하는 것을 원칙으로 합니다.\n\n제 3조 용어의 정의\n본 약관에서 사용하는 용어의 정의는 아래 각 호와 같습니다. \n1. ‘토핑’ 어플이란 당사가 회원을 위해 제공하는 인공지능 기반의 개인 맞춤 도서 추천 및 독후활동을 할 수 있는 독서 서비스입니다. \n2. ‘회원’이란 이 약관에서 당사의 회원가입 절차에 따라 ‘토핑’ 어플에 회원가입을 하여 독서 서비스를 이용할 수 있는 자를 말합니다. \n3. ‘소셜회원’이란 SNS나 포털 사이트의 계정을 이용해 ‘토핑’ 어플 서비스 이용에 동의함으로써 서비스를 이용하는 자를 말합니다. \n4. ‘아이디(ID)’이란 회원의 식별과 서비스 이용을 위하여 회원이 정하고 당사가 승인하는 영문, 숫자, 특수문자 등의 조합으로 이루어진 정보를 말합니다. \n5. ‘비밀번호’란 회원이 부여받은 아이디(ID)와 일치되는 회원임을 확인하고 회원의 비밀보호를 위해 회원 자신이 정한 영문, 숫자, 특수문자 등의 조합을 말합니다. \n6. ‘피드북’이란 회원이 카메라 촬영을 통해 도서의 표지를 업로드하고, 이를 공유할 수 있는 커뮤니티 공간을 의미합니다. \n7. ‘책서랍’이란 회원이 서비스를 이용하는 과정에서 도서 정보를 저장한 가상의 공간을 의미합니다. \n8. ‘토핑톡’이란 회원이 작성한 도서에 대한 감상 및 별점을 의미합니다. \n9. ‘게시물’이란 회원이 당사의 서비스를 이용함에 있어 서비스 상에 게시한 부호, 문자, 글, 사진, 동영상 등을 의미합니다.\n\n 제 4조 이용계약의 체결\n1. 이용계약은 토핑 어플의 회원이 되고자 하는 자가 약관 내용에 대해 동의 후 회원가입을 신청하고 당사가 이를 승낙함으로써 체결됩니다. \n2. 토핑은 다음 각 호에 해당하는 신청에 대하여는 가입 신청을 거절하거나 취소할 수 있습니다.\n   가.실명이 아니거나 타인의 명의를 이용하여 신청한 경우\n   나.가입 내용이 허위이거나 미비한 경우\n   다.기타 규정한 제반 사항을 위반하며 신청하는 경우\n3. 이용계약의 성립 시기는 회원이 가입절차를 완료하여 최종 제출한 시점부터로 합니다.\n\n제 5조 회원탈퇴 및 이용계약의 해지\n1. 회원은 회원탈퇴를 통해 언제든지 서비스 이용계약 해지를 요청할 수 있으며, 관련 정책에 따라 즉시 회원 탈퇴 처리를 합니다. 또한 관련 법령 및 개인정보 처리방침 내 명시된 경우를 제외하고 해지 즉시 개인정보를 삭제합니다.\n2. 당사는 회원이 다음 각 호의 사유에 해당하는 경우, 회원탈퇴를 시킬 수 있습니다. \n   가.다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 경우\n   나.타인의 정보 등 부정한 방법으로 가입한 것이 확인된 경우\n   다.당사 또는 제3자의 명예를 손상시키거나 업무를 방해하는 경우\n   라.당사가 제공하는 서비스를 정상적인 용도 이외 또는 부당한 방법으로 이용하는 경우\n\n제 6조 정보의 제공 및 광고의 게재\n1. 당사는 서비스 운영과 관련하여 광고를 게재할 수 있습니다. 회원은 서비스 이용 시 노출되는 맞춤 광고 게재에 대해 동의합니다.\n2. 당사는 서비스 이용 중 필요하다고 인정되는 다양한 정보를 공지사항 등의 방법으로 회원에게 제공할 수 있고, 회원의 사전 동의를 얻은 경우 문자, 이메일, 푸쉬알람 등의 방법으로 제공할 수 있습니다. 다만, 회원은 언제든지 어플 설정 메뉴를 통해 문자, 이메일, 팝업 메시지를 수신거절 할 수 있습니다. \n\n제 7조 회원에 대한 통지\n1. 당사는 회원에게 알려야 할 사항이 있는 경우 회원이 공개한 연락처, 이메일 주소 등을 통해 개별 통지를 하거나, 어플 내의 팝업 메시지를 통해 통지할 수 있습니다. 단, 회원이 어플을 삭제하거나 이용하지 않는 상황 등으로 인하여 개별 통지가 어려운 경우에는 공지사항에 게시함으로써 개별 통지를 갈음할 수 있습니다. \n2. 당사는 회원 전체에 대한 통지의 경우 7일 이상 어플 내 공지사항 게시판에 게시함으로써 전항의 개별 통지를 갈음 할 수 있습니다. \n\n부칙\n1. 본 약관은 2022년 1월 1일부터 시행합니다..\n\n'
        }
        borderColor={colors.border}
        multiline
        secure
        showSoftInputOnFocus={false}
      />
      <CheckBox
        style={styles.cb}
        // border
        label={
          <>
            <TextWrap font={fonts.kopubWorldDotumProLight} style={styles.label}>
              개인정보 수집·이용 동의
            </TextWrap>
            <TextWrap
              font={fonts.kopubWorldDotumProLight}
              style={styles.labelRequire}>
              (필수)
            </TextWrap>
          </>
        }
        labelStyle={styles.label}
        checked={privacy}
        onCheckedChange={handleChange(setPrivacy)}
      />
      <InputWrap
        style={styles.input}
        inputStyle={styles.valueStyle}
        // inputFlex={{flex: 1}}
        value={
          '1. 개인정보의 수집 및 이용 목적\n㈜피씨엔씨가 운영하는 ‘토핑’ 앱 서비스는 다음의 목적을 위해 개인정보를 수집·이용합니다. 수집한 개인정보는 다음의 목적 이외의 용도로는 사용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.\n\n- 본인 식별·인증, 회원자격 유지·관리, 각종 고지·통지 등을 목적으로 개인정보를 이용합니다.\n- 콘텐츠 제공, 서비스 개선을 위한 이용자의 관심 및 패턴 등의 추정에 따른 맞춤형 컨텐츠 추천 등을 목적으로 개인정보를 이용합니다. \n- 토핑스토어에 등록된 상품의 결제, 환불 등의 관리를 목적으로 개인정보를 이용합니다. \n- 이벤트 정보 및 광고성 정보 제공 등 마케팅 및 프로모션, 접속 빈도 파악 등을 목적으로 개인정보를 이용합니다. \n\n이용자는 위 개인정보의 수집 및 이용을 반드시 동의해야 하며 개인정보의 수집 및 이용을 거부할 경우 서비스 이용이 어렵습니다. \n\n2. 개인정보 수집 항목 및 방법\n㈜피씨엔씨가 운영하는 ‘토핑’ 앱 서비스는 회원가입 및 서비스 제공을 위해 필요한 최소한의 개인정보를 수집하고 있습니다. \n\n개인정보 수집 항목은 아래와 같습니다. \n- 일반 회원가입 : 이름, 아이디, 비밀번호, 핸드폰 번호, 이메일 주소, 암호화된 이용자 확인 값(CI), 중복가입확인정보(DI)\n- 토핑 회원가입 : 로그인 정보 식별 값, 토핑 웹 아이디, 토핑 웹 비밀번호, 이름, 핸드폰 번호, 이메일 주소\n- 카카오톡 회원가입 : 로그인 정보 식별 값, 카카오 계정(이메일 주소), 필명, 카카오톡 프로필 사진\n- 네이버 회원가입 : 로그인 정보 식별 값, 필명, 네이버 계정(이메일 주소), 네이버 프로필 사진\n- 구글 회원가입 : 로그인 정보 식별 값, 필명, 구글 계정(이메일 주소), 구글 프로필 사진\n- Apple 회원가입 : 로그인 정보 식별 값, Apple 계정(이메일 주소), 필명\n\n개인정보 수집 방법은 아래와 같습니다. \n회원가입 또는 서비스 이용 시 개인정보수집 항목에 동의를 하면 개인정보 수집에 대해 동의한 것으로 봅니다. 이를 위해 당사는 개인정보를 수집하는 경우, 반드시 사전에 이용자에게 해당 사실을 알리고 동의를 구하고 있으며, 아래의 방법을 통해 개인정보를 수집합니다.\n- 회원가입 과정에서 이용자가 개인정보 수집에 대해 동의를 하고 직접 입력하는 경우\n- 온·오프라인 이벤트에서 진행되는 이벤트 등 참여\n\n또한, 서비스 이용 과정에서 아래와 같은 정보들이 자동으로 생성되어 수집될 수 있습니다.\n- 모바일 기기 이용 시 단말기 식별번호, 단말 OS 정보\n- 도서 선택, 독후활동 등 도서 추천 서비스를 위한 데이터\n- 유료서비스 이용 시 발생한 구매/결제/취소/환불 내역\n\n3. 개인정보의 보유 및 이용 기간\n㈜피씨엔씨가 운영하는 ‘토핑’ 앱 서비스는 법령에 따른 개인정보 보유 및 이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유, 이용기간 내에서 개인정보를 처리, 보유합니다. \n이용자의 개인정보는 개인정보의 수집 목적 또는 제공받은 목적이 달성되면 즉시 파기하는 것을 목적으로 합니다. 단, 다음의 정보에 대해서는 아래의 사유로 명시한 기간 동안 보존합니다.\n· 회원 서비스 이용에 대한 근거자료\n- 보유정보 : 아이디(ID), 이름, 이메일, 휴대전화번호, 최종 로그인 일시\n- 보유근거 : 정보주체 동의\n- 보유기간 : 탈퇴 시\n\n4. 개인정보의 파기\n㈜피씨엔씨가 운영하는 ‘토핑’ 앱 서비스는 귀중한 이용자의 개인정보를 안전하게 처리하며, 유출의 방지를 위하여 다음과 같은 방법을 통하여 개인정보를 파기합니다.이용자가 제공한 정보는 목적이 달성된 후 별도의 DB로 옮겨져 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후 파기됩니다. 별도 DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 보유 목적 이외의 다른 목적으로 이용되지 않습니다.전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.개인정보의 보유기간이 경과된 경우에는 보유기간의 종료일로부터 5일 이내, 개인정보의 처리 목적 달성, 해당 서비스의 폐지, 사업의 종료 등 그 개인정보가 불필요하게 되었을 때에는 개인정보의 처리가 불필요한 것으로 인정되는 날로부터 5일 이내에 그 개인정보를 파기합니다. 또한 이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 수집 및 이용에 대한 동의 철회(회원탈퇴)를 요청할 수 있습니다. \n\n· 개인정보 조회 및 수정\n- 서비스 내 ‘개인정보수정’ 메뉴에서 자신의 개인정보를 조회하거나 수정할 수 있습니다. 처리가 완료될 때까지 해당 정보를 이용하거나 타인에게 제공하지 않습니다.\n· 개인정보 수집 동의 철회(회원탈퇴)\n- 서비스 내 ‘개인정보수정’ 메뉴에서 계정 > 회원탈퇴를 통해 탈퇴를 할 수 있습니다.\n\n5. 개인정보 자동수집 \n당사는 온라인 맞춤형 광고 등 이용자에게 최적화된 맞춤형 서비스 및 혜택을 제공하기 위하여 이용자의 ADID(Android OS)/IDFA(iOS) 모바일 앱 이용자의 광고 식별 값을 수집할 수 있습니다. \n· 수집 방법 및 보유/이용 기간\n- 이용자의 앱 방문 시 자동 수집하며 수집일로부터 1년간 보유/이용합니다. \n· 이용자 통제권 행사 방법\n- Android : 설정 > 구글(구글설정) > 광고 > 광고 맞춤설정 선택 해제\n- iOS : 설정 > 개인정보보호 > 광고 > 광고 추적 제한\n\n6. 개인정보 관련 기술적, 관리적 대책  \n당사는 개인정보를 처리함에 있어 개인정보가 분실, 도난, 누출, 변조 또는 훼손되지 않도록 안전성 확보를 위하여 기술적, 관리적, 물리적 조치를 강구하고 있습니다.\n· 기술적 대책\n- 암호화(encryption)를 이용하여 개인정보를 안전하게 전송할 수 있는 보안장치\n- 기타 안전성 확보를 위하여 필요한 기술적 장치 등\n\n· 관리적 대책\n- 개인정보에 대한 접근권한을 부여하고 이를 확인할 수 있는 절차\n- 사용자의 개인정보를 처리하는 시스템의 담당자를 지정하여 비밀번호를 부여하고 보안을 유지함\n- 개인정보의 안전한 처리를 위하여 내부관리계획을 수립 및 시행\n- 통신 관리를 위하여 온라인 회선과 설비상태에 대한 정기 점검 및 점검 결과를 기록/유지하는 절차 등\n- 개인정보 보호에 대한 정기적인 사내 교육 실시 등 \n\n회원 ID나 비밀번호에 대한 보안 유지는 개인정보의 보호를 위해 매우 중요한 사항이며 회원 ID와 비밀번호의 보안유지 책임은 해당 회원 본인에게 있습니다. 당사에서는 어떠한 경우에도 회원에게 직접적으로 비밀번호를 질문하지는 않기 때문에 회원 여러분은 타인에게 비밀번호가 유출되지 않도록 각별히 유의하셔야 합니다.\n\n7. 개인정보 보호책임자\n서비스를 이용하시는 과정에서 발생하는 모든 개인정보보호 관련 문의,불만처리는 개인정보 보호책임자에게 연락해 주시기 바랍니다. 당사는 이용자들의 목소리에 대해 신속하고 충분한 답변을 드릴 것입니다.\n· ㈜피씨엔씨, 02-2281-3322, pcncrekr@pcnc.dooray.com\n\n8. 개인정보처리 정책 변경에 따른 고지\n본 개인정보처리방침은 관련 법률 및 정부 지침의 변경과 당사의 내부 정책 변경에 의하여 수시로 변경될 수 있습니다. 당사의 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는 가능한 변경사항의 시행 7일 전부터 공지사항 또는 개별공지를 통하여 고지할 것입니다. \n· 고지일자: 2022년 1월 1일 \n· 시행일자: 2022년 1월 1일 \n\n'}
        borderColor={colors.border}
        multiline
        secure
        showSoftInputOnFocus={false}
      />

      <TextWrap style={styles.label2} font={fonts.kopubWorldDotumProLight}>
        광고 수신 동의
      </TextWrap>
      <CheckBox
        style={styles.cb}
        // border
        label="이메일 수신 동의(선택)"
        labelStyle={styles.label}
        checked={allowEmail}
        onCheckedChange={handleChange(setAllowEmail)}
      />
      <CheckBox
        style={styles.cb}
        label="SMS 수신 동의(선택)"
        labelStyle={styles.label}
        checked={sms}
        onCheckedChange={handleChange(setSms)}
      />
      <CheckBox
        style={styles.cb}
        label="앱PUSH 수신 동의(선택)"
        labelStyle={styles.label}
        checked={appPush}
        onCheckedChange={handleChange(setAppPush)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 32,
    borderBottomColor: '#e6e6e6',
  },
  cb: {
    marginTop: 15,
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(20),
  },
  cb2: {
    marginTop: 15,
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(20),
    paddingBottom: 10,
    borderBottomWidth: 1,
    marginBottom: 8,
    borderBottomColor: '#e6e6e6',
  },
  label: {
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(20),
    color: '#777777',
  },
  label2: {
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(20),
    color: '#777777',
    marginTop: 14,
  },
  labelRequire: {
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(20),
    color: colors.red,
  },
  input: {
    marginVertical: 8,
    height: heightPercentage(70),
  },
  valueStyle: {
    lineHeight: 14,
    fontSize: 12,
    color: colors.black,
    padding: 5,
  },
});
