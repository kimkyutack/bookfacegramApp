import React, {useRef} from 'react';
import {
  Image,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import TextWrap from '../components/text-wrap/TextWrap';
import images from '../libs/images';
import routes from '../libs/routes';
import {useDispatch} from 'react-redux';
import {navigate} from '../services/navigation';
import {setTab} from '../redux/tab/TabAction';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../services/util';

export function Footer(page) {
  const dispatch = useDispatch();
  const scrollRef = useRef();
  return (
    <View style={styles.mainfooter}>
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
                page.page === 'home'
                  ? {color: '#0066ff', fontSize: fontPercentage(10)}
                  : {color: 'black', fontSize: fontPercentage(10)}
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
                page.page === 'feed'
                  ? {color: '#0066ff', fontSize: fontPercentage(10)}
                  : {color: 'black', fontSize: fontPercentage(10)}
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
                page.page === 'draw'
                  ? {color: '#0066ff', fontSize: fontPercentage(10)}
                  : {color: 'black', fontSize: fontPercentage(10)}
              }>
              책서랍
            </TextWrap>
          </View>
          {/*display: flex로 변경*/}
          <TouchableOpacity
            onPress={() =>
              scrollRef.current.scrollToOffset({offset: 0, animated: true})
            }
            style={{display: 'none'}}>
            <Image source={images.scrollTop} style={[styles.scrolltotop]} />
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          dispatch(
            setTab({
              tab: 'quiz',
              rank: 'all',
            }),
          );
          navigate(routes.activity, {
            type: 'quiz',
            rank: 'all',
          });
        }}>
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
                page.page === 'quiz'
                  ? {color: '#0066ff', fontSize: fontPercentage(10)}
                  : {color: 'black', fontSize: fontPercentage(10)}
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
                page.page === 'event'
                  ? {color: '#0066ff', fontSize: fontPercentage(10)}
                  : {color: 'black', fontSize: fontPercentage(10)}
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
    bottom: heightPercentage(10),
    left: 0,
    right: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: heightPercentage(60),
    flexDirection: 'row',
    padding: widthPercentage(23),
    borderWidth: 0,
  },
  mainfooter: {
    position: 'relative',
    top: 0,
    bottom: heightPercentage(10),
    left: 0,
    right: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: heightPercentage(60),
    flexDirection: 'row',
    padding: widthPercentage(23),
    borderTopColor: '#c9c9c9',
    borderTopWidth: 1,
  },
  footerIcon: {
    bottom: heightPercentage(10),
    width: widthPercentage(20),
    height: heightPercentage(20),
    resizeMode: 'contain',
  },
  homes: {
    position: 'absolute',
    bottom: heightPercentage(10),
    right: widthPercentage(29),
  },
  quizs: {
    position: 'absolute',
    bottom: heightPercentage(10),
    right: widthPercentage(18),
  },
  events: {
    position: 'absolute',
    bottom: heightPercentage(10),
    right: widthPercentage(21),
  },
  scrolltotop: {
    display: 'flex',
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 60,
    right: 0,
  },
});

export default Footer;
