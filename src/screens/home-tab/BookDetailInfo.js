import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import {formatTime, screenWidth} from '../../services/util';
import HTMLView from 'react-native-htmlview';

export default function BookDetailInfo({
  book_cd,
  book_nm,
  buy_price,
  publish_dt,
  publisher,
  summary,
  writer,
}) {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  return (
    <View>
      <View>
        <View style={styles.mainContent}>
          <TextWrap font={fonts.robotoMedium} style={styles.title}>
            저자 | {writer}
          </TextWrap>
          <TextWrap font={fonts.robotoMedium} style={styles.title}>
            출판사 | {book_nm}
          </TextWrap>
          <TextWrap font={fonts.robotoMedium} style={styles.title}>
            출판년도 | {publish_dt ? publish_dt : publisher ? publisher : ''}
          </TextWrap>
        </View>
        <View>
          <TextWrap
            style={styles.descText}
            ellipsizeMode="tail"
            numberOfLines={!open ? 2 : 0}>
            {summary}
          </TextWrap>
        </View>
        <TouchableOpacity
          style={styles.main}
          onPress={() => {
            setOpen(!open);
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={open ? images.angleUp : images.angleDown}
              style={styles.up}
            />
            <TextWrap> 자세히</TextWrap>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
      </View>
      <View>
        <View style={styles.mainContent}>
          <TextWrap font={fonts.robotoMedium} style={styles.title}>
            저자소개
          </TextWrap>
        </View>
        <View>
          <TextWrap
            style={styles.descText}
            ellipsizeMode="tail"
            numberOfLines={!open2 ? 2 : 0}>
            {/* {summary} */}
          </TextWrap>
        </View>
        <TouchableOpacity
          style={styles.main}
          onPress={() => {
            setOpen2(!open2);
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={open2 ? images.angleUp : images.angleDown}
              style={styles.up}
            />
            <TextWrap> 자세히</TextWrap>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
      </View>
      <View>
        <View style={styles.mainContent}>
          <TextWrap font={fonts.robotoMedium} style={styles.title}>
            출판사 서평
          </TextWrap>
        </View>
        <View>
          <TextWrap
            style={styles.descText}
            ellipsizeMode="tail"
            numberOfLines={!open3 ? 2 : 0}>
            {/* {summary} */}
          </TextWrap>
        </View>
        <TouchableOpacity
          style={styles.main}
          onPress={() => {
            setOpen3(!open3);
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={open3 ? images.angleUp : images.angleDown}
              style={styles.up}
            />
            <TextWrap> 자세히</TextWrap>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  descText: {
    color: '#555555',
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  main: {
    alignItems: 'center',
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  mainContent: {
    width: screenWidth,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  date: {
    fontSize: 12,
    lineHeight: 13,
    color: '#999999',
  },
  title: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 19,
    letterSpacing: -0.5,
  },
  up: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  divider: {
    marginHorizontal: 16,
    borderRadius: 1,
    height: 1,
    backgroundColor: '#e5e5e5',
  },
});
