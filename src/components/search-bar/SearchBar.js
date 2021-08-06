import React from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import {widthPercentage} from '../../services/util';
import TextWrap from '../text-wrap/TextWrap';
export default function SearchBar({
  onPress,
  onBlur,
  number,
  optionComponent,
  autoFocus,
  style,
  placeholder,
  value,
  onChange,
  onSearch,
  inputRef,
  maxLength,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[styles.root, style]}>
      {onPress ? (
        <TextWrap
          style={[styles.inputText, {color: value ? '#222222' : '#ababab'}]}>
          {value || placeholder}
        </TextWrap>
      ) : (
        <TextInput
          autoFocus={autoFocus}
          ref={inputRef}
          style={styles.input}
          placeholderTextColor={'#ababab'}
          placeholder={placeholder}
          onBlur={onBlur}
          value={value}
          autoCapitalize="none"
          keyboardType={number ? 'decimal-pad' : 'default'}
          maxLength={maxLength}
          onChangeText={t => {
            if (number && t && isNaN(t)) {
              return;
            }
            onChange(t);
          }}
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
      )}
      {Boolean(optionComponent) && (
        <TouchableWithoutFeedback
          onPress={e => {
            e.stopPropagation();
          }}>
          <View style={styles.option}>{optionComponent}</View>
        </TouchableWithoutFeedback>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    paddingHorizontal: 6,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  root: {
    width: widthPercentage(332),
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: colors.white,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#222222',
    paddingVertical: 6,
    fontFamily: fonts.kopubWorldDotumProMedium,
  },
  inputText: {
    flex: 1,
    color: '#222222',
    fontSize: 14,
    lineHeight: 17,
  },
});
