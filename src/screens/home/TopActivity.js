import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import images from '../../libs/images';
import TextWrap from '../../components/text-wrap/TextWrap';
import routes from '../../libs/routes';
import {navigate} from '../../services/navigation';

export default function TopActivity({}) {
  return (
    <View style={styles.root}>
      <TextWrap style={styles.font}>다양한 독후활동에 참여해보세요!</TextWrap>
      <View style={styles.root2}>
        <TouchableOpacity
          style={styles.box2}
          onPress={() =>
            navigate(routes.examtest, {
              type: 'main',
            })
          }>
          <View style={styles.box3}>
            <Image style={styles.img1} source={images.exam} />
            <TextWrap style={styles.font4}>문해고사</TextWrap>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box2}
          onPress={() =>
            navigate(routes.kbstest, {
              type: 'main',
            })
          }>
          <View style={styles.box3}>
            <Image style={styles.img2} source={images.kbs_exam} />
            <TextWrap style={styles.font6}>
              {'\t'}
              {'\t'}책과함께
            </TextWrap>
            <TextWrap style={styles.font5}>{'\n'}KBS한국어능력시험</TextWrap>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.root2}>
        <TouchableOpacity
          style={styles.box2}
          onPress={() =>
            navigate(routes.bookContest, {
              type: 'main',
            })
          }>
          <View style={styles.box3}>
            <Image style={styles.img2} source={images.competition} />
            <TextWrap style={styles.font2}>독후감대회</TextWrap>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box2}
          onPress={() =>
            navigate(routes.activity, {
              screen: routes.topNewBooks,
              params: {
                type: 'main',
                key: Date.now(),
              },
            })
          }>
          <View style={styles.box3}>
            <Image style={styles.img1} source={images.quiz} />
            <TextWrap style={styles.font3}>독서퀴즈</TextWrap>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  root2: {
    width: '90%',
    top: 20,
    flexDirection: 'row',
  },
  font: {
    left: 42,
    top: 20,
    fontSize: 25,
    fontWeight: 'bold',
  },
  font2: {
    left: '10%',
    top: '55%',
    fontSize: 25,
    fontWeight: 'bold',
  },
  font3: {
    left: '18%',
    top: '55%',
    fontSize: 25,
    fontWeight: 'bold',
  },
  font4: {
    left: '14%',
    top: '55%',
    fontSize: 25,
    fontWeight: 'bold',
  },
  font5: {
    right: '50%',
    top: '47%',
    fontSize: 25,
    fontWeight: 'bold',
  },
  font6: {
    left: '10%',
    top: '47%',
    fontSize: 25,
    fontWeight: 'bold',
  },
  img1: {
    resizeMode: 'contain',
    width: 70,
    height: 80,
    left: '50%',
    top: '15%',
  },
  img2: {
    resizeMode: 'contain',
    width: 70,
    height: 80,
    left: '50%',
    top: '15%',
  },
  box2: {
    margin: 5,
    borderColor: '#c9c9c9',
    borderWidth: 0.5,
    borderRadius: 20,
    width: 80,
    height: 250,
    flex: 1,
    flexDirection: 'row',
    left: 38,
    top: 40,
    fontSize: 25,
    fontWeight: 'bold',
  },
  box3: {
    margin: 5,
    width: 80,
    height: 250,
    flex: 1,
    flexDirection: 'row',
    left: 0,
    top: 0,
    fontSize: 25,
    fontWeight: 'bold',
  },
});
