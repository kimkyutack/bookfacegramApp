import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  Keyboard,
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

export default function Topbar({
  title,
  onGoBack,
  options,
  optionsSearch,
  optionsAvator,
  back,
  navigation,
}) {
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
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.openDrawer();
            Keyboard.dismiss();
          }}>
          <View style={styles.hambergerBack} onLayout={handleOptionLayout}>
            <Image style={styles.hambergerIcon} source={images.hamberger} />
          </View>
        </TouchableWithoutFeedback>
      )}

      <TouchableWithoutFeedback>
        <View
          style={title === 'TOAPING' ? styles.toapingCenter : styles.center}
          onLayout={handleOptionLayout}>
          <TextWrap
            numberOfLines={1}
            ellipsizeMode="tail"
            font={fonts.kopubWorldDotumProBold}
            style={styles.title}>
            {title}
          </TextWrap>
        </View>
      </TouchableWithoutFeedback>

      <View style={(optionsSearch || optionsAvator) && styles.rightConatiner}>
        {optionsSearch && (
          <TouchableWithoutFeedback
            onPress={optionsSearch?.onPress ? optionsSearch.onPress : null}>
            <View style={styles.right1} onLayout={handleOptionLayout}>
              {optionsSearch?.component ? (
                optionsSearch.component
              ) : (
                <TextWrap style={styles.noneIcon} />
              )}
            </View>
          </TouchableWithoutFeedback>
        )}

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

        {optionsAvator && (
          <TouchableWithoutFeedback
            onPress={optionsAvator?.onPress ? optionsAvator.onPress : null}>
            <View style={styles.right2} onLayout={handleOptionLayout}>
              {optionsAvator?.component ? (
                optionsAvator.component
              ) : (
                <TextWrap style={styles.noneIcon} />
              )}
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
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
  back: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    marginBottom: 2,
  },
  hambergerBack: {
    width: widthPercentage(20),
    height: heightPercentage(20),
    marginBottom: 4,
  },
  toapingCenter: {
    paddingLeft: widthPercentage(4),
  },
  center: {
    position: 'absolute',
    left: widthPercentage(60),
  },
  rightConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    marginBottom: 5,
  },
  right1: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    marginRight: widthPercentage(20),
    marginBottom: 2,
  },
  right2: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: widthPercentage(20),
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#0077ff',
  },
  title: {
    fontSize: fontPercentage(19),
    letterSpacing: -0.5,
    color: '#000000',
  },
  backIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  hambergerIcon: {
    width: widthPercentage(20),
    height: heightPercentage(20),
    resizeMode: 'cover',
  },
  noneIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
  },
});
