import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
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
  heightPercentage,
} from '../../../services/util';
import BookMainCarousel from './BookMainCarousel';
import NoMybooks from './NoMybooks';
import {ScrollView} from 'react-native-gesture-handler';
import {navigate} from '../../../services/navigation';
import routes from '../../../libs/routes';

export default function TopMyBooksMain({route, kbsBook, newBook, banner, th}) {
  const [loading, setLoading] = useState(true);

  return (
    <View style={[styles.root, loading && {flex: 1, justifyContent: 'center'}]}>
      <NoMybooks />
      {/* {loading ? (
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
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
