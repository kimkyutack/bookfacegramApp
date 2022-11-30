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
import {
  screenHeight,
  fontPercentage,
  heightPercentage,
  screenWidth,
  widthPercentage,
} from '../../services/util';

export default function DialogPayment({}) {
  const dispatch = useDispatch();
  const {paymentDialog} = useSelector(s => s.dialog, shallowEqual);

  useEffect(() => {
    if (paymentDialog.open) {
      Keyboard.dismiss();
    }
  }, [paymentDialog.open]);

  if (!paymentDialog.open) {
    return null;
  }
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.wrap}>
        <View style={styles.dialog}>
          {Boolean(paymentDialog.label) && (
            <TextWrap
              font={fonts.kopubWorldDotumProBold}
              style={[
                styles.label,
                {
                  marginTop: paymentDialog.label ? 23 : 0,
                },
              ]}>
              {paymentDialog.label}
            </TextWrap>
          )}
          <TextWrap
            style={[
              styles.message2,
              {
                marginTop: paymentDialog.label ? 8 : 33,
                fontWeight: 'bold',
              },
            ]}>
            알림
          </TextWrap>
          <TextWrap style={[styles.message]}>{paymentDialog.message}</TextWrap>
          <View style={styles.row2}>
              <View style={{flex:1}}>
              </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              dispatch(dialogClose());
              if (paymentDialog.onPress) {
                paymentDialog.onPress(true);
              }
            }}>
            <TextWrap
              font={fonts.kopubWorldDotumProMedium}
              style={styles.title}>
              {paymentDialog.title}
            </TextWrap>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    bottom: 0,
    zIndex: consts.dialogZindex,
  },
  row2: {flexDirection: 'row', alignSelf: 'flex-end', justifyContent : 'flex-end' ,width : '50%'},
  wrap: {flex: 1, justifyContent: 'center'},
  dialog: {
    backgroundColor: colors.white,
    marginHorizontal: 30,
    borderRadius: 8,
  },
  message2: {
    ...Platform.select({
      android:{
        lineHeight: 21,
      },
    }),
    fontSize: fontPercentage(16),
    color: '#222222',
    textAlign: 'left',
    paddingHorizontal: 30,
  },
  message: {
    ...Platform.select({
      android:{
        lineHeight: 21,
      },
    }),
    fontSize: fontPercentage(14),
    color: '#222222',
    textAlign: 'left',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  label: {
    paddingHorizontal: 30,
    color: '#222222',
    lineHeight: 20,
    fontSize: fontPercentage(15),
    textAlign: 'left',
  },
  button: {
    // borderTopWidth: 1,
    flex:1,
    paddingVertical: 18,
    // borderTopColor: colors.prussianBlue,
    alignItems: 'center',
    // colors: colors.prussianBlue,
    justifyContent: 'center',
  },
  title: {
    fontSize: fontPercentage(15),
    lineHeight: 21,
    color: colors.blue,
  },
});
