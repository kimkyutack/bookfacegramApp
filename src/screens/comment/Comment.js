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
import {requestGet} from '../../services/network';
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
import {dialogOpenSelect} from '../../redux/dialog/DialogActions';
import {CommentItem} from './CommentItem';

export default function Comment({route, navigation}) {
  const user = useSelector(s => s.user, shallowEqual);
  const {show} = useSelector(s => s.keyboard, shallowEqual);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const inputRef = useRef();
  const listRef = useRef();

  const [tabIndex, setTabIndex] = useState(0); // 0 댓글 1 답글
  const [text, setText] = useState('');
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  //uri 추가해야함
  const k = [
    {
      id: 1,
      member_id: '아이디1아이디1아이디1dd@asd.com',
      uri: '',
      contents:
        '댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1댓글 내용1',
      joinDate: '2021.05.08',
      replys: [
        {
          id: 100,
          uri: '',
          member_id: '아이디3',
          contents: '답글 내용1',
          joinDate: '2021.05.08',
        },
      ],
    },
    {
      id: 2,
      member_id: '아이디아이디아',
      contents: '댓글 내용2',
      joinDate: '2021.05.08',
      replys: null,
    },
    {
      id: 3,
      member_id: '아이디3',
      contents: '댓글 내용3',
      joinDate: '2021.05.08',
      replys: null,
    },
    {
      id: 4,
      member_id: '아이디4',
      contents: '댓글 내용1',
      joinDate: '2021.05.08',
      replys: [
        {
          id: 101,
          member_id: '아이디3',
          contents: '답글 내용1',
          joinDate: '2021.05.08',
        },
        {
          id: 102,
          member_id: '아이디3',
          contents: '답글 내용2',
          joinDate: '2021.05.08',
        },
      ],
    },
    {
      id: 5,
      member_id: '아이디5',
      contents: '댓글 내용5',
      joinDate: '2021.05.08',
      replys: null,
    },
    {
      id: 6,
      member_id: '아이디6',
      contents: '댓글 내용6',
      joinDate: '2021.05.08',
      replys: null,
    },
    {
      id: 7,
      member_id: '아이디7',
      contents: '댓글 내용7',
      joinDate: '2021.05.08',
      replys: null,
    },
    {
      id: 8,
      member_id: '아이디8',
      contents: '댓글 내용8',
      joinDate: '2021.05.08',
      replys: null,
    },
    {
      id: 9,
      member_id: '아이디9',
      contents: '댓글 내용9',
      joinDate: '2021.05.08',
      replys: null,
    },
    {
      id: 10,
      member_id: '아이디10',
      contents: '댓글 내용10',
      joinDate: '2021.05.08',
      replys: null,
    },
    {
      id: 11,
      member_id: '아이디11',
      contents: '댓글 내용11',
      joinDate: '2021.05.08',
      replys: null,
    },
    {
      id: 12,
      member_id: '아이디12',
      contents: '댓글 내용12',
      joinDate: '2021.05.08',
      replys: null,
    },
    {
      id: 13,
      member_id: '아이디13',
      contents: '댓글 내용13',
      joinDate: '2021.05.08',
      replys: null,
    },
    {
      id: 14,
      member_id: '아이디14',
      contents: '댓글 내용14',
      joinDate: '2021.05.08',
      replys: null,
    },
    {
      id: 15,
      member_id: '아이디15',
      contents: '댓글 내용15',
      joinDate: '2021.05.08',
      replys: null,
    },
  ];
  const fetchSearch = () => {
    setLoading(true);
    requestGet({
      url: consts.apiUrl + '/users/' + user.member_id + '/friends',
      query: {
        member_id: route.params?.member_id,
      },
    })
      .then(replyData => {
        setData([...replyData]);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        // dispatch(dialogError(e));

        setData([...k]);
      });
  };

  useEffect(() => {
    if (navigation.isFocused()) {
      inputRef.current?.focus();
      setTabIndex(0);
      listRef.current?.scrollToOffset({y: 0, animated: false});
      fetchSearch();
    }
    setData([]);
    setText('');
  }, [isFocused]);

  const onSearch = () => {
    Keyboard.dismiss();
    fetchSearch();
    // fetch add  만들어야함
    setText('');
    if (tabIndex === 1) {
      setTabIndex(0);
    }
  };

  const onChangeReply = commnetId => {
    inputRef.current?.focus();
    setTabIndex(1);
    // comment id 받아와서 set해준뒤 onsearch 할때 아이디로 보내야함
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
              timeKey: Date.now(),
              member_id: user.member_id,
              member_idx: user.member_idx,
              platform_type: user.platform_type,
            }),
        },
      }}>
      <View style={styles.root}>
        <View style={styles.inputContainer}>
          <Avatar
            size={widthPercentage(31)}
            style={styles.avator}
            path={
              'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
              // uri
              //   ? uri
              //   : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
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
            // onSubmitEditing={onSearch}
          />
        </View>
        <View style={styles.buttonContainer}>
          <ButtonWrap
            style={styles.button}
            disabled={text ? false : true}
            styleTitle={text ? styles.buttonTitle : styles.buttonTitleDisabled}
            onPress={onSearch}>
            게시
          </ButtonWrap>
        </View>
        <View style={styles.dataContainer}>
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
