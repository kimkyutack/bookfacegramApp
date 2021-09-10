import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';

import colors from '../../../libs/colors';
import consts from '../../../libs/consts';
import {heightPercentage, screenWidth} from '../../../services/util';
import FastImage from 'react-native-fast-image';

export default function BookMainCarouselImage({
  item,
  index,
  style,
  marginHorizontal,
}) {
  const [bookThumbnail, setBookThumbnail] = useState(
    item.type === 'new' ? item?.img_nm : item?.imgNm,
  );
  useEffect(() => {
    if (item.type === 'kbs') {
      setBookThumbnail(item?.imgNm);
    } else if (item.type === 'new') {
      setBookThumbnail(item?.img_nm);
    }
  }, [item?.img_nm, item?.imgNm]);

  if (item.type === 'new') {
    return (
      <FastImage
        source={{
          uri:
            bookThumbnail !== '' && bookThumbnail !== undefined
              ? consts.imgUrl + '/thumbnail/' + bookThumbnail + '.gif'
              : consts.imgUrl + '/thumbnail/bookDefault.gif',
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
        style={[
          styles.image,
          {marginHorizontal: marginHorizontal},
          style && style,
        ]}
        onError={() => setBookThumbnail('bookDefault')}
      />
    );
  } else {
    return (
      <FastImage
        source={{
          uri:
            bookThumbnail !== '' && bookThumbnail !== undefined
              ? consts.toapingUrl + '/book/book_img/' + bookThumbnail + '.gif'
              : consts.imgUrl + '/thumbnail/bookDefault.gif',
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
        style={[
          styles.image,
          {marginHorizontal: marginHorizontal},
          style && style,
        ]}
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
