import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {
  ScrollView,
  Image,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Button,
} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import colors from '../../libs/colors';
import images from '../../libs/images';
import TextWrap from '../../components/text-wrap/TextWrap';
import {
  dialogOpenSelect,
  dialogOpenMessage,
} from '../../redux/dialog/DialogActions';
import {navigate} from '../../services/navigation';
import Footer from '../../libs/footer';
import {
  screenHeight,
  widthPercentage,
  heightPercentage,
  fontPercentage,
  cameraItem,
  screenWidth,
} from '../../services/util';
import routes from '../../libs/routes';

export default function Examtest({route, navigation}) {
  const [answer, setAnswer] = useState(1);
  const radio_props = [
    {label: '① 얼굴에 피가 나고 있다.', value: 1},
    {label: '② 얼굴에 주름이 없다.', value: 2},
    {label: '③ 얼굴에 화색이 돌다.', value: 3},
    {label: '④ 얼굴이 빨개지다.', value: 4},
  ];
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView style={styles.root}>
        <View
          style={{
            width: '90%',
            left: widthPercentage(17),
          }}>
          <TextWrap style={styles.fonta}>
            문해고사를 통해 문해력 UP 시키기!
          </TextWrap>
        </View>
        <View style={styles.root2}>
          <Image style={styles.img1} source={images.exam_title} />
        </View>
        <TextWrap style={styles.font}>
          위의 대화는 오랜만에 만난 유정이와 미진이의 대화입니다. 밑줄친 '
          <TextWrap style={styles.font3}>얼굴이 피다</TextWrap>' 의 뜻은 무슨
          의미일까요?
        </TextWrap>
        <View
          style={{
            height: screenHeight / 4,
            top: heightPercentage(35),
            left: widthPercentage(17),
          }}>
          <RadioForm
            radio_props={radio_props}
            initial={0}
            buttonSize={screenWidth / 70}
            buttonOuterSize={screenWidth / 30}
            borderWidth={0}
            buttonColor={'black'}
            selectedButtonColor={'black'}
            labelStyle={{
              fontSize: fontPercentage(12),
              textAlignVertical: 'center',
              height: screenHeight / 28,
              bottom: screenHeight / 110,
            }}
            onPress={value => {
              setAnswer(value);
            }}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="정답 제출하기"
            color="black"
            onPress={() =>
              answer === 3
                ? navigate(routes.home, {
                    screen: routes.topActivity,
                    params: {
                      type: 'examright',
                      key: Date.now(),
                    },
                  })
                : navigate(routes.home, {
                    screen: routes.topActivity,
                    params: {
                      type: 'examwrong',
                      key: Date.now(),
                    },
                  })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop: 10,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  button: {
    left: '5%',
    width: '90%',
    bottom: '1%',
  },
  fonta: {
    fontSize: fontPercentage(12),
    fontWeight: 'bold',
    textAlign: 'left',
  },
  root2: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  font: {
    marginRight: widthPercentage(30),
    left: widthPercentage(17),
    top: heightPercentage(15),
    fontSize: fontPercentage(12),
    fontWeight: 'bold',
  },
  font3: {
    fontSize: fontPercentage(12),
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  font2: {
    margin: widthPercentage(10),
    left: widthPercentage(8),
    top: heightPercentage(12),
    fontSize: fontPercentage(11),
  },
  img1: {
    width: '90%',
    height: screenHeight / 1.5,
    top: heightPercentage(12),
  },
  searchBar: {
    marginHorizontal: 18,
    backgroundColor: '#ececec',
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  x: {
    marginRight: 5,
    width: widthPercentage(18),
    height: heightPercentage(18),
    resizeMode: 'cover',
  },
});
