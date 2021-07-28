import React, {createRef, useCallback, useState} from 'react';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';
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
import {
  openSettings,
  PERMISSIONS,
  check,
  request,
} from 'react-native-permissions';
import {
  dialogOpenSelect,
  dialogOpenAction,
  dialogError,
} from '../../redux/dialog/DialogActions';
import {
  getImageFromCamera,
  checkMultiplePermissions,
} from '../../services/picker';
import TextWrap from '../../components/text-wrap/TextWrap';
import Topbar from '../../components/topbar/Topbar';
import SearchBar from '../../components/search-bar/SearchBar';
import TopTabs from './TopTabs';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import colors from '../../libs/colors';
import routes from '../../libs/routes';
import consts from '../../libs/consts';
import {isIos} from '../../services/util';

export default function TabsHome({route, navigation}) {
  const [keyword, setKeyword] = useState('');
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <Topbar
        title="TOAPING"
        navigation={navigation}
        options={{
          component: <Image style={styles.backIcon} source={images.camera} />,
          name: 'camera',
          onPress: () =>
            dispatch(
              dialogOpenSelect({
                item: [
                  {
                    name: '카메라',
                    source: images.like,
                    onPress: () =>
                      getImageFromCamera()
                        .then(async file => {
                          console.log('file');
                          console.log(file);
                          if (!file) {
                            return;
                          }
                          if (!isIos) {
                            let ps = await check(
                              PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
                            );
                            if (ps !== 'granted') {
                              ps = await request(
                                PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
                              );
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
                              // android file write on phone
                              const result = await CameraRoll.save(file.uri, {
                                type: 'photo',
                                album: 'toaping',
                              });
                              console.log('🐤result', result);
                            }
                          } else {
                            // ios ~
                          }

                          // const savedPath =
                          //   (isIos
                          //     ? RNFetchBlob.fs.dirs.DocumentDir
                          //     : RNFetchBlob.fs.dirs.PictureDir) +
                          //   '/toaping/' +
                          //   file.name;

                          // console.log('savedPath');
                          // console.log((isIos ? '' : 'file://') + savedPath);
                          // await CameraRoll.save(
                          //   (isIos ? '' : 'file://') + savedPath,
                          //   {
                          //     type: 'photo',
                          //     album: 'toaping',
                          //   },
                          // );
                        })
                        .catch(error => {
                          if (
                            error === 'getImageFromCamera' ||
                            error === 'checkMultiplePermissions'
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
                    source: images.talk,
                    onPress: async () =>
                      await checkMultiplePermissions([
                        PERMISSIONS.ANDROID.CAMERA,
                        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
                        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                      ])
                        .then(result => {
                          if (result) {
                            navigation.navigate(routes.cameraRollPicker, {
                              route: routes.message,
                              dataKey: 'image',
                              key: Date.now(),
                            });
                          }
                        })
                        .catch(error => {
                          if (
                            error === 'getImageFromCamera' ||
                            error === 'checkMultiplePermissions'
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
          <Image style={styles.backIcon} source={images.search} />
        }
        onSearch={() => {
          // fetch();
        }}
      />
      <TopTabs route={route} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginHorizontal: 16,
    // marginTop: 6,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  input: {
    marginHorizontal: 18,
    backgroundColor: '#ececec',
  },
});
