import React, {useState} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';

import colors from '../../libs/colors';
import consts from '../../libs/consts';
import {screenWidth} from '../../services/util';
import FastImage from 'react-native-fast-image';

export default function BookMainCarouselImage({item, index, style}) {
  const [bookThumbnail, setBookThumbnail] = useState(item.img_nm);
  return (
    <FastImage
      source={{
        uri:
          bookThumbnail !== ''
            ? consts.imgUrl + '/' + bookThumbnail + '.gif'
            : consts.imgUrl + '/bookDefault.gif',
        priority: FastImage.priority.normal,
      }}
      resizeMode={FastImage.resizeMode.cover}
      style={[styles.image, style && style]}
      onError={() => setBookThumbnail('bookDefault')}
    />
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: colors.white,
    marginTop: 20,
    height: 150,
  },

  image: {
    top: 5,
    position: 'relative',
    width: '90%',
    height: 150,
  },
});
