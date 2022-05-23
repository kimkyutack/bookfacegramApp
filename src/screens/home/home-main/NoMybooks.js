import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../../../libs/colors';
import TextButton from '../../../components/text-button/TextButton';
import TextWrap from '../../../components/text-wrap/TextWrap';
import images from '../../../libs/images';
import fonts from '../../../libs/fonts';
import {
  screenWidth,
  widthPercentage,
  chunk,
  fontPercentage,
  heightPercentage,
} from '../../../services/util';

export default function NoMybooks() {
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.noImageContain}>
      <TextWrap style={styles.noBooksTitle}>열심히 분석중이에요!</TextWrap>
      <Image source={images.noMybooks} style={styles.image} />
      <TextWrap style={styles.noBooksContent}>
        분석에 따른 개인추천 도서는 24시간 후 확인이 가능합니다. {'\n'}
        분석이 되는 동안 피드북,독후활동,책서랍등 다양한 활동을 통해{'\n'}
        나만의 '토핑'이 추가된 피자를 만들어보세요.{'\n'}
      </TextWrap>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: widthPercentage(170),
    height: heightPercentage(170),
    resizeMode: 'contain',
  },
  noImageContain: {
    flex: 1,
    alignItems: 'center',
  },
  noBooksTitle: {
    fontSize: fontPercentage(25),
    fontWeight: 'bold',
    letterSpacing : -0.5,
  },
  noBooksContent: {
    textAlign: 'center',
    fontSize: fontPercentage(12),
    color: '#959595',
  },
});
