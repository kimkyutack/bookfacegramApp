import React, { useEffect } from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import { dialogClose } from '../../redux/dialog/DialogActions';
import {
  screenHeight,
  fontPercentage,
  heightPercentage,
  screenWidth,
  widthPercentage,
} from '../../services/util';

export default function DialogAction({ }) {
  const dispatch = useDispatch();
  const { actionDialog } = useSelector(s => s.dialog, shallowEqual);

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
          <View style={styles.row2}>
            <TouchableOpacity
              style={[actionDialog.title.length > 3 ? styles.button : styles.button5]}
              onPress={() => {
                if (actionDialog.onPress) {
                  actionDialog.onPress(false);
                }
                dispatch(dialogClose());
              }}>
              <TextWrap
                font={fonts.kopubWorldDotumProMedium}
                style={styles.title}>
                {actionDialog.cancelTitle}
              </TextWrap>
            </TouchableOpacity>
            <TouchableOpacity
              style={[actionDialog.title.length > 3 ? styles.button2 : styles.button4]}
              onPress={() => {
                if (actionDialog.onPress) {
                  actionDialog.onPress(true);
                }
                dispatch(dialogClose());
              }}>
              <TextWrap
                font={fonts.kopubWorldDotumProMedium}
                style={[
                  styles.title2,
                  actionDialog.titleColor && { color: actionDialog.titleColor },
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
  row: { flexDirection: 'row', alignSelf: 'flex-end', justifyContent: 'flex-end', width: '50%' },
  row2: { flexDirection: 'row', alignSelf: 'flex-end', justifyContent: 'flex-end', width: '50%' },
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    bottom: 0,
    zIndex: consts.dialogZindex,
  },
  wrap: { flex: 1, justifyContent: 'center' },
  dialog: {
    backgroundColor: colors.white,
    marginHorizontal: 30,
    borderRadius: 8,
  },
  message2: {
    lineHeight: 21,
    fontSize: fontPercentage(16),
    color: '#222222',
    textAlign: 'left',
    paddingHorizontal: 30,
  },
  message: {
    lineHeight: 21,
    fontSize: fontPercentage(14),
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
    flex: 3,
    justifyContent: 'center',
  },
  button2: {
    paddingVertical: 18,
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
  },
  button4: {
    paddingVertical: 18,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',

  },
  button5: {
    paddingVertical: 18,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    left: 18,
  },
  title3: {
    fontSize: fontPercentage(15),
    lineHeight: 21,
    color: colors.primary,
    textAlign: 'left',
  },
  title2: {
    fontSize: fontPercentage(15),
    lineHeight: 21,
    color: colors.primary,
  },
  title: {
    fontSize: fontPercentage(15),
    lineHeight: 21,
    color: '#222222',
  },
});
