import React, {useEffect, useRef, useState} from 'react';
import CameraRoll from '@react-native-community/cameraroll';
import {useRoute} from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import Radio from '../../components/radio/Radio';
import TextWrap from '../../components/text-wrap/TextWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import routes from '../../libs/routes';
import {dialogError, dialogOpenMessage} from '../../redux/dialog/DialogActions';
import {goBack, navigate} from '../../services/navigation';
import {screenWidth, isIos} from '../../services/util';

export default function CameraRollPicker({navigation}) {
  const {params} = useRoute();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const listRef = useRef();
  const [assetType, setAssetType] = useState(''); //Videos
  const [limit, setLimit] = useState(18);
  const [page, setPage] = useState(1);
  const [canNext, setCanNtext] = useState(false);
  const [selectedArr, setSelectedArr] = useState([]);
  const [convertFileArr, setConvertFileArr] = useState([]);

  useEffect(() => {
    setAssetType('Photos');
  }, []);

  useEffect(() => {
    setSelectedArr([]);
    setConvertFileArr([]);
    setAssetType('');
    setPage(1);
    setLimit(18);
  }, [params.key]);

  useEffect(() => {
    setLoading(true);
    CameraRoll.getPhotos({
      assetType: assetType,
      first: limit * page,
      mimeTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/m4v',
        'video/mov',
      ],
      include: ['fileSize', 'filename', 'imageSize', 'location'],
    })
      .then(async d => {
        setLoading(false);
        if (d.page_info.has_next_page) {
          setCanNtext(true);
        } else {
          setCanNtext(false);
        }
        if (page === 1) {
          setImages([...d.edges]);
        } else {
          setImages(images2 => [
            ...images2,
            ...d.edges.filter((x, i) => i >= images2.length),
          ]);
        }
      })
      .catch(e => {
        goBack();
        setLoading(false);
        dispatch(dialogError(e));
      });
  }, [assetType, page, limit, params.key]);

  return (
    <RootLayout
      topbar={{
        title: 'Gallery',
        back: true,
        navigation: navigation,
        options: {
          name: 'complete',
          component: (
            <TextWrap
              font={fonts.kopubWorldDotumProBold}
              style={
                selectedArr.length > 0
                  ? styles.completeTextIcon
                  : styles.textIcon
              }>
              완료
            </TextWrap>
          ),
          onPress: () =>
            params.type === 'edit'
              ? navigation.navigate(routes.feedBookEditor, {
                  image: convertFileArr,
                  isNewFeed: true,
                  key: Date.now(),
                  name: 'gallery',
                })
              : params.type === 'upload'
              ? navigation.navigate(routes.photoEditor, {
                  image: convertFileArr,
                  isNewFeed: true,
                  key: Date.now(),
                  name: 'gallery',
                })
              : navigation.navigate(routes.profile, {
                  image: convertFileArr,
                }),
        },
      }}>
      <FlatList
        ref={listRef}
        numColumns={3}
        extraData={images}
        data={images}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="small"
              style={{alignSelf: 'center', marginTop: 16}}
              color={colors.blue}
            />
          ) : (
            <View style={{paddingBottom: 16}}>
              {canNext ? (
                <TouchableOpacity
                  onPress={() => {
                    setPage(p => p + 1);
                  }}
                  style={{alignSelf: 'center', paddingVertical: 10}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProBold}
                    style={{
                      color: 'black',
                    }}>
                    More Photos
                  </TextWrap>
                </TouchableOpacity>
              ) : (
                <TextWrap
                  font={fonts.kopubWorldDotumProBold}
                  style={{
                    color: 'black',
                    alignSelf: 'center',
                  }}>
                  No Photos
                </TextWrap>
              )}
            </View>
          )
        }
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        renderItem={({item, index}) => {
          let ext = item.node.image.filename.split('.').pop().toLowerCase();
          if (ext === 'jpg') {
            ext = 'jpeg';
          }
          const file = {
            uri: item.node.image.uri,
            type: `image/${ext}`,
            name: `${item.node.image.filename.split('.')[0]}_${Date.now()}.${
              item.node.image.filename.split('.')[1]
            }`,
          };
          return (
            <TouchableOpacity
              onPress={() => {
                const idx = selectedArr.indexOf(index);
                if (idx !== -1) {
                  const tmpArr = selectedArr;
                  const convertArr = selectedArr.filter(function (item2) {
                    return item2 !== index;
                  });
                  setSelectedArr(convertArr);
                  convertFileArr.splice(tmpArr.indexOf(index), 1);
                  setConvertFileArr(convertFileArr);
                } else {
                  if (selectedArr.length > 9) {
                    dispatch(
                      dialogOpenMessage({
                        message: '최대 10개까지 선택가능합니다.',
                      }),
                    );
                  } else {
                    setSelectedArr([...selectedArr, index]);
                    setConvertFileArr([...convertFileArr, file]);
                  }
                }
              }}
              style={{
                width: (screenWidth - 10) / 3,
                height: (screenWidth - 10) / 3,
                backgroundColor: '#000',
                marginRight: (index + 1) % 3 === 0 ? 0 : 5,
                marginTop: 5,
              }}>
              <View
                style={
                  selectedArr.indexOf(index) !== -1 && styles.selectedImage
                }>
                {selectedArr.indexOf(index) !== -1 ? (
                  selectedArr.indexOf(index) * 1 + 1 === 1 ? (
                    <>
                      <TextWrap style={styles.thumbnail}>대표 이미지</TextWrap>
                      <TextWrap style={styles.selectedCount}>
                        {selectedArr.indexOf(index) * 1 + 1}
                      </TextWrap>
                    </>
                  ) : (
                    <TextWrap style={styles.selectedCount}>
                      {selectedArr.indexOf(index) * 1 + 1}
                    </TextWrap>
                  )
                ) : (
                  <TextWrap style={styles.notSelectedCount} />
                )}
                <Image
                  source={{uri: item.node.image.uri}}
                  style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </RootLayout>
  );
}

const styles = StyleSheet.create({
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
  notSelectedCount: {
    position: 'absolute',
    right: 5,
    top: 5,
    color: colors.black,
    fontWeight: '700',
    zIndex: 1,
    borderRadius: 10,
    borderWidth: 1,
    textAlign: 'center',
    backgroundColor: 'transparent',
    borderColor: 'yellow',
    width: 20,
    height: 20,
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
});
