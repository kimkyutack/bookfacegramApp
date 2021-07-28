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
import {dialogError, dialogOpenAction} from '../../redux/dialog/DialogActions';
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

  // const handleMomentScrollEnd = e => {
  //   const {contentOffset, contentSize, layoutMeasurement} = e.nativeEvent;

  //   let invertY =
  //     contentSize.height - contentOffset.y - layoutMeasurement.height;

  //   if (invertY <= 0) {
  //     if (images.length < totalCount && !loading) {
  //       setLoading(true);
  //       let tm = setTimeout(() => {
  //         clearTimeout(tm);
  //         setPage(p => p + 1);
  //       }, 1000);
  //     }
  //   }
  // };

  useEffect(() => {
    setAssetType('Photos');
  }, []);

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
          setImages(images => [
            ...images,
            ...d.edges.filter((x, i) => i >= images.length),
          ]);
        }
      })
      .catch(e => {
        goBack();
        setLoading(false);
        dispatch(dialogError(e));
      });
  }, [assetType, page, limit]);

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
              style={
                selectedArr.length > 0
                  ? styles.completeTextIcon
                  : styles.textIcon
              }>
              완료
            </TextWrap>
          ),
          onPress:
            selectedArr.length > 0 ? () => console.log('complete1') : null,
        },
      }}>
      {/* <View style={styles.root}>
        <Radio
          onChange={e => {
            setAssetType('Photos');
            listRef.current?.scrollToOffset({y: 0});
            setPage(1);
            setImages([]);
          }}
          disabled
          value={assetType === 'Photos'}
          label="Photos"
        />
        <Radio
          style={{marginLeft: 16}}
          onChange={e => {
            setAssetType('Videos');
            setImages([]);
            listRef.current?.scrollToOffset({y: 0});
            setPage(1);
          }}
          value={assetType === 'Videos'}
          label="Videos"
          disabled
        />
      </View> */}
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
              color={colors.primary}
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
                    font={fonts.barlowBold}
                    style={{
                      color: 'black',
                    }}>
                    More Photos
                  </TextWrap>
                </TouchableOpacity>
              ) : (
                <TextWrap
                  font={fonts.barlowBold}
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
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                if (params && params.route) {
                  let ext = item.node.image.filename
                    .split('.')
                    .pop()
                    .toLowerCase();
                  if (ext === 'jpg') {
                    ext = 'jpeg';
                  }
                  navigate(params.route, {
                    [params.dataKey]: {
                      name: item.node.image.filename,
                      uri: item.node.image.uri,
                      size: item.node.image.fileSize,
                      width: item.node.image.width,
                      height: item.node.image.height,
                      type: `${
                        assetType === 'Photos' ? 'image' : 'video'
                      }/${ext}`,
                    },
                    key: params.key,
                    isImage: assetType === 'Photos',
                  });
                } else {
                  const idx = selectedArr.indexOf(index);
                  if (idx !== -1) {
                    setSelectedArr(
                      selectedArr.filter(function (item2) {
                        return item2 !== index;
                      }),
                    );
                  } else {
                    setSelectedArr([...selectedArr, index]);
                  }

                  let ext = item.node.image.filename
                    .split('.')
                    .pop()
                    .toLowerCase();
                  if (ext === 'jpg') {
                    ext = 'jpeg';
                  }
                  // console.log({
                  //   name: item.node.image.filename,
                  //   uri: item.node.image.uri,
                  //   size: item.node.image.fileSize,
                  //   width: item.node.image.width,
                  //   height: item.node.image.height,
                  //   type: `${
                  //     assetType === 'Photos' ? 'image' : 'video'
                  //   }/${ext}`,
                  //   key: params.key,
                  //   isImage: assetType === 'Photos',
                  // });
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
                  <TextWrap style={styles.selectedCount}>
                    {selectedArr.indexOf(index) * 1 + 1}
                  </TextWrap>
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
    color: colors.white,
    fontWeight: '700',
  },
  completeTextIcon: {
    // width: 24,
    // height: 24,
    fontWeight: '700',
    color: colors.blue,
  },
});
