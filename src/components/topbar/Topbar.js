import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from 'react-native';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import {goBack} from '../../services/navigation';
import TextWrap from '../text-wrap/TextWrap';
import {
  screenWidth as defaultScreenWidth,
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../services/util';
import colors from '../../libs/colors';
import routes from '../../libs/routes';

export default function Topbar({title, onGoBack, options, back, navigation}) {
  const [optionWidth, setOptionWidth] = useState(0);
  const [screenWidth, setScreenWidth] = useState(defaultScreenWidth);
  const handleOptionLayout = e => {
    const {width} = e.nativeEvent.layout;
    if (width > optionWidth) {
      setOptionWidth(width);
    }
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      // eslint-disable-next-line no-shadow
      ({window, screen}) => {
        setScreenWidth(screen.width);
      },
    );
    return () => subscription?.remove();
  }, []);

  return (
    <View style={styles.root}>
      {back ? (
        <TouchableWithoutFeedback onPress={onGoBack || goBack}>
          <View style={styles.back} onLayout={handleOptionLayout}>
            <Image style={styles.backIcon} source={images.back} />
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
          <View style={styles.back} onLayout={handleOptionLayout}>
            <Image style={styles.hambergerIcon} source={images.hamberger} />
          </View>
        </TouchableWithoutFeedback>
      )}

      <TouchableWithoutFeedback>
        <View style={styles.center} onLayout={handleOptionLayout}>
          <TextWrap
            numberOfLines={1}
            ellipsizeMode="tail"
            font={fonts.kopubWorldDotumProBold}
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
        onPress={options?.onPress ? options.onPress : null}>
        <View style={styles.right} onLayout={handleOptionLayout}>
          {options?.component ? (
            options.component
          ) : (
            <TextWrap style={styles.noneIcon} />
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0,
    minHeight: heightPercentage(68),
    maxHeight: heightPercentage(68),
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  back: {width: widthPercentage(24)},
  center: {},
  right: {width: widthPercentage(24)},
  title: {
    fontSize: fontPercentage(19),
    letterSpacing: -0.5,
    color: '#000000',
  },
  backIcon: {
    width: widthPercentage(20),
    height: heightPercentage(20),
    resizeMode: 'cover',
    marginBottom: 5,
  },
  hambergerIcon: {
    width: widthPercentage(18),
    height: heightPercentage(18),
    resizeMode: 'cover',
    marginBottom: 5,
  },
  noneIcon: {
    width: widthPercentage(20),
    height: heightPercentage(20),
    marginBottom: 3,
  },
});
