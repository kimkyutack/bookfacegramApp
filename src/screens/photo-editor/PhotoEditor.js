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
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import TextWrap from '../../components/text-wrap/TextWrap';
import Topbar from '../../components/topbar/Topbar';
import InputWrap from '../../components/input-wrap/InputWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import {isIos, screenWidth} from '../../services/util';
import {goBack, navigate} from '../../services/navigation';
import {requestFile, requestPost} from '../../services/network';
import {
  openSettings,
  PERMISSIONS,
  check,
  request,
} from 'react-native-permissions';
import {dialogOpenAction} from '../../redux/dialog/DialogActions';
import {
  getImageFromCamera,
  checkMultiplePermissions,
} from '../../services/picker';

export default function PhotoEditor({}) {
  const user = useSelector(s => s.user, shallowEqual);
  const [contents, setContents] = useState('');
  const {params} = useRoute();
  const dispatch = useDispatch();
  const isCarouselRef = useRef(null); //banner
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setContents('');
  }, [params.key]);

  const save = async () => {
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
        // android file write on phone
        if (params.image.length) {
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
          formData.append('member_idx', user.member_idx);
          formData.append('contents', contents);

          const serverResponse = await requestFile(
            {
              url: consts.apiUrl + '/feedbookInsert',
              method: 'post',
            },
            formData,
          );
        } else {
          // 한장
          const saveResult = await CameraRoll.save(params.image.uri, {
            type: 'photo',
            album: 'toaping',
          });
          const formData = new FormData();
          const file = {
            uri: params.image.uri,
            type: params.image.type,
            name: params.image.name,
          };
          formData.append('file', file);
          formData.append('member_idx', user.member_idx);
          formData.append('contents', contents);
          const serverResponse = await requestFile(
            {
              url: consts.apiUrl + '/feedbookInsert',
              method: 'post',
            },
            formData,
          );
        }
        // saveResult, serverResponse throw 검사해야함
        navigate(params.route, {
          [params.dataKey]: params.image,
          key: params.key,
          isImage: true,
        });
      }
    } else {
      // ios ~
    }
  };

  const onSnapToItem = useCallback(index => {
    setActiveSlide(index);
  }, []);

  const memoRenderItem = useMemo(
    () =>
      ({item, index}) => {
        if (item) {
          return (
            <Image
              source={{uri: item.uri}}
              style={{width: '100%', height: '80%', resizeMode: 'contain'}}
            />
          );
        } else {
          return;
        }
      },
    [],
  );

  const memoRenderData = useMemo(() => params.image, [params.image]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: '#000'}}>
        <View
          style={{
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={goBack}
            style={{paddingHorizontal: 16, paddingVertical: 16}}>
            <Image
              source={images.back}
              style={{width: 24, height: 24, tintColor: '#fff'}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => save()}
            style={{
              paddingHorizontal: 16,
              alignSelf: 'stretch',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TextWrap
              font={fonts.kopubWorldDotumProMedium}
              style={{fontSize: 15, color: '#fff', lineHeight: 19}}>
              등록
            </TextWrap>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, marginVertical: 16}}>
          {params.image?.length > 0 ? (
            <>
              <Carousel
                ref={isCarouselRef}
                layout={'default'}
                data={memoRenderData}
                renderItem={memoRenderItem}
                sliderWidth={screenWidth}
                itemWidth={screenWidth}
                activeSlideAlignment={'start'}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                onSnapToItem={onSnapToItem}
                removeClippedSubviews={false}
              />
              <Pagination
                dotsLength={memoRenderData.length ? memoRenderData.length : 0}
                carouselRef={isCarouselRef}
                activeDotIndex={activeSlide}
                containerStyle={{
                  backgroundColor: 'transparent',
                  paddingVertical: 0,
                }}
                dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 1,
                  backgroundColor: '#919392',
                  position: 'relative',
                  top: -25,
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                tappableDots={true}
              />
            </>
          ) : (
            <Image
              source={{uri: params.image.uri}}
              style={{
                width: '100%',
                height: '80%',
                resizeMode: 'contain',
              }}
            />
          )}
        </View>
        <View style={{felx: 1}}>
          <InputWrap
            style={styles.input}
            value={contents}
            onChange={setContents}
            inputFlex={{flex: 1}}
            placeholder={'내용을 입력하세요'}
            multiline
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 24,
    height: 50,
    fontSize: 14,
    color: colors.white,
    backgroundColor: colors.white,
  },
});
