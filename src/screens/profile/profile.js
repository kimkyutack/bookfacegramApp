import { useRoute } from '@react-navigation/native';
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import CameraRoll from '@react-native-community/cameraroll';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import TagInput from 'react-native-tags-input';
import Avatar from '../../components/avatar/Avatar';
import TextWrap from '../../components/text-wrap/TextWrap';
import Topbar from '../../components/topbar/Topbar';
import InputWrap2 from '../../components/input-wrap/InputWrap2';
import RootLayout from '../../layouts/root-layout/RootLayout';
import { userSignOut } from '../../redux/user/UserActions';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import routes from '../../libs/routes';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import {
  fontPercentage,
  heightPercentage,
  isIos,
  screenWidth,
  cameraProfile,
  widthPercentage,
} from '../../services/util';
import { goBack, navigate, reset } from '../../services/navigation';
import { browsingTime } from '../../redux/session/SessionAction';
import {
  requestFile,
  requestPost,
  requestGet,
  requestPut,
} from '../../services/network';
import {
  openSettings,
  PERMISSIONS,
  check,
  request,
} from 'react-native-permissions';
import {
  dialogError,
  dialogClose,
  dialogOpenGradeProfile,
  dialogOpenDrawerKeyBoardPW,
  dialogOpenDrawerKeyBoardWD,
  dialogOpenSelect,
  dialogOpenAction,
  dialogOpenAction2,
} from '../../redux/dialog/DialogActions';
import { userUpdateProfileImage, userUpdate } from '../../redux/user/UserActions';
import Footer from '../../libs/footer';
import { color } from 'react-native-reanimated';

