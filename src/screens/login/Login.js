import React, { useEffect, useState, useRef } from 'react';
import { Image, Keyboard, StyleSheet, View, Platform } from 'react-native';
import Config from 'react-native-config';
import axios from 'axios';
import { decode as atob, encode as btoa } from 'base-64';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import InputWrap from '../../components/input-wrap/InputWrap';
import TextButton from '../../components/text-button/TextButton';
import TextWrap from '../../components/text-wrap/TextWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import images from '../../libs/images';
import fonts from '../../libs/fonts';
import routes from '../../libs/routes';
import jwtDecode from 'jwt-decode';
import {
  convertKorPhoneFormat,
  getAgeFromMoment,
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../services/util';
import { v4 as uuid } from 'uuid';

// import AppleAuthenticationAndroid, {
//   NOT_CONFIGURED_ERROR,
//   SIGNIN_CANCELLED_ERROR,
//   SIGNIN_FAILED_ERROR,
//   ResponseType,
//   Scope,
// } from 'react-native-apple-authentication-android';

import { appleAuthAndroid, appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';

import {
  dialogError,
  dialogOpenMessage,
  dialogOpenKakaoLoginSelect,
  dialogClose,
} from '../../redux/dialog/DialogActions';
import { userCheckToken, userSignOut } from '../../redux/user/UserActions';
import { navigationRef, reset, navigate } from '../../services/navigation';
import { requestGet, requestPost } from '../../services/network';
import { getItem, setItem } from '../../services/preference';
import Avatar from '../../components/avatar/Avatar';

import {
  getProfile as getKakaoProfile,
  login as kakaoLogin,
  unlink,
  loginWithKakaoAccount,
} from '@react-native-seoul/kakao-login';
import { NaverLogin, getProfile } from '@react-native-seoul/naver-login';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import {LoginManager, Profile} from 'react-native-fbsdk-next';

export default function Login({ route }) {
  const dispatch = useDispatch();
  const user = useSelector(s => s.user, shallowEqual);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const rawNonce = uuid();
  const state = uuid();

  const [facebookAccessToken, setFacebookAccessToken] = useState('');
  const naverIosKeys = {
    kConsumerKey: Config.NAVER_CLIENT_ID,
    kConsumerSecret: Config.NAVER_CLIENT_SECRET,
    kServiceAppName: Config.NAVER_CLIENT_NAME,
    kServiceAppUrlScheme: 'com.bookfacegram', // only for iOS
  };
  const naverAndroidKeys = {
    kConsumerKey: Config.NAVER_CLIENT_ID,
    kConsumerSecret: Config.NAVER_CLIENT_SECRET,
    kServiceAppName: Config.NAVER_CLIENT_NAME,
  };
  const naverInitials = Platform.OS === 'ios' ? naverIosKeys : naverAndroidKeys;

  useEffect(() => {
    if ((username || password) && passwordError) {
      setPasswordError('');
    }
  }, [username, password]);

  useEffect(() => {
    signInWithGoogleConfigure();
    return () => {
      setLoading(false);
      setPasswordError('');
      setUsername('');
      setPassword('');
    };
  }, []);


  const handleLogin = async type => {
    setLoading(true);
    try {
      Keyboard.dismiss();
      let userId = '';
      let userPw = '';
      if (type === 'app') {
        userId = username;
        userPw = password;
      } else if (type === 'toaping') {
        userId = await getItem('toapingId');
        userPw = await getItem('toapingPw');
        if (!userId || !userPw) {
          throw 'toapingError';
        }
      }
      const { data, status } = await requestPost({
        url: consts.apiUrl + '/auth/login',
        body: {
          memberId: userId,
          password: userPw,
          platformType: type,
        },
      });
      if (status === 'SUCCESS') {
        if (data?.lnupMember) {
          navigate(routes.registerForm, {
            data: data?.lnupMember,
            userId: 'userId',
            password: userPw,
            platformType: type,
            category: 'member'
          });
        } else if (data?.partner) {
          navigate(routes.registerForm, {
            data: data?.partner,
            userId: 'userId',
            password: userPw,
            platformType: type,
            category: 'partner'
          });
        } else {
          await setItem('accessToken', data.accessToken);
          await setItem('refreshToken', data.refreshToken);
          await setItem('platformType', type);
          dispatch(userCheckToken);
        }
      } else if (status === 'FAIL') {
        dispatch(
          dialogOpenMessage({
            message: '???????????? ?????? ???????????????.',
          }),
        );
        // setPasswordError('???????????? ?????? ??????????????????, ????????? ?????????????????????.');
      }
    } catch (error) {
      if (error === 'toapingError') {
        setLoading(false);
        navigate(routes.toapingLogin);
      } else {
        if (type === 'app') {
          dispatch(
            dialogOpenMessage({
              message: '???????????? ?????? ???????????????.',
            }),
          );
          /*setPasswordError(
            '???????????? ?????? ??????????????????, ????????? ?????????????????????.',
          );*/
        } else {
          dispatch(
            dialogOpenMessage({
              message:
                error?.data?.msg ||
                error?.message ||
                (typeof error === 'object' ? JSON.stringify(error) : error),
            }),
          );
          setLoading(false);
          navigate(routes.toapingLogin);
        }
      }
    }
    setLoading(false);
  };

  const handleRegister = () => {
    navigate(routes.registerForm, {
      data: '',
      userId: '',
      password: '',
      platformType: '',
    });
  };

  const handleFindPassword = () => {
    navigate(routes.findPw);
  };

  const signInWithApp = async () => {
    try {
      handleLogin('app');
    } catch (e) {
      dispatch(dialogError(e));
    }
  };

  const signInWithToaping = () => {
    try {
      handleLogin('toaping');
    } catch (e) {
      dispatch(dialogError(e));
    }
    // ?????? ?????? ????????? ?????? ??????
    // dispatch(
    //   dialogOpenSelect({
    //     item: [
    //       {
    //         name: '?????????????????? ???????????????',
    //         source: images.toapingIcon,
    //         type: 'login',
    //         onPress: () => signInWithToapingSelect(),
    //       },
    //       {
    //         name: '?????? ?????????????????? ?????????',
    //         source: images.toapingIcon,
    //         type: 'login',
    //         onPress: () => navigate(routes.toapingLogin),
    //       },
    //     ],
    //   }),
    // );
  };

  const signInWithToapingSelect = async () => {
    try {
      handleLogin('toaping');
    } catch (e) {
      dispatch(dialogError(e));
    }
  };

  const signInWithKakao = async () => {
    // await unlink();
    dispatch(
      dialogOpenKakaoLoginSelect({
        item: [
          {
            // name: '?????????????????? ???????????????',
            source: images.kakaoLogin,
            type: 'login',
            onPress: () => signInWithKakaoSelect('exist'),
          },
          {
            // name: '?????? ????????????????????? ?????????',
            source: images.kakaoLoginAuth,
            type: 'login',
            onPress: async () => {
              await signInWithKakaoSelect('change');
            },
          },
          {
            // name: 'close'
            source: images.kakaoLoginClose,
            type: 'close',
            onPress: () => dispatch(dialogClose()),
          },
        ],
      }),
    );
  };

  const signInWithKakaoSelect = async type => {
    try {
      let token = '';
      if (type === 'exist') {
        token = await kakaoLogin();
      } else if (type === 'change') {
        token = await loginWithKakaoAccount();
      }

      const profile = await getKakaoProfile();
      let serviceTerms = {};
      try {
        serviceTerms = await requestGet({
          url: 'https://kapi.kakao.com/v1/user/service/terms',
          // query: {extra: 'app_service_terms'},
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });
      } catch (e) {
        throw 'get kakao serviceTerms error';
      }
      const { data, status } = await requestPost({
        url: consts.apiUrl + '/auth/kakaoLogin',
        body: {
          platformType: 'kakao',
          memberId: profile.email ? profile.email : '',
          sex:
            profile.gender === null
              ? ''
              : profile.gender === 'MALE'
                ? '???'
                : '???',
          handphone:
            profile.phoneNumber === null
              ? ''
              : convertKorPhoneFormat(profile.phoneNumber),
          birth_day:
            profile?.birthday === null
              ? ''
              : profile?.birthday.length === 4
                ? profile.birthday
                : '0' + profile.birthday,
          birth_year: profile.birthyear === null ? '' : profile.birthyear,
          age:
            profile.birthyear === null
              ? ''
              : getAgeFromMoment(
                profile.birthyear + profile.birthday,
                'YYYYMMDD',
              ),
          kor_nm: profile.nickname,
          email: profile.email,
          profile_path: profile.thumbnailImageUrl,
          agree_sms: serviceTerms?.allowed_service_terms
            ? serviceTerms?.allowed_service_terms
              ?.map(x => x.tag)
              .indexOf('agree_sms') !== -1
              ? 1
              : 0
            : 0,
          agree_email: serviceTerms?.allowed_service_terms
            ? serviceTerms?.allowed_service_terms
              ?.map(x => x.tag)
              .indexOf('agree_email') !== -1
              ? 1
              : 0
            : 0,
          agree_app_push: serviceTerms?.allowed_service_terms
            ? serviceTerms?.allowed_service_terms
              ?.map(x => x.tag)
              .indexOf('agree_app_push') !== -1
              ? 1
              : 0
            : 0,
        },
      });
      if (status === 'SUCCESS') {
        await setItem('accessToken', data.accessToken);
        await setItem('refreshToken', data.refreshToken);
        await setItem('platformType', 'kakao');
        dispatch(userCheckToken);
      } else {
        // fail
        setPasswordError('????????? ????????? ??????');
      }
    } catch (e) {
    }
  };

  const signInWithNaver = () => {
    NaverLogin.login(naverInitials, async (err, naverToken) => {
      if (err) {
      } else {
        const profileResult = await getProfile(naverToken.accessToken);
        if (profileResult.resultcode === '024') {
          dispatch(dialogError('????????? ??????' + profileResult.message));
          return;
        }
        const { data, status } = await requestPost({
          url: consts.apiUrl + '/auth/naverLogin',
          body: {
            platformType: 'naver',
            memberId: profileResult.response?.email,
            email: profileResult.response?.email,
            handphone: profileResult.response?.mobile?.replace(/-/g, ''),
            kor_nm: profileResult.response?.name,
            profile_path: profileResult.response?.profile_image,
          },
        });
        if (status === 'SUCCESS') {
          await setItem('accessToken', data.accessToken);
          await setItem('refreshToken', data.refreshToken);
          await setItem('platformType', 'naver');
          dispatch(userCheckToken);
        } else {
          // fail
          setPasswordError('????????? ????????? ??????');
        }
      }
    });
  };

  const signInWithGoogleConfigure = () => {
    try {
      GoogleSignin.configure({
        scopes: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/user.phonenumbers.read',
        ],
        webClientId: Config.GOOGLE_WEB_CLIENT_ID,
        offlineAccess: false,
      });
    } catch (e) {
      dispatch(dialogError('??????????????????'));
    }
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { accessToken } = await GoogleSignin.getTokens();
      await axios({
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
        url: `https://people.googleapis.com/v1/people/${userInfo.user.id}?personFields=phoneNumbers`,
      })
        .then(async function (response) {
          if (response.data.phoneNumbers) {
            const { data, status } = await requestPost({
              url: consts.apiUrl + '/auth/googleLogin',
              body: {
                platformType: 'google',
                memberId: userInfo.user.email,
                email: userInfo.user.email,
                handphone: '0' + response.data?.phoneNumbers[0]?.value,
                kor_nm: userInfo.user.name,
                profile_path: userInfo.user.photo,
              },
            });
            if (status === 'SUCCESS') {
              await setItem('accessToken', data.accessToken);
              await setItem('refreshToken', data.refreshToken);
              await setItem('platformType', 'google');
              dispatch(userCheckToken);
            } else {
              setPasswordError('?????? ????????? ??????');
            }
          } else {
            const { data, status } = await requestPost({
              url: consts.apiUrl + '/auth/googleLogin',
              body: {
                platformType: 'google',
                memberId: userInfo.user.email,
                email: userInfo.user.email,
                kor_nm: userInfo.user.name,
                profile_path: userInfo.user.photo,
              },
            });
            if (status === 'SUCCESS') {
              await setItem('accessToken', data.accessToken);
              await setItem('refreshToken', data.refreshToken);
              await setItem('platformType', 'google');
              dispatch(userCheckToken);
            } else {
              setPasswordError('?????? ????????? ??????');
            }
          }
        })
        .catch(function (error) {
        });
    } catch (error) {
    }
  };

  // const signWithFacebook = async () => {
  //   LoginManager.logInWithPermissions(['public_profile']).then(
  //     async function (result) {
  //       if (result.isCancelled) {
  //         dispatch(dialogError('Login cancelled'));
  //       } else {
  //         const profile = await Profile.getCurrentProfile();
  //         if (profile === null) {
  //           signWithFacebook();
  //         } else {
  //           try {
  //             const {data, status} = await requestPost({
  //               url: consts.apiUrl + '/auth/facebookLogin',
  //               body: {
  //                 platformType: 'facebook',
  //                 memberId: profile.userID,
  //                 email: profile.email,
  //                 kor_nm: profile.name,
  //                 profile_path: profile.imageURL,
  //               },
  //             });
  //             if (status === 'SUCCESS') {
  //               await setItem('accessToken', data.accessToken);
  //               await setItem('refreshToken', data.refreshToken);
  //               await setItem('platformType', 'facebook');
  //               dispatch(userCheckToken);
  //             } else {
  //               setPasswordError('?????? ????????? ??????');
  //             }
  //           } catch (e) {
  //             // console.log(e);
  //           }
  //         }
  //       }
  //     },
  //     function (error) {
  //       dispatch(dialogError(error));
  //     },
  //   );
  // };
  // Initialize the module
  function b64DecodeUnicode(str) {
    return decodeURIComponent(
      atob(str).replace(/(.)/g, function (m, p) {
        var code = p.charCodeAt(0).toString(16).toUpperCase();
        if (code.length < 2) {
          code = '0' + code;
        }
        return '%' + code;
      }),
    );
  }

  function base64_url_decode(str) {
    var output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw 'Illegal base64url string!';
    }

    try {
      return b64DecodeUnicode(output);
    } catch (err) {
      return atob(output);
    }
  }
