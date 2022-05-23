import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import {fontPercentage, formatTime, heightPercentage, screenHeight, screenWidth} from '../../services/util';
import HTMLView from 'react-native-htmlview';
import AutoHeightImage from 'react-native-auto-height-image';

export default function NoticeItem({
  register_dt,
  title,
  contents,
  filePath,
  isFocused,
}) {
  const [open, setOpen] = useState(false);
  const renderNode = (node, index) => {
        if (node.name == 'img') {
            const a = node.attribs;
            return (
              <View key={index}>
               <AutoHeightImage width={screenWidth * 0.84} source={{uri: a.src}}/> 
              </View>
               );
        }
    };

  useEffect(() => {
    setOpen(false);
  }, [isFocused]);
  return (
    <View>
      <TouchableOpacity
        style={[styles.main, open && styles.mainOpend]}
        onPress={() => {
          setOpen(!open);
        }}>
        <View style={[styles.mainContent, open && {marginTop: 6}]}>
          <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.title}>
            {title}
          </TextWrap>
          <TextWrap style={styles.date} font={fonts.kopubWorldDotumProMedium}>
            {register_dt}
          </TextWrap>
        </View>
        <Image
          source={open ? images.angleUp : images.angleDown}
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
          {/* <TextWrap style={styles.descText}>{CONTENTS}</TextWrap> */}
          <View style={styles.descText}>
            <HTMLView value={contents}  renderNode={renderNode}/>
          </View>
        </View>
      )}
      <View style={styles.divider} />
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
  },
  mainContent: {flex: 1},
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
  divider: {
    marginHorizontal: 16,
    borderRadius: 1,
    height: 1,
    backgroundColor: '#e5e5e5',
  },
});
