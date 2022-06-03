import { useRoute } from '@react-navigation/native';
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import CameraRoll from '@react-native-community/cameraroll';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import TagInput from 'react-native-tags-input';
import Avatar from '../../components/avatar/Avatar';
import TextWrap from '../../components/text-wrap/TextWrap';
import Topbar from '../../components/topbar/Topbar';
import InputWrap from '../../components/input-wrap/InputWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import routes from '../../libs/routes';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import Footer from '../../libs/footer';
import {
  fontPercentage,
  heightPercentage,
  isIos,
  screenWidth,
  widthPercentage,
  cameraEditItem,
} from '../../services/util';
import { goBack, navigate } from '../../services/navigation';
import { requestGet, requestFile, requestPost } from '../../services/network';
import {
  openSettings,
  PERMISSIONS,
  check,
  request,
} from 'react-native-permissions';
import {
  dialogError,
  dialogOpenAction,
  dialogOpenMessage,
  dialogOpenSelect,
} from '../../redux/dialog/DialogActions';

export default function FeedBookEditor({ route, navigation }) {
  const user = useSelector(s => s.user, shallowEqual);
  const [contents, setContents] = useState('');
  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [Feedimage, setImage] = useState([{ name: '', uri: '' }]);
  const [tags, setTags] = useState({ tag: '', tagsArray: [] });
  const { params } = useRoute();
  const dispatch = useDispatch();
  const listRef = useRef();
  const tagRef = useRef();
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);

  useEffect(() => {
    requestGet({
      url: consts.apiUrl + '/mypage/feedBook/my',
      query: {
        feedIdx: route.params.idx,
      },
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          setImage([
            {
              name: res.data.feedImageName,
              uri: res.data.feedImageName,
            },
          ]);
          //console.log(Feedimage);
          let contentReplace = res.data.contents.replace(
            /(<br>|<br\/>|<br \/>)/g,
            '\r\n',
          );
          setContents(contentReplace.replace(/&nbsp/g, ' '));
          setTags({ tag: '', tagsArray: res.data.feedHashtag });
          if (res.data.title != null) {
            setTitle(res.data.title);
          }
          if (res.data.writer != null) {
            setWriter(res.data.writer);
          }
        }
      })
      .catch(error => {
        setContents('');
        setTags({ tag: '', tagsArray: [] });
      });
  }, [params.key]);

  const save = async () => {
    // ios도 button dsiabled 해주라
    setSaveButtonDisabled(true);
    if (!isIos) {
      let ps = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      if (ps !== 'granted') {
        ps = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        if (ps !== 'granted') {
          dispatch(
            dialogOpenAction({
              title: '설정',
              titleColor: colors.blue,
              cancelTitle: '닫기',
              message:
                '파일 첨부를 위해 다음 권한이 필요합니다.\n- 저장소 접근 권한\n- 카메라 접근 권한\n설정>어플리케이션>토핑에서 권한을 허용으로 변경해 주세요.',
              onPress: a => {
                if (a) {
                  openSettings();
                }
              },
            }),
          );
        } else {
          try {
            // android file write on phone
            if (params?.name === 'gallery') {
              // 여러장

              const formData = new FormData();
              const file = [];
              if (params.image !== undefined) {
                for (let i = 0; i < params.image.length; i++) {
                  file.push({
                    uri: params.image[i].uri,
                    type: params.image[i].type,
                    name: params.image[i].name,
                  });
                  formData.append('file', file[i]);
                }
              }
              formData.append('feedIdx', route.params.idx);
              formData.append('contents', contents);
              formData.append('bookNm', title);
              formData.append('author', writer);
              formData.append('hashTags', tags.tagsArray?.toString());

              const { data, status } = await requestFile(
                {
                  url: consts.apiUrl + '/mypage/feedBook/my',
                  method: 'put',
                },
                formData,
              );
              if (status === 'SUCCESS') {
                setSaveButtonDisabled(false);
                navigate(routes.feedBookImage, {
                  screen: routes.feedBookFeed,
                  params: {
                    memberId: user.member_id,
                    memberIdx: user.member_idx,
                    infoType: 'user',
                    isNewFeed: true,
                    key: Date.now(),
                    noname: 'name',
                  },
                });
              }
            } else {
              // 한장

              var formData = new FormData();
              var file = [];
              if (params.image !== undefined) {
                file.push({
                  uri: params.image[0].uri,
                  type: params.image[0].type,
                  name: params.image[0].name,
                });

                formData.append('file', file[0]);
              }
              formData.append('feedIdx', route.params.idx);
              formData.append('contents', contents);
              formData.append('bookNm', title);
              formData.append('author', writer);
              formData.append('hashTags', tags.tagsArray?.toString());

              const { data, status } = await requestFile(
                {
                  url: consts.apiUrl + '/mypage/feedBook/my',
                  method: 'put',
                },
                formData,
              );
              if (status === 'SUCCESS') {
                setSaveButtonDisabled(false);
                if (params?.name === 'camera') {
                  const saveResult = await CameraRoll.save(params.image[0].uri, {
                    type: 'photo',
                    album: 'toaping',
                  });
                }
                navigate(routes.feedBookImage, {
                  screen: routes.feedBookFeed,
                  params: {
                    memberId: user.member_id,
                    memberIdx: user.member_idx,
                    infoType: 'user',
                    isNewFeed: true,
                    key: Date.now(),
                    noname: 'name',
                  },
                });
              }
            }
          } catch (e) {
            setSaveButtonDisabled(false);
            dispatch(dialogError(e));
          }
        }
      } else {
        try {
          // android file write on phone
          if (params?.name === 'gallery') {
            // 여러장

            const formData = new FormData();
            const file = [];
            if (params.image !== undefined) {
              for (let i = 0; i < params.image.length; i++) {
                file.push({
                  uri: params.image[i].uri,
                  type: params.image[i].type,
                  name: params.image[i].name,
                });
                formData.append('file', file[i]);
              }
            }
            formData.append('feedIdx', route.params.idx);
            formData.append('contents', contents);
            formData.append('bookNm', title);
            formData.append('author', writer);
            formData.append('hashTags', tags.tagsArray?.toString());

            const { data, status } = await requestFile(
              {
                url: consts.apiUrl + '/mypage/feedBook/my',
                method: 'put',
              },
              formData,
            );
            if (status === 'SUCCESS') {
              setSaveButtonDisabled(false);
              navigate(routes.feedBookImage, {
                screen: routes.feedBookFeed,
                params: {
                  memberId: user.member_id,
                  memberIdx: user.member_idx,
                  infoType: 'user',
                  isNewFeed: true,
                  key: Date.now(),
                  noname: 'name',
                },
              });
            }
          } else {
            // 한장

            var formData = new FormData();
            var file = [];
            if (params.image !== undefined) {
              file.push({
                uri: params.image[0].uri,
                type: params.image[0].type,
                name: params.image[0].name,
              });

              formData.append('file', file[0]);
            }
            formData.append('feedIdx', route.params.idx);
            formData.append('contents', contents);
            formData.append('bookNm', title);
            formData.append('author', writer);
            formData.append('hashTags', tags.tagsArray?.toString());

            const { data, status } = await requestFile(
              {
                url: consts.apiUrl + '/mypage/feedBook/my',
                method: 'put',
              },
              formData,
            );
            if (status === 'SUCCESS') {
              setSaveButtonDisabled(false);
              if (params?.name === 'camera') {
                const saveResult = await CameraRoll.save(params.image[0].uri, {
                  type: 'photo',
                  album: 'toaping',
                });
              }
              navigate(routes.feedBookImage, {
                screen: routes.feedBookFeed,
                params: {
                  memberId: user.member_id,
                  memberIdx: user.member_idx,
                  infoType: 'user',
                  isNewFeed: true,
                  key: Date.now(),
                  noname: 'name',
                },
              });
            }
          }
        } catch (e) {
          setSaveButtonDisabled(false);
          dispatch(dialogError(e));
        }
      }
    } else {
      // ios ~
    }
  };

  const setTagHandle = e => {
    if (tags.tagsArray.includes(tags.tag) && tags.tag.length !== 0) {
      setTags({ tag: '', tagsArray: tags.tagsArray });
      dispatch(
        dialogOpenMessage({ message: '중복된 해시태그입니다.' }),
      );
    } else {
      setTags(e);
      listRef.current?.scrollToEnd({ animated: true });
    }
    //tagRef.current.focus();
  };

  const setTagHandle2 = e => {
    if (tags.tagsArray.length > 9) {
      dispatch(
        dialogOpenMessage({ message: '해시태그는 10개까지 등록할 수 있습니다.' }),
      );
    } else {
      setTags(e);
      listRef.current?.scrollToEnd({ animated: true });
    }
    //tagRef.current.focus();
  };

  return (
    <RootLayout
      style={{ paddingHorizontal: 16 }}
      topbar={{
        title:
          user.member_id?.length > 20
            ? user.member_id?.substring(0, 20) + '...'
            : user.member_id,
        back: true,
        navigation: navigation,
        options: {
          name: 'complete',
          component: (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() =>
                  dispatch(
                    dialogOpenSelect({
                      item: cameraEditItem(),
                    }),
                  )
                }>
                <Image style={styles.cameraIcon} source={images.camera} />
              </TouchableOpacity>
              <TextWrap
                font={fonts.kopubWorldDotumProBold}
                style={
                  saveButtonDisabled
                    ? styles.disabledTextIcon
                    : styles.completeTextIcon
                }
                onPress={() => (saveButtonDisabled ? null : save())}>
                수정
              </TextWrap>
            </View>
          ),
        },
      }}>
      {saveButtonDisabled ? (
        <ActivityIndicator
          size="large"
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            top: heightPercentage(250),
          }}
          color={colors.blue}
        />
      ) : (
        <FlatList
          ref={listRef}
          numColumns={4}
          extraData={params.image === undefined ? Feedimage : params.image}
          data={params.image === undefined ? Feedimage : params.image}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          ListFooterComponent={
            <>
              <View style={styles.userInfoContainer}>
                <View>
                  <Avatar
                    size={widthPercentage(17)}
                    style={styles.avator}
                    path={
                      user?.profile_path
                        ? user?.profile_path
                        : 'https://toaping.me/bookfacegram/images/menu_left/icon/toaping.png'
                    }
                  />
                </View>
                <View>
                  <InputWrap
                    style={styles.input}
                    selectionColor="#acacac"
                    inputFlex={{ borderColor: colors.white }}
                    inputStyle={styles.textInput}
                    maxLength={2000}
                    value={contents}
                    onChange={setContents}
                    placeholder="내용 입력..."
                    placeholderTextColor="#acacac"
                    placeholderSize={fontPercentage(11)}
                    multiline
                    numberOfLines={10}
                  // optionComponent={
                  //   <TextWrap style={styles.contentCount}>
                  //     ({contents.length} / 2000)
                  //   </TextWrap>
                  // }
                  />
                </View>
              </View>
              <View style={styles.hashTagContianer}>
                <TextWrap
                  style={styles.hashTagTitle}
                  font={fonts.kopubWorldDotumProBold}>
                  #도서 상세정보 입력
                </TextWrap>
                <InputWrap
                  inputStyle={{
                    fontSize: fontPercentage(12),
                    lineHeight: fontPercentage(19),
                    color: '#858585',
                    fontFamily: fonts.kopubWorldDotumProBold,
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#333333',
                  }}
                  value={title}
                  onChange={setTitle}
                  placeholder="#책제목"
                  placeholderTextColor="#acacac"
                  placeholderSize={fontPercentage(12)}
                />
                <InputWrap
                  inputStyle={{
                    fontSize: fontPercentage(12),
                    lineHeight: fontPercentage(19),
                    color: '#858585',
                    fontFamily: fonts.kopubWorldDotumProBold,
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#333333',
                  }}
                  value={writer}
                  onChange={setWriter}
                  placeholder="#저자명"
                  placeholderTextColor="#acacac"
                  placeholderSize={fontPercentage(12)}
                />
                <TextWrap
                  font={fonts.kopubWorldDotumProLight}
                  style={styles.customElement2}>
                  *상세정보를 입력하시면 정확한 나만의 도서를 추천받을 수
                  있습니다.
                </TextWrap>
              </View>
              <View style={styles.hashTagContianer}>
                <TextWrap
                  style={styles.hashTagTitle}
                  font={fonts.kopubWorldDotumProBold}>
                  #나만의 해시태그 입력
                </TextWrap>

                <TagInput
                  ref={tagRef}
                  updateState={setTagHandle2}
                  endState={setTagHandle}
                  tags={tags}
                  placeholder="#"
                  placeholderTextColor="#acacac"
                  placeholderSize={fontPercentage(12)}
                  containerStyle={{
                    width: screenWidth,
                    paddingHorizontal: 10,
                  }}
                  inputContainerStyle={styles.hashTagInput}
                  inputStyle={{
                    fontSize: fontPercentage(12),
                    lineHeight: fontPercentage(23),
                    color: '#858585',
                    fontFamily: fonts.kopubWorldDotumProBold,
                  }}
                  autoCorrect={false}
                  tagStyle={styles.tag}
                  tagTextStyle={styles.tagText}
                  tagsViewStyle={{ paddingHorizontal: 5 }}
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
            </>
          }
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  width: widthPercentage(82),
                  height: heightPercentage(82),
                  backgroundColor: colors.black,
                  marginRight: (index + 1) % 4 === 0 ? 0 : 2,
                  marginTop: 5,
                }}>
                <View>
                  <Image
                    source={
                      params.image === undefined
                        ? {
                          uri:
                            'https://api-storage.cloud.toast.com/v1/AUTH_2900a4ee8d4d4be3a5146f0158948bd1/books/feedBook/' +
                            item.uri,
                        }
                        : { uri: item.uri }
                    }
                    style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                  />
                </View>
              </View>
            );
          }}
        />
      )}
      <Footer />
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
    marginRight: widthPercentage(10),
    bottom: 3,
  },
  input: {
    width: widthPercentage(291),
    maxHeight: heightPercentage(190),
    marginLeft: 6,
    color: '#333333',
    paddingBottom: 0,
  },
  textInput: {
    marginTop: 5,
    textAlignVertical: 'top',
    padding: 0,
    color: colors.black,
    fontSize: fontPercentage(11),
    fontFamily: fonts.kopubWorldDotumProLight,
  },
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  selectedImage: {
    borderWidth: 3,
    borderColor: 'yellow',
  },
  selectedCount: {
    position: 'absolute',
    right: 5,
    top: 5,
    color: colors.black,
    fontWeight: '700',
    zIndex: 1,
    borderRadius: 10,
    borderWidth: 1,
    textAlign: 'center',
    backgroundColor: 'yellow',
    borderColor: 'yellow',
    width: 20,
    height: 20,
  },
  thumbnail: {
    position: 'absolute',
    left: 8,
    top: 5,
    color: colors.red,
    fontWeight: '700',
    zIndex: 1,
  },

  textIcon: {
    // width: 24,
    // height: 24,
    bottom: -3,
    color: colors.white,
  },
  completeTextIcon: {
    // width: 24,
    // height: 24,
    fontSize: fontPercentage(12),
    textAlign: 'right',
    bottom: -3,
    color: colors.blue,
  },
  disabledTextIcon: {
    // width: 24,
    // height: 24,
    fontSize: fontPercentage(12),
    textAlign: 'right',
    bottom: -3,
    color: colors.border,
  },
  userInfoContainer: {
    flexDirection: 'row',
    paddingBottom: 16,
    height: heightPercentage(100),
    marginTop: heightPercentage(12),
  },
  avator: {
    marginTop: 3,
  },
  contentCount: {
    // position: 'absolute',
    // top: 5,
    // right: -widthPercentage(18),
    // fontSize: fontPercentage(11),
  },
  hashTagContianer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: heightPercentage(42),
  },
  hashTagTitle: {
    alignSelf: 'flex-start',
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(19),
    color: '#333333',
  },
  tagText: {
    height: fontPercentage(22),
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
  hashTagInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#333333',
    marginTop: 10,
    flexDirection: 'row',
  },
  customElement: {
    color: colors.red,
    paddingLeft: widthPercentage(5),
    fontSize: fontPercentage(10),
  },
  customElement2: {
    color: colors.blue,
    fontSize: fontPercentage(10),
    alignSelf: 'flex-start',
  },
});
