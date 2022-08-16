import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';

import colors from '../../libs/colors';
import consts from '../../libs/consts';
import {heightPercentage, screenWidth} from '../../services/util';
import FastImage from 'react-native-fast-image';

export default function AudiioCarouselImage({item, index, style}) {
  const [bookThumbnail, setBookThumbnail] = useState(item?.audImg
  );
  useEffect(() => {
    // crawl , toaping
    setBookThumbnail(item?.audImg);
  }, [item?.audImg]);

  return (
    <FastImage
      source={{
        uri:
          bookThumbnail !== '' && bookThumbnail !== 'bookDefault'
            ? 'https://toaping.com/aud_file/' + bookThumbnail
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
