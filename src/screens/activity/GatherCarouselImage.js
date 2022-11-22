import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';

import consts from '../../libs/consts';
import {heightPercentage} from '../../services/util';
import FastImage from 'react-native-fast-image';

export default function GatherCarouselImage({item, index, style}) {
  const [bookThumbnail, setBookThumbnail] = useState(item?.isbn
  );
  useEffect(() => {
    // crawl , toaping
    setBookThumbnail(item?.isbn);
  }, [item?.isbn]);

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
