import React from 'react';
import {Text, TextPropTypes} from 'react-native';
import fonts from '../../libs/fonts';
import propType from 'prop-types';
export default function TextWrap(props) {
  return (
    <Text
      {...props}
      style={[
        props.style,
        {fontFamily: props.font || fonts.kopubWorldDotumProLight},
      ]}>
      {props.children}
    </Text>
  );
}

TextWrap.propTypes = {
  ...TextPropTypes,
  font: propType.string,
  style: propType.any,
};
