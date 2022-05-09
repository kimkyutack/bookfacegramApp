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

export default function DialogGrade({route}) {
  const dispatch = useDispatch();
  const [rank, setRank] = useState('all');
  const {gradeDialog} = useSelector(s => s.dialog, shallowEqual);
  const gradeArr = [
    {name: '전체', value: 'all'},
    {name: '유아', value: 'preSchool'},
    {name: '초등학교 1학년', value: '00004'},
    {name: '초등학교 2학년', value: '00005'},
    {name: '초등학교 3학년', value: '00006'},
    {name: '초등학교 4학년', value: '00007'},
    {name: '초등학교 5학년', value: '00008'},
    {name: '초등학교 6학년', value: '00009'},
    {name: '중학교 1학년', value: '00010'},
    {name: '중학교 2학년', value: '00011'},
    {name: '중학교 3학년', value: '00012'},
    {name: '고등학교 1학년', value: '00013'},
    {name: '고등학교 2학년', value: '00014'},
    {name: '고등학교 3학년', value: '00015'},
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
  const {Troutes} = {
    name: routes.topActivity,
    component: TopActivity,
    initialParams: {type: 'quiz', rank: '00004'},
    options: {tabBarLabel: 'ACTIVITY'},
  };
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
              backgroundColor: '#403737',
              height: screenHeight / 1.07,
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
                    dispatch(
                      setTab({
                        tab: 'quiz',
                        rank: item.value,
                      }),
                    );
                    dispatch(dialogClose());
                  }}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.message}>
                    {item.name}
                  </TextWrap>
                </TouchableOpacity>
              ))}
              {/*<RadioForm animation={true}>

                {radio_props.map((obj, i) => (
                  <RadioButton labelHorizontal={true} key={i}>

                    <RadioButtonLabel
                      obj={obj}
                      index={i}
                      labelHorizontal={true}
                      onPress={() => {
                        dispatch(
                          setTab({
                            tab: 'quiz',
                            rank: obj.value,
                          }),
                        );
                        setRank(obj.value);
                        dispatch(dialogClose());
                      }}
                      labelStyle={styles.message}
                      labelWrapStyle={{}}
                    />
                    <RadioButtonInput
                      obj={obj}
                      index={i}
                      isSelected={rank === obj.value}
                      onPress={() => {
                        dispatch(
                          setTab({
                            tab: 'quiz',
                            rank: obj.value,
                          }),
                        );
                        setRank(obj.value);
                        dispatch(dialogClose());
                      }}
                      borderWidth={1}
                      buttonOuterColor={'#fff'}
                      buttonSize={25}
                      buttonOuterSize={50}
                      buttonStyle={{}}
                      buttonWrapStyle={{left: 500}}
                    />
                  </RadioButton>
                ))}
                    </RadioForm>*/}
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
    lineHeight: screenHeight / 72,
    fontSize: fontPercentage(10),
    color: 'white',
    textAlign: 'left',
    paddingHorizontal: 20,
    paddingVertical: screenHeight / 35,
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
  iconContainer: {
    borderBottomWidth: 1,
    borderColor: '#c9c9c9',
    height: screenHeight / 15,
    marginLeft: widthPercentage(15),
    marginRight: widthPercentage(15),
  },
});
