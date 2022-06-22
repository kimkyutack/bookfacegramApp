import React from 'react';
import {StyleSheet, View} from 'react-native';
import TextButton from '../../components/text-button/TextButton';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import { fontPercentage } from '../../services/util';

export default function ListHeader({
  label,
  buttonLabel,
  onPress,
  button = true,
}) {
  return (
    <View style={styles.header}>
      <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.label}>
        {label}
      </TextWrap>
      {button && (
        <TextButton onPress={onPress} styleTitle={styles.labelButton}>
          {buttonLabel}
        </TextButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  label: {
    color: '#222',
    fontSize: fontPercentage(14),
    lineHeight: 24,
  },
  labelButton: {
    color: colors.blue,
    fontSize: fontPercentage(14),
    lineHeight: 24,
  },
});
