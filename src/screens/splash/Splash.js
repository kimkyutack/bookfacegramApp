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
import image from '../../libs/image';
import routes from '../../libs/routes';
import {dialogError, dialogOpenMessage} from '../../redux/dialog/DialogActions';
import {userCheckToken} from '../../redux/user/UserActions';
import {
  reset,
  isReadyRef,
  navigationRef,
  navigate,
} from '../../services/navigation';
import {requestPost} from '../../services/network';
import {isIos} from '../../services/util';
import {getItem, setItem} from '../../services/preference';

export default function Splash({navigation}) {
  const user = useSelector(s => s.user, shallowEqual);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user.signed) {
      if (user.intro_setting) {
        reset(routes.home);
      } else {
        navigate(routes.intro1);
      }
    } else if (user.inited) {
      reset(routes.login);
    }
  }, [user.inited, user.signed]);

  useEffect(() => {
    const listener = (e, a) => {
      if (e === 'active') {
        try {
          dispatch(userCheckToken);
        } catch (e1) {
          console.log(e1);
        }
      }
    };
    AppState.addEventListener('change', listener);
    let tm = setTimeout(() => {
      try {
        dispatch(userCheckToken);
      } catch (e2) {
        console.log(e2);
      }
    }, 100);

    return () => {
      AppState.removeEventListener('change', listener);
      clearTimeout(tm);
    };
  }, []);

  return (
    <RootLayout style={styles.root} safeBackgroundColor={colors.background}>
      <View style={styles.view}>
        <Image source={image.splash} style={styles.logo} />
      </View>
      <TextWrap font={fonts.barlowRegular} style={styles.info}>
        © (주)피씨엔씨 OF PUBLIC POLICY AND MANAGEMENT.
      </TextWrap>
    </RootLayout>
  );
}
const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
  },
  logo: {
    // marginLeft: 30,
    // width: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
    // tintColor: colors.white,
  },
  view: {
    flex: 1,
    justifyContent: 'center',
  },
  info: {
    fontSize: 12,
    lineHeight: 30,
    color: '#a0e5be',
    marginBottom: 30,
    alignSelf: 'center',
  },
});
