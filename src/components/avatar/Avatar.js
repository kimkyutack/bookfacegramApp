import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import consts from '../../libs/consts';
import image from '../../libs/image';
//react-native-fast-image.import FastImage from 'react-native-fast-image'
import FastImage from 'react-native-fast-image';

export default function Avatar({
  resizeMode,
  size,
  style,
  source,
  onPress,
  children,
  onUpdate,
  onLayout,
  path,
}) {
  return (
    <TouchableOpacity
      onLayout={e => {
        if (onLayout) {
          onLayout(e.nativeEvent.layout);
        }
      }}
      onPress={onPress}
      disabled={!onPress}
      style={[styles.root, style, size && {width: size, height: size}]}>
      {Boolean(path) || (source && source.uri) ? (
        <>
          <FastImage
            source={{
              uri: path
                ? path
                : // ? consts.fileApiUrl + '/' + path
                source
                ? source.uri
                : '',
              priority: FastImage.priority.normal,
            }}
            resizeMode={resizeMode || FastImage.resizeMode.cover}
            style={[styles.image]}
          />
        </>
      ) : (
        <Image
          source={
            source
              ? source
              : path
              ? {uri: consts.fileApiUrl + '/' + path}
              : image.avatarDefault
          }
          borderRadius={100}
          style={[styles.image, {resizeMode: resizeMode || 'cover'}]}
        />
      )}

      {Boolean(onUpdate) && (
        <Image source={image.camera_edit} style={styles.edit} />
      )}
      {children && children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  edit: {
    position: 'absolute',
    width: 26,
    height: 26,
    bottom: 0,
    right: 0,
  },
});
