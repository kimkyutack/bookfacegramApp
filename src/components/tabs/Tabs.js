import React from 'react';
import {StyleSheet, TouchableOpacity, View, ViewPropTypes} from 'react-native';
import propTypes from 'prop-types';
// import Ripple from 'react-native-material-ripple';
import TextWrap from '../text-wrap/TextWrap';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../services/util';

export default function Tabs(props) {
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
        const pin = props.dataPin && props.dataPin[index];
        return (
          <TouchableOpacity
            onPress={() => {
              props.onIndexChange(index);
            }}
            key={index.toString()}
            style={[styles.tab]}>
            {/* {sel && !props.hideBall && <View style={styles.ball} />} */}
            <View style={[styles.labelItem, sel && styles.labelItemSel]}>
              <TextWrap
                style={[styles.label, sel && styles.labelSel]}
                font={fonts.kopubWorldDotumProMedium}>
                {tab}{' '}
              </TextWrap>
              <TextWrap
                style={[styles.label, sel && styles.labelSel]}
                font={fonts.kopubWorldDotumProMedium}>
                {pin}
              </TextWrap>
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
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    flex: 1,
    justifyContent: 'center',
  },
  root: {
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
});

Tabs.propTypes = {
  ...ViewPropTypes,
  data: propTypes.array,
  index: propTypes.number,
  onIndexChange: propTypes.func,
};
