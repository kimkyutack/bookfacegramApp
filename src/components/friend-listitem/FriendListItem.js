import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Avatar from '../../components/avatar/Avatar';
import ButtonImage from '../../components/button-image/ButtonImage';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import image from '../../libs/image';
import {
  checkStringMatch,
  parseName,
  splitMatchIndex,
  splitMatchKeyword,
  splitMatchString,
} from '../../services/util';

export default function FriendListItem({
  onPress,
  onItemPress,
  primary,
  showStatus,
  //
  search = {}, //keyword,graduationSemester,entranceYear
  //
  lastName,
  firstName,
  program,
  country,
  entranceYear,
  profilePath,
  workPlace,
  workPlacePosition,
  status,
  friendRequest,
  mask,
  isSigned,
  isFriend,
}) {
  const [name, setName] = useState('');

  useEffect(() => {
    setName(parseName(firstName, lastName));
  }, [firstName, lastName]);

  const matchIndex = splitMatchIndex(firstName, search.keyword);
  const matchIndexLast = splitMatchIndex(lastName, search.keyword);

  return (
    <TouchableOpacity
      disabled={!onItemPress}
      onPress={onItemPress}
      style={styles.root}>
      <Avatar path={profilePath} />
      <View style={[styles.main]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}} />
        {checkStringMatch(name, search.keyword, true) ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingRight: 16,
              flex: 1,
            }}>
            <TextWrap
              style={[
                styles.name,
                {
                  color: '#222',
                },
              ]}>
              {firstName.split('').map((x, i) => {
                if (i >= matchIndex[0] && i < matchIndex[1]) {
                  return (
                    <TextWrap
                      key={i.toString()}
                      style={[
                        styles.name,
                        {
                          color: colors.primary,
                        },
                      ]}>
                      {i > 2 && mask ? '*' : x}
                    </TextWrap>
                  );
                } else {
                  return i > 2 && mask ? '*' : x;
                }
              })}{' '}
              {lastName.split('').map((x, i) => {
                if (i >= matchIndexLast[0] && i < matchIndexLast[1]) {
                  return (
                    <TextWrap
                      key={i.toString()}
                      style={[
                        styles.name,
                        {
                          color: colors.primary,
                        },
                      ]}>
                      {i > 1 && mask ? '*' : x}
                    </TextWrap>
                  );
                } else {
                  return i > 1 && mask ? '*' : x;
                }
              })}
            </TextWrap>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingRight: 16,
              flex: 1,
            }}>
            <TextWrap style={[styles.name]}>
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
          </View>
        )}
        {showStatus && (
          <View style={{flex: 1}}>
            <TextWrap style={styles.desc}>{status}</TextWrap>
          </View>
        )}
        {!primary && (
          <View>
            <TextWrap style={styles.desc}>
              {[country, entranceYear, program].map((t, i) => {
                if (
                  (i === 1 &&
                    search.entranceYear &&
                    String(search.entranceYear) === String(t)) ||
                  ((i === 0 || i === 2) &&
                    checkStringMatch(t, search.keyword, true))
                ) {
                  return (
                    <TextWrap
                      key={i.toString()}
                      style={[styles.desc, {color: colors.primary}]}>
                      {t}
                      <TextWrap style={[styles.desc, {color: '#999999'}]}>
                        {i <= 1 ? ' | ' : ''}
                      </TextWrap>
                    </TextWrap>
                  );
                } else {
                  return (
                    <TextWrap key={i.toString()} style={styles.desc}>
                      {t}
                      <TextWrap style={[styles.desc, {color: '#999999'}]}>
                        {i <= 1 ? ' | ' : ''}
                      </TextWrap>
                    </TextWrap>
                  );
                }
              })}
            </TextWrap>
            {checkStringMatch(workPlace, search.keyword, true) && (
              <TextWrap style={[styles.info]}>
                {splitMatchString(workPlace, search.keyword).map((x, i) => {
                  return (
                    <TextWrap
                      key={i.toString()}
                      style={[styles.info, i === 1 && {color: colors.primary}]}>
                      {x}
                    </TextWrap>
                  );
                })}
              </TextWrap>
            )}

            {checkStringMatch(workPlacePosition, search.keyword, true) && (
              <TextWrap style={[styles.info]}>
                {splitMatchString(workPlacePosition, search.keyword).map(
                  (x, i) => {
                    return (
                      <TextWrap
                        key={i.toString()}
                        style={[
                          styles.info,
                          i === 1 && {color: colors.primary},
                        ]}>
                        {x}
                      </TextWrap>
                    );
                  },
                )}
              </TextWrap>
            )}
          </View>
        )}
      </View>
      {Boolean(onPress) && !isFriend && (
        <ButtonImage
          style={styles.bi}
          paddingHorizontal={16}
          size={20}
          disabled={friendRequest}
          onPress={onPress}
          source={
            isSigned
              ? friendRequest
                ? image.addFriendOff
                : image.addFriend
              : image.invite
          }
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bi: {alignSelf: 'flex-start', marginTop: 10},
  root: {
    flexDirection: 'row',
    paddingLeft: 16,
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  main: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  name: {
    color: '#222',
    textAlignVertical: 'center',
    fontSize: 16,
    flex: 1,
    lineHeight: 18,
  },
  desc: {
    color: '#999999',
    fontSize: 12,
    lineHeight: 14,
  },
  info: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 14,
    color: '#999999',
  },
});
