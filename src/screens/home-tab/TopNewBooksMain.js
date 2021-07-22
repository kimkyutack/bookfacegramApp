import React, {useState, useEffect, useRef} from 'react';

import {Image, StyleSheet, View, ScrollView, FlatList} from 'react-native';
import colors from '../../libs/colors';
import {screenWidth} from '../../services/util';
import BookMainCarousel from './BookMainCarousel';

export default function TopNewBooksMain({
  newBookList,
  kbsBookList1,
  kbsBookList2,
  kbsBookList3,
  kbsBookList4,
  kbsBookList5,
  kbsBookList6,
  bannerList,
  th,
  setTabs,
  setSelectedBook,
  setGrade,
}) {
  const onPressBookList = grade => {
    setTabs(1);
    setGrade(grade ? grade : null);
  };
  const isCarouselRef1 = useRef(null); //banner
  const isCarouselRef2 = useRef(null); //new
  const isCarouselRef3 = useRef(null); //kbs1
  const isCarouselRef4 = useRef(null); //kbs2
  const isCarouselRef5 = useRef(null); //kbs3
  const isCarouselRef6 = useRef(null); //kbs4
  const isCarouselRef7 = useRef(null); //kbs5
  const isCarouselRef8 = useRef(null); //kbs6

  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <BookMainCarousel
        isCarouselRef={isCarouselRef1}
        name="banner"
        renderData={bannerList}
        sliderWidth={screenWidth - 40}
        itemWidth={screenWidth - 40}
        pagination={true}
        header={false}
      />
      {/* 신간 */}
      <BookMainCarousel
        name="new"
        isCarouselRef={isCarouselRef2}
        renderData={newBookList}
        sliderWidth={screenWidth - 40}
        itemWidth={(screenWidth - 30) / 3}
        setTabs={setTabs}
        onPressBookList={onPressBookList}
        setSelectedBook={setSelectedBook}
        header={true}
      />
      {/* kbs 1급 */}
      <BookMainCarousel
        name="kbs"
        isCarouselRef={isCarouselRef3}
        grade="1급"
        gradeStyle={{color: colors.st1}}
        renderData={kbsBookList1}
        sliderWidth={screenWidth - 40}
        itemWidth={(screenWidth - 30) / 3}
        setTabs={setTabs}
        onPressBookList={onPressBookList}
        setSelectedBook={setSelectedBook}
        header={true}
        th={th}
      />
      {/* kbs 2급 */}
      <BookMainCarousel
        name="kbs"
        isCarouselRef={isCarouselRef4}
        grade="2급"
        gradeStyle={{color: colors.st2}}
        renderData={kbsBookList2}
        sliderWidth={screenWidth - 40}
        itemWidth={(screenWidth - 30) / 3}
        setTabs={setTabs}
        onPressBookList={onPressBookList}
        setSelectedBook={setSelectedBook}
        header={true}
        th={th}
      />
      {/* kbs 3급 */}
      <BookMainCarousel
        name="kbs"
        isCarouselRef={isCarouselRef5}
        grade="(준)3급"
        gradeStyle={{color: colors.st3}}
        renderData={kbsBookList3}
        sliderWidth={screenWidth - 40}
        itemWidth={(screenWidth - 30) / 3}
        setTabs={setTabs}
        onPressBookList={onPressBookList}
        setSelectedBook={setSelectedBook}
        header={true}
        th={th}
      />
      {/* kbs 4급 */}
      <BookMainCarousel
        name="kbs"
        isCarouselRef={isCarouselRef6}
        grade="(준)4급"
        gradeStyle={{color: colors.st4}}
        renderData={kbsBookList4}
        sliderWidth={screenWidth - 40}
        itemWidth={(screenWidth - 30) / 3}
        setTabs={setTabs}
        onPressBookList={onPressBookList}
        setSelectedBook={setSelectedBook}
        header={true}
        th={th}
      />
      {/* kbs 5급 */}
      <BookMainCarousel
        name="kbs"
        isCarouselRef={isCarouselRef7}
        grade="(준)5급"
        gradeStyle={{color: colors.st5}}
        renderData={kbsBookList5}
        sliderWidth={screenWidth - 40}
        itemWidth={(screenWidth - 30) / 3}
        setTabs={setTabs}
        onPressBookList={onPressBookList}
        setSelectedBook={setSelectedBook}
        header={true}
        th={th}
      />
      {/* kbs 누리급 */}
      <BookMainCarousel
        name="kbs"
        isCarouselRef={isCarouselRef8}
        grade="누리급"
        gradeStyle={{color: colors.st6}}
        renderData={kbsBookList6}
        sliderWidth={screenWidth - 40}
        itemWidth={(screenWidth - 30) / 3}
        setTabs={setTabs}
        onPressBookList={onPressBookList}
        setSelectedBook={setSelectedBook}
        header={true}
        th={th}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginBottom: 10,
  },
});
