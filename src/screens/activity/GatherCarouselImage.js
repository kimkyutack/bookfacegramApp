import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';

import consts from '../../libs/consts';
import {heightPercentage} from '../../services/util';
import FastImage from 'react-native-fast-image';

export default function GatherCarouselImage({item, index, style}) {
  const [bookThumbnail, setBookThumbnail] = useState(item?.thumbnail
  );
  useEffect(() => {
    // crawl , toaping
    setBookThumbnail(item?.thumbnail);
  }, [item?.thumbnail]);
  return (
    <FastImage
      source={{
        uri:
          bookThumbnail !== '' && bookThumbnail !== 'bookDefault'
            ? 'https://api-storage.cloud.toast.com/v1/AUTH_2900a4ee8d4d4be3a5146f0158948bd1/village/' + bookThumbnail
            : consts.imgUrl + '/thumbnail/bookDefault.gif',
        priority: FastImage.priority.high,
      }}
      resizeMode={style?.resizeMode == 'contain' ? FastImage.resizeMode.contain : FastImage.resizeMode.cover}
      style={[styles.image, style && style]}
      onError={e => {
        setBookThumbnail('bookDefault');
      }}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    height: heightPercentage(200),
  },
});
