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

export default function TopNewBooksMain({route, kbsBook, newBook}) {
  const [th, setTh] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newBookList, setNewBookList] = useState(null);
  const [bannerList, setBannerList] = useState(null);
  const [kbsBookList1, setKbsBookList1] = useState(null); //1급
  const [kbsBookList2, setKbsBookList2] = useState(null); //2급
  const [kbsBookList3, setKbsBookList3] = useState(null); //3급
  const [kbsBookList4, setKbsBookList4] = useState(null); //4급
  const [kbsBookList5, setKbsBookList5] = useState(null); //5급
  const [kbsBookList6, setKbsBookList6] = useState(null); //6급
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
      grade: '1급',
      gradeStyle: {color: colors.st1},
      renderData: kbsBookList1,
      sliderWidth: screenWidth - 22,
      itemWidth: ((screenWidth - 22) / 3).toFixed(1) * 1,
      header: true,
      th: th,
    },
    {
      name: 'kbs',
      grade: '2급',
      gradeStyle: {color: colors.st2},
      renderData: kbsBookList2,
      sliderWidth: screenWidth - 22,
      itemWidth: ((screenWidth - 22) / 3).toFixed(1) * 1,
      header: true,
      th: th,
    },
    {
      name: 'kbs',
      grade: '(준)3급',
      gradeStyle: {color: colors.st3},
      renderData: kbsBookList3,
      sliderWidth: screenWidth - 22,
      itemWidth: ((screenWidth - 22) / 3).toFixed(1) * 1,
      header: true,
      th: th,
    },
    {
      name: 'kbs',
      grade: '(준)4급',
      gradeStyle: {color: colors.st4},
      renderData: kbsBookList4,
      sliderWidth: screenWidth - 22,
      itemWidth: ((screenWidth - 22) / 3).toFixed(1) * 1,
      header: true,
      th: th,
    },
    {
      name: 'kbs',
      grade: '(준)5급',
      gradeStyle: {color: colors.st5},
      renderData: kbsBookList5,
      sliderWidth: screenWidth - 22,
      itemWidth: ((screenWidth - 22) / 3).toFixed(1) * 1,
      header: true,
      th: th,
    },
    {
      name: 'kbs',
      grade: '누리급',
      gradeStyle: {color: colors.st6},
      renderData: kbsBookList6,
      sliderWidth: screenWidth - 22,
      itemWidth: ((screenWidth - 22) / 3).toFixed(1) * 1,
      header: true,
      th: th,
    },
  ];

  useEffect(() => {
    setTh(
      kbsBook?.filter(
        x => x.recomm_grade === '1급' || x.recomm_grade === '준1급',
      )[0].recomm_order,
    );
    setNewBookList([...newBook]);
    setKbsBookList1([
      ...kbsBook?.filter(
        x => x.recomm_grade === '1급' || x.recomm_grade === '준1급',
      ),
    ]);
    setKbsBookList2([
      ...kbsBook?.filter(
        x => x.recomm_grade === '2급' || x.recomm_grade === '준2급',
      ),
    ]);
    setKbsBookList3([
      ...kbsBook?.filter(
        x => x.recomm_grade === '3급' || x.recomm_grade === '준3급',
      ),
    ]);
    setKbsBookList4([
      ...kbsBook?.filter(
        x => x.recomm_grade === '4급' || x.recomm_grade === '준4급',
      ),
    ]);
    setKbsBookList5([
      ...kbsBook?.filter(
        x => x.recomm_grade === '5급' || x.recomm_grade === '준5급',
      ),
    ]);
    setKbsBookList6([...kbsBook?.filter(x => x.recomm_grade === '누리급')]);
    setBannerList([
      {index: 0, id: 1, title: images.bannerOne},
      {index: 1, id: 2, title: images.bannerTwo},
    ]);
  }, []);

  useEffect(() => {
    if (
      th &&
      newBookList &&
      bannerList &&
      kbsBookList1 &&
      kbsBookList2 &&
      kbsBookList3 &&
      kbsBookList4 &&
      kbsBookList5 &&
      kbsBookList6
    ) {
      setLoading(false);
    }
  }, [
    th,
    newBookList,
    bannerList,
    kbsBookList1,
    kbsBookList2,
    kbsBookList3,
    kbsBookList4,
    kbsBookList5,
    kbsBookList6,
  ]);

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
          keyExtractor={(item, index) => index.toString()}
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
