import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {} from 'react-native-gesture-handler';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import image from '../../libs/image';
import {
  checkStringMatch,
  formatLastMessageTime,
  formatTime,
  splitMatchString,
} from '../../services/util';
import Avatar from '../avatar/Avatar';
import Length from '../length/Length';
import TextWrap from '../text-wrap/TextWrap';

export default function ChatSingle({
  onPress,
  profilePath,
  keyword,
  lastMessage,
  lastMessagedAt,
  name,
  pin,
  unReadLength,
  onLongPress,
  notification,
}) {
  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      onPress={onPress}
      style={styles.root}>
      <Avatar size={40} path={profilePath} />
      <View style={styles.main}>
        <View style={styles.header}>
          <TextWrap style={styles.name} font={fonts.robotoMedium}>
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
        <TextWrap ellipsizeMode="tail" numberOfLines={1} style={styles.message}>
          {lastMessage}
        </TextWrap>
      </View>
      <View style={styles.end}>
        <TextWrap style={styles.date}>
          {formatLastMessageTime(lastMessagedAt)}
        </TextWrap>
        {Boolean(unReadLength) && (
          <Length style={styles.length}>
            {unReadLength > 999 ? 999 : unReadLength}
          </Length>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  header: {flexDirection: 'row', alignItems: 'center'},
  end: {
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },

  root: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  main: {flex: 1, paddingLeft: 12, paddingRight: 20},
  message: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    color: '#555555',
  },
  name: {
    fontSize: 16,
    lineHeight: 19,
    color: '#222222',
  },
  date: {
    fontSize: 12,
    lineHeight: 14,
    color: '#999999',
  },
});
