import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import images from '../../libs/image';
import {formatTime, screenWidth} from '../../services/util';
import {numFormat} from '../../services/util';

export default function BookListItem({
  book_cd,
  book_nm,
  buy_price,
  img_rm,
  topic,
  writer,
  index,
}) {
  return (
    <>
      {index === 0 ? (
        <View style={styles.headerContainer}>
          <TextWrap style={styles.header}>신간을 확인해 보세요!</TextWrap>
          <TextWrap style={styles.subHeader}>
            이번 달 새롭게 출간된 신간을 소개합니다.
          </TextWrap>
        </View>
      ) : null}
      <View style={styles.root}>
        <TouchableOpacity
          style={styles.main}
          onPress={() => {
            //
          }}>
          <View style={styles.mainContent}>
            <Image
              style={styles.thumbnail}
              source={require('../../assets/images/book1.png')}
            />
            <View style={styles.info}>
              <TextWrap
                ellipsizeMode="tail"
                numberOfLines={1}
                font={fonts.robotoMedium}
                style={styles.title}>
                {book_nm}
              </TextWrap>
              <TextWrap
                style={styles.title}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {writer}
              </TextWrap>
              <TextWrap
                ellipsizeMode="tail"
                numberOfLines={1}
                style={styles.title}>
                "{topic}"
              </TextWrap>
              <TextWrap style={[styles.title, styles.date]}>
                {numFormat(buy_price)}원
              </TextWrap>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              //
            }}>
            <Image style={styles.button1} source={images.like} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              //
            }}>
            <Image style={styles.button2} source={images.talk} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.divider} />
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    width: screenWidth,
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  main: {
    flex: 2.5,
    width: '70%',
    backgroundColor: colors.white,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'red',
  },
  date: {
    marginTop: 5,
    fontWeight: '700',
  },
  title: {
    color: colors.black,
    marginVertical: 1.5,
    fontSize: 13,
    lineHeight: 17,
  },
  divider: {
    marginHorizontal: 16,
    borderWidth: 0.3,
    borderColor: '#ccc',
  },
  thumbnail: {
    height: 120,
    width: 90,
    resizeMode: 'stretch',
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 12,
    padding: 0,
    alignSelf: 'center',
  },
  buttonContainer: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    // backgroundColor: 'blue',
  },
  button1: {
    width: 40,
    height: 40,
    flex: 1,
    resizeMode: 'contain',
    marginRight: 10,
  },
  button2: {
    width: 40,
    height: 40,
    flex: 1,
    resizeMode: 'contain',
  },
  headerContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '700',
  },
  subHeader: {
    color: colors.black,
    fontSize: 13,
  },
});
