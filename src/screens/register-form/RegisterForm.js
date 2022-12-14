import {useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Image, Keyboard, ScrollView, StyleSheet, View} from 'react-native';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import InputPhone from '../../components/input-phone/InputPhone';
import InputWrap from '../../components/input-wrap/InputWrap';
import TextWrap from '../../components/text-wrap/TextWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import colors from '../../libs/colors';
import routes from '../../libs/routes';
import fonts from '../../libs/fonts';
import { BackHandler } from 'react-native';
import Policy from './Policy';
import { navigationRef, navigate } from '../../services/navigation';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../services/util';

export default function RegisterForm({route,navigation}) {
  const scrollRef = useRef();
  const [agree, setAgree] = useState(false);
  const [term, setTerm] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [allowEmail, setAllowEmail] = useState(false);
  const [sms, setSms] = useState(false);
  const [appPush, setAppPush] = useState(false);
  const [select, setSelect] = useState(0);

  const buttonDisabled = !agree;
  const curRouteName = navigationRef.current.getCurrentRoute().name;
  const handleGoRegister = () => {
    if (route.params?.platformType === 'toaping') {
      navigate(routes.registerFormToapingInfo, {
        term: term,
        privacy: privacy,
        allowEmail: allowEmail,
        sms: sms,
        appPush: appPush,
        data: route.params?.data,
        userId: route.params?.userId,
        password: route.params?.password,
        category: route.params?.category,
      });
    } else {
      navigate(routes.registerFormInfo, {
        term: term,
        privacy: privacy,
        allowEmail: allowEmail,
        sms: sms,
        appPush: appPush,
      });
    }
      setAgree(false);
      setTerm(false);
      setPrivacy(false);
      setAllowEmail(false);
      setSms(false);
      setAppPush(false);
      setSelect(select + 1);
  };

  const allFalse = () =>{
      setAgree(false);
      setTerm(false);
      setPrivacy(false);
      setAllowEmail(false);
      setSms(false);
      setAppPush(false);
      setSelect(select + 1);
  };

  useEffect(() => {
    let isMounted = true;
    if(isMounted ){
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        allFalse,
      );
    }
    return () => {
      isMounted = false;
      false;
      };
  }, [curRouteName]);

  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = navigation.addListener('focus', () => {
      if(isMounted ){
      setAgree(false);
      setTerm(false);
      setPrivacy(false);
      setAllowEmail(false);
      setSms(false);
      setAppPush(false);
      setSelect(select + 1);
      }
    });
    return () => {
      isMounted = false;
      unsubscribe;
      };
  }, [navigate]);

  return (
    <RootLayout
      topbar={{
        title: '?????? ????????????',
        none: true,
      }}>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.root}>
        <TextWrap style={styles.subTitle}>
          ??????????????? ????????? ???????????? ????????? ?????????????????????{'\n'}
          ???????????? ????????? ??????????????? ????????? ??????????????? ???????????????.
        </TextWrap>
        <TextWrap style={styles.label} font={fonts.kopubWorldDotumProBold}>
          1.????????????
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
          select={select}
        />
        <ButtonWrap
          disabled={buttonDisabled}
          onPress={handleGoRegister}
          style={buttonDisabled ? styles.diabledButton : styles.button}
          styleTitle={styles.buttonTitle}
          disabledBackgroundColor={!buttonDisabled && styles.buttonBackground}>
          ??????
        </ButtonWrap>
      </ScrollView>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 20,
  },
  root: {flex: 1, paddingHorizontal: 16},
  title: {
    marginHorizontal: 16,
    fontSize: 22,
    marginTop: 20,
    lineHeight: 26,
    color: '#222',
  },
  subTitle: {
    backgroundColor: '#fbfbfb',
    paddingVertical: 10,
    textAlign: 'center',
    color: '#333333',
    fontSize: fontPercentage(10),
    lineHeight: fontPercentage(14),
  },
  label: {
    marginTop: 11,
    fontSize: fontPercentage(15),
    color: '#222',
  },
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: widthPercentage(130),
    height: heightPercentage(43),
    marginTop: 10,
  },
  diabledButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: widthPercentage(130),
    height: heightPercentage(43),
    marginTop: 10,
    backgroundColor: '#c9c9c9',
  },
  buttonTitle: {
    color: colors.white,
    backgroundColor: 'transparent',
  },
  buttonBackground: {
    backgroundColor: colors.prussianBlue,
  },
});
