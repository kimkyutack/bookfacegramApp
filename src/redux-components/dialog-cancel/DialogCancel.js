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
import {dialogClose, dialogCloseMessage, dialogError} from '../../redux/dialog/DialogActions';
import {
  screenHeight,
  fontPercentage,
  heightPercentage,
  screenWidth,
  widthPercentage,
} from '../../services/util';
import { requestGet } from '../../services/network';
import { setPayCancel } from '../../redux/payment/PayAction';

export default function DialogCancel({}) {
  const dispatch = useDispatch();
  const {cancelDialog} = useSelector(s => s.dialog, shallowEqual);
   //해당 모임별 데이터 가져오기
  const fetchRequested = async () => {
    console.log(cancelDialog.orderCode)
    try {
      const { data, status } = await requestGet({
        url: consts.apiUrl + '/mypage/village/cancel',
        query: {
          orderCode: cancelDialog.orderCode,
        },
      });
      if (status === 'SUCCESS') {
        dispatch(dialogClose());
        dispatch(setPayCancel(cancelDialog.orderCode));
        dispatch(dialogError('취소처리가 완료되었습니다.'));
      }
      return status;
    } catch (error) {
      dispatch(dialogClose());
      dispatch(dialogError(error));
    }
  };

  useEffect(() => {
    if (cancelDialog.open) {
      Keyboard.dismiss();
    }
  }, [cancelDialog.open]);

  if (!cancelDialog.open) {
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
                marginTop: cancelDialog.label ? 8 : 33,
                fontWeight: 'bold',
              },
            ]}>
            알림
          </TextWrap>
          <TextWrap style={[styles.message]}>{cancelDialog.message}</TextWrap>
          <View style={styles.row2}>
              <View style={{flex:1}}>
              </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => dispatch(dialogClose())}>
            <TextWrap
              font={fonts.kopubWorldDotumProMedium}
              style={styles.title}>
              취소
            </TextWrap>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => fetchRequested()}>
            <TextWrap
              font={fonts.kopubWorldDotumProMedium}
              style={styles.title}>
              확인
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
    elevation: consts.dialogZindex,
  },
  row2: {flexDirection: 'row', alignSelf: 'flex-end', justifyContent : 'flex-end' ,width : '70%'},
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
