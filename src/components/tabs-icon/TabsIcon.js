import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Image,
} from 'react-native';
import propTypes from 'prop-types';
// import Ripple from 'react-native-material-ripple';
import TextWrap from '../text-wrap/TextWrap';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../services/util';

export default function TabsIcon(props) {
  if (!props.data || !props.data.length) {
    return null;
  }

  return (
    <View
      {...props}
      style={[styles.root, props.style]}
      data={undefined}
      index={undefined}
      onIndexChange={undefined}>
      {props.data.map((tab, index) => {
        const sel = index === props.index;
        return (
          <TouchableOpacity
            onPress={() => {
              props.onIndexChange(index);
            }}
            key={index.toString()}
            style={[styles.tab]}>
            {/* {sel && !props.hideBall && <View style={styles.ball} />} */}
            <View style={[styles.labelItem, sel && styles.labelItemSel]}>
              {tab === 'my' ? (
                sel ? (
                  <Image source={images.myActive} style={styles.tabIcon} />
                ) : (
                  <Image source={images.myInactive} style={styles.tabIcon} />
                )
              ) : sel ? (
                <Image source={images.otherActive} style={styles.tabIcon} />
              ) : (
                <Image source={images.otherInactive} style={styles.tabIcon} />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  ball: {
    backgroundColor: colors.primary,
    width: 4,
    height: 4,
  },
  label: {
    fontFamily: fonts.kopubWorldDotumProMedium,
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(19),
    color: '#c3c3c3',
  },
  labelSel: {
    color: '#333333',
  },
  labelItem: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    paddingVertical: 12,
    justifyContent: 'center',
  },
  labelItemSel: {
    borderBottomColor: '#333333',
    borderBottomWidth: 2,
  },
  tab: {
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#e6e6e6',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e6e6e6',
    flex: 1,
    justifyContent: 'center',
  },
  tabIcon: {
    width: widthPercentage(21),
    height: heightPercentage(22),
    resizeMode: 'cover',
  },
  root: {
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
});

TabsIcon.propTypes = {
  ...ViewPropTypes,
  data: propTypes.array,
  index: propTypes.number,
  onIndexChange: propTypes.func,
};
