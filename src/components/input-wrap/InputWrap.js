import React from 'react';
import {Image, StyleSheet, TextInput, View} from 'react-native';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import TextWrap from '../text-wrap/TextWrap';

export default function InputWrap({
  message,
  style,
  placeholderSize,
  label,
  toolbarComponent,
  number,
  onFocus,
  optionComponent,
  borderColor,
  value,
  placeholder,
  onChange,
  disabled,
  maxLength,
  secure,
  icon,
  messageColor = colors.red,
}) {
  const handleChange = (t) => {
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
          <TextWrap font={fonts.robotoMedium} style={styles.label}>
            {label}
          </TextWrap>
        )}
        {toolbarComponent && toolbarComponent}
      </View>

      <View
        style={[
          styles.inputWrap,
          borderColor && {borderColor, borderWidth: 1.5},
          disabled && {
            backgroundColor: '#f2f2f2',
            borderColor: '#e5e5e5',
          },
        ]}>
        {icon && <Image source={icon} style={styles.icon} />}
        <TextInput
          onFocus={onFocus}
          secureTextEntry={secure}
          editable={!disabled}
          placeholder={placeholder}
          keyboardType={number ? 'decimal-pad' : 'default'}
          placeholderTextColor={'#ababab'}
          autoCapitalize="none"
          value={value}
          onChangeText={handleChange}
          style={[
            styles.input,
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
    fontSize: 13,
    marginTop: 8,
  },
  inputWrap: {
    paddingVertical: 7.5,
    flexDirection: 'row',
    // alignItems: 'center',
    // paddingHorizontal: 12,
    // borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    marginRight: 8,
    width: 19,
    height: 19,
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
    fontSize: 14,
    lineHeight: 17,
    color: '#c3c3c3',
    letterSpacing: -0.5,
    flex: 1,
    fontFamily: fonts.notoSansCjkKrRegular,
  },
});
