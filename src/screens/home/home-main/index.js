import React, {useEffect, useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';
import {openSettings, PERMISSIONS} from 'react-native-permissions';
import {
  dialogOpenSelect,
  dialogOpenAction,
  dialogError,
} from '../../../redux/dialog/DialogActions';
import {
  getImageFromCamera,
  checkMultiplePermissions,
  getImageFromGallery,
} from '../../../services/picker';
import TextWrap from '../../../components/text-wrap/TextWrap';
import Topbar from '../../../components/topbar/Topbar';
import SearchBar from '../../../components/search-bar/SearchBar';
import TopTabs from './TopTabs';
import fonts from '../../../libs/fonts';
import images from '../../../libs/images';
import colors from '../../../libs/colors';
import routes from '../../../libs/routes';
import consts from '../../../libs/consts';
import {isIos} from '../../../services/util';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../../services/util';

export default function HomeMain({route, navigation}) {
  const [keyword, setKeyword] = useState('');
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <Topbar
        title="TOAPING"
        navigation={navigation}
        options={{
          component: <Image style={styles.cameraIcon} source={images.camera} />,
          name: 'camera',
          onPress: () =>
            dispatch(
              dialogOpenSelect({
                item: [
                  {
                    name: '카메라',
                    source: images.cameraBtn,
                    onPress: () =>
                      getImageFromCamera()
                        .then(async file => {
                          if (!file) {
                            return;
                          }
                          navigation.navigate(routes.photoEditor, {
                            route: routes.home,
                            image: file,
                            dataKey: 'image',
                            key: Date.now(),
                          });
                        })
                        .catch(error => {
                          if (
                            error === 'getImageFromCamera' ||
                            error === 'checkMultiplePermissions' ||
                            error === 'getImageFromGallery'
                          ) {
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
                            dispatch(dialogError(error));
                          }
                        }),
                  },
                  {
                    name: '파일',
                    source: images.fileBtn,
                    onPress: async () =>
                      await getImageFromGallery()
                        .then(async file => {
                          if (!file) {
                            return;
                          }
                          navigation.navigate(routes.photoEditor, {
                            route: routes.home,
                            image: file,
                            dataKey: 'image',
                            key: Date.now(),
                          });
                        })
                        .catch(error => {
                          if (
                            error === 'getImageFromCamera' ||
                            error === 'checkMultiplePermissions' ||
                            error === 'getImageFromGallery'
                          ) {
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
                            dispatch(dialogError(error));
                          }
                        }),
                  },
                  {
                    name: '갤러리',
                    source: images.albumBtn,
                    onPress: async () =>
                      await checkMultiplePermissions([
                        PERMISSIONS.ANDROID.CAMERA,
                        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
                        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                      ])
                        .then(result => {
                          if (result) {
                            navigation.navigate(routes.cameraRollPicker, {
                              route: routes.home,
                              dataKey: 'image',
                              key: Date.now(),
                            });
                          }
                        })
                        .catch(error => {
                          if (
                            error === 'getImageFromCamera' ||
                            error === 'checkMultiplePermissions' ||
                            error === 'getImageFromGallery'
                          ) {
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
                            dispatch(dialogError(error));
                          }
                        }),
                  },
                ],
              }),
            ),
        }}
      />
      {<StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />}

      <SearchBar
        value={keyword}
        onChange={setKeyword}
        style={styles.input}
        placeholder=""
        optionComponent={
          <Image style={styles.cameraIcon} source={images.search} />
        }
        onSearch={() => {
          // fetch();
        }}
      />
      <TopTabs
        grade={route.params?.grade}
        type={route.params?.type ? route.params?.type : 'main'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginHorizontal: 16,
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  input: {
    marginHorizontal: 18,
    backgroundColor: '#ececec',
  },
});
