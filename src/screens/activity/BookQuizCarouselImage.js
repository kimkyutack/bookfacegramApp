import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';

import colors from '../../libs/colors';
import consts from '../../libs/consts';
import {heightPercentage, screenWidth} from '../../services/util';
import FastImage from 'react-native-fast-image';

export default function BookQuizCarouselImage({item, index, style}) {
  // console.log(item.type, item?.img_nm, item?.imgNm);
  const [bookThumbnail, setBookThumbnail] = useState(
    item?.type === 'new' ? item?.img_nm : item?.imgNm,
  );
  useEffect(() => {
    // crawl , toaping
    setBookThumbnail(item?.isbn);
  }, [item?.isbn, item?.isbn]);

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
}

const styles = StyleSheet.create({
  image: {
    height: heightPercentage(150),
  },
});