if(!appleAuth.isSupported){
  appleAuthAndroid.configure({
    clientId: 'com.bookfacegram.app',
    redirectUri: 'https://toaping-735b6.firebaseapp.com/__/auth/handler',

    // [OPTIONAL]
    // Scope.ALL (DEFAULT) = 'email name'
    // Scope.Email = 'email';
    // Scope.Name = 'name';
    scope: appleAuthAndroid.Scope.ALL,

    // [OPTIONAL]
    // ResponseType.ALL (DEFAULT) = 'code id_token';
    // ResponseType.CODE = 'code';
    // ResponseType.ID_TOKEN = 'id_token';
    responseType: appleAuthAndroid.ResponseType.ALL,
    nonce: rawNonce,
    state,
  });
}
  // Sign In with Apple
  const signInWithApple = async () => {
    try {
      const response = await appleAuthAndroid.signIn();
      if (response) {
        const code = response.code; // Present if selected ResponseType.ALL / ResponseType.CODE
        const id_token = response.id_token; // Present if selected ResponseType.ALL / ResponseType.ID_TOKEN
        //const users = response.user; // Present when user first logs in using appleid
        const result = JSON.parse(base64_url_decode(id_token.split('.')[1]));
        //const name_type = typeof response.user;
        //const email = 'ddr1323@gmail.com';
        var appleemail = result.email;
        /*const applename = response.user.name.lastName;
        const applename2 = response.user.name.firstName;
        const fullName = applename + applename2;*/

        // if (appleemail != null) {
        //  appleemail = result.email;
        // }
        await requestGet({
          url: 'https://toaping.me:8811/bookApp/auth/apple',
          query: {
            email: appleemail,
          },
        })
          .then(async function (res) {
            if (res.status === 'SUCCESS') {
              const { data, status } = await requestPost({
                url: consts.apiUrl + '/auth/appleLogin',
                body: {
                  email: appleemail,
                  memberId: appleemail,
                  platformType: 'apple',
                },
              });
              if (status === 'SUCCESS') {
                await setItem('accessToken', data.accessToken);
                await setItem('refreshToken', data.refreshToken);
                await setItem('platformType', 'apple');
                dispatch(userCheckToken);
              } else {
                setPasswordError('?????? ????????? ??????');
              }
            }
          })
          .catch(async function (error) {
            const applename = response.user.name.lastName;
            const applename2 = response.user.name.firstName;
            const fullName = applename + applename2;
            const { data, status } = await requestPost({
              url: consts.apiUrl + '/auth/appleLogin',
              body: {
                email: appleemail,
                memberId: appleemail,
                kor_nm: fullName,
                platformType: 'apple',
              },
            });
            if (status === 'SUCCESS') {
              await setItem('accessToken', data.accessToken);
              await setItem('refreshToken', data.refreshToken);
              await setItem('platformType', 'apple');
              dispatch(userCheckToken);
            } else {
              setPasswordError('?????? ????????? ??????');
            }
          });
      }
    } catch (error) {
    }
  };


  // Sign In with Apple
  const signInWithAppleIos = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      const result = jwtDecode(appleAuthRequestResponse.identityToken);
      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      //const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
      // console.log(credentialState)
      // // use credentialState response to ensure the user is authenticated
      // if (credentialState === appleAuth.State.AUTHORIZED) {
      //   // user is authenticated
      //   console.log(appleAuthRequestResponse)
      // }
      let appleEmail = result.email;

      await requestGet({
        url: 'https://toaping.me:8811/bookApp/auth/apple',
        query: {
          email: appleEmail,
        },
      })
        .then(async function (res) {
          if (res.status === 'SUCCESS') {
            const { data, status } = await requestPost({
              url: consts.apiUrl + '/auth/appleLogin',
              body: {
                email: appleEmail,
                memberId: appleEmail,
                platformType: 'apple',
              },
            });

            if (status === 'SUCCESS') {
              await setItem('accessToken', data.accessToken);
              await setItem('refreshToken', data.refreshToken);
              await setItem('platformType', 'apple');
              dispatch(userCheckToken);
            } else {
              setPasswordError('?????? ????????? ??????');
            }
          }
        })
        .catch(async function (error) {
          const applename = appleAuthRequestResponse.fullName.familyName;
          const applename2 = appleAuthRequestResponse.fullName.givenName;
          const fullName = applename + applename2;
          const { data, status } = await requestPost({
            url: consts.apiUrl + '/auth/appleLogin',
            body: {
              email: appleEmail,
              memberId: appleEmail,
              kor_nm: fullName,
              platformType: 'apple',
            },
          });
          if (status === 'SUCCESS') {
            await setItem('accessToken', data.accessToken);
            await setItem('refreshToken', data.refreshToken);
            await setItem('platformType', 'apple');
            dispatch(userCheckToken);
          } else {
            setPasswordError('?????? ????????? ??????');
          }
        });


    } catch (error) {

    }
  };



  // Initialize the module

  return (
    <RootLayout style={styles.root}>
      <View style={styles.inputRow}>
        <Image source={images.login} style={styles.logo} />
        <InputWrap
          style={styles.input}
          placeholder="?????????"
          value={username}
          selectionColor={colors.white}
          onChange={setUsername}
          maxLength={50}
          borderBottomColor={{ borderBottomColor: colors.white }}
        />
        <InputWrap
          style={styles.input2}
          placeholder="????????????"
          selectionColor={colors.white}
          secure
          value={password}
          onChange={setPassword}
          maxLength={20}
          message={passwordError}
          messageColor={colors.red}
          borderBottomColor={{ borderBottomColor: colors.white }}
        />
      </View>

      <View style={styles.row}>
        <ButtonWrap
          loading={loading}
          onPress={signInWithApp}
          disabled={!password || !username || passwordError}
          style={styles.button}
          styleTitle={styles.buttonTitle}>
          ?????????
        </ButtonWrap>
      </View>
      <View style={styles.row1}>
        <TextButton
          onPress={() => {
            navigate(routes.findId);
          }}
          //onPress={handleFindIdPassword}
          styleTitle={styles.t}
          font={fonts.kopubWorldDotumProMedium}>
          ????????? ??????
        </TextButton>
        <TextWrap style={styles.t2}>|</TextWrap>
        <TextButton
          // onPress={() => {
          //   navigate(routes.registerPhoneVerify);
          // }}
          onPress={handleFindPassword}
          styleTitle={styles.t}
          font={fonts.kopubWorldDotumProMedium}>
          ???????????? ??????
        </TextButton>
        <TextWrap style={styles.t2}>|</TextWrap>
        <TextButton
          onPress={handleRegister}
          styleTitle={styles.t}
          font={fonts.kopubWorldDotumProMedium}>
          ????????????
        </TextButton>
      </View>

      <View style={styles.rowCenter}>
        <TextButton
          disabled
          styleTitle={styles.text}
          font={fonts.kopubWorldDotumProMedium}>
          ?????? ?????????
        </TextButton>
      </View>

      <View style={styles.rowAround}>
        <View>
          <Avatar
            style={styles.avator}
            source={images.toapingIcon}
            onPress={signInWithToaping}
          />
        </View>
        <View>
          <Avatar
            style={styles.avator}
            source={images.kakaoIcon}
            onPress={signInWithKakao}
          />
        </View>
        <View>
          <Avatar
            style={styles.avator}
            source={images.naverIcon}
            onPress={signInWithNaver}
          />
        </View>
        {/*<View>
          <Avatar
            style={styles.avator}
            source={images.facebookIcon}
            onPress={signWithFacebook}
          />
  </View>*/}

        <View>
          <Avatar
            style={styles.avator}
            source={images.googleIcon}
            onPress={signInWithGoogle}
          />
        </View>
        <View>
          <Avatar
            style={styles.avator}
            source={images.appleIcon}
            onPress={() => {
              if (appleAuth.isSupported) {
                signInWithAppleIos();
              } else {
                signInWithApple();
              }
            }}
          />
        </View>
      </View>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  inputRow: {
    flexDirection: 'column',
    width: '100%',
    paddingHorizontal: widthPercentage(40),
  },
  row: { flexDirection: 'row' },
  row1: {
    flexDirection: 'row',
    marginTop: heightPercentage(37.4),
  },
  rowCenter: {
    flexDirection: 'row',
    marginTop: heightPercentage(71),
    borderBottomWidth: 2,
    borderBottomColor: colors.white,
  },
  rowAround: {
    marginTop: heightPercentage(23),
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: widthPercentage(70),
    justifyContent: 'space-around',
  },
  t: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(14),
    fontFamily: fonts.kopubWorldDotumProMedium,
    color: '#ffffff',
    marginTop: 9,
  },
  t2: {
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(14),
    fontFamily: fonts.kopubWorldDotumProMedium,
    color: '#ffffff',
    marginTop: 10,
    paddingHorizontal: 5,
  },
  text: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(17),
    fontFamily: fonts.kopubWorldDotumProMedium,
    color: '#ffffff',
    bottom: heightPercentage(2),
    textAlign: 'center',
  },
  input: {
    marginTop: heightPercentage(33.5),
  },
  input2: {
    marginTop: heightPercentage(26),
  },
  logo: {
    width: widthPercentage(161),
    height: heightPercentage(68.5),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  button: {
    justifyContent: 'center',
    width: widthPercentage(250),
    height: heightPercentage(42.6),
    marginTop: heightPercentage(37.5),
  },
  buttonTitle: {
    color: '#000000',
    fontSize: fontPercentage(15),
    lineHeight: fontPercentage(23),
  },
  avator: {
    width: widthPercentage(32),
    height: heightPercentage(32),
  },
  avatarTitle: {
    fontSize: fontPercentage(8),
    lineHeight: fontPercentage(12),
    alignSelf: 'center',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginTop: 5,
  },
});
