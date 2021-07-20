import React, {useState, useEffect, useCallback} from 'react';

import {Image, StyleSheet, View, ScrollView} from 'react-native';
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
  setTh,
}) {
  useEffect(() => {
    if (kbsBookList1.length > 0) {
      setTh(kbsBookList1[0].recomm_order);
    }
  }, [kbsBookList1, setTh]);

  const onPressBookList = useCallback(grade => {
    setTabs(1);
    setGrade(grade ? grade : null);
  }, []);

  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <BookMainCarousel
        name="banner"
        renderData={bannerList ? bannerList : []}
        sliderWidth={screenWidth - 40}
        itemWidth={screenWidth - 40}
        bannerPagination={true}
        header={false}
      />
      {/* 신간 */}
      <BookMainCarousel
        name="new"
        renderData={newBookList ? newBookList : []}
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
        grade="1급"
        gradeStyle={{color: colors.st1}}
        renderData={kbsBookList1 ? kbsBookList1 : []}
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
        grade="2급"
        gradeStyle={{color: colors.st2}}
        renderData={kbsBookList2 ? kbsBookList2 : []}
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
        grade="(준)3급"
        gradeStyle={{color: colors.st3}}
        renderData={kbsBookList3 ? kbsBookList3 : []}
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
        grade="(준)4급"
        gradeStyle={{color: colors.st4}}
        renderData={kbsBookList4 ? kbsBookList4 : []}
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
        grade="(준)5급"
        gradeStyle={{color: colors.st5}}
        renderData={kbsBookList5 ? kbsBookList5 : []}
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
        grade="누리급"
        gradeStyle={{color: colors.st6}}
        renderData={kbsBookList6 ? kbsBookList6 : []}
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
