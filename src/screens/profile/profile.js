import {useRoute} from '@react-navigation/native';
import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import CameraRoll from '@react-native-community/cameraroll';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
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
} from 'react-native';
import TagInput from 'react-native-tags-input';
import Avatar from '../../components/avatar/Avatar';
import TextWrap from '../../components/text-wrap/TextWrap';
import Topbar from '../../components/topbar/Topbar';
import InputWrap2 from '../../components/input-wrap/InputWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import {userSignOut} from '../../redux/user/UserActions';
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
  widthPercentage,
} from '../../services/util';
import {goBack, navigate} from '../../services/navigation';
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
  dialogOpenSelect,
  dialogOpenDrawerKeyBoardPW,
} from '../../redux/dialog/DialogActions';
import {
  userUpdateProfileImage,
  userUpdate,
  userUpdate2,
  userCheckToken,
} from '../../redux/user/UserActions';
import Footer from '../../libs/footer';

export default function Profile({route, navigation}) {
  const user = useSelector(s => s.user, shallowEqual);
  const inputRef = useRef();
  const isFocused = useIsFocused();
  //alert(JSON.stringify(user));
  const dispatch = useDispatch();
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [phone, setPhone] = useState(user?.handphone ? user?.handphone : '');
  const [email, setEmail] = useState(user?.email ? user?.email : '');
  const [emailError, setEmailError] = useState('');
  const [length, setLength] = useState('');
  let infograde = user.grade * 1;
  let grade = '';

  useEffect(() => {
    console.log(JSON.stringify(user));
    const unsubscribe = navigation.addListener('focus', () => {
      setSaveButtonDisabled(false);
      setPhone(user?.handphone ? user?.handphone : '');

      setEmail(user?.email ? user?.email : '');

      //Put your Data loading function here instead of my loadData()
    });

    return unsubscribe;
  }, [navigate, user.handphone, user.email, user?.profile_path]);

  useEffect(() => {
    console.log(JSON.stringify(user));
    setSaveButtonDisabled(false);
    setPhone(user?.handphone ? user?.handphone : '');

    setEmail(user?.email ? user?.email : '');
  }, [user]);

  switch (infograde) {
    case 2:
      grade = '유치';
      break;
    case 3:
      grade = '초등학교 1학년';
      break;
    case 4:
      grade = '초등학교 2학년';
      break;
    case 5:
      grade = '초등학교 3학년';
      break;
    case 6:
      grade = '초등학교 4학년';
      break;
    case 7:
      grade = '초등학교 5학년';
      break;
    case 8:
      grade = '초등학교 6학년';
      break;
    case 9:
      grade = '중학교 1학년';
      break;
    case 10:
      grade = '중학교 2학년';
      break;
    case 11:
      grade = '중학교 3학년';
      break;
    case 12:
      grade = '고등학교 1학년';
      break;
    default:
      grade = '없음';
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
          dispatch(dialogError('수정되었습니다.'));
          //alert(JSON.stringify(user));
          setSaveButtonDisabled(false);
        } else if (res.status === 'FAIL') {
          // error 일때 해야함
          dispatch(dialogError(res.data.msg));
        } else {
        }
      })
      .catch(error => {
        dispatch(dialogError(error));
        // error 일때 해야함
      });
  };
  const emailDuplicatedCheck = async e => {
    let preventKorReg = /[^A-Za-z0-9@.]/gi;
    let emailFormatReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (emailFormatReg.test(e) === false) {
      setEmail(e.replace(preventKorReg, ''));
      setEmailError('이메일 형식이 맞지 않습니다. ex) toaping@naver.com');
    } else {
      setEmail(e.replace(preventKorReg, ''));
      setEmailError('');
    }
    try {
      if (!emailError) {
        setEmailLoading(true);
        const {data, status} = await requestGet({
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
            setEmailError('이메일 형식이 맞지 않습니다. ex) toaping@naver.com');
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
        title: '개인정보수정',
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
              저장
            </TextWrap>
          ),
          onPress: () => (saveButtonDisabled ? UpdateProfile() : null),
        },
      }}>
      <ScrollView>
        <View style={styles.userInfoContainer}>
          <TouchableOpacity
            onPress={() => {
              dispatch(userUpdateProfileImage(user.profile_path));
            }}>
            <Avatar
              size={84}
              style={styles.avator}
              path={
                user?.profile_path
                  ? user?.profile_path
                  : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
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
            기본정보
          </TextWrap>
        </View>
        <View style={styles.mainSub}>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.userInfo}>
            아이디
          </TextWrap>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.inputStyle}>
            {user.member_id}
          </TextWrap>
        </View>

        <View style={styles.divider} />
        <View style={styles.mainSub}>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.userInfo}>
            이름
          </TextWrap>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.inputStyle}>
            {user.kor_nm}
          </TextWrap>
        </View>
        <View style={styles.divider} />
        <View style={styles.mainSub}>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.userInfo}>
            학년
          </TextWrap>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.inputStyle}>
            {grade}
          </TextWrap>
        </View>
        <View style={styles.divider} />
        <View style={styles.mainSub}>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.userInfo}>
            연락처
          </TextWrap>
          <InputWrap2
            style={styles.inputStyle}
            inputStyle={styles.inputValue}
            value={autoHypenPhone(phone)}
            onChange={eve => {
              setPhone(eve);
              setSaveButtonDisabled(true);
            }}
            maxLength={13}
            placeholder="핸드폰번호(필수)"
            placeholderTextColor="#acacac"
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.mainSub}>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.userInfo}>
            이메일
          </TextWrap>
          <InputWrap2
            style={styles.inputStyle}
            inputStyle={styles.inputValue}
            onChange={emailDuplicatedCheck}
            value={email}
            placeholder="이메일 주소(필수)"
            placeholderTextColor="#acacac"
            message={
              email
                ? emailLoading
                  ? '중복체크 중입니다.'
                  : emailError
                  ? emailError
                  : '사용 가능한 이메일입니다.'
                : 'ex) toaping@naver.com'
            }
            messageColor={
              email
                ? emailLoading
                  ? colors.black
                  : emailError
                  ? colors.red
                  : colors.blue
                : colors.black
            }
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.main}>
          <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.title2}>
            계정
          </TextWrap>
        </View>
        <View style={styles.divider} />
        <TouchableOpacity
          onPress={() => {
            dispatch(dialogClose());
            dispatch(
              dialogOpenDrawerKeyBoardPW({
                title: '비밀번호변경',
                buttonTitle: '등록',
              }),
            );
          }}>
          <View style={styles.mainUser}>
            <TextWrap
              font={fonts.kopubWorldDotumProMedium}
              style={styles.title}>
              비밀번호변경
            </TextWrap>
            <View>
              <TextWrap font={fonts.kopubWorldDotumProMedium}>&gt;</TextWrap>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
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
              로그아웃
            </TextWrap>
            <View>
              <TextWrap font={fonts.kopubWorldDotumProMedium}>&gt;</TextWrap>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity>
          <View style={styles.mainUser}>
            <TextWrap
              font={fonts.kopubWorldDotumProMedium}
              style={styles.title}>
              회원탈퇴
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
    fontSize: fontPercentage(16),
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
  userInfo: {
    color: colors.black,
    fontSize: fontPercentage(16),
    lineHeight: fontPercentage(24),
    display: 'flex',
    flexBasis: 100,
    flexShrink: 1,
    textAlign: 'left',
    alignSelf: 'center',
  },
  inputStyle: {
    color: colors.black,
    fontSize: fontPercentage(16),
    lineHeight: fontPercentage(24),
    display: 'flex',
    flexBasis: 300,
    flexShrink: 1,
    textAlign: 'left',
  },
});
