import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  View,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import {dialogClose} from '../../redux/dialog/DialogActions';
import routes from '../../libs/routes';
import {setTab} from '../../redux/tab/TabAction';
import {navigate} from '../../services/navigation';
import TopActivity from '../../screens/home/TopActivity';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {
  screenHeight,
  fontPercentage,
  heightPercentage,
  screenWidth,
  widthPercentage,
} from '../../services/util';

export default function DialogGradeProfile({}) {
  const dispatch = useDispatch();
  const {gradeDialogProfile} = useSelector(s => s.dialog, shallowEqual);
  const gradeArr = [
    {name: '유치', value: '2'},
    {name: '초등학교 1학년', value: '3'},
    {name: '초등학교 2학년', value: '4'},
    {name: '초등학교 3학년', value: '5'},
    {name: '초등학교 4학년', value: '6'},
    {name: '초등학교 5학년', value: '7'},
    {name: '초등학교 6학년', value: '8'},
    {name: '중학교 1학년', value: '9'},
    {name: '중학교 2학년', value: '10'},
    {name: '중학교 3학년', value: '11'},
    {name: '고등학교 1학년', value: '12'},
  ];
  const radio_props = [
    {label: '전체', value: 'all'},
    {label: '유아', value: 'preSchool'},
    {label: '초등학교 1학년', value: '00004'},
    {label: '초등학교 2학년', value: '00005'},
    {label: '초등학교 3학년', value: '00006'},
    {label: '초등학교 4학년', value: '00007'},
    {label: '초등학교 5학년', value: '00008'},
    {label: '초등학교 6학년', value: '00009'},
    {label: '중학교 1학년', value: '00010'},
    {label: '중학교 2학년', value: '00011'},
    {label: '중학교 3학년', value: '00012'},
    {label: '고등학교 1학년', value: '00013'},
    {label: '고등학교 2학년', value: '00014'},
    {label: '고등학교 3학년', value: '00015'},
  ];
  useEffect(() => {
    if (gradeDialogProfile.open) {
      Keyboard.dismiss();
    }
  }, [gradeDialogProfile.open]);

  if (!gradeDialogProfile.open) {
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
              backgroundColor: '#403737',
              height: screenHeight / 1.36,
              marginLeft: widthPercentage(15),
              marginRight: widthPercentage(15),
              alignItems: 'center',
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                width: screenWidth,
              }}>
              {gradeArr.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.iconContainer}
                  onPress={() => {
                    navigate(routes.profile, {grade: item.value});
                    dispatch(dialogClose());
                  }}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.message}>
                    {item.name}
                  </TextWrap>
                </TouchableOpacity>
              ))}
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
    fontSize: fontPercentage(11),
    color: 'white',
    textAlign: 'left',
    paddingHorizontal: 20,
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
    paddingVertical: 18,
    paddingHorizontal: 18,
    // borderTopColor: colors.prussianBlue,
    alignItems: 'flex-end',
    // colors: colors.prussianBlue,
    justifyContent: 'center',
  },
  title: {
    fontSize: fontPercentage(15),
    lineHeight: 21,
    color: colors.blue,
  },
  iconContainer: {
    borderBottomWidth: 1,
    borderColor: '#c9c9c9',
    height: screenHeight / 15,
    marginLeft: widthPercentage(15),
    marginRight: widthPercentage(15),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
