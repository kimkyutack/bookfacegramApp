import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import image from '../../libs/image';
import {formatTime, screenWidth} from '../../services/util';

export default function NoticeItem({createdAt, title, description, filePath}) {
  const [open, setOpen] = useState(false);
  const [h, setH] = useState(1);

  return (
    <View>
      <TouchableOpacity
        style={[styles.main, open && styles.mainOpend]}
        onPress={() => {
          setOpen(!open);
        }}>
        <View style={[styles.mainContent, open && {marginTop: 10}]}>
          <TextWrap font={fonts.robotoMedium} style={styles.title}>
            {title}
          </TextWrap>
          <TextWrap style={styles.date}>
            {formatTime(createdAt, 'YYYY. MM. DD')}
          </TextWrap>
        </View>
        <Image
          source={open ? image.angleUp : image.angleDown}
          style={styles.up}
        />
      </TouchableOpacity>
      {open && (
        <View style={styles.desc}>
          {/* {Boolean(filePath) && (
            <Image
              style={{
                width: '100%',
                marginBottom: 10,
                height: h,
              }}
              source={{
                uri: consts.fileApiUrl + '/' + filePath,
              }}
              onLoad={e => {
                const ratio = (screenWidth - 32) / e.nativeEvent.source.width;
                setH(e.nativeEvent.source.height * ratio);
              }}
            />
          )} */}
          <TextWrap style={styles.descText}>{description}</TextWrap>
        </View>
      )}
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  descDate: {fontSize: 13, lineHeight: 15, color: '#777777', marginTop: 12},
  desc: {
    padding: 16,
    paddingBottom: 0,
  },
  descText: {
    color: '#555555',
    fontSize: 14,
    lineHeight: 21,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  main: {
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 16,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  mainContent: {flex: 1},
  mainOpend: {paddingVertical: 10},
  date: {
    fontSize: 12,
    lineHeight: 13,
    color: '#999999',
    marginTop: 10,
  },
  title: {
    color: colors.black,
    fontSize: 16,
    lineHeight: 19,
  },
  up: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  divider: {
    marginHorizontal: 16,
    borderRadius: 1,
    height: 1,
    backgroundColor: '#e5e5e5',
  },
});
