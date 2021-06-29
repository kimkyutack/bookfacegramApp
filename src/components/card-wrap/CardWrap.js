import React from 'react';
import {StyleSheet} from 'react-native';

import {TouchableOpacity, View, Text, Image} from 'react-native';
import {Card, ListItem, Button, Icon} from 'react-native-elements';
import TextWrap from '../text-wrap/TextWrap';

export default function CardWrap({
  onPress,
  children,
  styleTitle = {},
  style = {},
}) {
  return (
    <TouchableOpacity
      style={[styles.root, style]}
      onPress={e => {
        if (onPress) {
          e.stopPropagation();
          onPress();
        }
      }}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});
