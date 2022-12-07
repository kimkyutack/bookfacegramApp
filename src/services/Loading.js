import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { fontPercentage, heightPercentage, widthPercentage } from './util';
import images from '../libs/images';

export function Loading() {
  const { container } = styles;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>결제가 진행됩니다. 잠시만 기다려주세요.</Text>
      <View style={styles.container2}>
      <Image source={images.loadingclock} style={styles.loading}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    flexDirection:'column'
  },
  container2: {
    flex: 2,
    alignItems:'center',
    flexDirection:'column'
  },
  text: {
    flex:1,
    fontSize:fontPercentage(13),
    fontWeight:'bold',
    top:heightPercentage(40)
  },
  loading: {
    width:widthPercentage(80),
    height:heightPercentage(90),
    resizeMode:'contain'
  },
});

export default Loading;