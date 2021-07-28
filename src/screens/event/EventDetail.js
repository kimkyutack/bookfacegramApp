import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import RootLayout from '../../layouts/root-layout/RootLayout';
import EventReplyItem from './EventReplyItem';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import TextWrap from '../../components/text-wrap/TextWrap';
import InputWrap from '../../components/input-wrap/InputWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import images from '../../libs/images';
import {requestGet} from '../../services/network';
import {dialogError} from '../../redux/dialog/DialogActions';
import routes from '../../libs/routes';

export default function EventDetail({route, navigation}) {
  const [data, setData] = useState([
    {
      comment:
        '북핑에서 제공하는 도서추천 서비스 덕분에 점점 독서에 더 흥미가 생겼어요. 책을 읽고 나서 다양한 독서활동까지 할 수 있으니깐 너무너무 재밌고, 친구들한테도 추천하고 있답니다. 북핑 짱!!',
      register: '피치못할피치:D',
      register_dt: '2021.09.05',
    },
    {
      comment:
        '독서가 지루하다고만 생각했는데 독서퀴즈도 하고, 생각을 자유롭게 펼칠 수 있는 독후감대회도 있어서 재밌게 이용하고 있어요:) 북핑덕분에 재밌게 책을 읽고 있습니다.',
      register: '자두자두',
      register_dt: '2021.09.05',
    },
  ]);
  const [raplyContent, setReplyContent] = useState('');
  const dispathc = useDispatch();
  const routeParams = route.params.item;
  // console.log(routeParams);
  return (
    <RootLayout
      topbar={{
        title: '이벤트',
        navigation: navigation,
        back: true,
        options: {
          name: 'camera',
          component: <Image style={styles.cameraIcon} source={images.camera} />,
          onPress: () =>
            navigation.navigate(routes.cameraRollPicker, {
              route: routes.message,
              dataKey: 'image',
              key: Date.now(),
            }),
        },
      }}>
      <ScrollView contentContainerStyle={{flexGrow: 2}} scrollEnabled>
        <View style={styles.root}>
          {routeParams && (
            <Image
              source={
                routeParams.ev_img === 'event1_thumb.jpg'
                  ? images.event1Body
                  : images.event2Body
              }
              style={styles.image}
            />
          )}
          {routeParams.ev_btn_active === 1 && (
            <ButtonWrap
              // onPress={}
              styleTitle={styles.buttonTitle}
              style={styles.button}>
              이벤트 응모하기
            </ButtonWrap>
          )}

          {routeParams.ev_reply_active === 1 && (
            <View style={styles.replyContainer}>
              <TextWrap style={styles.reply}>
                댓글{' '}
                <TextWrap style={{color: colors.blue}}>
                  {data ? data.length : 0}
                </TextWrap>
              </TextWrap>
              <InputWrap
                style={styles.input}
                inputFlex={{flex: 1}}
                value={raplyContent}
                onChange={setReplyContent}
                borderColor={colors.border}
                maxLength={200}
                optionComponent={
                  <TextWrap style={styles.contentCount}>
                    ({raplyContent.length} / 200)
                  </TextWrap>
                }
                multiline
              />
              <View style={styles.buttonContainer}>
                <ButtonWrap
                  styleTitle={styles.buttonAddTitle}
                  style={styles.buttonAdd}>
                  등록
                </ButtonWrap>
              </View>
              <View style={{flex: 1}}>
                {data.map((u, i) => {
                  return <EventReplyItem {...u} key={i} />;
                })}
                {/* <FlatList
                  data={data}
                  nestedScrollEnabled
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => {
                    return <EventReplyItem {...item} />;
                  }}
                /> */}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    resizeMode: 'stretch',
  },
  button: {
    borderRadius: 0,
    backgroundColor: colors.black,
  },
  buttonAdd: {
    width: 60,
    height: 30,
    backgroundColor: colors.black,
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  buttonTitle: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  buttonAddTitle: {
    color: colors.white,
    // fontWeight: '700',
    fontSize: 13,
  },
  replyContainer: {
    flex: 1,
    marginTop: 15,
    marginBottom: 10,
  },
  reply: {
    fontWeight: '700',
    color: colors.black,
  },
  input: {
    marginVertical: 12,
    height: 100,
    fontSize: 14,
    color: colors.black,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
  },
  contentCount: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: -8,
    right: 4,
  },
  cameraIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
