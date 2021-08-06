import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import {formatTime, screenWidth} from '../../services/util';

export default function EventItem({item, navigation}) {
  return (
    <View>
      <TouchableOpacity
        style={styles.main}
        onPress={() => {
          navigation.navigate('eventDetail', {item});
        }}>
        <View style={styles.mainContent}>
          <Image
            source={
              item.ev_img === 'event1_thumb.jpg' ? images.event1 : images.event2
            }
            style={styles.thumbnail}
          />
          <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.title}>
            {item.ev_title}
          </TextWrap>
          <TextWrap style={styles.date}>
            {item.ev_start_date} ~ {item.ev_end_date}
          </TextWrap>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    // alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'stretch',
    flexDirection: 'column',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 16,
    // backgroundColor: 'red',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  mainContent: {flex: 1},
  date: {
    fontSize: 12,
    lineHeight: 14,
    color: colors.black,
    marginTop: 4,
  },
  title: {
    color: colors.black,
    marginTop: 14,
    fontSize: 14,
    lineHeight: 16,
  },
  thumbnail: {
    width: '100%',
    height: 290,
    resizeMode: 'stretch',
  },
});
