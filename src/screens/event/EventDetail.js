import React, { useEffect, useState, useRef } from 'react';
import { Image, View, ScrollView, StyleSheet, Linking, Text } from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import RootLayout from '../../layouts/root-layout/RootLayout';
import EventReplyItem from './EventReplyItem';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import TextWrap from '../../components/text-wrap/TextWrap';
import InputWrap from '../../components/input-wrap/InputWrap';
import colors from '../../libs/colors';
import images from '../../libs/images';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import { dialogOpenSelect, dialogError } from '../../redux/dialog/DialogActions';
import { requestGet, requestPost } from '../../services/network';
import Footer from '../../libs/footer';
import HTMLView from 'react-native-htmlview';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
  cameraItem,
  screenWidth,
} from '../../services/util';
import { useIsFocused } from '@react-navigation/core';
import AutoHeightImage from 'react-native-auto-height-image';
import RenderHtml from 'react-native-render-html';
import table from '@native-html/table-plugin';
import WebView from 'react-native-webview';
import { browsingTime } from '../../redux/session/SessionAction';


const renderers = {
  table
};

const htmlConfig = {
  renderers,
  WebView,
  renderersProps: {
    table: {
      animationType: 'animated',
      tableStyleSpecs: {
        outerBorderWidthPx: 1,
        rowsBorderWidthPx: 1,
        columnsBorderWidthPx: 1,
        trOddBackground: 'white',
        thBorderColor: 'black',
        tdBorderColor: 'black',
        outerBorderColor: 'black',
      },
    },
    img: {
      enableExperimentalPercentWidth: true,
    }
  },
  tagsStyles: {
    table: {
      flex: 1,
      alignSelf: 'center',
      minWidth: screenWidth * 0.92,
      maxWidth: screenWidth * 0.92,
      paddingHorizontal: 2,
    },
    img: {
      minWidth: screenWidth * 0.85,
      maxWidth: screenWidth * 0.85,
      alignSelf: 'center',
    },
    p: {
      fontSize: fontPercentage(14)
    },
    span: {
      fontSize: fontPercentage(14)
    },
    strong: {
      fontSize: fontPercentage(14)
    },
  },
  defaultWebViewProps: {},
  computeEmbeddedMaxWidth: (contentWidth, tagName) => {
    if (tagName === 'table') {
      return Math.min(contentWidth, 500);
    }
    return contentWidth;
  }
};

