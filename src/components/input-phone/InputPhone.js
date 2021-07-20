import {func} from 'prop-types';
import React, {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import fonts from '../../libs/fonts';
import TextWrap from '../text-wrap/TextWrap';
import image from '../../libs/image';
import {phoneExts} from '../../services/bulk';
import ExtPopup from './ExtPopup';
import colors from '../../libs/colors';

export default function InputPhone({value, onChange, style, ext, onExtChange}) {
  const [open, setOpen] = useState(false);

  const getValue = () => {
    if (!value) {
      return value;
    }
    let result = '';
    if (ext === '82') {
      result = value
        .replace(/[^0-9]/g, '')
        .replace(
          /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,
          '$1-$2-$3',
        )
        .replace('--', '-');
    } else {
      result = value
        .replace(/[^0-9]/g, '')
        .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
        .replace('--', '-');
    }
    return result;
  };
  return (
    <View style={[styles.root, style]}>
      {open && (
        <ExtPopup
          onClose={() => {
            setOpen(false);
          }}
          onSelect={(ext) => {
            onExtChange && onExtChange(ext);
          }}
        />
      )}
      <TextWrap style={styles.label} font={fonts.robotoMedium}>
        Cell phone number
      </TextWrap>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => {
            setOpen(true);
          }}
          style={styles.ext}>
          <TextWrap style={styles.extText}>+ {ext || '82'}</TextWrap>
          <Image source={image.down} style={styles.own} />
        </TouchableOpacity>
        <TextInput
          maxLength={30}
          keyboardType="decimal-pad"
          value={getValue()}
          placeholderTextColor="#ababab"
          style={styles.input}
          onChangeText={(t) => {
            if (t && isNaN(t.replace(/-/g, ''))) {
              return;
            }
            onChange(t.replace(/-/g, ''));
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
  },
  label: {fontSize: 13, color: '#222', lineHeight: 24, marginBottom: 9},
  row: {flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch'},
  input: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.robotoRegular,
    fontSize: 14,
    lineHeight: 19,
    borderColor: '#e5e5e5',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ext: {
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 14,
    marginRight: 10,
    borderColor: '#e5e5e5',
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },
  extText: {
    color: '#ababab',
    fontSize: 14,
    lineHeight: 19,
    marginRight: 27,
  },
  own: {
    width: 10,
    height: 5.8,
    resizeMode: 'contain',
  },
});
