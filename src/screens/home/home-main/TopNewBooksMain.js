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
import {screenWidth, widthPercentage, chunk} from '../../../services/util';
import BookMainCarousel from './BookMainCarousel';

export default function TopNewBooksMain({route, kbsBook, newBook, banner, th}) {
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
      itemWidth: widthPercentage(332),
      slideWidth: widthPercentage(332),
      pagination: true,
      header: false,
    },
    {
      name: 'new',
      renderData: newBookList ? chunk(newBookList, 3) : newBookList,
      itemWidth: (widthPercentage(332) / 3).toFixed(1) * 1 - 10,
      slideWidth: widthPercentage(344),
      grade: null,
      pagination: false,
      header: true,
    },
    {
      name: 'kbs',
      grade: arrayGrade[0],
      gradeStyle: {color: colors.st1},
      renderData: kbsBookList1 ? chunk(kbsBookList1, 3) : kbsBookList1,
      itemWidth: (widthPercentage(332) / 3).toFixed(1) * 1 - 10,
      slideWidth: widthPercentage(344),
      pagination: false,
      header: true,
      th: th,
    },
    {
      name: 'kbs',
      grade: arrayGrade[1],
      gradeStyle: {color: colors.st2},
      renderData: kbsBookList2 ? chunk(kbsBookList2, 3) : kbsBookList2,
      itemWidth: (widthPercentage(332) / 3).toFixed(1) * 1 - 10,
      slideWidth: widthPercentage(344),
      pagination: false,
      header: true,
      th: th,
    },
  ];

  useEffect(() => {
    setNewBookList([...newBook]);
    setKbsBookList1([...kbsBook?.filter(x => x.grade === arrayGrade[0])]);
    setKbsBookList2([...kbsBook?.filter(x => x.grade === arrayGrade[1])]);
    setBannerList([...banner]);
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
