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
import { setDateOption } from '../../redux/dateaction/DateAction';

export default function DialogDate({route}) {
  const dispatch = useDispatch();
  const {dateDialog} = useSelector(s => s.dialog, shallowEqual);
  const detailTab = useSelector(s => s.tab, shallowEqual);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const today = year + '-' + month + '-' +date;



  const eyear = new Date(year, now.getMonth() - 1, now.getDate()).getFullYear();
  const emonth = new Date(year, now.getMonth() - 1, now.getDate()).getMonth() + 1;
  const edate = new Date(year, now.getMonth() - 1, now.getDate()).getDate();
  const eDate = eyear + '-' + emonth + '-' + edate;

  const weekyear = new Date(year, now.getMonth(), now.getDate() - 7).getFullYear();
  const weekmonth = new Date(year, now.getMonth(), now.getDate() - 7).getMonth() + 1 >= 10 ? new Date(year, now.getMonth(), now.getDate() - 7).getMonth() + 1 : '0' + (new Date(year, now.getMonth(), now.getDate() - 7).getMonth() + 1);
  const weekdate = new Date(year, now.getMonth(), now.getDate() - 7).getDate() >= 10 ? new Date(year, now.getMonth(), now.getDate() - 7).getDate() : '0' + new Date(year, now.getMonth(), now.getDate() - 7).getDate();
  const weekDate = weekyear + '-' + weekmonth + '-' + weekdate;

  const tyear = new Date(year, now.getMonth() - 3, now.getDate()).getFullYear();
  const tmonth = new Date(year, now.getMonth() - 3, now.getDate()).getMonth() + 1 >= 10 ? new Date(year, now.getMonth() - 3, now.getDate()).getMonth() + 1 : '0' + (new Date(year, now.getMonth() - 3, now.getDate()).getMonth() + 1);
  const tdate = new Date(year, now.getMonth() - 3, now.getDate()).getDate() >= 10 ? new Date(year, now.getMonth() - 3, now.getDate()).getDate() : '0' + new Date(year, now.getMonth() - 3, now.getDate()).getDate();
  const tDate = tyear + '-' + tmonth + '-' + tdate;

  const syear = new Date(year, now.getMonth() - 6, now.getDate()).getFullYear();
  const smonth = new Date(year, now.getMonth() - 6, now.getDate()).getMonth() + 1 >= 10 ? new Date(year, now.getMonth() - 6, now.getDate()).getMonth() + 1 : '0' + (new Date(year, now.getMonth() - 6, now.getDate()).getMonth() + 1);
  const sdate = new Date(year, now.getMonth() - 6, now.getDate()).getDate() >= 10 ? new Date(year, now.getMonth() - 6, now.getDate()).getDate() : '0' + new Date(year, now.getMonth() - 6, now.getDate()).getDate();
  const sDate = syear + '-' + smonth + '-' + sdate;

  const dateArr = [
    {name: '최근 1주일', value: weekDate},
    {name: '최근 1개월', value: eDate},
    {name: '최근 3개월', value: tDate},
    {name: '최근 6개월', value: sDate},
    {name: '직접입력', value: eDate},
  ];

  useEffect(() => {
    if (dateDialog.open) {
      Keyboard.dismiss();
    }
  }, [dateDialog.open]);

  if (!dateDialog.open) {
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
              height: screenHeight / 3.02,
              marginLeft: widthPercentage(15),
              marginRight: widthPercentage(15),
              alignItems: 'center',
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                width: screenWidth,
              }}>
              {dateArr.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.iconContainer}
                  onPress={() => {
                    dispatch(setDateOption(item.value,today, item.name));
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
    fontSize: fontPercentage(10),
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
