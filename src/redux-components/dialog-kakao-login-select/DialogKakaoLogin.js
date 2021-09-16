import React, {useEffect} from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Image,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import {dialogClose} from '../../redux/dialog/DialogActions';
import images from '../../libs/images';
import {
  fontPercentage,
  heightPercentage,
  widthPercentage,
} from '../../services/util';

export default function DialogKakaoLogin({}) {
  const dispatch = useDispatch();
  const {selectKakaoLoginDialog} = useSelector(s => s.dialog, shallowEqual);
  useEffect(() => {
    if (selectKakaoLoginDialog.open) {
      Keyboard.dismiss();
    }
  }, [selectKakaoLoginDialog.open]);

  if (!selectKakaoLoginDialog.open) {
    return null;
  }

  const handleOnpress = onPress => {
    dispatch(dialogClose());
    onPress();
  };
  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity
        style={styles.wrap}
        onPress={() => dispatch(dialogClose())}>
        <TextWrap style={styles.loginText} font={fonts.kopubWorldDotumProBold}>
          로그인
        </TextWrap>
        {selectKakaoLoginDialog.item.length > 0 &&
          selectKakaoLoginDialog.item.map((x, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.iconContainer}
                // onPress={x.onPress}
                onPress={() => handleOnpress(x.onPress)}>
                <Image
                  style={x.type === 'login' ? styles.loginIcon : styles.icon}
                  source={x.source}
                />
                <TextWrap style={styles.message}>{x.name}</TextWrap>
              </TouchableOpacity>
            );
          })}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    bottom: 0,
    zIndex: consts.dialogZindex,
  },
  wrap: {flex: 1, justifyContent: 'center'},

  dialog3: {
    // flex: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: colors.white,
    // paddingHorizontal: 3,
  },
  loginText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: fontPercentage(22),
    marginBottom: 20,
  },
  message: {
    lineHeight: 21,
    fontSize: 12,
    color: '#222222',
    fontWeight: '700',
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
  },
  icon: {
    width: widthPercentage(40),
    resizeMode: 'contain',
  },
  loginIcon: {
    width: widthPercentage(260),
    resizeMode: 'contain',
  },
});
