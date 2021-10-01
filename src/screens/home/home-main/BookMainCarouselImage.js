import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';

import colors from '../../../libs/colors';
import consts from '../../../libs/consts';
import {heightPercentage, screenWidth} from '../../../services/util';
import FastImage from 'react-native-fast-image';

export default function BookMainCarouselImage({item, index, style}) {
  // console.log(item.type, item?.img_nm, item?.imgNm);
  const [bookThumbnail, setBookThumbnail] = useState(
    item?.type === 'new' ? item?.img_nm : item?.imgNm,
  );
  useEffect(() => {
    if (item?.type === 'kbs') {
      setBookThumbnail(item?.imgNm);
    } else if (item.type === 'new') {
      setBookThumbnail(item?.img_nm);
    } else {
      // crawl , toaping
      setBookThumbnail(item?.imgNm);
    }
  }, [item?.img_nm, item?.imgNm]);

  if (item?.type === 'new' || item?.type === 'crawl') {
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
