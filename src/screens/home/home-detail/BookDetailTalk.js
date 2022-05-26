import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import TagInput from 'react-native-tags-input';
import {useDispatch} from 'react-redux';
import TextWrap from '../../../components/text-wrap/TextWrap';
import ButtonWrap from '../../../components/button-wrap/ButtonWrap';
import InputWrap from '../../../components/input-wrap/InputWrap';
import colors from '../../../libs/colors';
import consts from '../../../libs/consts';
import fonts from '../../../libs/fonts';
import images from '../../../libs/images';
import routes from '../../../libs/routes';
import {
  fontPercentage,
  formatTime,
  heightPercentage,
  screenWidth,
  widthPercentage,
} from '../../../services/util';
import {requestGet, requestPost} from '../../../services/network';
import BookDetailTalkItem from './BookDetailTalkItem';
import {
  dialogOpenMessage,
  dialogError,
} from '../../../redux/dialog/DialogActions';
export default function BookDetailTalk({selectedBook, wait}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [raplyContent, setReplyContent] = useState('');
  const [starRate, setStarRate] = useState(5);
  const [tags, setTags] = useState({tag: '', tagsArray: []});
  const dispatch = useDispatch();

  useEffect(() => {
    let mount = true;
    if (mount) {
      // talkReplyList();
    }
    return () => {
      mount = false;
    };
  }, []);

  const talkReplyList = () => {
    setLoading(true);
    requestGet({
      url: consts.apiUrl + '/book/bookPingTalk',
      query: {
        book_cd: selectedBook,
      },
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          setData(res.data?.bookPingTalk);
        } else if (res.status === 'FAIL') {
          // error 일때 해야함
          dispatch(dialogError('fail'));
        } else {
          dispatch(dialogError('fail'));
        }
        setLoading(false);
      })
      .catch(error => {
        // error 일때 해야함
        dispatch(dialogError(error));
        setLoading(false);
      });
  };

  const talkReplyInsert = () => {
    setLoading(true);
    requestPost({
      url: consts.apiUrl + '/book/bookPingTalk',
      body: {
        bookHashtag: tags.tagsArray,
        book_cd: selectedBook,
        contents: raplyContent,
        starRate: starRate,
      },
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          setTags({tag: '', tagsArray: []});
          setStarRate(5);
          setReplyContent('');
          talkReplyList();
        } else if (res.status === 'FAIL') {
          // error 일때 해야함
          dispatch(dialogError('fail'));
        } else {
          dispatch(dialogError('fail'));
        }
        setLoading(false);
      })
      .catch(error => {
        // error 일때 해야함
        dispatch(dialogError(error));
        setLoading(false);
      });
  };

  const onStarRatingPress = rating => {
    setStarRate(rating);
  };

  const setTagHandle = e => {
    if (tags.tagsArray.length > 9) {
      dispatch(
        dialogOpenMessage({message: '해시태그는 10개까지 등록할 수 있습니다.'}),
      );
    } else {
      setTags(e);
    }
  };

  if (loading) {
    return <></>;
  } else {
    return (
      <View style={styles.replyContainer}>
        <View style={styles.starRateContainer}>
          <StarRating
            disabled={false}
            halfStarEnabled={true}
            emptyStar={images.recommend}
            fullStar={images.recommendActive}
            halfStar={images.recommendHalf}
            maxStars={5}
            animation={'tada'}
            starSize={40}
            starStyle={{marginHorizontal: 3}}
            rating={starRate}
            selectedStar={rating => onStarRatingPress(rating)}
          />
        </View>

        <InputWrap
          style={styles.input}
          value={raplyContent}
          onChange={setReplyContent}
          borderColor={colors.border}
          placeholder="자유롭게 토핑톡을 남겨주세요.
          (최대 200자)"
          placeholderTextColor="#acacac"
          maxLength={200}
          inputStyle={raplyContent.length === 0 ? styles.placeInput : styles.textInput}
          multiline

        />
        <View style={styles.hashTagContianer}>
          <TagInput
            updateState={setTagHandle}
            tags={tags}
            placeholder="태그입력(최대 10개 가능)"
            placeholderTextColor="#acacac"
            containerStyle={{
              width: screenWidth,
              paddingHorizontal: 16,
            }}
            inputContainerStyle={styles.hashTagInput}
            inputStyle={{
              fontSize: fontPercentage(11),
              lineHeight: fontPercentage(20),
              marginLeft: 3,
              color: '#858585',
              fontFamily: fonts.kopubWorldDotumProBold,
            }}
            autoCorrect={false}
            tagStyle={styles.tag}
            tagTextStyle={styles.tagText}
            tagsViewStyle={{paddingHorizontal: 5}}
            keysForTagsArray={['#', ',']}
            customElement={
              <TextWrap
                font={fonts.kopubWorldDotumProLight}
                style={styles.customElement}>
                *엔터를 눌러 해시태그를 등록해주세요.
              </TextWrap>
            }
          />
        </View>
        <View style={styles.buttonContainer}>
          <ButtonWrap
            styleTitle={styles.buttonAddTitle}
            onPress={talkReplyInsert}
            style={styles.buttonAdd}>
            등록
          </ButtonWrap>
        </View>
        <View style={{flex: 1}}>
          {data.map((u, i) => {
            return <BookDetailTalkItem {...u} key={i} />;
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  replyContainer: {
    width: screenWidth,
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  starRateContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  hashTagContianer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginVertical: 12,
    fontSize: fontPercentage(14),
    color: colors.black,
  },
  textInput: {
    color: colors.black,
    height: heightPercentage(100),
    textAlignVertical: 'top', //android-only
    fontFamily: fonts.kopubWorldDotumProMedium,
  },
  placeInput: {
    height: heightPercentage(100),
    textAlign: 'center', //android-only
    fontFamily: fonts.kopubWorldDotumProMedium,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
  },
  contentCount: {
    position: 'absolute',
    bottom: 0,
    right: 4,
    alignSelf: 'flex-end',
  },
  buttonAdd: {
    width: widthPercentage(60),
    height: heightPercentage(30),
    justifyContent: 'center',
    backgroundColor: colors.black,
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  buttonAddTitle: {
    color: colors.white,
    fontSize: fontPercentage(13),
  },

  hashTagInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#333333',
    height: heightPercentage(30),
    marginTop: 10,
    flexDirection: 'row',
  },
  customElement: {
    color: colors.red,
    paddingLeft: widthPercentage(6),
    fontSize: fontPercentage(10),
  },
  tagText: {
    fontSize: fontPercentage(11),
    color: '#858585',
    fontFamily: fonts.kopubWorldDotumProBold,
  },
  tag: {
    backgroundColor: '#f1f1f1',
    borderColor: '#f1f1f1',
    borderRadius: widthPercentage(13),
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(19),
    fontFamily: fonts.kopubWorldDotumProLight,
  },
});
