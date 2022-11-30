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

export default function DialogCate({route}) {
  
  const dispatch = useDispatch();
  const [rank, setRank] = useState('all');
  const {cateDialog} = useSelector(s => s.dialog, shallowEqual);
  const detailTab = useSelector(s => s.tab, shallowEqual);
  const gradeArr = [
    {name: '전체', value: 'all'},
    {name: '초등학교 1학년', value: '초1'},
    {name: '초등학교 2학년', value: '초2'},
    {name: '초등학교 3학년', value: '초3'},
    {name: '초등학교 4학년', value: '초4'},
    {name: '초등학교 5학년', value: '초5'},
    {name: '초등학교 6학년', value: '초6'},
    {name: '중학교 1학년', value: '중1'},
    {name: '중학교 2학년', value: '중2'},
  ];

  useEffect(() => {
    if (cateDialog.open) {
      Keyboard.dismiss();
    }
  }, [cateDialog.open]);

  if (!cateDialog.open) {
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
              height: screenHeight / 1.68,
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
                        tab: 'gather',
                        cate: item.value,
                        region: detailTab.region,
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
