import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import routes from '../../libs/routes';
import {
  fontPercentage,
  formatTime,
  screenHeight,
  screenWidth,
} from '../../services/util';

export default function EventItem({item, navigation}) {
  return (
    <View>
      <TouchableOpacity
        style={styles.main}
        onPress={() => {
          navigation.navigate(routes.eventDetail, {item});
        }}>
        <View style={styles.mainContent}>
          <Image
            source={{
              uri:
                'https://api-storage.cloud.toast.com/v1/AUTH_2900a4ee8d4d4be3a5146f0158948bd1/event/' +
                item.ev_img,
            }}
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
  mainContent: {flex: 1, height: screenHeight / 2.5},
  date: {
    fontSize: fontPercentage(12),
    color: colors.black,
    marginTop: 4,
  },
  title: {
    color: colors.black,
    fontSize: fontPercentage(14),
    marginTop: 14,
  },
  thumbnail: {
    width: '100%',
    height: screenHeight / 3,
    resizeMode: 'stretch',
  },
});
