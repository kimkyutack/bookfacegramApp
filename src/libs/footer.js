import React from 'react';
import {
  Image,
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
} from 'react-native';
import TextWrap from '../components/text-wrap/TextWrap';
import images from '../libs/images';
import routes from '../libs/routes';
import {navigate} from '../services/navigation';

export function Footer() {
  return (
    <View style={styles.footer}>
      <TouchableWithoutFeedback
        onPress={() =>
          navigate(routes.home, {
            screen: routes.topNewBooks,
            params: {
              type: 'main',
              key: Date.now(),
            },
          })
        }>
        <View accessibilityRole="button" style={[styles.footer]}>
          <Image style={styles.footerIcon} source={images.footerHome1} />
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          navigate(routes.feedBook, {
            screen: routes.feedBookFeed,
            params: {
              type: 'feed',
              key: Date.now(),
            },
          })
        }>
        <View accessibilityRole="button" style={[styles.footer]}>
          <Image style={styles.footerIcon} source={images.footerFeed1} />
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          navigate(routes.bookDrawer, {
            screen: routes.bookDrawer,
            params: {
              type: 'draw',
              key: Date.now(),
            },
          })
        }>
        <View accessibilityRole="button" style={[styles.footer]}>
          <Image style={styles.footerIcon} source={images.footerDraw1} />
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          navigate(routes.event, {
            screen: routes.event,
            params: {
              type: 'event',
              key: Date.now(),
            },
          })
        }>
        <View accessibilityRole="button" style={[styles.footer]}>
          <Image style={styles.footerIcon} source={images.footerQuiz1} />
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          navigate(routes.event, {
            screen: routes.event,
            params: {
              type: 'event',
              key: Date.now(),
            },
          })
        }>
        <View accessibilityRole="button" style={[styles.footer]}>
          <Image style={styles.footerIcon} source={images.footerEvent1} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    flexDirection: 'row',
    padding: 40,
  },
  footerIcon: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
  },
});

export default Footer;
