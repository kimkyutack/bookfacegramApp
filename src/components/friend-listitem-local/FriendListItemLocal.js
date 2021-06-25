import React from 'react';
import {StyleSheet, View} from 'react-native';
import Avatar from '../../components/avatar/Avatar';
import ButtonImage from '../../components/button-image/ButtonImage';
import TextWrap from '../../components/text-wrap/TextWrap';
import image from '../../libs/image';

export default function FriendListItemLocal({
  onDelete,
  country,
  year,
  mask,
  entranceYear,
  program,
  profilePath,
  showStatus,
  disableSecondary,
  firstName,
  lastName,
  status,
}) {
  return (
    <View style={styles.root}>
      <Avatar path={profilePath} />
      <View style={styles.main}>
        <TextWrap style={styles.name}>
          {mask && (firstName || '').length > 3
            ? firstName.substring(0, 3) +
              firstName
                .substring(3, firstName.length)
                .split('')
                .map((x) => '•')
                .join('')
            : firstName}{' '}
          {mask && (lastName || '').length > 2
            ? lastName.substring(0, 2) +
              lastName
                .substring(2, lastName.length)
                .split('')
                .map((x) => '•')
                .join('')
            : lastName}
        </TextWrap>
        {(!disableSecondary || showStatus) && (
          <TextWrap style={styles.desc}>
            {showStatus
              ? status
              : [country, year || entranceYear, program]
                  .filter((x) => x)
                  .join(' | ')}
          </TextWrap>
        )}
      </View>
      <ButtonImage
        onPress={onDelete}
        paddingVertical={14}
        paddingHorizontal={16}
        size={12}
        source={image.delete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingVertical: 8,
  },
  main: {flex: 1, paddingHorizontal: 12, justifyContent: 'center'},
  name: {
    color: '#222',
    fontSize: 16,
    lineHeight: 18,
  },
  desc: {
    color: '#999999',
    fontSize: 12,
    lineHeight: 14,
  },
});
