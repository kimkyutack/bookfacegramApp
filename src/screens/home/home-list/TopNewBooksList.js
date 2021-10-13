import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
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
import {requestGet, requestPost} from '../../../services/network';
import {dialogError} from '../../../redux/dialog/DialogActions';
export default function TopNewBooksList({route, newBook, kbsBook, th}) {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const listTab = useSelector(s => s.tab, shallowEqual);
  const [rednerData, setRenderData] = useState([]);
  const [type, setType] = useState('new');

  useEffect(() => {
    let mount = true;
    if (mount) {
      scrollRef.current?.scrollToOffset({y: 0.1, animated: false});
      if (listTab.listTab.grade === null) {
        setType('new');
        setRenderData(newBook);
      } else if (listTab.listTab.grade === '1급') {
        setType('kbs');
        setRenderData(
          kbsBook?.filter(x => x.grade === '1급' || x.grade === '준1급'),
        );
      } else if (listTab.listTab.grade === '2급') {
        setType('kbs');
        setRenderData(
          kbsBook?.filter(x => x.grade === '2급' || x.grade === '준2급'),
        );
      } else if (
        listTab.listTab.grade === '3급' ||
        listTab.listTab.grade === '준3급'
      ) {
        setType('kbs');
        setRenderData(
          kbsBook?.filter(x => x.grade === '3급' || x.grade === '준3급'),
        );
      } else if (
        listTab.listTab.grade === '4급' ||
        listTab.listTab.grade === '준4급'
      ) {
        setType('kbs');
        setRenderData(
          kbsBook?.filter(x => x.grade === '4급' || x.grade === '준4급'),
        );
      } else if (
        listTab.listTab.grade === '5급' ||
        listTab.listTab.grade === '준5급'
      ) {
        setType('kbs');
        setRenderData(
          kbsBook?.filter(x => x.grade === '5급' || x.grade === '준5급'),
        );
      } else if (listTab.listTab.grade === '누리급') {
        setType('kbs');
        setRenderData(kbsBook?.filter(x => x.grade === '누리급'));
      }
    }
    return () => {
      mount = false;
    };
  }, [listTab.listTab.grade]);

  const getDrawerList = async bookCd => {
    const {data, status} = await requestGet({
      url: consts.apiUrl + '/mypage/bookDrawer/keep',
      query: {
        bookIdx: bookCd,
      },
    });
    if (status === 'SUCCESS') {
      return data;
    } else {
      return 'bookDrawerKeepFailed';
    }
  };

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
            item.type = type;
            return (
              <BookListItem
                item={item}
                type={type}
                index={index}
                grade={listTab.listTab.grade}
                th={th}
                gradeStyle={listTab.listTab.gradeStyle}
                getDrawerList={getDrawerList}
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
