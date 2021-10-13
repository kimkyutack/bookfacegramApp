import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TouchableHighlight,
  View,
  SafeAreaView,
  Platform,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';

import {openSettings, PERMISSIONS} from 'react-native-permissions';

import consts from '../../../libs/consts';
import colors from '../../../libs/colors';
import images from '../../../libs/images';
import routes from '../../../libs/routes';
import {requestGet, requestPost} from '../../../services/network';
import {
  screenWidth,
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../../services/util';
import FastImage from 'react-native-fast-image';

import TextWrap from '../../../components/text-wrap/TextWrap';
import BookDetailInfo from './BookDetailInfo';
import BookDetailQuiz from './BookDetailQuiz';
import BookDetailTalk from './BookDetailTalk';

import {
  getImageFromCamera,
  checkMultiplePermissions,
  getImageFromGallery,
} from '../../../services/picker';
import {
  dialogError,
  dialogOpenDrawerSelect,
} from '../../../redux/dialog/DialogActions';
import fonts from '../../../libs/fonts';
import {useIsFocused} from '@react-navigation/core';

FastImage.preload([
  {
    uri: 'https://api-storage.cloud.toast.com/v1/AUTH_2900a4ee8d4d4be3a5146f0158948bd1/books/thumbnail/bookDefault.gif',
  },
]);

export default function TopNewBooksDetail({route}) {
  const [loading, setLoading] = useState(false);
  const detailTab = useSelector(s => s.tab, shallowEqual);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [bookDetail, setBookDetail] = useState([]);
  const [tabs, setTabs] = useState(0);
  const [bookThumbnail, setBookThumbnail] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [drawerList, setDrawerList] = useState([]);

  const fetchRequested = async () => {
    try {
      setLoading(true);
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/book/bookDetail',
        query: {
          book_cd: selectedBook,
          type: detailTab.detailTab?.viewType || 'new',
        },
      });
      if (status === 'SUCCESS') {
        setBookThumbnail(data.bookDetail[0]?.img_nm);
        setBookDetail(data.bookDetail[0]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      dispatch(dialogError(error));
    }
  };

  const getDrawerList = () => {
    requestGet({
      url: consts.apiUrl + '/mypage/bookDrawer/keep',
      query: {
        bookIdx: selectedBook,
      },
    })
      .then(res => {
        res.data.map(x => {
          x.contentsIdx = x.drawIdx;
          x.bookIdx = detailTab.detailTab.selectedBook;
          x.type = detailTab.detailTab.viewType;
        });
        dispatch(
          dialogOpenDrawerSelect({
            drawerList: res.data.map(x => [x]),
            title: '보관 책서랍 선택',
            from: 'detail',
            bookIdx: detailTab.detailTab.selectedBook,
            viewType: detailTab.detailTab.viewType,
          }),
        );
      })
      .catch(e => {
        dispatch(dialogError(e));
      });
  };

  useEffect(() => {
    if (isFocused) {
      setSelectedBook(detailTab.detailTab.selectedBook);
    }
  }, [detailTab.detailTab.selectedBook]);

  useEffect(() => {
    let mount = true;
    if (mount && selectedBook) {
      fetchRequested();
    }
    return () => {
      mount = false;
    };
  }, [selectedBook]);

  useEffect(() => {
    if (detailTab.tabType === 'talk') {
      setTabs(2);
    } else {
      setTabs(0);
    }
  }, [isFocused]);

  const Tab = props => {
    let style = (props.isSelected && styles.selectedTab) || styles.normalTab;
    let fontStyle =
      (props.isSelected && styles.selectedTabFont) || styles.normalTabFont;
    return (
      <View style={style}>
        <TouchableHighlight
          underlayColor={'transparent'}
          style={styles.highlight}
          onPress={() => setTabs(props.id)}>
          <>
            <TextWrap style={fontStyle} font={fonts.kopubWorldDotumProMedium}>
              {props.title}
            </TextWrap>
            <View style={styles.tabBorder} />
          </>
        </TouchableHighlight>
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.root,
        loading && {flex: 1, justifyContent: 'center'},
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{alignSelf: 'center', marginBottom: 60}}
          color={colors.blue}
        />
      ) : tabs === 0 ? (
        <>
          <View style={styles.imageContainer}>
            {detailTab.detailTab.viewType === 'kbs' ? (
              <FastImage
                source={{
                  uri:
                    bookThumbnail !== '' && bookThumbnail !== 'bookDefault'
                      ? consts.toapingUrl +
                        '/book/book_img/' +
                        bookThumbnail +
                        '.gif'
                      : consts.imgUrl + '/thumbnail/bookDefault.gif',
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
                style={styles.image}
                onError={() => setBookThumbnail('bookDefault')}
              />
            ) : (
              <FastImage
                source={{
                  uri:
                    bookThumbnail !== ''
                      ? consts.imgUrl + '/thumbnail/' + bookThumbnail + '.gif'
                      : consts.imgUrl + '/thumbnail/bookDefault.gif',
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
                style={styles.image}
                onError={() => setBookThumbnail('bookDefault')}
              />
            )}
          </View>
          <TextWrap
            style={styles.imageTitle}
            font={fonts.kopubWorldDotumProBold}>
            {bookDetail?.book_nm}
          </TextWrap>

          <TouchableOpacity
            onPress={getDrawerList}
            style={{
              marginTop: 10,
              marginBottom: 35,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={images.heart}
              style={{
                width: widthPercentage(15),
                height: widthPercentage(15),
                resizeMode: 'contain',
              }}
            />
            <TextWrap
              style={styles.drawerTitle}
              font={fonts.kopubWorldDotumProMedium}>
              책서랍
            </TextWrap>
          </TouchableOpacity>
          <View style={styles.tabContainer}>
            <Tab
              title="도서소개"
              id={0}
              isSelected={tabs === 0 ? true : false}
            />
            <Tab
              title="독서퀴즈"
              id={1}
              isSelected={tabs === 1 ? true : false}
            />
            <Tab title="토핑톡" id={2} isSelected={tabs === 2 ? true : false} />
          </View>
          <BookDetailInfo {...bookDetail} />
        </>
      ) : tabs === 1 ? (
        <>
          <View style={styles.imageContainer}>
            {detailTab.detailTab.viewType === 'kbs' ? (
              <FastImage
                source={{
                  uri:
                    bookThumbnail !== '' && bookThumbnail !== 'bookDefault'
                      ? consts.toapingUrl +
                        '/book/book_img/' +
                        bookThumbnail +
                        '.gif'
                      : consts.imgUrl + '/thumbnail/bookDefault.gif',
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
                style={styles.image}
                onError={() => setBookThumbnail('bookDefault')}
              />
            ) : (
              <FastImage
                source={{
                  uri:
                    bookThumbnail !== ''
                      ? consts.imgUrl + '/thumbnail/' + bookThumbnail + '.gif'
                      : consts.imgUrl + '/thumbnail/bookDefault.gif',
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
                style={styles.image}
                onError={() => setBookThumbnail('bookDefault')}
              />
            )}
          </View>
          <TextWrap
            style={styles.imageTitle}
            font={fonts.kopubWorldDotumProBold}>
            {bookDetail?.book_nm}
          </TextWrap>
          <TouchableOpacity
            onPress={getDrawerList}
            style={{
              marginTop: 10,
              marginBottom: 35,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={images.heart}
              style={{
                width: widthPercentage(15),
                height: widthPercentage(15),
                resizeMode: 'contain',
              }}
            />
            <TextWrap
              style={styles.drawerTitle}
              font={fonts.kopubWorldDotumProMedium}>
              책서랍
            </TextWrap>
          </TouchableOpacity>
          <View style={styles.tabContainer}>
            <Tab
              title="도서소개"
              id={0}
              isSelected={tabs === 0 ? true : false}
            />
            <Tab
              title="독서퀴즈"
              id={1}
              isSelected={tabs === 1 ? true : false}
            />
            <Tab title="토핑톡" id={2} isSelected={tabs === 2 ? true : false} />
          </View>
          <BookDetailQuiz />
        </>
      ) : (
        <>
          <View style={styles.imageContainer}>
            {detailTab.detailTab.viewType === 'kbs' ? (
              <FastImage
                source={{
                  uri:
                    bookThumbnail !== '' && bookThumbnail !== 'bookDefault'
                      ? consts.toapingUrl +
                        '/book/book_img/' +
                        bookThumbnail +
                        '.gif'
                      : consts.imgUrl + '/thumbnail/bookDefault.gif',
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
                style={styles.image}
                onError={() => setBookThumbnail('bookDefault')}
              />
            ) : (
              <FastImage
                source={{
                  uri:
                    bookThumbnail !== ''
                      ? consts.imgUrl + '/thumbnail/' + bookThumbnail + '.gif'
                      : consts.imgUrl + '/thumbnail/bookDefault.gif',
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
                style={styles.image}
                onError={() => setBookThumbnail('bookDefault')}
              />
            )}
          </View>
          <TextWrap
            style={styles.imageTitle}
            font={fonts.kopubWorldDotumProBold}>
            {bookDetail?.book_nm}
          </TextWrap>
          <TouchableOpacity
            onPress={getDrawerList}
            style={{
              marginTop: 10,
              marginBottom: 35,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={images.heart}
              style={{
                width: widthPercentage(15),
                height: widthPercentage(15),
                resizeMode: 'contain',
              }}
            />
            <TextWrap
              style={styles.drawerTitle}
              font={fonts.kopubWorldDotumProMedium}>
              책서랍
            </TextWrap>
          </TouchableOpacity>
          <View style={styles.tabContainer}>
            <Tab
              title="도서소개"
              id={0}
              isSelected={tabs === 0 ? true : false}
            />
            <Tab
              title="독서퀴즈"
              id={1}
              isSelected={tabs === 1 ? true : false}
            />
            <Tab title="토핑톡" id={2} isSelected={tabs === 2 ? true : false} />
          </View>
          <BookDetailTalk selectedBook={selectedBook} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    width: screenWidth,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    marginTop: 25,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
      },
      android: {
        backgroundColor: 'white',
        elevation: 1,
      },
    }),
  },
  image: {
    width: widthPercentage(140),
    height: heightPercentage(200),
    resizeMode: 'cover',
  },
  imageTitle: {
    textAlign: 'center',
    fontSize: fontPercentage(16),
  },
  drawerTitle: {
    fontSize: fontPercentage(14),
    marginLeft: 5,
  },
  tabContainer: {
    width: screenWidth,
    borderTopColor: colors.border,
    borderTopWidth: 0.8,
    borderBottomColor: colors.border,
    borderBottomWidth: 0.8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    fontFamily: fonts.kopubWorldDotumProBold,
  },
  selectedTab: {
    width: widthPercentage(60),
    height: heightPercentage(40),
    borderBottomWidth: 3,
    borderBottomColor: colors.black,
    justifyContent: 'center',
  },
  normalTab: {
    width: widthPercentage(60),
    height: heightPercentage(40),
    justifyContent: 'center',
  },
  selectedTabFont: {
    color: colors.black,
    textAlign: 'center',
  },
  normalTabFont: {
    color: '#BABABA',
    textAlign: 'center',
  },
  highlight: {
    backgroundColor: colors.white,
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
});