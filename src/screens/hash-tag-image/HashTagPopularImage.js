import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {PinchGestureHandler} from 'react-native-gesture-handler';
import colors from '../../libs/colors';
import images from '../../libs/images';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import routes from '../../libs/routes';
import {
  widthPercentage,
  heightPercentage,
  screenWidth,
  fontPercentage,
} from '../../services/util';
import TextWrap from '../../components/text-wrap/TextWrap';
import {getPopularHashTag} from '../../redux/tag/TagAction';

export default function HashTagPopularImage({route, navigation}) {
  const {isPopularLoading, popularPage, popularHashTags, popularErrorMessage} =
    useSelector(s => s.tag);

  const dispatch = useDispatch();
  const listRef = useRef();
  const pinchHandlerRef = useRef();
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 150;
  const limit = 24;
  const [time, setTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [numColumns, setNumColumns] = useState(3); // pinch zoom columns number

  const fetchPopularTags = (type, newTime) => {
    if (type === 'reset') {
      dispatch(
        getPopularHashTag(route.params?.hashTag, 'popular', 1, limit, newTime),
      );
    } else {
      dispatch(
        getPopularHashTag(
          route.params?.hashTag,
          'popular',
          popularPage + 1,
          limit,
          time,
        ),
      );
    }
  };

  useEffect(() => {
    let mount = true;
    if (mount) {
      listRef.current?.scrollToOffset({y: 0.1, animated: false});
      const newTime = moment().add(20, 'second').format('YYYY-MM-DD HH:mm:ss');
      setTime(newTime);
      fetchPopularTags('reset', newTime);
    }
    return () => {
      mount = false;
    };
  }, [route.params?.hashTag, route.params?.key]);

  const handleGesture = e => {
    const oldScale = e.nativeEvent.scale;
    if (oldScale >= 1) {
      if (numColumns === 2) {
        return;
      }
      setNumColumns(numColumns - 1);
    } else {
      if (numColumns >= 4) {
        return;
      }
      setNumColumns(numColumns + 1);
    }
  };

  const onPress = (item, index) => {
    navigation.navigate(routes.hashTagImage, {
      screen: routes.hashTagFeed,
      params: {
        memberId: item.memberId,
        memberIdx: item.memberIdx,
        feedIdx: item.feedIdx,
        key: Date.now(),
        page: popularPage,
        index: index,
        infoType: 'popular',
        hashTag: route.params?.hashTag,
      },
    });
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => onPress(item, index)}
        style={{
          width: (screenWidth - 3 * (numColumns - 1)) / numColumns,
          height: (screenWidth - 3 * (numColumns - 1)) / numColumns,
          backgroundColor: '#000',
          marginRight: (index + 1) % numColumns === 0 ? 0 : 3,
          marginTop: 3,
        }}>
        <FastImage
          source={{
            uri: item.feedImgName?.length
              ? consts.imgUrl + '/feedBook/' + item.feedImgName[0]
              : 'https://toaping.me/bookfacegram/images/menu_left/icon/toaping.png',
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.image}
        />
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!isPopularLoading) {
      return <></>;
    } else {
      return (
        <ActivityIndicator
          size="large"
          style={{
            alignSelf: 'center',
            top: -70,
          }}
          color={colors.blue}
        />
      );
    }
  };

  const onEndReached = e => {
    if (!isPopularLoading && popularHashTags.length >= limit * popularPage) {
      fetchPopularTags();
    }
  };

  const memoizedRenderItem = useMemo(() => renderItem, [handleGesture]);
  const keyExtractor = useCallback((item, index) => {
    return item?.feedIdx.toString() + index.toString();
  }, []);

  return popularHashTags?.length === 0 ? (
    <View style={styles.root}>
      <TextWrap>
        {popularErrorMessage ? popularErrorMessage : '검색 결과가 없습니다.'}
      </TextWrap>
    </View>
  ) : (
    <View>
    <PinchGestureHandler ref={pinchHandlerRef} onGestureEvent={handleGesture}>
      <FlatList
        key={String(numColumns)}
        numColumns={numColumns}
        initialNumToRender={limit}
        ref={listRef}
        data={popularHashTags}
        extraData={popularHashTags}
        removeClippedSubviews={true}
        disableVirtualization={false}
        showsVerticalScrollIndicator={true}
        keyExtractor={keyExtractor} // arrow 함수 자제
        renderItem={memoizedRenderItem} // arrow 함수 자제
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        ListFooterComponent={renderFooter}
      />
    </PinchGestureHandler>
    {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
        <TouchableOpacity
          onPress={() => {
            listRef.current.scrollToOffset({ animated: true, offset: 0 });
          }}
          style={styles.topButton}>
          <Image source={images.scrollTop} style={styles.scrolltotop} />
        </TouchableOpacity>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  info: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    marginTop: 10,
  },

  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  status: {
    position: 'absolute',
    bottom: 0,
    left: widthPercentage(60),
    width: widthPercentage(42),
    height: heightPercentage(16),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006fff',
  },
  statusOutline: {
    position: 'absolute',
    bottom: 0,
    left: widthPercentage(60),
    width: widthPercentage(42),
    height: heightPercentage(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTitle: {
    color: colors.white,

    fontSize: fontPercentage(10),
    lineHeight: fontPercentage(19),
  },
  scrolltotop: {
    width: widthPercentage(35),
    height: heightPercentage(35),
    resizeMode: 'contain',
  },
  topButton: {
    alignItems: 'center',
    width: widthPercentage(35),
    height: heightPercentage(35),
    position: 'absolute',
    bottom: 0,
    left: screenWidth / 2.2,
    display: 'flex',
  },
});
