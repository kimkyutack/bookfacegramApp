import React from 'react';
import {Image, StyleSheet, TextInput, View} from 'react-native';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import TextWrap from '../text-wrap/TextWrap';
import {
  containPasswordCheck,
  fontPercentage,
  heightPercentage,
  preventKor,
  widthPercentage,
} from '../../services/util';

export default function InputWrap({
  message,
  style,
  inputStyle,
  inputFlex,
  placeholderSize,
  label,
  toolbarComponent,
  number,
  onFocus,
  optionComponent,
  borderColor,
  value,
  placeholder,
  placeholderTextColor,
  onChange,
  disabled,
  maxLength,
  secure,
  icon,
  multiline,
  showSoftInputOnFocus,
  messageColor,
  selectionColor,
}) {
  const handleChange = t => {
    if (maxLength && t.length > maxLength) {
      return;
    } else if (number && t && isNaN(t)) {
      return;
    }
    if (onChange) {
      onChange(t);
    }
  };

  return (
    <View style={[styles.root, style]}>
      <View style={[styles.toolbar, {marginBottom: label ? 8 : 0}]}>
        {Boolean(label) && (
          <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.label}>
            {label}
          </TextWrap>
        )}
        {toolbarComponent && toolbarComponent}
      </View>

      <View
        style={[
          styles.inputWrap,
          inputFlex,
          borderColor && {borderColor, borderWidth: 1.5},
          disabled && {
            backgroundColor: '#f2f2f2',
            borderColor: '#e5e5e5',
          },
        ]}>
        {icon && <Image source={icon} style={styles.icon} />}
        <TextInput
          onFocus={onFocus}
          selectionColor={selectionColor ? selectionColor : colors.border}
          secureTextEntry={secure}
          editable={!disabled}
          showSoftInputOnFocus={showSoftInputOnFocus}
          placeholder={placeholder}
          keyboardType={number ? 'decimal-pad' : 'default'}
          placeholderTextColor={
            placeholderTextColor ? placeholderTextColor : '#ffffff'
          }
          autoCapitalize="none"
          value={value}
          autoCorrect={false}
          multiline={multiline}
          onChangeText={handleChange}
          underlineColorAndroid="transparent"
          style={[
            inputStyle ? inputStyle : styles.input,
            disabled && {color: '#999999'},
            !value && placeholderSize && {fontSize: placeholderSize},
          ]}
        />
        {optionComponent && optionComponent}
      </View>

      {Boolean(message) && (
        <TextWrap style={[styles.message, {color: messageColor}]}>
          {message}
        </TextWrap>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
  },
  message: {
    lineHeight: 18,
    fontSize: 11,
    marginTop: 4,
    color: '#ababab',
  },
  inputWrap: {
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    marginRight: 8,
    width: widthPercentage(19),
    height: heightPercentage(19),
  },
  label: {
    fontSize: 13,
    lineHeight: 24,
    color: '#222',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  input: {
    padding: 0,
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(20),
    color: '#ffffff',
    letterSpacing: -0.5,
    textDecorationLine: 'none',
  },
});
