import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import consts from '../../libs/consts';
import images from '../../libs/images';
import TextWrap from '../text-wrap/TextWrap';

export default function Avatars({plus, paths}) {
  return (
    <View style={styles.root}>
      <View style={styles.images}>
        {paths && paths.length ? (
          paths.map((path, index) => {
            return (
              <View
                style={[
                  styles.iconWrap,
                  {marginLeft: index !== 0 ? -8 : 0, zIndex: index + 1},
                ]}
                key={index.toString()}>
                <Image
                  style={[styles.icon]}
                  source={
                    path
                      ? {uri: consts.fileApiUrl + '/' + path}
                      : images.avatarDefault
                  }
                />
              </View>
            );
          })
        ) : (
          <View style={[styles.iconWrap]}>
            <Image style={[styles.icon]} source={images.avatarDefault} />
          </View>
        )}
      </View>
      {Boolean(plus) && <TextWrap style={styles.label}>+ {plus}</TextWrap>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
    borderRadius: 100,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 17,
    color: '#999999',
  },
  iconWrap: {
    borderWidth: 1,
    backgroundColor: '#eee',
    borderRadius: 100,
    borderColor: '#fff',
  },
  images: {flexDirection: 'row', alignItems: 'center'},
});
