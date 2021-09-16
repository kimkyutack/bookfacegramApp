import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
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
import {getFeedUser} from '../../redux/book/BookActions';
import FastImage from 'react-native-fast-image';

export default function FeedBookUserImage({route, navigation}) {
  const {isLoading, userBooks, userPage} = useSelector(s => s.book);
  const dispatch = useDispatch();
  const listRef = useRef();
  const pinchHandlerRef = useRef();

  const limit = 24;
  const [time, setTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [numColumns, setNumColumns] = useState(3); // pinch zoom columns number

  const fetchUserData = (type, newTime) => {
    if (type === 'reset') {
      dispatch(
        getFeedUser(
          route.params?.memberId,
          route.params?.memberIdx,
          1,
          limit,
          newTime,
        ),
      );
    } else {
      dispatch(
        getFeedUser(
          route.params?.memberId,
          route.params?.memberIdx,
          userPage + 1,
          limit,
          time,
        ),
      );
    }
  };

  useEffect(() => {
    let mount = true;
    if (mount) {
      listRef.current?.scrollToOffset({y: 0, animated: false});
      const newTime = moment().format('YYYY-MM-DD HH:mm:ss');
      setTime(newTime);
      fetchUserData('reset', newTime);
    }
    return () => {
      mount = false;
    };
  }, [route.params?.memberIdx, route.params?.key]);

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

  const onEndReached = e => {
    if (!isLoading && userBooks.length >= limit * userPage) {
      fetchUserData();
    }
  };

  const onPress = (item, index) => {
    navigation.navigate(routes.feedBookImage, {
      screen: routes.feedBookFeed,
      params: {
        memberId: item.memberId,
        memberIdx: item.memberIdx,
        feedIdx: item.feedIdx,
        isNewFeed: false,
        key: Date.now(),
        page: userPage,
        index: index,
        infoType: 'user',
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
              : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp',
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.image}
        />
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!isLoading) {
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

  const memoizedRenderItem = useMemo(() => renderItem, [handleGesture]);
  const keyExtractor = useCallback((item, index) => {
    return item?.feedIdx.toString() + index.toString();
  }, []);

  return (
    <PinchGestureHandler ref={pinchHandlerRef} onGestureEvent={handleGesture}>
      <FlatList
        key={String(numColumns)}
        numColumns={numColumns}
        initialNumToRender={limit}
        ref={listRef}
        data={userBooks}
        extraData={userBooks}
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
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
});
