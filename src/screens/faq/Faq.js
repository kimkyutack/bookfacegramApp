import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import {dialogOpenSelect} from '../../redux/dialog/DialogActions';
import {requestGet} from '../../services/network';
import FaqItem from './FaqItem';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import images from '../../libs/images';
import Footer from '../../libs/footer';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
  fontPercentage,
  screenWidth,
} from '../../services/util';

export default function Faq({route, navigation}) {
  const [data, setData] = useState([]);
  const [color1, setColor1] = useState('#c9c9c9');
  const [color2, setColor2] = useState('#FED500');
  const [color3, setColor3] = useState('#c9c9c9');
  const [color4, setColor4] = useState('#c9c9c9');
  const [category_, setCategory] = useState('feed');
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const changeStyle = type => {
    if (type === 'service') {
      setColor1('#FED500');
      setColor2('#c9c9c9');
      setColor3('#c9c9c9');
      setColor4('#c9c9c9');
    } else if (type === 'feed') {
      setColor1('#c9c9c9');
      setColor2('#FED500');
      setColor3('#c9c9c9');
      setColor4('#c9c9c9');
    } else if (type === 'read') {
      setColor1('#c9c9c9');
      setColor2('#c9c9c9');
      setColor3('#FED500');
      setColor4('#c9c9c9');
    } else {
      setColor1('#c9c9c9');
      setColor2('#c9c9c9');
      setColor3('#c9c9c9');
      setColor4('#FED500');
    }
    setCategory(type);
  };
  useEffect(() => {
    requestGet({url: consts.apiUrl + '/mypage/help'})
      .then(x => {
        setData([...x.data]);
      })
      .catch(e => {
        // console.log(e);
        // dispatch(dialogError(e));
      });
  }, []);

  return (
    <RootLayout
      topbar={{
        title: '도움말(FAQ)',
        navigation: navigation,
        back: true,
        options: {
          component: <Image style={styles.cameraIcon} source={images.camera} />,
          name: 'camera',
          onPress: () =>
            dispatch(
              dialogOpenSelect({
                item: cameraItem(),
              }),
            ),
        },
      }}>
      <View style={styles.menu}>
        <View>
          <TouchableOpacity onPress={() => changeStyle('feed')}>
            {color2 === '#c9c9c9' ? (
              <TextWrap
                style={{
                  borderBottomColor: color2,
                  width: screenWidth / 4,
                  height: heightPercentage(40),
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  fontSize: fontPercentage(13),
                  textAlign: 'center',
                  borderBottomWidth: 0,
                }}>
                피드북
              </TextWrap>
            ) : (
              <TextWrap
                style={{
                  borderBottomColor: color2,
                  width: screenWidth / 4,
                  height: heightPercentage(40),
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  fontSize: fontPercentage(13),
                  textAlign: 'center',

                  borderBottomWidth: 4,
                }}>
                피드북
              </TextWrap>
            )}
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => changeStyle('service')}>
            {color1 === '#c9c9c9' ? (
              <TextWrap
                style={{
                  borderBottomColor: color1,
                  width: screenWidth / 4,
                  height: heightPercentage(40),
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  fontSize: fontPercentage(13),
                  textAlign: 'center',
                  borderBottomWidth: 0,
                }}>
                서비스
              </TextWrap>
            ) : (
              <TextWrap
                style={{
                  borderBottomColor: color1,
                  width: screenWidth / 4,
                  height: heightPercentage(40),
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  fontSize: fontPercentage(13),
                  textAlign: 'center',
                  borderBottomWidth: 4,
                }}>
                서비스
              </TextWrap>
            )}
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => changeStyle('read')}>
            {color3 === '#c9c9c9' ? (
              <TextWrap
                style={{
                  borderBottomColor: color3,
                  width: screenWidth / 4,
                  height: heightPercentage(40),
                  alignItems: 'center',
                  alignSelf: 'stretch',

                  textAlign: 'center',
                  fontSize: fontPercentage(13),
                  borderBottomWidth: 0,
                }}>
                독후활동
              </TextWrap>
            ) : (
              <TextWrap
                style={{
                  borderBottomColor: color3,
                  width: screenWidth / 4,
                  height: heightPercentage(40),
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  textAlign: 'center',
                  fontSize: fontPercentage(13),
                  borderBottomWidth: 4,
                }}>
                독후활동
              </TextWrap>
            )}
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => changeStyle('mem')}>
            {color4 === '#c9c9c9' ? (
              <TextWrap
                style={{
                  borderBottomColor: color4,
                  width: screenWidth / 4,
                  height: heightPercentage(40),
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  fontSize: fontPercentage(13),
                  textAlign: 'center',
                  borderBottomWidth: 0,
                }}>
                회원
              </TextWrap>
            ) : (
              <TextWrap
                style={{
                  borderBottomColor: color4,
                  width: screenWidth / 4,
                  height: heightPercentage(40),
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  fontSize: fontPercentage(13),
                  textAlign: 'center',
                  borderBottomWidth: 4,
                }}>
                회원
              </TextWrap>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          borderBottomColor: colors.borderLine,
        }}
      />
      <FlatList
        data={data}
        keyExtractor={(item, index) => {
          return item.question + index.toString();
        }}
        renderItem={({item, index}) => {
          return (
            <FaqItem {...item} categoryType={category_} isFocused={isFocused} />
          );
        }}
      />
      <Footer page="faq" />
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  menu: {
    resizeMode: 'cover',
    flexDirection: 'row',
    width: screenWidth,
    height: heightPercentage(36),
  },
  tapmenu: {
    width: '100%',
    height: heightPercentage(40),
    alignItems: 'center',
    alignSelf: 'stretch',
    fontSize: 20,
    paddingHorizontal: '8.5%',
  },
  selectmenu: {
    width: '100%',
    height: heightPercentage(40),
    alignItems: 'center',
    alignSelf: 'stretch',
    fontSize: 20,
    paddingHorizontal: '8.5%',
    borderBottomWidth: 4,
  },
});
