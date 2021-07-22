import React, {useState} from 'react';
import {Image, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import fonts from '../../libs/fonts';
import image from '../../libs/image';
import {goBack} from '../../services/navigation';
import TextWrap from '../text-wrap/TextWrap';
import {screenWidth} from '../../services/util';
import colors from '../../libs/colors';

export default function Topbar({title, onGoBack, options, back, navigation}) {
  const [optionWidth, setOptionWidth] = useState(0);
  const handleOptionLayout = e => {
    const {width} = e.nativeEvent.layout;
    if (width > optionWidth) {
      setOptionWidth(width);
    }
  };

  return (
    <View style={styles.root}>
      {back ? (
        <TouchableWithoutFeedback onPress={onGoBack || goBack}>
          <View style={styles.back} onLayout={handleOptionLayout}>
            <Image style={styles.backIcon} source={image.back} />
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
          <View style={styles.back} onLayout={handleOptionLayout}>
            <Image style={styles.backIcon} source={image.hamberger} />
          </View>
        </TouchableWithoutFeedback>
      )}

      <TouchableWithoutFeedback>
        <View style={styles.center} onLayout={handleOptionLayout}>
          <TextWrap
            numberOfLines={1}
            ellipsizeMode="tail"
            font={fonts.notoSansCjkKrRegular}
            style={styles.title}>
            {title}
          </TextWrap>
        </View>
      </TouchableWithoutFeedback>
      {/* <View
        onLayout={handleOptionLayout}
        style={[optionWidth && {width: optionWidth}]}>
        {options}
      </View> */}

      <TouchableWithoutFeedback
        onPress={options ? () => navigation.openDrawer() : null}>
        <View style={styles.right} onLayout={handleOptionLayout}>
          {options ? options : <TextWrap style={styles.noneIcon} />}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: screenWidth,
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0,
    minHeight: 44,
    maxHeight: 44,
    // alignSelf: 'stretch',
    borderBottomColor: '#e6e6e6',
    paddingLeft: 16,
    paddingRight: 18,
    alignContent: 'space-between',
    justifyContent: 'space-between',
  },
  back: {},
  center: {},
  right: {},
  title: {
    // backgroundColor: 'blue',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.5,
    color: '#000000',
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  noneIcon: {
    width: 24,
    height: 24,
  },
});
