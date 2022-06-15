import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import { fontPercentage, formatTime, heightPercentage, screenHeight, screenWidth, widthPercentage } from '../../services/util';
import HTMLView from 'react-native-htmlview';
import AutoHeightImage from 'react-native-auto-height-image';
import RenderHtml from 'react-native-render-html';
import RNFetchBlob from 'rn-fetch-blob';

const renderersProps = {
  img: {
    enableExperimentalPercentWidth: true,
  }
};

const tagsStyles = {
  img: {
    minWidth: screenWidth * 0.92,
    maxWidth: screenWidth * 0.92,
    alignSelf: 'center',
  },
};
export default function NoticeItem({
  no_idxs,
  register_dt,
  title,
  contents,
  file1,
  file2,
  isFocused,
  bannerYn
}) {
  const regex = /<br>|\n|\r\s*\\?>/gm;
  const source = {
    html: contents.replace(/font/gi, 'span').trim().replace(regex, '')
  };
  const [open, setOpen] = useState(false);

  const download = async (file) => {
  await RNFetchBlob.config({
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      path: `${RNFetchBlob.fs.dirs.DownloadDir}/${file}`,
    },
  }).fetch('GET', 'https://api-storage.cloud.toast.com/v1/AUTH_2900a4ee8d4d4be3a5146f0158948bd1/notice/' + file);
};

  useEffect(() => {
    if (bannerYn !== 0) {
      if (bannerYn == no_idxs) {
        setOpen(true);
      }
    } else {
      setOpen(false);
    }
  }, [isFocused]);

  return (
    <View>
      <TouchableOpacity
        style={[styles.main, open && styles.mainOpend]}
        onPress={() => {
          setOpen(!open);
        }}>
        <View style={[styles.mainContent, open && { marginTop: 6 }]}>
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
            {file1 === null || file1 === ''
            ? null
            : <TouchableOpacity onPress={() => download(file1)} style={{flexDirection:'row'}}>
            <Image source={images.noticeFile} style={{width:widthPercentage(10), height:heightPercentage(10)}}/><TextWrap style={{left:10, fontSize:fontPercentage(10), bottom:heightPercentage(2), fontWeight: 'bold'}}>{file1}</TextWrap>
            </TouchableOpacity>}
            {file2 === null || file2 === ''
            ? null
            : <TouchableOpacity onPress={() => download(file2)} style={{flexDirection:'row'}}>
            <Image source={images.noticeFile} style={{width:widthPercentage(10), height:heightPercentage(10)}}/><TextWrap style={{left:10, fontSize:fontPercentage(10), bottom:heightPercentage(2), fontWeight: 'bold'}}>{file2}</TextWrap>
            </TouchableOpacity>}
            {/* <HTMLView value={contents.trim().replace(regex, '')} renderNode={renderNode} /> */}
            <RenderHtml
              contentWidth={screenWidth * 0.92}
              source={source}
              tagsStyles={tagsStyles}
              renderersProps={renderersProps}
            />
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
    paddingVertical: heightPercentage(10),
  },
  main: {
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 16,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  mainContent: { flex: 1 },
  mainOpend: { paddingVertical: 10 },
  date: {
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(15),
    color: '#999999',
    marginTop: 10,
  },
  title: {
    color: colors.black,
    fontSize: fontPercentage(15),
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
  pFont: {
    marginBottom: 0,
  }
});
