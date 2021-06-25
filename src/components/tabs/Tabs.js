import React from 'react';
import {StyleSheet, TouchableOpacity, View, ViewPropTypes} from 'react-native';
import propTypes from 'prop-types';
// import Ripple from 'react-native-material-ripple';
import TextWrap from '../text-wrap/TextWrap';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
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
                font={
                  sel ? fonts.notoSansCjkKrRegular : fonts.notoSansCjkKrRegular
                }>
                {tab}
              </TextWrap>
              {pin && (
                <View
                  style={{
                    backgroundColor: '#ffb600',
                    width: 4,
                    position: 'absolute',
                    right: 6,
                    top: 8,
                    marginLeft: 6,
                    height: 4,
                    borderRadius: 2,
                  }}
                />
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
    fontSize: 14,
    lineHeight: 16,
    color: '#c3c3c3',
  },
  labelSel: {
    color: '#101113',
  },
  labelItem: {
    // paddingHorizontal: 16,
    // paddingBottom: 5,
    flexDirection: 'row',
    // alignItems: 'center',
    alignSelf: 'stretch',
    // textAlign: 'center',
    paddingVertical: 12,
    justifyContent: 'center',
    // alignSelf: 'center',
  },
  labelItemSel: {
    borderBottomColor: '#6a25eb',
    borderBottomWidth: 2,
  },
  tab: {
    alignItems: 'center',
    // paddingTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
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
