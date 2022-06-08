import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../libs/colors';
import TextButton from '../../../components/text-button/TextButton';
import TextWrap from '../../../components/text-wrap/TextWrap';
import images from '../../../libs/images';
import fonts from '../../../libs/fonts';
import {
  screenWidth,
  widthPercentage,
  chunk,
  fontPercentage,
  heightPercentage
} from '../../../services/util';
import BookMainCarousel from './BookMainCarousel';
import {ScrollView} from 'react-native-gesture-handler';
import {navigate} from '../../../services/navigation';
import routes from '../../../libs/routes';

export default function TopNewBooksMain({route, kbsBook, newBook, banner, th}) {
  const [arrayGrade, setArrayGrade] = useState([
    ...new Set(kbsBook.map(x => x.grade)),
  ]);
  const [loading, setLoading] = useState(true);
  const [newBookList, setNewBookList] = useState(null);
  const [bannerList, setBannerList] = useState(null);
  const [kbsBookList1, setKbsBookList1] = useState(null); //1급
  const [kbsBookList2, setKbsBookList2] = useState(null); //2급 
  const scrollRef = useRef();
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 150;

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
    let isMounted = true;
    if(isMounted ){
    setNewBookList([...newBook]);
    setKbsBookList1([...kbsBook?.filter(x => x.grade === arrayGrade[0])]);
    setKbsBookList2([...kbsBook?.filter(x => x.grade === arrayGrade[1])]);
    setBannerList([...banner]);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if(isMounted ){
      if(scrollRef.current !== undefined){
      scrollRef.current.scrollToOffset({animated: false, offset: 0});
      }
    }
    return () => {
      isMounted = false;
    };
  },[route]);

  useEffect(() => {
    if (th && newBookList && bannerList && kbsBookList1 && kbsBookList2) {
      setLoading(false);
    }
  }, [th, newBookList, bannerList, kbsBookList1, kbsBookList2]);

  const handleFAQ = () => {
    navigate(routes.faq);
  };

  const handlePolicyHome = () => {
    navigate(routes.policyHome);
  };
  const handleProvision = () => {
    navigate(routes.provision);
  };
  const handleTeenager = () => {
    navigate(routes.teenager);
  };

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
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onScroll={event => {
            setContentVerticalOffset(event.nativeEvent.contentOffset.y);
          }}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            return <BookMainCarousel {...item} />;
          }}
          ListFooterComponent={
            <View style={styles.infoRow}>
              <TextWrap
                style={styles.infoHeader}
                font={fonts.kopubWorldDotumProMedium}>
                (주)피씨엔씨
              </TextWrap>
              <View style={styles.row1}>
                <TextButton
                  onPress={handlePolicyHome}
                  styleTitle={styles.t}
                  font={fonts.kopubWorldDotumProMedium}>
                  이용약관
                </TextButton>
                <TextWrap style={styles.t2}>|</TextWrap>
                <TextButton
                  onPress={handleProvision}
                  styleTitle={styles.t}
                  font={fonts.kopubWorldDotumProMedium}>
                  개인정보처리방침
                </TextButton>
                <TextWrap style={styles.t2}>|</TextWrap>
                <TextButton
                  onPress={handleTeenager}
                  styleTitle={styles.t}
                  font={fonts.kopubWorldDotumProMedium}>
                  청소년보호정책
                </TextButton>
                <TextWrap style={styles.t2}>|</TextWrap>
                <TextButton
                  onPress={handleFAQ}
                  styleTitle={styles.t}
                  font={fonts.kopubWorldDotumProMedium}>
                  고객센터
                </TextButton>
              </View>
              <TextWrap
                style={styles.infoFooter}
                font={fonts.kopubWorldDotumProMedium}>
                Copyright 2022. PCNC All rights reserved.
              </TextWrap>
            </View>
          }
        />
      )}
      {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
        <TouchableOpacity
          onPress={() => {
            scrollRef.current.scrollToOffset({ animated: true, offset: 0 });
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
  },
  row1: {
    width: widthPercentage(344),
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10,
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  infoRow: {
    top: 15,
    marginBottom: 40,
    paddingLeft: 20,
  },
  t: {
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(18),
    fontFamily: fonts.kopubWorldDotumProMedium,
    color: '#000',
    display: 'flex',
    marginTop: 9,
    alignSelf: 'center',
    textAlign: 'center',
  },
  t2: {
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(18),
    fontFamily: fonts.kopubWorldDotumProMedium,
    color: '#000',
    marginTop: 10,
    display: 'flex',
    paddingHorizontal: 8,
    alignSelf: 'center',
    textAlign: 'center',
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
  infoFooter: {
    fontSize: fontPercentage(10.5),
    lineHeight: fontPercentage(18),
    fontFamily: fonts.kopubWorldDotumProMedium,
    color: '#aaa',
  },
  infoHeader: {
    fontSize: fontPercentage(13.5),
    lineHeight: fontPercentage(20),
    color: '#000',
    fontWeight: 'bold',
  },
});
