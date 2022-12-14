import React, {useEffect} from 'react';
import {
  AppState,
  Image,
  Linking,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import routes from '../../libs/routes';
import {dialogError, dialogOpenMessage} from '../../redux/dialog/DialogActions';
import {userCheckToken} from '../../redux/user/UserActions';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
  isIos,
} from '../../services/util';
import {getItem, setItem} from '../../services/preference';
import {splashCheckMultiplePermissions} from '../../services/picker';
import {PERMISSIONS} from 'react-native-permissions';
export default function Splash({navigation}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const listener = (e, a) => {
      if (e === 'active') {
        try {
          dispatch(userCheckToken);
        } catch (e1) {
          // console.log(e1);
        }
      }
    };
    AppState.addEventListener('change', listener);
    let tm = setTimeout(async () => {
      try {
        await splashCheckMultiplePermissions([
          PERMISSIONS.ANDROID.CAMERA,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ]);
        dispatch(userCheckToken);
      } catch (e2) {
        // console.log(e2);
      }
    }, 1000);
    return () => {
      AppState.removeEventListener('change', listener);
      clearTimeout(tm);
      if (!isIos) {
        StatusBar.setBackgroundColor(colors.white);
      }
      StatusBar.setBarStyle('dark-content');
    };
  }, []);

  return (
    <RootLayout style={styles.root} safeBackgroundColor={colors.background}>
      <View style={styles.view}>
        <Image source={images.splash} style={styles.logo} />
        <TextWrap font={fonts.kopubWorldDotumProBold} style={styles.title}>
          ???????????? ????????? ??????!
        </TextWrap>
        <TextWrap font={fonts.kopubWorldDotumProLight} style={styles.subTitle}>
          ?????? ?????? ??????????????? ?????? ????????? ?????? ?????? ????????? ????????? ?????????
          ???????????????.
        </TextWrap>
      </View>
    </RootLayout>
  );
}
const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
  },
  logo: {
    width: widthPercentage(161),
    height: heightPercentage(113),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  view: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#ffffff',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 15,
    width: widthPercentage(192),
    fontSize: fontPercentage(22, 'title'),
    lineHeight: fontPercentage(34),
  },
  subTitle: {
    color: '#ffffff',
    marginTop: 25,
    alignSelf: 'center',
    width: widthPercentage(226),
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(18),
    textAlign: 'center',
  },
});
