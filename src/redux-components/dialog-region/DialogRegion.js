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

export default function DialogRegion({route}) {
  const dispatch = useDispatch();
  const [region, setRegion] = useState('all');
  const {regionDialog} = useSelector(s => s.dialog, shallowEqual);
  const regionArr = [
    {name: '전체지역', value: 'all'},
    {name: '강원도', value: '강원도'},
    {name: '경기도', value: '경기도'},
    {name: '경상남도', value: '경상남도'},
    {name: '경상북도', value: '경상북도'},
    {name: '광주광역시', value: '광주광역시'},
    {name: '대구광역시', value: '대구광역시'},
    {name: '대전광역시', value: '대전광역시'},
    {name: '부산광역시', value: '부산광역시'},
    {name: '서울특별시', value: '서울특별시'},
    {name: '세종특별자치시', value: '세종특별자치시'},
    {name: '울산광역시', value: '울산광역시'},
    {name: '전라남도', value: '전라남도'},
    {name: '전라북도', value: '전라북도'},
    {name: '제주특별자치도', value: '제주특별자치도'},
    {name: '충청남도', value: '충청남도'},
    {name: '충청북도', value: '충청북도'},
  ];
  const radio_props = [
    {label: '전체지역', value: 'all'},
    {label: '강원도', value: '강원도'},
    {label: '경기도', value: '경기도'},
    {label: '경상남도', value: '경상남도'},
    {label: '경상북도', value: '경상북도'},
    {label: '광주광역시', value: '광주광역시'},
    {label: '대구광역시', value: '대구광역시'},
    {label: '대전광역시', value: '대전광역시'},
    {label: '부산광역시', value: '부산광역시'},
    {label: '서울특별시', value: '서울특별시'},
    {label: '세종특별자치시', value: '세종특별자치시'},
    {label: '울산광역시', value: '울산광역시'},
    {label: '전라남도', value: '전라남도'},
    {label: '전라북도', value: '전라북도'},
    {label: '제주특별자치도', value: '제주특별자치도'},
    {label: '충청남도', value: '충청남도'},
    {label: '충청북도', value: '충청북도'},
  ];
  const {Troutes} = {
    name: routes.topActivity,
    component: TopActivity,
    initialParams: {type: 'gather', rank: '00004'},
    options: {tabBarLabel: 'ACTIVITY'},
  };
  useEffect(() => {
    if (regionDialog.open) {
      Keyboard.dismiss();
    }
  }, [regionDialog.open]);

  if (!regionDialog.open) {
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
              {regionArr.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.iconContainer}
                  onPress={() => {
                    dispatch(
                      setTab({
                        tab: 'gather',
                        region: item.value,
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
