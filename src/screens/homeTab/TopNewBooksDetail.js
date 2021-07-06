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
import consts from '../../libs/consts';
import colors from '../../libs/colors';
import {requestGet, requestPost} from '../../services/network';
import {screenWidth} from '../../services/util';

import TextWrap from '../../components/text-wrap/TextWrap';
import BookDetailInfo from './BookDetailInfo';
import BookDetailQuiz from './BookDetailQuiz';
import BookDetailTalk from './BookDetailTalk';

export default function TopNewBooksDetail({selectedBook}) {
  const [loading, setLoading] = useState(false);
  const [bookDetail, setBookDetail] = useState();
  const [tabs, setTabs] = useState(0);
  const fetchRequested = async () => {
    try {
      setLoading(true);
      const book = await requestGet({
        url: consts.apiUrl + '/bookDetail',
        query: {book_cd: selectedBook},
      });
      setBookDetail(book.bookDetail[0]);
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
            <TextWrap style={fontStyle}>{props.title}</TextWrap>
            <View style={styles.tabBorder} />
          </>
        </TouchableHighlight>
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.root}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../../assets/images/book3.png')}
        />
      </View>
      <TextWrap style={styles.imageTitle}>{selectedBook}</TextWrap>
      <View style={styles.tabContainer}>
        <Tab title="도서소개" id={0} isSelected={tabs === 0 ? true : false} />
        <Tab title="독서퀴즈" id={1} isSelected={tabs === 1 ? true : false} />
        <Tab title="북핑톡" id={2} isSelected={tabs === 2 ? true : false} />
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{alignSelf: 'center', marginBottom: 60}}
          color={colors.primary}
        />
      ) : tabs === 0 ? (
        <BookDetailInfo {...bookDetail} />
      ) : tabs === 1 ? (
        <BookDetailQuiz />
      ) : (
        <BookDetailTalk />
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
        elevation: 5,
      },
    }),
  },
  image: {
    width: 150,
    height: 200,
    overflow: 'visible',
  },
  imageTitle: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 35,
  },
  tabContainer: {
    width: screenWidth,
    borderTopColor: colors.border,
    borderTopWidth: 0.8,
    borderBottomColor: colors.border,
    borderBottomWidth: 0.8,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  selectedTab: {
    width: 60,
    borderBottomWidth: 3,
    borderBottomColor: colors.black,
  },
  normalTab: {
    width: 60,
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
});
