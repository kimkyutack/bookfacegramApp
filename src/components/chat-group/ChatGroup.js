import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import image from '../../libs/image';
import {
  checkStringMatch,
  formatLastMessageTime,
  splitMatchString,
  splitMatchStringMultiple,
} from '../../services/util';
import Avatars from '../avatars/Avatars';
import Length from '../length/Length';
import TextWrap from '../text-wrap/TextWrap';

export default function ChatGroup({
  onPress,
  lastMessage,
  name,
  keyword,
  pin,
  profilePaths,
  lastMessagedAt,
  notification,
  unReadLength,
  onLongPress,
  names,
}) {
  const [plusLength, setPlusLength] = useState(0);
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    if (!profilePaths) {
      return;
    }
    let profilePathsArr = profilePaths.split(',');
    if (profilePathsArr.length > 3) {
      setPlusLength(profilePathsArr.length - 3);
      setPaths(profilePathsArr.filter((x, i) => i < 3));
    } else {
      setPlusLength(0);
      setPaths(profilePathsArr);
    }
  }, [profilePaths]);
  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      onPress={onPress}
      style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerMain}>
          <TextWrap
            ellipsizeMode="tail"
            numberOfLines={1}
            font={fonts.robotoMedium}
            style={styles.names}>
            {checkStringMatch(name, keyword, true)
              ? splitMatchString(name, keyword).map((x, i) => {
                  return (
                    <TextWrap
                      key={i.toString()}
                      style={[
                        styles.name,
                        i === 1 && {
                          color: colors.primary,
                        },
                      ]}>
                      {x}
                    </TextWrap>
                  );
                })
              : name}
          </TextWrap>
          {Boolean(pin) && <Image source={image.pin} style={styles.pin} />}
          {!Boolean(notification) && (
            <Image source={image.notificationOff} style={styles.pin} />
          )}
        </View>
        {Boolean(unReadLength) && (
          <Length style={styles.length}>
            {unReadLength > 999 ? 999 : unReadLength}
          </Length>
        )}
      </View>
      <View style={styles.main}>
        <TextWrap ellipsizeMode="tail" numberOfLines={2} style={styles.message}>
          {lastMessage}
        </TextWrap>
        <View style={styles.bottom}>
          <Avatars plus={plusLength} paths={paths} />
          <View style={{flex: 1, paddingHorizontal: 10}}>
            {Boolean(names) && (
              <TextWrap style={styles.names2}>
                {names.split(',').length > 1
                  ? splitMatchString(names.split(',')[0], keyword).map(
                      (x, i) => {
                        return (
                          <TextWrap
                            key={i.toString()}
                            style={[
                              styles.names2,
                              i === 1 && {
                                color: colors.primary,
                              },
                            ]}>
                            {x}
                          </TextWrap>
                        );
                      },
                    )
                  : splitMatchString(names, keyword).map((x, i) => {
                      return (
                        <TextWrap
                          key={i.toString()}
                          style={[
                            styles.names2,
                            i === 1 && {
                              color: colors.primary,
                            },
                          ]}>
                          {x}
                        </TextWrap>
                      );
                    })}
                {names.split(',').length > 1 &&
                  `.. et al. ${names.split(',').length - 1}`}
              </TextWrap>
            )}
          </View>
          <TextWrap style={styles.date}>
            {formatLastMessageTime(lastMessagedAt)}
          </TextWrap>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  names2: {
    fontSize: 14,
    lineHeight: 17,
    color: '#222',
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  date: {
    fontSize: 12,
    lineHeight: 14,
    color: '#999999',
  },
  main: {
    borderBottomRightRadius: 8,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 8,
  },
  names: {
    flex: 1,
    fontSize: 16,
    lineHeight: 19,
    color: '#222',
  },
  root: {
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: '#f6f6f6',
  },
  headerMain: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  pin: {
    width: 14,
    height: 14,
    marginLeft: 4,
    resizeMode: 'contain',
  },
  length: {
    alignSelf: 'flex-end',
    position: 'relative',
  },
});
