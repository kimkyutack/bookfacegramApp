import React, {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Text,
  ScrollView,
} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import CardWrap from '../../components/card-wrap/CardWrap';
import SnapCarousel from '../../components/snap-carousel/SnapCarousel';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';

import {requestGet, requestPost} from '../../services/network';
import {screenHeight, screenWidth} from '../../services/util';
import {navigate, navigationRef} from '../../services/navigation';

import consts from '../../libs/consts';
import colors from '../../libs/colors';
import BookItem from './Bookitem';

export default function TopNewBooks({}) {
  const [bookList, setBookList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [th, setTh] = useState('18');

  const fetchRequested = async () => {
    try {
      setLoading(true);
      const books = await requestGet({
        // url: consts.apiUrl + '/bookList',
        url: 'http://172.16.0.89:8080/bookList',
      });
      console.log(books);
      setBookList([...books.newBook]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      // dispatch(dialogError(error));
    }
  };

  useEffect(() => {
    fetchRequested();
  }, []);

  // const onEndReached = () => {
  //   if (loading) {
  //     return;
  //   } else {
  //     fetchRequested();
  //   }
  // };

  const onPressTitle = () => {
    navigate('topActivity');
  };
  return (
    <View style={styles.root}>
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{alignSelf: 'center', marginBottom: 60}}
          color={colors.primary}
        />
      ) : (
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: 'white',
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <SnapCarousel
            name="mainCarousel"
            sliderWidth={screenWidth - 40}
            itemWidth={screenWidth - 40}
          />
          {/* 신간 */}
          <View>
            <View style={styles.cardHeader}>
              <TextWrap style={styles.cardHeaderTitleSt1}>
                신간을 확인해보세요!
              </TextWrap>
              <TextWrap style={styles.cardHeaderSpread} onPress={onPressTitle}>
                &gt; 전체보기
              </TextWrap>
            </View>
            <View style={styles.cardContainer}>
              {[
                {url: 1, title: '존리의 부자되기 습관', writer: '존리'},
                {
                  url: 2,
                  title: '이토록 공부가 재미있어지는 순간',
                  writer: '박성희',
                },
                {url: 3, title: '돈의속성', writer: '김승호'},
              ].map((u, i) => {
                return (
                  <CardWrap
                    style={styles.card}
                    key={i}
                    onPress={() => console.log(u.url)}>
                    <Image
                      style={styles.image}
                      source={
                        u.url === 1
                          ? require('../../assets/images/book1.png')
                          : u.url === 2
                          ? require('../../assets/images/book2.png')
                          : u.url === 3
                          ? require('../../assets/images/book3.png')
                          : 'defulat'
                      }
                    />
                    <TextWrap
                      style={styles.info}
                      ellipsizeMode="tail"
                      numberOfLines={2}>
                      {u.writer}/{'\n'}
                      {u.title}
                    </TextWrap>
                  </CardWrap>
                );
              })}
            </View>
          </View>
          {/* 1급 도서 */}
          <View style={styles.category}>
            <View style={styles.cardHeader}>
              <TextWrap style={styles.cardHeaderTitle}>
                {moment().format('YYYY')}년도 [제{th}회]{'\n'}
                <TextWrap style={styles.blueText}>
                  책과함께, KBS한국어능력시험
                </TextWrap>
                <TextWrap style={{color: colors.st1}}> 1급 </TextWrap>도서
              </TextWrap>
              <TextWrap style={styles.cardHeaderSpread}>&gt; 전체보기</TextWrap>
            </View>
            <View style={styles.cardContainer}>
              {[
                {url: 1, title: '존리의 부자되기 습관', writer: '존리'},
                {
                  url: 2,
                  title: '이토록 공부가 재미있어지는 순간',
                  writer: '박성희',
                },
                {url: 3, title: '돈의속성', writer: '김승호'},
              ].map((u, i) => {
                return (
                  <CardWrap style={styles.card} key={i}>
                    <Image
                      style={styles.image}
                      source={
                        u.url === 1
                          ? require('../../assets/images/book1.png')
                          : u.url === 2
                          ? require('../../assets/images/book2.png')
                          : u.url === 3
                          ? require('../../assets/images/book3.png')
                          : 'defulat'
                      }
                    />
                    <TextWrap
                      style={styles.info}
                      ellipsizeMode="tail"
                      numberOfLines={2}>
                      {u.writer}/{'\n'}
                      {u.title}
                    </TextWrap>
                  </CardWrap>
                );
              })}
            </View>
          </View>
          {/* 2급 도서 */}
          <View style={styles.category}>
            <View style={styles.cardHeader}>
              <TextWrap style={styles.cardHeaderTitle}>
                {moment().format('YYYY')}년도 [제{th}회]{'\n'}
                <TextWrap style={styles.blueText}>
                  책과함께, KBS한국어능력시험
                </TextWrap>
                <TextWrap style={{color: colors.st2}}> 2급 </TextWrap>도서
              </TextWrap>
              <TextWrap style={styles.cardHeaderSpread}>&gt; 전체보기</TextWrap>
            </View>
            <View style={styles.cardContainer}>
              {[
                {url: 1, title: '존리의 부자되기 습관', writer: '존리'},
                {
                  url: 2,
                  title: '이토록 공부가 재미있어지는 순간',
                  writer: '박성희',
                },
                {url: 3, title: '돈의속성', writer: '김승호'},
              ].map((u, i) => {
                return (
                  <CardWrap style={styles.card} key={i}>
                    <Image
                      style={styles.image}
                      source={
                        u.url === 1
                          ? require('../../assets/images/book1.png')
                          : u.url === 2
                          ? require('../../assets/images/book2.png')
                          : u.url === 3
                          ? require('../../assets/images/book3.png')
                          : 'defulat'
                      }
                    />
                    <TextWrap
                      style={styles.info}
                      ellipsizeMode="tail"
                      numberOfLines={2}>
                      {u.writer}/{'\n'}
                      {u.title}
                    </TextWrap>
                  </CardWrap>
                );
              })}
            </View>
          </View>
          {/* 준(3)급 도서 */}
          <View style={styles.category}>
            <View style={styles.cardHeader}>
              <TextWrap style={styles.cardHeaderTitle}>
                {moment().format('YYYY')}년도 [제{th}회]{'\n'}
                <TextWrap style={styles.blueText}>
                  책과함께, KBS한국어능력시험
                </TextWrap>
                <TextWrap style={{color: colors.st3}}> (준)3급 </TextWrap>도서
              </TextWrap>
              <TextWrap style={styles.cardHeaderSpread}>&gt; 전체보기</TextWrap>
            </View>
            <View style={styles.cardContainer}>
              {[
                {url: 1, title: '존리의 부자되기 습관', writer: '존리'},
                {
                  url: 2,
                  title: '이토록 공부가 재미있어지는 순간',
                  writer: '박성희',
                },
                {url: 3, title: '돈의속성', writer: '김승호'},
              ].map((u, i) => {
                return (
                  <CardWrap style={styles.card} key={i}>
                    <Image
                      style={styles.image}
                      source={
                        u.url === 1
                          ? require('../../assets/images/book1.png')
                          : u.url === 2
                          ? require('../../assets/images/book2.png')
                          : u.url === 3
                          ? require('../../assets/images/book3.png')
                          : 'defulat'
                      }
                    />
                    <TextWrap
                      style={styles.info}
                      ellipsizeMode="tail"
                      numberOfLines={2}>
                      {u.writer}/{'\n'}
                      {u.title}
                    </TextWrap>
                  </CardWrap>
                );
              })}
            </View>
          </View>
          {/* 준(4)급 도서 */}
          <View style={styles.category}>
            <View style={styles.cardHeader}>
              <TextWrap style={styles.cardHeaderTitle}>
                {moment().format('YYYY')}년도 [제{th}회]{'\n'}
                <TextWrap style={styles.blueText}>
                  책과함께, KBS한국어능력시험
                </TextWrap>
                <TextWrap style={{color: colors.st4}}> 준(4)급 </TextWrap>도서
              </TextWrap>
              <TextWrap style={styles.cardHeaderSpread}>&gt; 전체보기</TextWrap>
            </View>
            <View style={styles.cardContainer}>
              {[
                {url: 1, title: '존리의 부자되기 습관', writer: '존리'},
                {
                  url: 2,
                  title: '이토록 공부가 재미있어지는 순간',
                  writer: '박성희',
                },
                {url: 3, title: '돈의속성', writer: '김승호'},
              ].map((u, i) => {
                return (
                  <CardWrap style={styles.card} key={i}>
                    <Image
                      style={styles.image}
                      source={
                        u.url === 1
                          ? require('../../assets/images/book1.png')
                          : u.url === 2
                          ? require('../../assets/images/book2.png')
                          : u.url === 3
                          ? require('../../assets/images/book3.png')
                          : 'defulat'
                      }
                    />
                    <TextWrap
                      style={styles.info}
                      ellipsizeMode="tail"
                      numberOfLines={2}>
                      {u.writer}/{'\n'}
                      {u.title}
                    </TextWrap>
                  </CardWrap>
                );
              })}
            </View>
          </View>
          {/* 준(5)급 도서 */}
          <View style={styles.category}>
            <View style={styles.cardHeader}>
              <TextWrap style={styles.cardHeaderTitle}>
                {moment().format('YYYY')}년도 [제{th}회]{'\n'}
                <TextWrap style={styles.blueText}>
                  책과함께, KBS한국어능력시험
                </TextWrap>
                <TextWrap style={{color: colors.st5}}> 준(5)급 </TextWrap>도서
              </TextWrap>
              <TextWrap style={styles.cardHeaderSpread}>&gt; 전체보기</TextWrap>
            </View>
            <View style={styles.cardContainer}>
              {[
                {url: 1, title: '존리의 부자되기 습관', writer: '존리'},
                {
                  url: 2,
                  title: '이토록 공부가 재미있어지는 순간',
                  writer: '박성희',
                },
                {url: 3, title: '돈의속성', writer: '김승호'},
              ].map((u, i) => {
                return (
                  <CardWrap style={styles.card} key={i}>
                    <Image
                      style={styles.image}
                      source={
                        u.url === 1
                          ? require('../../assets/images/book1.png')
                          : u.url === 2
                          ? require('../../assets/images/book2.png')
                          : u.url === 3
                          ? require('../../assets/images/book3.png')
                          : 'defulat'
                      }
                    />
                    <TextWrap
                      style={styles.info}
                      ellipsizeMode="tail"
                      numberOfLines={2}>
                      {u.writer}/{'\n'}
                      {u.title}
                    </TextWrap>
                  </CardWrap>
                );
              })}
            </View>
          </View>
          {/* 누리급 도서 */}
          <View style={styles.category}>
            <View style={styles.cardHeader}>
              <TextWrap style={styles.cardHeaderTitle}>
                {moment().format('YYYY')}년도 [제{th}회]{'\n'}
                <TextWrap style={styles.blueText}>
                  책과함께, KBS한국어능력시험
                </TextWrap>
                <TextWrap style={{color: colors.st6}}> 누리급 </TextWrap>도서
              </TextWrap>
              <TextWrap style={styles.cardHeaderSpread}>&gt; 전체보기</TextWrap>
            </View>
            <View style={styles.cardContainer}>
              {[
                {url: 1, title: '존리의 부자되기 습관', writer: '존리'},
                {
                  url: 2,
                  title: '이토록 공부가 재미있어지는 순간',
                  writer: '박성희',
                },
                {url: 3, title: '돈의속성', writer: '김승호'},
              ].map((u, i) => {
                return (
                  <CardWrap style={styles.card} key={i}>
                    <Image
                      style={styles.image}
                      source={
                        u.url === 1
                          ? require('../../assets/images/book1.png')
                          : u.url === 2
                          ? require('../../assets/images/book2.png')
                          : u.url === 3
                          ? require('../../assets/images/book3.png')
                          : 'defulat'
                      }
                    />
                    <TextWrap
                      style={styles.info}
                      ellipsizeMode="tail"
                      numberOfLines={2}>
                      {u.writer}/{'\n'}
                      {u.title}
                    </TextWrap>
                  </CardWrap>
                );
              })}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  category: {
    marginVertical: 30,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#d9d9d9',
    height: 200,
    maxWidth: screenWidth / 3.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 13,
    marginBottom: 6,
  },
  cardHeaderTitle: {
    fontWeight: '700',
    lineHeight: 16,
  },
  cardHeaderTitleSt1: {
    fontWeight: '700',
    lineHeight: 24,
  },
  cardHeaderSpread: {fontSize: 12, position: 'absolute', bottom: 1, right: 0},
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 200,
  },
  image: {
    top: 5,
    position: 'relative',
    height: 150,
    resizeMode: 'contain',
  },
  info: {
    width: '100%',
    height: '100%',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 5,
    paddingTop: 16,
    lineHeight: 16,
  },
  blueText: {
    color: colors.blue,
  },
  button: {
    justifyContent: 'center',
    width: '80%',
  },
});
