import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';

import colors from '../../../libs/colors';
import consts from '../../../libs/consts';
import {heightPercentage, screenWidth} from '../../../services/util';
import FastImage from 'react-native-fast-image';

export default function MyBookListimage({item, index, style}) {
  const [bookThumbnail, setBookThumbnail] = useState(item?.imgNm);
  useEffect(() => {
      setBookThumbnail(item?.imgNm);
  }, [item?.imgNm]);

  if (item?.type === 'new' || item?.type === 'crawl' || item?.type === 'app' || item?.type === 'web') {
    return (
      <FastImage
        source={{
          uri:
            bookThumbnail !== '' && bookThumbnail !== 'bookDefault'
              ? consts.imgUrl + '/thumbnail/' + bookThumbnail + '.gif'
              : consts.imgUrl + '/thumbnail/bookDefault.gif',
          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.cover}
        style={[styles.image, style && style]}
        onError={e => {
          setBookThumbnail('bookDefault');
        }}
      />
    );
  } else {
    // item?.type === 'kbs' || item?.type === 'toaping'
    return (
      <FastImage
        source={{
          uri:
            bookThumbnail !== '' && bookThumbnail !== 'bookDefault'
              ? consts.toapingUrl + '/book/book_img/' + bookThumbnail + '.gif'
              : consts.imgUrl + '/thumbnail/bookDefault.gif',
          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.cover}
        style={[styles.image, style && style]}
        onError={() => {
          setBookThumbnail('');
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  image: {
    height: heightPercentage(150),
  },
});
