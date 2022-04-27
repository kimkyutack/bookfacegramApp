import React, {useEffect} from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
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
  screenWidth,
  widthPercentage,
} from '../../services/util';

export default function DialogGrade({}) {
  const dispatch = useDispatch();
  const {gradeDialog} = useSelector(s => s.dialog, shallowEqual);

  useEffect(() => {
    if (gradeDialog.open) {
      Keyboard.dismiss();
    }
  }, [gradeDialog.open]);

  if (!gradeDialog.open) {
    return null;
  }
  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity
        style={styles.wrap}
        onPress={() => dispatch(dialogClose())}>
        <TouchableWithoutFeedback
          onPress={() => {
            return;
          }}>
          <View
            style={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              backgroundColor: colors.white,
              height: heightPercentage(350),
              alignItems: 'center',
            }}>
            <View
              style={{
                width: widthPercentage(31),
                borderBottomColor: '#c2c2c2',
                borderRadius: 3,
                borderBottomWidth: 4,
                position: 'absolute',
                top: 12,
                alignSelf: 'center',
              }}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: heightPercentage(30),
                left: widthPercentage(20),
              }}
              onPress={() => dispatch(dialogClose())}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: heightPercentage(25),
                right: widthPercentage(20),
              }}
              onPress={() => {
                dispatch(dialogClose());
              }}
            />
            <TextWrap
              style={styles.inputTitle}
              font={fonts.kopubWorldDotumProBold}>
              {gradeDialog.title ? gradeDialog.title : '이동 책서랍 선택'}
            </TextWrap>
            <View
              style={{
                width: screenWidth,
                borderBottomColor: '#eeeeee',
                borderBottomWidth: 1.5,
                position: 'absolute',
                top: heightPercentage(61.5),
              }}
            />
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                width: screenWidth,
                marginTop: heightPercentage(30),
                marginBottom: 20,
              }}>
              {gradeDialog.drawerList?.length > 0 &&
                gradeDialog?.drawerList?.map((x, index) => {
                  if (gradeDialog.currentDrawerIndex === x[0].contentsIdx) {
                    return <View key={index} />;
                  } else {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.iconContainer}
                        onPress={() => {
                          alert('11');
                        }}>
                        <TextWrap
                          font={fonts.kopubWorldDotumProMedium}
                          style={styles.message}>
                          {x[0]?.name}
                        </TextWrap>
                      </TouchableOpacity>
                    );
                  }
                })}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
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
    textAlign: 'left',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  label: {
    paddingHorizontal: 30,
    color: '#222222',
    lineHeight: 20,
    fontSize: 15,
    textAlign: 'left',
  },
  button: {
    // borderTopWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 18,
    // borderTopColor: colors.prussianBlue,
    alignItems: 'flex-end',
    // colors: colors.prussianBlue,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    color: colors.blue,
  },
});
