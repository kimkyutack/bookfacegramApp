import {useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Image, Keyboard, ScrollView, StyleSheet, View} from 'react-native';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import InputPhone from '../../components/input-phone/InputPhone';
import InputWrap from '../../components/input-wrap/InputWrap';
import TextWrap from '../../components/text-wrap/TextWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import {navigate} from '../../services/navigation';

import colors from '../../libs/colors';
import routes from '../../libs/routes';
import fonts from '../../libs/fonts';

import Policy from './Policy';

export default function RegisterForm({}) {
  const scrollRef = useRef();
  const [agree, setAgree] = useState(false);
  const [term, setTerm] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [allowEmail, setAllowEmail] = useState(false);
  const [sms, setSms] = useState(false);
  const [appPush, setAppPush] = useState(false);

  const buttonDisabled = !agree;
  const handleGoRegister = () => {
    navigate(routes.registerFormInfo, {
      term: term,
      privacy: privacy,
      allowEmail: allowEmail,
      sms: sms,
      appPush: appPush,
    });
  };

  return (
    <RootLayout
      topbar={{
        title: '토핑 회원가입',
        back: true,
      }}>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.root}>
        <TextWrap style={styles.subTitle}>
          회원가입에 필요한 최소한의 정보만 입력받음으로써{'\n'}
          개인정보 수집을 최소화하고 편리한 회원가입을 제공합니다.
        </TextWrap>
        <TextWrap style={styles.label} font={fonts.robotoMedium}>
          1.약관동의
        </TextWrap>

        <Policy
          agree={agree}
          onAgreeChange={setAgree}
          term={term}
          setTerm={setTerm}
          privacy={privacy}
          setPrivacy={setPrivacy}
          allowEmail={allowEmail}
          setAllowEmail={setAllowEmail}
          sms={sms}
          setSms={setSms}
          appPush={appPush}
          setAppPush={setAppPush}
        />
        <ButtonWrap
          disabled={buttonDisabled}
          onPress={handleGoRegister}
          style={styles.button}
          styleTitle={styles.buttonTitle}
          disabledBackgroundColor={!buttonDisabled && styles.buttonBackground}>
          다음
        </ButtonWrap>
      </ScrollView>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 20,
  },
  root: {flex: 1},
  title: {
    marginHorizontal: 16,
    fontSize: 22,
    marginTop: 20,
    lineHeight: 26,
    color: '#222',
  },
  subTitle: {
    backgroundColor: colors.border,
    marginHorizontal: 16,
    paddingVertical: 12,
    textAlign: 'center',
    color: '#777',
    fontSize: 12,
    lineHeight: 22,
    marginTop: 10,
  },
  label: {
    marginTop: 20,
    fontSize: 16,
    paddingHorizontal: 16,
    lineHeight: 20,
    color: '#222',
  },
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: '40%',
    marginTop: 10,
  },
  buttonTitle: {
    color: colors.white,
  },
  buttonBackground: {
    backgroundColor: colors.prussianBlue,
  },
});
