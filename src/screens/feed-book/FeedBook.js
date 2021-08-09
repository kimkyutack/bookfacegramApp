import React, {useEffect, useState} from 'react';
import {FlatList, View, Image, StyleSheet} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {openSettings, PERMISSIONS} from 'react-native-permissions';
import RootLayout from '../../layouts/root-layout/RootLayout';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import {
  dialogError,
  dialogOpenAction,
  dialogOpenSelect,
} from '../../redux/dialog/DialogActions';
import {requestGet} from '../../services/network';
// import NoticeItem from './NoticeItem';
import routes from '../../libs/routes';
import images from '../../libs/images';
import {widthPercentage, heightPercentage} from '../../services/util';
import {
  getImageFromCamera,
  checkMultiplePermissions,
  getImageFromGallery,
} from '../../services/picker';
export default function FeedBook({route, navigation}) {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  return (
    <RootLayout
      topbar={{
        title: '피드북',
        navigation: navigation,
        back: true,
        options: {
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
        },
      }}>
      <View
        style={{
          borderBottomColor: colors.borderLine,
          borderBottomWidth: 1,
        }}
      />
      {/* <FlatList
        data={data}
        keyExtractor={(item, index) => item.title + index.toString()}
        renderItem={({item, index}) => {
          return <NoticeItem {...item} isFocused={isFocused} />;
        }}
      /> */}
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
});
