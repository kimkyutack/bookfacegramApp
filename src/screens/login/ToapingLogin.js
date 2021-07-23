import {useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {Image, Keyboard, ScrollView, StyleSheet, View} from 'react-native';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import InputPhone from '../../components/input-phone/InputPhone';
import InputWrap from '../../components/input-wrap/InputWrap';
import TextWrap from '../../components/text-wrap/TextWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import {navigate, reset} from '../../services/navigation';
import {dialogOpenMessage, dialogError} from '../../redux/dialog/DialogActions';
import {requestPost} from '../../services/network';
import {getItem, setItem} from '../../services/preference';
import {userCheckToken, userSignOut} from '../../redux/user/UserActions';

import consts from '../../libs/consts';
import colors from '../../libs/colors';
import routes from '../../libs/routes';
import fonts from '../../libs/fonts';

export default function ToapingLogin({}) {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const user = useSelector(s => s.user, shallowEqual);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const buttonDisabled = !password || !username;

  const handleLogin = async () => {
    setLoading(false);
    try {
      Keyboard.dismiss();
      const token = await requestPost({
        url: consts.apiUrl + '/makeJwt',
        body: {
          member_id: username,
          password: password,
          platform_type: 'toaping',
        },
      });
      if (token.valid) {
        await setItem('token', token.token);
        await setItem('platformType', 'toaping');
        dispatch(
          dialogOpenMessage({
            label: '확인',
            title: '확인',
            message:
              '입력하신 계정의 회원정보가 확인되었습니다.\n해당 계정으로 앱 회원가입을 진행합니다.',
            onPress: () => {
              dispatch(userCheckToken);
            },
          }),
        );
      } else {
        dispatch(
          dialogOpenMessage({
            label: '오류',
            title: '확인',
            message:
              '입력하신 이름과 이메일에 해당하는 회원정보를 찾지 못했습니다. 다시 입력해주세요.',
          }),
        );
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      if (error.message === 'Network Error') {
        dispatch(dialogError(error));
      } else {
        dispatch(
          dialogOpenMessage({
            label: '오류',
            title: '확인',
            message:
              '입력하신 이름과 이메일에 해당하는 회원정보를 찾지 못했습니다. 다시 입력해주세요.',
          }),
        );
      }
      setUsername('');
      setPassword('');
    }
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
          토핑웹(PC)에 가입해주신 아이디와 비밀번호를 입력해주세요.
        </TextWrap>
        <InputWrap
          // icon={image.idIcon}
          style={styles.input}
          placeholder="아이디"
          value={username}
          // borderColor={Boolean(passwordError) && colors.red}
          onChange={setUsername}
          maxLength={50}
        />
        <InputWrap
          // icon={image.pwIcon}
          style={styles.input2}
          placeholder="비밀번호"
          secure
          value={password}
          onChange={setPassword}
          maxLength={20}
        />
        <ButtonWrap
          disabled={buttonDisabled}
          onPress={handleLogin}
          style={styles.button}
          styleTitle={styles.buttonTitle}
          disabledBackgroundColor={!buttonDisabled && styles.buttonBackground}>
          로그인
        </ButtonWrap>
      </ScrollView>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 40,
  },
  input2: {
    marginTop: 30,
  },
  root: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    marginHorizontal: 16,
    fontSize: 22,
    marginTop: 20,
    lineHeight: 26,
    color: '#222',
  },
  subTitle: {
    backgroundColor: colors.border,
    paddingVertical: 20,
    textAlign: 'center',
    color: '#777',
    fontSize: 12,
    lineHeight: 22,
    marginTop: 10,
  },
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: '60%',
    marginTop: 50,
  },
  buttonTitle: {
    backgroundColor: 'transparent',
    color: colors.white,
  },
  buttonBackground: {
    backgroundColor: colors.prussianBlue,
  },
});
