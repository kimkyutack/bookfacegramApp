import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CheckBox from '../../components/check-box/CheckBox';
import TextWrap from '../../components/text-wrap/TextWrap';
import InputWrap from '../../components/input-wrap/InputWrap';
import fonts from '../../libs/fonts';
import colors from '../../libs/colors';
import routes from '../../libs/routes';
import {navigate} from '../../services/navigation';

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
        bold
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
            <TextWrap font={fonts.robotoRegular} style={styles.label}>
              이용약관 동의
            </TextWrap>
            <TextWrap font={fonts.robotoRegular} style={styles.labelRequire}>
              (필수)
            </TextWrap>
          </>
        }
        checked={term}
        onCheckedChange={handleChange(setTerm)}
      />
      <InputWrap
        style={styles.input}
        inputStyle={styles.valueStyle}
        inputFlex={{flex: 1}}
        value={
          '제 1조  (목적)\n\n본 약관은 (주)피씨엔씨(이하 "PCNC")가 제공하는 온라인 상의 인터넷 서비스(이하 "서비스")에 대해 PCNC와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.엔씨(이하 "PCNC")가 제공하는 온라인 상의 인터넷 서비스(이하 "서비스")에 대해 PCNC와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.엔씨(이하 "PCNC")가 제공하는 온라인 상의 인터넷 서비스(이하 "서비스")에 대해 PCNC와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다..엔씨(이하 "PCNC")가 제공하는 온라인 상의 인터넷 서비스(이하 "서비스")에 대해 PCNC와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다..엔씨(이하 "PCNC")가 제공하는 온라인 상의 인터넷 서비스(이하 "서비스")에 대해 PCNC와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.'
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
            <TextWrap font={fonts.robotoRegular} style={styles.label}>
              개인정보 수집·이용 동의
            </TextWrap>
            <TextWrap font={fonts.robotoRegular} style={styles.labelRequire}>
              (필수)
            </TextWrap>
          </>
        }
        checked={privacy}
        onCheckedChange={handleChange(setPrivacy)}
      />
      <InputWrap
        style={styles.input}
        inputStyle={styles.valueStyle}
        inputFlex={{flex: 1}}
        value={
          '1. 개인정보 수집목적 및 이용목적\n\n(1)통합독서지원서비스 독서앱 "토핑" 회원가입 및 관리\n통합독서지원서비스 독서앱 "토핑"회원가입을 위해 개인정보가 이용되며 이를 관리하기 위해통합독서지원서비스 독서앱 "토핑" 회원가입 및 관리\n통합독서지원서비스 독서앱 "토핑"회원가입을 위해 개인정보가 이용되며 이를 관리하기 위해통합독서지원서비스 독서앱 "토핑" 회원가입 및 관리\n통합독서지원서비스 독서앱 "토핑"회원가입을 위해 개인정보가 이용되며 이를 관리하기 위해통합독서지원서비스 독서앱 "토핑" 회원가입 및 관리\n통합독서지원서비스 독서앱 "토핑"회원가입을 위해 개인정보가 이용되며 이를 관리하기 위해통합독서지원서비스 독서앱 "토핑" 회원가입 및 관리\n통합독서지원서비스 독서앱 "토핑"회원가입을 위해 개인정보가 이용되며 이를 관리하기 위해'
        }
        borderColor={colors.border}
        multiline
        secure
        showSoftInputOnFocus={false}
      />

      <TextWrap style={styles.label2} font={fonts.robotoMedium}>
        광고 수신 동의
      </TextWrap>
      <CheckBox
        style={styles.cb}
        // border
        label="이메일 수신 동의(선택)"
        checked={allowEmail}
        onCheckedChange={handleChange(setAllowEmail)}
      />
      <CheckBox
        style={styles.cb}
        label="SMS 수신 동의(선택)"
        checked={sms}
        onCheckedChange={handleChange(setSms)}
      />
      <CheckBox
        style={styles.cb}
        label="앱PUSH 수신 동의(선택)"
        checked={appPush}
        onCheckedChange={handleChange(setAppPush)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    paddingBottom: 32,
    paddingHorizontal: 16,
    borderBottomColor: '#f2f2f2',
  },
  cb: {
    marginTop: 14,
  },
  cb2: {
    marginTop: 14,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  label: {
    fontSize: 15,
    lineHeight: 19,
    color: '#777777',
  },
  label2: {
    fontSize: 15,
    lineHeight: 19,
    color: '#777777',
    marginTop: 14,
  },
  labelRequire: {
    fontSize: 15,
    lineHeight: 19,
    color: colors.red,
  },
  input: {
    marginVertical: 8,
  },
  valueStyle: {
    lineHeight: 14,
    fontSize: 12,
    color: colors.black,
    padding: 5,
  },
});