export default function EventDetail({ route, navigation }) {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [raplyContent, setReplyContent] = useState('');
  const routeParams = route.params.item !== undefined ? route.params.item : route.params.data.eventDetail[0];
  const isFocused = useIsFocused();
  const scrollRef = useRef();
  const [sessionTime, setSessionTime] = useState('000000');
  const user = useSelector(s => s.user, shallowEqual);

  const regex = /<br>|\n|\r\s*\\?>/gm;
  const source = {
    html: routeParams?.ev_contents.replace(/font/gi, 'span').trim().replace(regex, '')
  };

  useEffect(() => {
    if (isFocused) {
      getEventList();
    }
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (scrollRef.current !== undefined) {
        scrollRef.current.scrollTo({ animated: false, offset: 0 });
      }
    }
    return () => {
      isMounted = false;
    };
  }, [route]);

  let hour = 0, minute = 0, second = -1;

  //카운트 올라가는 로직
  function timeCount() {


    let dsp_hour, dsp_minute, dsp_second;

    second++;

    if (minute == 60) {
      hour++;
      minute = 0;
    }
    if (second == 60) {
      minute++;
      second = 0;
    }

    if (hour < 10)
      dsp_hour = '0' + hour;
    else
      dsp_hour = hour;

    if (minute < 10)
      dsp_minute = '0' + minute;
    else
      dsp_minute = minute;

    if (second < 10)
      dsp_second = '0' + second;
    else
      dsp_second = second;


    let date_state = dsp_hour + dsp_minute + dsp_second;


    setSessionTime(date_state);
  };

  //page 로그 찍는 로직
  useEffect(() => {
    if (isFocused) {
      var timer = setInterval(() => { timeCount() }, 1000);
    }

    if (!isFocused) {
      if (sessionTime !== '000000') {

        dispatch(browsingTime('이벤트(상세페이지)', sessionTime, user.member_id));
      }
    }
    return () => {
      clearInterval(timer);
      setSessionTime('000000');
    }
  }, [isFocused]);

  const getEventList = () => {
    setLoading(true);
    requestGet({
      url: consts.apiUrl + '/mypage/eventReply',
      query: {
        ev_idx: routeParams.ev_idx,
      },
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          setData(res.data?.eventReply);
        } else if (data.status === 'FAIL') {
          // error 일때 해야함
          dispatch(dialogError('fail'));
        } else {
          dispatch(dialogError('fail'));
        }
        setLoading(false);
      })
      .catch(error => {
        // error 일때 해야함
        dispatch(dialogError(error));
        setLoading(false);
      });
  };
  const eventInsert = () => {
    setLoading(true);
    requestPost({
      url: consts.apiUrl + '/mypage/eventReply',
      body: {
        contents: raplyContent,
        ev_idx: routeParams.ev_idx,
      },
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          getEventList();
          setReplyContent('');
        } else if (res.status === 'FAIL') {
          // error 일때 해야함
          dispatch(dialogError('fail'));
        } else {
          dispatch(dialogError('fail'));
        }
        setLoading(false);
      })
      .catch(error => {
        // error 일때 해야함
        dispatch(dialogError(error));
        setLoading(false);
      });
  };

  // const renderNode = (node, index, parent, siblings, defaultRenderer) => {
  //   if (node.name == 'img') {
  //     const a = node.attribs;
  //     return (
  //       <View key={index.toString()}>
  //         <Image style={{
  //           width: screenWidth * 0.92, height: heightPercentage(1500), resizeMode
  //             : 'stretch'
  //         }} source={{ uri: a.src }} />
  //       </View>
  //     );
  //   }

  //   if (node.name == 'p') {
  //     return (
  //       <Text key={index.toString()} style={styles.pFont}>
  //         {defaultRenderer(node.children, parent)}
  //       </Text>
  //     )
  //   }
  // };

  return (
    <RootLayout
      topbar={{
        title: '이벤트',
        navigation: navigation,
        back: true,
        options: {
          component: <Image style={styles.cameraIcon} source={images.camera} />,
          name: 'camera',
          onPress: () =>
            dispatch(
              dialogOpenSelect({
                item: cameraItem(),
              }),
            ),
        },
      }}>
      <ScrollView contentContainerStyle={{ width: screenWidth, flexGrow: 2 }} ref={scrollRef} scrollEnabled>
        <View style={styles.root}>
          {/*uri: routeParams.ev_img_f,*/}
          {routeParams && (
            // <Image
            //   source={{
            //     uri: routeParams.ev_img_f,
            //   }}
            //   style={styles.image}
            // />
            /*<AutoHeightImage
              source={{
                uri: routeParams.ev_img_f,
              }}
              width= {screenWidth*0.92}
            />*/

            <View style={styles.root2}>
              {/* <HTMLView value={routeParams?.ev_contents.trim().replace(regex, '')} renderNode={renderNode} /> */}
              <RenderHtml
                contentWidth={screenWidth}
                source={source}
                {...htmlConfig}
              />
            </View>

          )}
          {routeParams.ev_btn_active === 1 && (
            <ButtonWrap
              onPress={() =>
                Linking.openURL('http://' + routeParams?.ev_btn_url)
              }
              styleTitle={styles.buttonTitle}
              style={styles.button}>
              이벤트 응모하기
            </ButtonWrap>
          )}

          {routeParams.ev_reply_active === 1 && (
            <View style={styles.replyContainer}>
              <TextWrap
                style={styles.reply}
                font={fonts.kopubWorldDotumProBold}>
                댓글{' '}
                <TextWrap style={{ color: colors.blue }}>
                  {data ? data.length : 0}
                </TextWrap>
              </TextWrap>
              <InputWrap
                style={styles.input}
                value={raplyContent}
                inputStyle={styles.textInput}
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
                  styleTitle={
                    loading
                      ? styles.disabledButtonAddTitle
                      : styles.buttonAddTitle
                  }
                  onPress={eventInsert}
                  disabled={loading}
                  disabledBackgroundColor={
                    loading && { backgroundColor: colors.red }
                  }
                  style={styles.buttonAdd}>
                  등록
                </ButtonWrap>
              </View>
              <View style={{ flex: 1 }}>
                {data?.map((u, i) => {
                  return <EventReplyItem {...u} key={i} />;
                })}
                {/* <FlatList
                  data={data}
                  nestedScrollEnabled
                  keyExtractor={(item, index) => return {index.toString()}}
                  renderItem={({item, index}) => {
                    return <EventReplyItem {...item} />;
                  }}
                /> */}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <Footer page="event" />
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  root2: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    // height: heightPercentage(2000),
    // resizeMode: 'stretch',
  },
  button: {
    borderRadius: 0,
    height: 40,
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  buttonAdd: {
    width: widthPercentage(60),
    height: heightPercentage(30),
    backgroundColor: colors.black,
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    justifyContent: 'center',
  },
  buttonTitle: {
    color: colors.white,
    fontSize: fontPercentage(14),
  },
  buttonAddTitle: {
    color: colors.white,
    fontSize: fontPercentage(13),
  },
  disabledButtonAddTitle: {
    color: colors.border,
    fontSize: fontPercentage(13),
    backgroundColor: colors.black,
  },
  replyContainer: {
    flex: 1,
    marginTop: 15,
    marginBottom: 10,
  },
  reply: {
    color: colors.black,
  },
  input: {
    marginVertical: 12,
    fontSize: fontPercentage(14),
    color: colors.black,
  },
  textInput: {
    color: colors.black,
    height: heightPercentage(100),
    textAlignVertical: 'top', //android-only
    fontFamily: fonts.kopubWorldDotumProMedium,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
  },
  contentCount: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 0,
    right: 4,
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
});
