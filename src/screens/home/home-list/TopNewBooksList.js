import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../../components/text-wrap/TextWrap';
import consts from '../../../libs/consts';
import colors from '../../../libs/colors';
import images from '../../../libs/images';
import routes from '../../../libs/routes';
import BookListItem from './BookListItem';
import {
  screenWidth,
  widthPercentage,
  heightPercentage,
} from '../../../services/util';

export default function TopNewBooksList({route, newBook, kbsBook}) {
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const listTab = useSelector(s => s.tab, shallowEqual);
  const [rednerData, setRenderData] = useState([]);

  useEffect(() => {
    scrollRef.current?.scrollToOffset({y: 0, animated: false});
    if (listTab.listTab.grade === null) {
      setRenderData(newBook);
    } else if (listTab.listTab.grade === '1급') {
      setRenderData(
        kbsBook?.filter(
          x => x.recomm_grade === '1급' || x.recomm_grade === '준1급',
        ),
      );
    } else if (listTab.listTab.grade === '2급') {
      setRenderData(
        kbsBook?.filter(
          x => x.recomm_grade === '2급' || x.recomm_grade === '준2급',
        ),
      );
    } else if (listTab.listTab.grade === '(준)3급') {
      setRenderData(
        kbsBook?.filter(
          x => x.recomm_grade === '3급' || x.recomm_grade === '준3급',
        ),
      );
    } else if (listTab.listTab.grade === '(준)4급') {
      setRenderData(
        kbsBook?.filter(
          x => x.recomm_grade === '4급' || x.recomm_grade === '준4급',
        ),
      );
    } else if (listTab.listTab.grade === '(준)5급') {
      setRenderData(
        kbsBook?.filter(
          x => x.recomm_grade === '5급' || x.recomm_grade === '준5급',
        ),
      );
    } else if (listTab.listTab.grade === '누리급') {
      setRenderData(kbsBook?.filter(x => x.recomm_grade === '누리급'));
    }
  }, [listTab.listTab.grade]);

  return (
    <View
      style={[
        styles.root,
        rednerData.length === 0 && {flex: 1, justifyContent: 'center'},
      ]}>
      {rednerData.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TextWrap>BookList가 없습니다.</TextWrap>
        </View>
      ) : (
        <FlatList
          ref={scrollRef}
          data={rednerData}
          extraData={rednerData}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            return (
              <BookListItem
                item={item}
                index={index}
                grade={listTab.listTab.grade}
                th={listTab.listTab.th}
                gradeStyle={listTab.listTab.gradeStyle}
              />
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
});
