import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import images from '../../libs/images';
import TextWrap from '../../components/text-wrap/TextWrap';
import routes from '../../libs/routes';
import {navigate} from '../../services/navigation';
import MainQuiz from '../activity/MainQuiz';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
  cameraItem,
} from '../../services/util';

export default function ActivityMain({route}) {
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
          onPress={() => {
            navigate(routes.activity, {
              type: 'quiz',
            });
          }}>
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
    top: heightPercentage(10),
    flexDirection: 'row',
  },
  font: {
    left: widthPercentage(20),
    top: heightPercentage(10),
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
  font2: {
    left: widthPercentage(16),
    top: heightPercentage(100),
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
  font3: {
    left: widthPercentage(24),
    top: heightPercentage(100),
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
  font4: {
    left: '14%',
    top: heightPercentage(100),
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
  font5: {
    right: widthPercentage(58),
    top: heightPercentage(90),
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
  font6: {
    left: widthPercentage(18),
    top: heightPercentage(90),
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
  img1: {
    resizeMode: 'contain',
    width: widthPercentage(35),
    height: heightPercentage(45),
    left: widthPercentage(62),
    top: heightPercentage(30),
  },
  img2: {
    resizeMode: 'contain',
    width: widthPercentage(35),
    height: heightPercentage(45),
    left: widthPercentage(66),
    top: heightPercentage(30),
  },
  box2: {
    margin: 5,
    borderColor: '#c9c9c9',
    borderWidth: 0.5,
    borderRadius: 20,
    width: widthPercentage(40),
    height: heightPercentage(160),
    flex: 1,
    flexDirection: 'row',
    left: widthPercentage(20),
    top: heightPercentage(25),
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
  box3: {
    margin: 5,
    width: widthPercentage(40),
    height: heightPercentage(160),
    flex: 1,
    flexDirection: 'row',
    left: 0,
    top: 0,
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
});
