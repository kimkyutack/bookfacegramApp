import React, {useEffect} from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import {dialogClose} from '../../redux/dialog/DialogActions';

export default function DialogAction({}) {
  const dispatch = useDispatch();
  const {actionDialog} = useSelector(s => s.dialog, shallowEqual);

  useEffect(() => {
    if (actionDialog.open) {
      Keyboard.dismiss();
    }
  }, [actionDialog.open]);

  if (!actionDialog.open) {
    return null;
  }
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.wrap}>
        <View style={styles.dialog}>
          <TextWrap
            style={[
              styles.message2,
              {
                marginTop: actionDialog.label ? 8 : 33,
                fontWeight: 'bold',
              },
            ]}>
            알림
          </TextWrap>
          <TextWrap style={styles.message}>{actionDialog.message}</TextWrap>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.button3, styles.button2]} />
            <TouchableOpacity
              style={[styles.button, styles.button2]}
              onPress={() => {
                dispatch(dialogClose());
                if (actionDialog.onPress) {
                  actionDialog.onPress(false);
                }
              }}>
              <TextWrap
                font={fonts.kopubWorldDotumProMedium}
                style={styles.title}>
                {actionDialog.cancelTitle}
              </TextWrap>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.button2]}
              onPress={() => {
                dispatch(dialogClose());
                if (actionDialog.onPress) {
                  actionDialog.onPress(true);
                }
              }}>
              <TextWrap
                font={fonts.kopubWorldDotumProMedium}
                style={[
                  styles.title2,
                  actionDialog.titleColor && {color: actionDialog.titleColor},
                ]}>
                {actionDialog.title}
              </TextWrap>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', width:'100%'},
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    bottom: 0,
    zIndex: consts.dialogZindex,
  },
  wrap: {flex: 1, justifyContent: 'center'},
  dialog: {
    width:'100%',
    backgroundColor: colors.white,
    marginHorizontal: 30,
    borderRadius: 8,
  },
  message2: {
    lineHeight: 21,
    fontSize: 16,
    color: '#222222',
    textAlign: 'left',
    paddingHorizontal: 30,
  },
  message: {
    lineHeight: 21,
    fontSize: 14,
    color: '#222222',
    textAlign: 'left',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  button: {
    paddingVertical: 18,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  button3: {
    paddingVertical: 18,
    alignItems: 'center',
    flex: 4,
    justifyContent: 'center',
  },
  button2: {
    // borderRightWidth: 1,
  },
  title2: {
    fontSize: 15,
    lineHeight: 21,
    color: colors.primary,
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    color: '#222222',
  },
});
