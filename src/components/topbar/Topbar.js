import React, {useState} from 'react';
import {Image, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import fonts from '../../libs/fonts';
import image from '../../libs/image';
import {goBack, navigationRef} from '../../services/navigation';
import TextWrap from '../text-wrap/TextWrap';

export default function Topbar({
  title,
  onGoBack,
  options,
  back = true,
  navigation,
}) {
  const [optionWidth, setOptionWidth] = useState(0);
  const handleOptionLayout = e => {
    const {width} = e.nativeEvent.layout;
    if (width > optionWidth) {
      setOptionWidth(width);
    }
  };
  return (
    <View style={styles.root}>
      {!navigation ? (
        <TouchableWithoutFeedback onPress={onGoBack || goBack}>
          <View
            style={[styles.back, optionWidth && {width: optionWidth}]}
            onLayout={handleOptionLayout}>
            <Image style={styles.backIcon} source={image.back} />
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
          <View
            style={[styles.back, optionWidth && {width: optionWidth}]}
            onLayout={handleOptionLayout}>
            <Image style={styles.backIcon} source={image.hamberger} />
          </View>
        </TouchableWithoutFeedback>
      )}

      <View style={styles.center}>
        <TextWrap
          numberOfLines={1}
          ellipsizeMode="tail"
          font={fonts.notoSansCjkKrRegular}
          style={styles.title}>
          {title}
        </TextWrap>
      </View>

      {/* <View
        onLayout={handleOptionLayout}
        style={[optionWidth && {width: optionWidth}]}>
        {options}
      </View> */}

      <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
        <View
          style={[styles.right && {width: optionWidth}]}
          onLayout={handleOptionLayout}>
          {options}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0,
    minHeight: 44,
    alignSelf: 'stretch',
    borderBottomColor: '#e6e6e6',
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.5,
    flex: 1,
    color: '#000000',
  },
  back: {
    // paddingVertical: 18,
    // paddingHorizontal: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
