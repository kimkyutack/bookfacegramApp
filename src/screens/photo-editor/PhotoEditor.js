import {useRoute} from '@react-navigation/native';
import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import CameraRoll from '@react-native-community/cameraroll';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import TagInput from 'react-native-tags-input';
import Avatar from '../../components/avatar/Avatar';
import TextWrap from '../../components/text-wrap/TextWrap';
import Topbar from '../../components/topbar/Topbar';
import InputWrap from '../../components/input-wrap/InputWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import {
  fontPercentage,
  heightPercentage,
  isIos,
  screenWidth,
  widthPercentage,
} from '../../services/util';
import {goBack, navigate} from '../../services/navigation';
import {requestFile, requestPost} from '../../services/network';
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
} from '../../redux/dialog/DialogActions';
import {
  getImageFromCamera,
  checkMultiplePermissions,
} from '../../services/picker';

export default function PhotoEditor({route, navigation}) {
  const user = useSelector(s => s.user, shallowEqual);
  const [contents, setContents] = useState('');
  const [tags, setTags] = useState({tag: '', tagsArray: []});
  const {params} = useRoute();
  const dispatch = useDispatch();
  const listRef = useRef();
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);

  useEffect(() => {
    setContents('');
    setTags({tag: '', tagsArray: []});
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
        }
      } else {
        try {
          // android file write on phone
          if (params?.image?.length > 1) {
            // 여러장
            const formData = new FormData();
            const file = [];
            for (let i = 0; i < params.image.length; i++) {
              file.push({
                uri: params.image[i].uri,
                type: params.image[i].type,
                name: params.image[i].name,
              });
              formData.append('file', file[i]);
            }
            formData.append('contents', contents);
            formData.append('hashTags', tags.tagsArray?.toString());

            const {data, status} = await requestFile(
              {
                url: consts.apiUrl + '/mypage/feedBook/my/upload',
                method: 'post',
              },
              formData,
            );
            if (status === 'SUCCESS') {
              setSaveButtonDisabled(false);

              navigate(params.route, {
                [params.dataKey]: params.image,
                key: params.key,
                isNew: true,
                member_id: user.member_id,
                member_idx: user.member_idx,
                // feedIdx: item.feedIdx,
              });
            }
          } else {
            // 한장

            var formData = new FormData();
            var file = [];
            file.push({
              uri: params.image[0].uri,
              type: params.image[0].type,
              name: params.image[0].name,
            });

            formData.append('file', file[0]);
            formData.append('contents', contents);
            formData.append('hashTags', tags.tagsArray?.toString());

            const {data, status} = await requestFile(
              {
                url: consts.apiUrl + '/mypage/feedBook/my/upload',
                method: 'post',
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
              navigate(params.route, {
                [params.dataKey]: params.image,
                key: params.key,
                isNew: true,
                member_id: user.member_id,
                member_idx: user.member_idx,
                // feedIdx: item.feedIdx,
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
    if (tags.tagsArray.length > 9) {
      dispatch(
        dialogOpenMessage({message: '해시태그는 10개까지 등록할 수 있습니다.'}),
      );
    } else {
      setTags(e);
      listRef.current?.scrollToEnd({animated: true});
    }
  };
  return (
    <RootLayout
      style={{paddingHorizontal: 16}}
      topbar={{
        title:
          user.member_id?.split('@')[0]?.length > 12
            ? user.member_id?.split('@')[0]?.substring(0, 12) + '...'
            : user.member_id?.split('@')[0],
        back: true,
        navigation: navigation,
        options: {
          name: 'complete',
          component: (
            <TextWrap
              font={fonts.kopubWorldDotumProBold}
              style={
                saveButtonDisabled
                  ? styles.disabledTextIcon
                  : styles.completeTextIcon
              }>
              등록
            </TextWrap>
          ),
          onPress: () => (saveButtonDisabled ? null : save()),
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
          extraData={params.image}
          data={params.image}
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
                        : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
                    }
                  />
                </View>
                <View style={styles.avatorTextContainer}>
                  <InputWrap
                    style={styles.input}
                    selectionColor="#acacac"
                    inputFlex={{borderColor: colors.white}}
                    inputStyle={styles.textInput}
                    maxLength={200}
                    value={contents}
                    onChange={setContents}
                    placeholder="내용 입력..."
                    placeholderTextColor="#acacac"
                    placeholderSize={fontPercentage(11)}
                    multiline
                    optionComponent={
                      <TextWrap style={styles.contentCount}>
                        ({contents.length} / 200)
                      </TextWrap>
                    }
                  />
                </View>
              </View>
              <View style={styles.hashTagContianer}>
                <TextWrap
                  style={styles.hashTagTitle}
                  font={fonts.kopubWorldDotumProBold}>
                  #나만의 해시태그 입력
                </TextWrap>

                <TagInput
                  updateState={setTagHandle}
                  tags={tags}
                  placeholder="#책제목"
                  containerStyle={{
                    width: screenWidth,
                    paddingHorizontal: 10,
                  }}
                  inputContainerStyle={styles.hashTagInput}
                  inputStyle={{
                    fontSize: fontPercentage(12),
                    lineHeight: fontPercentage(19),
                    marginLeft: 3,
                    color: '#858585',
                    fontFamily: fonts.kopubWorldDotumProBold,
                  }}
                  autoCorrect={false}
                  tagStyle={styles.tag}
                  tagTextStyle={styles.tagText}
                  tagsViewStyle={{paddingHorizontal: 5}}
                  keysForTagsArray={[' ', '#', ',']}
                  customElement={
                    <TextWrap
                      font={fonts.kopubWorldDotumProLight}
                      style={styles.customElement}>
                      *스페이스바, 엔터, 콤마를 눌러 해시태그를 등록해주세요.
                    </TextWrap>
                  }
                />
              </View>
            </>
          }
          renderItem={({item, index}) => {
            let ext = item.name.split('.').pop().toLowerCase();
            if (ext === 'jpg') {
              ext = 'jpeg';
            }
            const file = {
              uri: item.uri,
              type: `image/${ext}`,
              name: item.name,
            };
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
                    source={{uri: item.uri}}
                    style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                  />
                </View>
              </View>
            );
          }}
        />
      )}
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  input: {
    width: widthPercentage(291),
    maxHeight: heightPercentage(180),
    marginLeft: 6,
    fontSize: fontPercentage(11),
    color: '#333333',
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
    textAlign: 'right',
    bottom: -3,
    color: colors.blue,
  },
  disabledTextIcon: {
    // width: 24,
    // height: 24,
    textAlign: 'right',
    bottom: -3,
    color: colors.border,
  },
  userInfoContainer: {
    flexDirection: 'row',
    paddingBottom: 16,
    marginTop: heightPercentage(12),
  },
  avatorTextContainer: {},
  textInput: {
    padding: 0,
    color: colors.black,
    fontSize: fontPercentage(11),
    fontFamily: fonts.kopubWorldDotumProLight,
  },
  avator: {
    marginTop: 3,
  },
  contentCount: {
    position: 'absolute',
    top: 5,
    right: -widthPercentage(18),
    fontSize: fontPercentage(11),
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
  hashTagInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#333333',
    height: 35,
    marginTop: 10,
    flexDirection: 'row',
  },
  customElement: {
    color: colors.red,
    paddingLeft: widthPercentage(6),
    fontSize: fontPercentage(10),
  },
});
