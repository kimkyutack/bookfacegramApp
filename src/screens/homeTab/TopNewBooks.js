import React, {useState, useEffect} from 'react';
import {
  FlatList,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import SnapCarousel from '../../components/snap-carousel/SnapCarousel';
import BookItem from './Bookitem';
import {requestGet, requestPut} from '../../services/network';
import {screenHeight, screenWidth} from '../../services/util';
import consts from '../../libs/consts';

export default function TopNewBooks({}) {
  const data = [{title: 'abc'}, {title: 'bbc'}, {title: 'ccd'}];
  const list = [{title: 'abc'}, {title: 'bbc'}, {title: 'ccd'}];
  const [bookList, setBookList] = useState([]);
  useEffect(() => {
    fetchRequested();
  }, []);

  const fetchRequested = async () => {
    try {
      const books = await requestGet({
        url: consts.apiUrl + '/books/new',
      });
      setBookList([...books]);
    } catch (error) {
      console.log(error);
      // dispatch(dialogError(error));
    }
  };

  return (
    <View style={styles.root}>
      <SnapCarousel data={data} />
      <BookItem />
      <View style={styles.modalList}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
              // handleClose();
              // dispatch(userUpdateProfileImage(userId, true));
            }}>
            <TextWrap style={[styles.modalItemText]}>
              Select as default image
            </TextWrap>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
              // handleClose();
              // dispatch(userUpdateProfileImage(userId));
            }}>
            <TextWrap style={[styles.modalItemText]}>
              Select from album
            </TextWrap>
          </TouchableOpacity>
        </ScrollView>
      </View>
      {/* <FlatList
        data={list}
        extraData={list}
        initialNumToRender={15}
        onEndReachedThreshold={0.1}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        keyExtractor={(item, index) =>
          '' + item.userId + item.likes + item.profilePath + item.status + index
        }
        renderItem={({item, index}) => {
          return (
            <BookItem
              // onLongPress={handleLongPress(item)}
              {...item}
              index={index}
              onPress={() => {
                // navigate(routes.profile, {userId: item.userId});
              }}
              viewRef={ref => {
                if (ref) {
                  ref.measureInWindow((x, y, width, height) => {
                    list[index].scrollY = y;
                    list[index].height = height;
                  });
                }
              }}
            />
          );
        }}
      /> */}
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  modalList: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    maxHeight: screenHeight / 2,
    borderRadius: 10,
    width: screenWidth / 1.5,
  },
  modalItem: {
    alignSelf: 'stretch',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  modalItemText: {
    color: '#222',
    fontSize: 14,
    lineHeight: 20,
  },
});
