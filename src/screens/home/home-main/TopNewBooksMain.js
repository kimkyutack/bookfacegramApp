import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import colors from '../../../libs/colors';
import images from '../../../libs/images';
import {screenWidth, widthPercentage} from '../../../services/util';
import BookMainCarousel from './BookMainCarousel';

export default function TopNewBooksMain({route, kbsBook, newBook, th}) {
  const [arrayGrade, setArrayGrade] = useState([
    ...new Set(kbsBook.map(x => x.grade)),
  ]);
  const [loading, setLoading] = useState(true);
  const [newBookList, setNewBookList] = useState(null);
  const [bannerList, setBannerList] = useState(null);
  const [kbsBookList1, setKbsBookList1] = useState(null); //1급
  const [kbsBookList2, setKbsBookList2] = useState(null); //2급

  const listData = [
    {
      name: 'banner',
      renderData: bannerList,
      sliderWidth: screenWidth - 22,
      itemWidth: screenWidth - 22,
      pagination: true,
      header: false,
    },
    {
      name: 'new',
      renderData: newBookList,
      sliderWidth: screenWidth - 22,
      itemWidth: ((screenWidth - 22) / 3).toFixed(1) * 1,
      grade: null,
      header: true,
    },
    {
      name: 'kbs',
      grade: arrayGrade[0],
      gradeStyle: {color: colors.st1},
      renderData: kbsBookList1,
      sliderWidth: screenWidth - 22,
      itemWidth: ((screenWidth - 22) / 3).toFixed(1) * 1,
      header: true,
      th: th,
    },
    {
      name: 'kbs',
      grade: arrayGrade[1],
      gradeStyle: {color: colors.st2},
      renderData: kbsBookList2,
      sliderWidth: screenWidth - 22,
      itemWidth: ((screenWidth - 22) / 3).toFixed(1) * 1,
      header: true,
      th: th,
    },
  ];

  useEffect(() => {
    setNewBookList([...newBook]);
    setKbsBookList1([...kbsBook?.filter(x => x.grade === arrayGrade[0])]);
    setKbsBookList2([...kbsBook?.filter(x => x.grade === arrayGrade[1])]);
    setBannerList([
      {index: 0, id: 1, title: images.bannerOne},
      {index: 1, id: 2, title: images.bannerTwo},
    ]);
  }, []);

  useEffect(() => {
    if (th && newBookList && bannerList && kbsBookList1 && kbsBookList2) {
      setLoading(false);
    }
  }, [th, newBookList, bannerList, kbsBookList1, kbsBookList2]);

  return (
    <View style={[styles.root, loading && {flex: 1, justifyContent: 'center'}]}>
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{alignSelf: 'center', marginBottom: 60}}
          color={colors.blue}
        />
      ) : (
        <FlatList
          data={listData}
          extraData={listData}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            return <BookMainCarousel {...item} />;
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
