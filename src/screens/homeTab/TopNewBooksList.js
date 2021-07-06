import React, {useState, useEffect} from 'react';
import {
  FlatList,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  View,
  SafeAreaView,
} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import consts from '../../libs/consts';
import colors from '../../libs/colors';
import {requestGet, requestPost} from '../../services/network';
import BookListItem from './BookListItem';
import {screenHeight, screenWidth} from '../../services/util';

export default function TopNewBooksList({newBookList}) {
  return (
    <View style={styles.root}>
      {!newBookList.length ? (
        <TextWrap>newBookList가 없습니다.</TextWrap>
      ) : (
        <View>
          <View>
            <FlatList
              data={newBookList}
              extraData={newBookList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => {
                return <BookListItem {...item} index={index} />;
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
  },
});
