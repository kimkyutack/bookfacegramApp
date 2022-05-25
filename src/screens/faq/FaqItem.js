import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import {fontPercentage, heightPercentage} from '../../services/util';
import HTMLView from 'react-native-htmlview';

export default function FaqItem({
  registerDt,
  question,
  answer,
  category,
  categoryType,
  isFocused,
}) {
  const [open, setOpen] = useState(false);
  //alert(JSON.stringify(category));

  useEffect(() => {
    setOpen(false);
  }, [categoryType, isFocused]);
  return (
    <View>
      {categoryType === 'service'
        ? category === '서비스' && (
            <TouchableOpacity
              style={[styles.main, open && styles.mainOpend]}
              onPress={() => {
                setOpen(!open);
              }}>
              <View style={[styles.mainContent, open && {marginTop: 6}]}>
                <TextWrap
                  font={fonts.kopubWorldDotumProMedium}
                  style={styles.title}>
                  {question}
                </TextWrap>
              </View>
              <Image
                source={open ? images.angleUp : images.angleDown}
                style={styles.up}
              />
            </TouchableOpacity>
          )
        : categoryType === 'feed'
        ? category === '피드북' && (
            <TouchableOpacity
              style={[styles.main, open && styles.mainOpend]}
              onPress={() => {
                setOpen(!open);
              }}>
              <View style={[styles.mainContent, open && {marginTop: 6}]}>
                <TextWrap
                  font={fonts.kopubWorldDotumProMedium}
                  style={styles.title}>
                  {question}
                </TextWrap>
              </View>
              <Image
                source={open ? images.angleUp : images.angleDown}
                style={styles.up}
              />
            </TouchableOpacity>
          )
        : categoryType === 'read'
        ? category === '독후활동' && (
            <TouchableOpacity
              style={[styles.main, open && styles.mainOpend]}
              onPress={() => {
                setOpen(!open);
              }}>
              <View style={[styles.mainContent, open && {marginTop: 6}]}>
                <TextWrap
                  font={fonts.kopubWorldDotumProMedium}
                  style={styles.title}>
                  {question}
                </TextWrap>
              </View>
              <Image
                source={open ? images.angleUp : images.angleDown}
                style={styles.up}
              />
            </TouchableOpacity>
          )
        : categoryType === 'mem'
        ? category === '회원' && (
            <TouchableOpacity
              style={[styles.main, open && styles.mainOpend]}
              onPress={() => {
                setOpen(!open);
              }}>
              <View style={[styles.mainContent, open && {marginTop: 6}]}>
                <TextWrap
                  font={fonts.kopubWorldDotumProMedium}
                  style={styles.title}>
                  {question}
                </TextWrap>
              </View>
              <Image
                source={open ? images.angleUp : images.angleDown}
                style={styles.up}
              />
            </TouchableOpacity>
          )
        : category === '서비스' && (
            <TouchableOpacity
              style={[styles.main, open && styles.mainOpend]}
              onPress={() => {
                setOpen(!open);
              }}>
              <View style={[styles.mainContent, open && {marginTop: 6}]}>
                <TextWrap
                  font={fonts.kopubWorldDotumProMedium}
                  style={styles.title}>
                  {question}
                </TextWrap>
              </View>
              <Image
                source={open ? images.angleUp : images.angleDown}
                style={styles.up}
              />
            </TouchableOpacity>
          )}
      {open && (
        <View style={styles.desc}>
          <View style={styles.descText}>
            <HTMLView value={answer} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  descDate: {
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(15),
    color: '#777777',
    marginTop: 12,
  },
  desc: {
    padding: 16,
    paddingBottom: 0,
  },
  descText: {
    color: '#555555',
    fontSize: fontPercentage(14),
    fontFamily: fonts.kopubWorldDotumProLight,
    lineHeight: fontPercentage(20),
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
    borderBottomColor:'#e5e5e5',
    borderBottomWidth:1,
  },
  mainContent: {
    flex: 1,
    paddingVertical: heightPercentage(10),
    height: heightPercentage(50),
  },
  mainOpend: {paddingVertical: 10},
  date: {
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(15),
    color: '#999999',
    marginTop: 10,
  },
  title: {
    color: colors.black,
    fontSize: fontPercentage(16),
    lineHeight: fontPercentage(21),
  },
  up: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
