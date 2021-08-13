import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

export default function ButtonImage({
  size = 0,
  disabled,
  tintColor,
  resizeMode,
  onPress,
  paddingVertical,
  paddingHorizontal,
  style,
  source,
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={e => {
        if (onPress) {
          e.stopPropagation();
          onPress();
        }
      }}
      style={[
        styles.root,
        style,
        {
          paddingVertical: paddingVertical || 0,
          paddingHorizontal: paddingHorizontal || 0,
        },
      ]}>
      <Image
        style={[
          styles.image,
          size && {width: size, height: size},
          {
            resizeMode: resizeMode || 'contain',
          },
          tintColor && {tintColor},
          //    disabled && {tintColor: 'lightgray'},
        ]}
        source={source}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
