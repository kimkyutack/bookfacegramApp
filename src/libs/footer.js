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

export function Footer(page) {
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
          <Image
            style={styles.footerIcon}
            source={
              page.page === 'home' ? images.footerHome2 : images.footerHome1
            }
          />
          <View style={[styles.homes]}>
            <TextWrap
              style={
                page.page === 'home' ? {color: '#0066ff'} : {color: 'black'}
              }>
              홈
            </TextWrap>
          </View>
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
          <Image
            style={styles.footerIcon}
            source={
              page.page === 'feed' ? images.footerFeed2 : images.footerFeed1
            }
          />
          <View style={[styles.events]}>
            <TextWrap
              style={
                page.page === 'feed' ? {color: '#0066ff'} : {color: 'black'}
              }>
              피드북
            </TextWrap>
          </View>
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
          <Image
            style={styles.footerIcon}
            source={
              page.page === 'draw' ? images.footerDraw2 : images.footerDraw1
            }
          />
          <View style={[styles.events]}>
            <TextWrap
              style={
                page.page === 'draw' ? {color: '#0066ff'} : {color: 'black'}
              }>
              책서랍
            </TextWrap>
          </View>
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
          <Image
            style={styles.footerIcon}
            source={
              page.page === 'quiz' ? images.footerQuiz2 : images.footerQuiz1
            }
          />
          <View style={[styles.quizs]}>
            <TextWrap
              style={
                page.page === 'quiz' ? {color: '#0066ff'} : {color: 'black'}
              }>
              독서퀴즈
            </TextWrap>
          </View>
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
          <Image
            style={styles.footerIcon}
            source={
              page.page === 'event' ? images.footerEvent2 : images.footerEvent1
            }
          />
          <View style={[styles.events]}>
            <TextWrap
              style={
                page.page === 'event' ? {color: '#0066ff'} : {color: 'black'}
              }>
              이벤트
            </TextWrap>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'relative',
    top: 0,
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 110,
    flexDirection: 'row',
    padding: 50,
    borderTopColor: '#c9c9c9',
    borderTopWidth: 1,
  },
  footerIcon: {
    bottom: 15,
    width: 35,
    height: 35,
    resizeMode: 'cover',
  },
  homes: {
    position: 'absolute',
    bottom: 20,
    right: 61,
  },
  quizs: {
    position: 'absolute',
    bottom: 20,
    right: 45,
  },
  events: {
    position: 'absolute',
    bottom: 20,
    right: 49,
  },
});

export default Footer;
