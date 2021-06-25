import React, {useEffect} from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import {dialogClose} from '../../redux/dialog/DialogActions';

export default function DialogAction({}) {
  const dispatch = useDispatch();
  const {actionDialog} = useSelector((s) => s.dialog, []);

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
          <TextWrap style={styles.message}>{actionDialog.message}</TextWrap>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.button, styles.button2]}
              onPress={() => {
                dispatch(dialogClose());
                if (actionDialog.onPress) {
                  actionDialog.onPress(false);
                }
              }}>
              <TextWrap font={fonts.robotoMedium} style={styles.title}>
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
                font={fonts.robotoMedium}
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
  row: {flexDirection: 'row', alignItems: 'center'},
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
    backgroundColor: colors.white,
    marginHorizontal: 30,
    borderRadius: 8,
  },
  message: {
    lineHeight: 21,
    fontSize: 14,
    color: '#222222',
    marginTop: 44,
    textAlign: 'center',
    marginBottom: 36,
    paddingHorizontal: 30,
  },
  button: {
    borderTopWidth: 1,
    paddingVertical: 18,
    borderTopColor: '#f2f2f2',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  button2: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
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