export default function Profile({ route, navigation }) {
  const user = useSelector(s => s.user, shallowEqual);
  //alert(JSON.stringify(user));
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { params, setParams } = useRoute();
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [sessionTime, setSessionTime] = useState('000000');
  const [phone, setPhone] = useState(user?.handphone ? user?.handphone : '');
  const [email, setEmail] = useState(user?.email ? user?.email : '');
  const [cmail, setCmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [grades, setGrades] = useState(user?.grade ? user?.grade : '');
  let infograde = grades * 1;
  let grade = '';

  let hour = 0, minute = 0, second = -1;

  function timeCount() {


    let dsp_hour, dsp_minute, dsp_second;

    second++;

    if (minute == 60) {
      hour++;
      minute = 0;
    }
    if (second == 60) {
      minute++;
      second = 0;
    }

    if (hour < 10)
      dsp_hour = '0' + hour;
    else
      dsp_hour = hour;

    if (minute < 10)
      dsp_minute = '0' + minute;
    else
      dsp_minute = minute;

    if (second < 10)
      dsp_second = '0' + second;
    else
      dsp_second = second;


    let date_state = dsp_hour + dsp_minute + dsp_second;


    setSessionTime(date_state);
  };

  //page ?????? ?????? ??????
  useEffect(() => {
    if (isFocused) {
      var timer = setInterval(() => { timeCount() }, 1000);
    }

    if (!isFocused) {
      if (sessionTime !== '000000') {

        dispatch(browsingTime('??????????????????', sessionTime, user.member_id));
      }
    }
    return () => {
      clearInterval(timer);
      setSessionTime('000000');
    }
  }, [isFocused]);


  useEffect(() => {
    //console.log(JSON.stringify(user));
    const unsubscribe = navigation.addListener('focus', () => {
      setSaveButtonDisabled(false);
      setPhone(user?.handphone ? user?.handphone : '');
      setGrades(user?.grade ? user?.grade : '');
      setEmail(user?.email ? user?.email : '');
      setEmailError('');
      setCmail('');

      //Put your Data loading function here instead of my loadData()
    });

    return unsubscribe;
  }, [
    navigate,
    user.handphone,
    user.email,
    user?.profile_path,
    user?.grade,
  ]);

  useEffect(() => {
    setSaveButtonDisabled(false);
    setPhone(user?.handphone ? user?.handphone : '');
    setGrades(user?.grade ? user?.grade : '');
    setEmail(user?.email ? user?.email : '');
  }, [user.handphone, user.email, user?.profile_path, user?.grade]);

  useEffect(() => {
    setGrades(route.params?.grade ? route.params?.grade : user?.grade);

    if (route.params?.grade * 1 === user?.grade * 1) {
      setSaveButtonDisabled(false);
    } else {
      setSaveButtonDisabled(true);
    }
  }, [route.params?.grade]);
  useEffect(() => {
    //console.log(params?.type);
    if (params?.type === 'camera' || params?.type === 'file' || params?.type === 'gallery') {
      dispatch(
        dialogOpenAction2({
          titleColor: '#005aff',
          cancelTitle: '??????',
          message: '????????? ????????? ?????????????????????????',
          onPress: a => {
            if (a) {
              dispatch(userUpdateProfileImage(params?.image[0], user.profile_path));

            }
          },
        }),
      );
      if (params?.type !== 'ok') {
        params.type = 'cancel';
      }
    }
  }, [params.type, params.image]);

  // if (params?.image !== undefined) {
  //   console.log(params?.image);
  // }
  switch (infograde) {
    case 2:
      grade = '??????';
      break;
    case 3:
      grade = '???????????? 1??????';
      break;
    case 4:
      grade = '???????????? 2??????';
      break;
    case 5:
      grade = '???????????? 3??????';
      break;
    case 6:
      grade = '???????????? 4??????';
      break;
    case 7:
      grade = '???????????? 5??????';
      break;
    case 8:
      grade = '???????????? 6??????';
      break;
    case 9:
      grade = '????????? 1??????';
      break;
    case 10:
      grade = '????????? 2??????';
      break;
    case 11:
      grade = '????????? 3??????';
      break;
    case 12:
      grade = '???????????? 1??????';
      break;
    default:
      grade = '??????';
      break;
  }

  const autoHypenPhone = phoneStr => {
    let st = phoneStr.toString().replace(/[^0-9]/g, '');
    let tmp = '';
    if (st.length < 4) {
      return st;
    } else if (st.length < 7) {
      tmp += st.substr(0, 3);
      tmp += '-';
      tmp += st.substr(3);
      return tmp;
    } else if (st.length < 11) {
      tmp += st.substr(0, 3);
      tmp += '-';
      tmp += st.substr(3, 3);
      tmp += '-';
      tmp += st.substr(6);
      return tmp;
    } else {
      tmp += st.substr(0, 3);
      tmp += '-';
      tmp += st.substr(3, 4);
      tmp += '-';
      tmp += st.substr(7);
      return tmp;
    }
  };
  const UpdateProfile = async () => {
    let emails = email;
    let phoneNum = phone;
    phoneNum = phoneNum.replace(/-/gi, '');

    requestPut({
      url: consts.apiUrl + '/mypage/info',
      body: {
        handphone: phoneNum,
        email: emails,
        grade: infograde,
      },
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          setEmail(res.data.email);
          setPhone(res.data.handphone);

          dispatch(userUpdate);
          dispatch(dialogError('?????????????????????.'));
          //alert(JSON.stringify(user));
          setSaveButtonDisabled(false);
        } else if (res.status === 'FAIL') {
          // error ?????? ?????????
          dispatch(dialogError(res.data.msg));
        } else {
        }
      })
      .catch(error => {
        dispatch(dialogError(error));
        // error ?????? ?????????
      });
  };
  const emailDuplicatedCheck = async e => {
    let preventKorReg = /[^A-Za-z0-9@.]/gi;
    let emailFormatReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (emailFormatReg.test(e) === false) {
      setEmail(e.replace(preventKorReg, ''));
      setCmail(email);
      setEmailError('????????? ????????? ?????? ????????????. ex) toaping@naver.com');
    } else {
      setEmail(e.replace(preventKorReg, ''));
      setCmail(email);
      setEmailError('');
    }
    try {
      if (!emailError) {
        setEmailLoading(true);
        const { data, status } = await requestGet({
          url: consts.apiUrl + '/auth/validEmail',
          query: {
            email: e,
          },
        });
        if (status === 'SUCCESS') {
          if (emailFormatReg.test(e)) {
            setEmailError('');
            setSaveButtonDisabled(true);
          } else {
            setEmailError('????????? ????????? ?????? ????????????. ex) toaping@naver.com');
            setSaveButtonDisabled(false);
          }
        }
        setEmailLoading(false);
      }
    } catch (error) {
      setEmailError(
        error?.data?.msg ||
        error?.message ||
        (typeof error === 'object' ? JSON.stringify(error) : error),
      );
      setEmailLoading(false);
      setSaveButtonDisabled(false);
    }
  };

  return (
    <RootLayout
      topbar={{
        title: '??????????????????',
        back: true,
        navigation: navigation,
        options: {
          name: 'complete',
          component: (
            <TextWrap
              font={fonts.kopubWorldDotumProBold}
              style={
                !saveButtonDisabled
                  ? styles.disabledTextIcon
                  : styles.completeTextIcon
              }>
              ??????
            </TextWrap>
          ),
          onPress: () => (saveButtonDisabled ? UpdateProfile() : null),
        },
      }}>
      <ScrollView>
        <View style={styles.userInfoContainer}>
          <TouchableOpacity
            onPress={() => {
              //dispatch(userUpdateProfileImage(user.profile_path));
              dispatch(
                dialogOpenSelect({
                  item: cameraProfile(user.profile_path),
                }),
              );
              //setSaveButtonDisabled(true);
            }}>
            <Avatar
              size={84}
              style={styles.avator}
              path={
                user?.profile_path
                  ? user?.profile_path
                  : 'https://toaping.me/bookfacegram/images/menu_left/icon/toaping.png'
              }
            />
            <Image
              source={images.userCamera}
              borderRadius={100}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.main}>
          <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.title2}>
            ????????????
          </TextWrap>
        </View>
        <View style={styles.mainSub}>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.userInfo}>
            ?????????
          </TextWrap>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.inputStyle}>
            {user?.member_id ? user?.member_id : user?.memberId}
          </TextWrap>
        </View>
        <View style={styles.divider} />
        <View style={styles.mainSub}>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.userInfo}>
            ??????
          </TextWrap>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.inputStyle}>
            {user?.kor_nm ? user?.kor_nm : user?.korNm}
          </TextWrap>
        </View>
        <View style={styles.divider} />
        <View style={styles.mainSub}>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.userInfo}>
            ??????
          </TextWrap>
          <TouchableOpacity
            onPress={() => {
              dispatch(dialogClose());
              dispatch(dialogOpenGradeProfile({ title: '??????' }));
            }}
            style={styles.inputStyle}
          >
            <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.inputStyle}>
              {grade}
            </TextWrap>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={styles.mainSub2}>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.userInfo}>
            ?????????
          </TextWrap>
          <InputWrap2
            style={styles.inputStyle}
            inputStyle={styles.inputValue2}
            value={autoHypenPhone(phone)}
            onChange={eve => {
              setPhone(eve);
              setSaveButtonDisabled(true);
            }}
            maxLength={13}
            placeholder="???????????????(??????)"
            placeholderTextColor="#acacac"
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.mainSub2}>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.userInfo}>
            ?????????
          </TextWrap>
          <InputWrap2
            style={styles.inputStyle2}
            inputStyle={styles.inputValue}
            onChange={emailDuplicatedCheck}
            value={email}
            placeholder="????????? ??????(??????)"
            placeholderTextColor="#acacac"
            message={
              email ? emailLoading ? '???????????? ????????????.' : emailError ? emailError : cmail ? '?????? ????????? ??????????????????.' : 'ex) toaping@naver.com' : 'ex) toaping@naver.com'
            }
            messageColor={
              email
                ? emailLoading
                  ? colors.black
                  : emailError
                    ? colors.red : cmail ? colors.blue : colors.black : colors.black
            }
          />
        </View>
        <View style={styles.divider} />

        <View style={styles.main}>
          <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.title2}>
            ??????
          </TextWrap>
        </View>
        <View style={styles.divider} />
        {user.platform_type === 'app' && (
          <View>
            <TouchableOpacity
              onPress={() => {
                dispatch(dialogClose());
                dispatch(
                  dialogOpenDrawerKeyBoardPW({
                    title: '??????????????????',
                    buttonTitle: '??????',
                  }),
                );
              }}>
              <View style={styles.mainUser}>
                <TextWrap
                  font={fonts.kopubWorldDotumProMedium}
                  style={styles.title}>
                  ??????????????????
                </TextWrap>
                <View>
                  <TextWrap font={fonts.kopubWorldDotumProMedium}>&gt;</TextWrap>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
          </View>)
        }
        <TouchableOpacity
          onPress={() => {
            try {
              dispatch(userSignOut(user.member_id));
            } catch (e) {
              dispatch(dialogError(e));
            }
          }}>
          <View style={styles.mainUser}>
            <TextWrap
              font={fonts.kopubWorldDotumProMedium}
              style={styles.title}>
              ????????????
            </TextWrap>
            <View>
              <TextWrap font={fonts.kopubWorldDotumProMedium}>&gt;</TextWrap>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          onPress={() => {
            dispatch(dialogClose());
            dispatch(
              dialogOpenDrawerKeyBoardWD({
                title: '????????????',
                buttonTitle: '?????? ??? ?????? ??????',
              }),
            );
          }}>
          <View style={styles.mainUser}>
            <TextWrap
              font={fonts.kopubWorldDotumProMedium}
              style={styles.title}>
              ????????????
            </TextWrap>
            <View>
              <TextWrap font={fonts.kopubWorldDotumProMedium}>&gt;</TextWrap>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
      </ScrollView>
      <Footer page={'wer'} />
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  divider: {
    borderRadius: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#F9F9F9',
  },
  input: {
    color: colors.black,
  },
  inputValue: {
    fontFamily: fonts.kopubWorldDotumProMedium,
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(24),
    color: colors.black,
    textAlign: 'left',
    paddingHorizontal: 0,
  },
  inputValue2: {
    fontFamily: fonts.kopubWorldDotumProMedium,
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(24),
    color: colors.black,
    textAlign: 'left',
    paddingHorizontal: 0,
    top: Platform.OS === 'ios' ? heightPercentage(-4) : 0,
  },
  image: {
    width: widthPercentage(30),
    height: heightPercentage(30),
    position: 'absolute',
    right: -5,
    bottom: 3,
    resizeMode: 'contain',
  },
  textInput: {
    marginTop: 5,
    textAlignVertical: 'top',
    padding: 0,
    color: colors.black,
    fontSize: fontPercentage(11),
    fontFamily: fonts.kopubWorldDotumProLight,
  },
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  selectedImage: {
    borderWidth: 3,
    borderColor: 'yellow',
  },
  selectedCount: {
    position: 'absolute',
    right: 5,
    top: 5,
    color: colors.black,
    fontWeight: '700',
    zIndex: 1,
    borderRadius: 10,
    borderWidth: 1,
    textAlign: 'center',
    backgroundColor: 'yellow',
    borderColor: 'yellow',
    width: 20,
    height: 20,
  },
  thumbnail: {
    position: 'absolute',
    left: 8,
    top: 5,
    color: colors.red,
    fontWeight: '700',
    zIndex: 1,
  },

  textIcon: {
    // width: 24,
    // height: 24,
    bottom: -3,
    color: colors.white,
  },
  completeTextIcon: {
    // width: 24,
    // height: 24,
    textAlign: 'right',
    bottom: -3,
    color: colors.blue,
  },
  disabledTextIcon: {
    // width: 24,
    // height: 24,
    textAlign: 'right',
    bottom: -3,
    color: colors.border,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginTop: 15,
    position: 'relative',
  },
  avator: {
    marginTop: 1,
  },
  contentCount: {
    // position: 'absolute',
    // top: 5,
    // right: -widthPercentage(18),
    // fontSize: fontPercentage(11),
  },
  hashTagContianer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: heightPercentage(42),
  },
  hashTagTitle: {
    alignSelf: 'flex-start',
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(19),
    color: '#333333',
  },
  tagText: {
    fontSize: fontPercentage(11),
    color: '#858585',
    fontFamily: fonts.kopubWorldDotumProBold,
  },
  tag: {
    backgroundColor: '#f1f1f1',
    borderColor: '#f1f1f1',
    borderRadius: widthPercentage(13),
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(19),
    fontFamily: fonts.kopubWorldDotumProLight,
  },
  hashTagInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#333333',
    height: 35,
    marginTop: 10,
    flexDirection: 'row',
  },
  customElement: {
    color: colors.red,
    paddingLeft: widthPercentage(6),
    fontSize: fontPercentage(10),
  },
  title2: {
    color: colors.black,
    fontSize: fontPercentage(18),
    lineHeight: fontPercentage(27),
    fontWeight: '700',
  },
  main: {
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 16,
    flexDirection: 'row',
    paddingHorizontal: 16,
    display: 'flex',
    flexShrink: 1,
    justifyContent: 'space-between',
    marginTop: 15,
  },
  mainUser: {
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 16,
    flexDirection: 'row',
    paddingHorizontal: 16,
    display: 'flex',
    flexShrink: 1,
    justifyContent: 'space-between',
  },
  mainSub: {
    paddingVertical: 16,
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignContent: 'flex-start',
    alignSelf: 'stretch',
    display: 'flex',
    flexShrink: 1,
  },
  mainSub2: {
    ...Platform.select({
      ios: {
        paddingVertical: 14,
      },
      android: {
        paddingVertical: 2,
      },
    }),
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignContent: 'flex-start',
    alignSelf: 'stretch',
    display: 'flex',
    flexShrink: 1,
  },
  userInfo: {
    color: colors.black,
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(24),
    display: 'flex',
    flexBasis: 100,
    flexShrink: 1,
    textAlign: 'left',
    alignSelf: 'center',
  },
  inputStyle: {
    color: colors.black,
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(24),
    display: 'flex',
    flexBasis: 300,
    flexShrink: 1,
    textAlign: 'left',


  },
  inputStyle2: {
    color: colors.black,
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(24),
    display: 'flex',
    flexBasis: 300,
    flexShrink: 1,
    textAlign: 'left',
    top: Platform.OS === 'ios' ? heightPercentage(4) : heightPercentage(8),
  },
});
