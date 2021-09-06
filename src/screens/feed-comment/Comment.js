import React, {useEffect, useState, useRef} from 'react';
import {
  FlatList,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import colors from '../../libs/colors';
import images from '../../libs/images';
import consts from '../../libs/consts';
import routes from '../../libs/routes';
import fonts from '../../libs/fonts';
import {requestGet, requestPost} from '../../services/network';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
  fontPercentage,
  screenWidth,
} from '../../services/util';
import RootLayout from '../../layouts/root-layout/RootLayout';
import Avatar from '../../components/avatar/Avatar';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import {dialogOpenSelect, dialogError} from '../../redux/dialog/DialogActions';
import {CommentItem} from './CommentItem';
import TextWrap from '../../components/text-wrap/TextWrap';

export default function Comment({route, navigation}) {
  const user = useSelector(s => s.user, shallowEqual);
  const {show} = useSelector(s => s.keyboard, shallowEqual);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const inputRef = useRef();
  const listRef = useRef();

  const [tabIndex, setTabIndex] = useState(0); // 0 댓글 1 답글
  const [reReplyIdx, setReReplyIdx] = useState(null);
  const [text, setText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCommentList = () => {
    setLoading(true);
    requestGet({
      url: consts.apiUrl + `/mypage/feedBook/reply/${route.params.feedIdx}`,
    })
      .then(replyData => {
        setData([...replyData.data?.feedReplyList]);
        setLoading(false);
        listRef.current?.scrollToOffset({y: 0, animated: false});
      })
      .catch(e => {
        setLoading(false);
        dispatch(dialogError(e));
      });
  };

  const fetchAddComment = feed_idx => {
    setLoading(true);
    // 댓글달기
    if (tabIndex === 0) {
      requestPost({
        url: consts.apiUrl + '/mypage/feedBook/reply',
        body: {
          contents: text,
          feedIdx: feed_idx,
        },
      })
        .then(commentData => {
          setLoading(false);
          fetchCommentList();
        })
        .catch(e => {
          dispatch(dialogError(e));
          setLoading(false);
        });
    } else {
      // 답글달기
      requestPost({
        url: consts.apiUrl + '/mypage/feedBook/reReply',
        body: {
          contents: text,
          replyIdx: reReplyIdx,
        },
      })
        .then(commentData => {
          setLoading(false);
          fetchCommentList();
        })
        .catch(e => {
          dispatch(dialogError(e));
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (isFocused) {
      inputRef.current?.focus();
      setTabIndex(0);
      listRef.current?.scrollToOffset({y: 0, animated: false});
      fetchCommentList();
    }
    setData([]);
    setText('');
  }, [isFocused]);

  const onAddPress = () => {
    Keyboard.dismiss();
    fetchAddComment(route.params?.feedIdx);
    setText('');
    if (tabIndex === 1) {
      setTabIndex(0);
    }
  };

  const onChangeReply = replyIdx => {
    inputRef.current?.focus();
    setTabIndex(1);
    setReReplyIdx(replyIdx);
  };

  return (
    <RootLayout
      topbar={{
        title: '댓글',
        navigation: navigation,
        back: true,
        options: {
          component: <Image style={styles.cameraIcon} source={images.camera} />,
          name: 'camera',
          onPress: () =>
            dispatch(
              dialogOpenSelect({
                item: cameraItem(),
              }),
            ),
        },
        optionsSearch: {
          component: <Image style={styles.cameraIcon} source={images.search} />,
          name: 'search',
          onPress: () =>
            navigation.navigate(routes.search, {
              timeKey: Date.now(),
            }),
        },
        optionsAvator: {
          component: (
            <Avatar
              size={29}
              style={styles.avator}
              path={
                user?.profile_path
                  ? user?.profile_path
                  : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
              }
            />
          ),
          name: 'avator',
          onPress: () =>
            navigation.navigate(routes.feedBookImage, {
              memberId: user.member_id,
              memberIdx: user.member_idx,
              platformType: user.platform_type,
              key: Date.now(),
            }),
        },
      }}>
      <View style={styles.root}>
        <View style={styles.inputContainer}>
          <Avatar
            size={widthPercentage(31)}
            style={styles.avator}
            path={
              user
                ? user.profile_path
                : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
            }
          />
          <TextInput
            ref={inputRef}
            placeholder={''}
            style={styles.input}
            multiline={true}
            maxLength={200}
            autoCapitalize="none"
            onChangeText={t => {
              setText(t);
            }}
            value={text}
            // onSubmitEditing={onAddPress}
          />
        </View>
        <View style={styles.buttonContainer}>
          <ButtonWrap
            style={styles.button}
            disabled={text ? false : true}
            styleTitle={text ? styles.buttonTitle : styles.buttonTitleDisabled}
            onPress={onAddPress}>
            게시
          </ButtonWrap>
        </View>
        <View style={styles.dataContainer}>
          {data.length > 0 ? (
            <FlatList
              ref={listRef}
              data={data}
              extraData={data}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              ListFooterComponent={
                loading && (
                  <ActivityIndicator
                    size="large"
                    style={{
                      alignSelf: 'center',
                      marginTop: 20,
                      marginBottom: 150,
                    }}
                    color={colors.blue}
                  />
                )
              }
              renderItem={({item, index}) => {
                return (
                  <CommentItem
                    {...item}
                    index={index}
                    onChangeReply={onChangeReply}
                  />
                );
              }}
            />
          ) : (
            <View>
              <TextWrap>댓글이 없습니다.</TextWrap>
            </View>
          )}
        </View>
      </View>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    position: 'absolute',
    width: '100%',
    bottom: 0,
    borderTopColor: '#e6e6e6',
    borderTopWidth: 0.5,
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 0.5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 14,
    right: 16,
  },
  dataContainer: {
    width: screenWidth,
    marginTop: 10,
    marginBottom: 55,
    paddingHorizontal: 16,
  },
  input: {
    width: widthPercentage(271),
    height: 50,
    paddingLeft: widthPercentage(9.5),
    fontFamily: fonts.kopubWorldDotumProMedium,
  },
  button: {
    width: widthPercentage(30),
    height: heightPercentage(18),
    // backgroundColor: '#e6e6e6',
    backgroundColor: colors.white,
    alignSelf: 'center',
  },
  buttonTitle: {
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(19),
    color: colors.blue,
  },
  buttonTitleDisabled: {
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(19),
    color: colors.border,
  },
  avator: {
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
});
