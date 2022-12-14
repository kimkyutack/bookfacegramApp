import React, { useState, useEffect } from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import TextWrap from '../../../components/text-wrap/TextWrap';
import colors from '../../../libs/colors';
import consts from '../../../libs/consts';
import fonts from '../../../libs/fonts';
import images from '../../../libs/images';
import InputWrap2 from '../../../components/input-wrap/InputWrap2';
import HTMLView from 'react-native-htmlview';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { requestGet, requestPost, requestFile } from '../../../services/network';
import {
  formatTime,
  screenWidth,
  widthPercentage,
  heightPercentage,
  screenHeight,
  fontPercentage,
} from '../../../services/util';
import {
  dialogClose,
  dialogError,
  dialogOpenMessage,
  dialogOpenDrawerSelect,
  dialogOpenAction,
} from '../../../redux/dialog/DialogActions';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { navigate } from '../../../services/navigation';
import { browsingTime } from '../../../redux/session/SessionAction';
import { createIconSetFromFontello } from 'react-native-vector-icons';

export default function BookDetailQuiz({ isbn }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [bookQuiz, setBookQuiz] = useState([]);
  const [quizcreate, setQuizcreate] = useState(0);
  const [quizEnd, setQuizEnd] = useState(0);
  const [quizstart, setQuizstart] = useState(0);
  const [contents, setContents] = useState('');
  const [subjm, setsubjm] = useState('');
  const [subtype, setsubType] = useState(1);
  const [Answerno, setAnswerno] = useState(1);
  const [answer, setAnswer] = useState('');
  const [subanswer, setsubanswer] = useState();
  const [examnum, setExamnum] = useState(0);
  const [quizRecord, setQuizRecord] = useState([]);
  const [quizScore, setQuizScore] = useState([]);
  const [titlenum, setTitlenum] = useState(1);
  const [page, setPage] = useState(1);
  const [totAnswer, setTotAnswer] = useState([]);
  const [totRecord, setTotRecord] = useState([]);
  const [openRecord, setOpenRecord] = useState();
  const [ans1, setans1] = useState();
  const [ans2, setans2] = useState();
  const [ans3, setans3] = useState();
  const [ans4, setans4] = useState();
  const [ans5, setans5] = useState();
  const [sessionTime, setSessionTime] = useState('000000');
  const isFocused = useIsFocused();
  const comma = ",";
  const radio_props = [
    { label: '?????????', value: 1 },
    { label: '?????????', value: 2 },
  ];
  const paths = [
    { path: '1??? ????????? ????????? ??????????????????.' },
    { path: '2??? ????????? ????????? ??????????????????.' },
    { path: '3??? ????????? ????????? ??????????????????.' },
    { path: '4??? ????????? ????????? ??????????????????.' },
    { path: '5??? ????????? ????????? ??????????????????.' },
  ];
  const subnum = [
    { label: '1???:', value: 1 },
    { label: '2???:', value: 2 },
    { label: '3???:', value: 3 },
    { label: '4???:', value: 4 },
    { label: '5???:', value: 5 },
  ];
  const user = useSelector(s => s.user, shallowEqual);

  const renderNode = (node, index, parent, siblings, defaultRenderer) => {
    if (node.name == 'img') {
      const a = node.attribs;
      return (
        <View key={index.toString()}>
          <Image style={{
            width: screenWidth * 0.84, height: heightPercentage(800), resizeMode
              : 'stretch'
          }} source={{ uri: a.src }} />
        </View>
      );
    }

    if (node.name == 'p') {
      return (
        <Text key={index.toString()} style={styles.pFont}>
          {defaultRenderer(node.children, parent)}
        </Text>
      )
    }
  };

  const fetchRequested = async () => {
    try {
      setLoading(true);
      const { data, status } = await requestGet({
        url: consts.apiUrl + '/book/quiz/' + isbn,
      });
      if (status === 'SUCCESS') {
        setBookQuiz(data.bookQuiz);
        setTotRecord(data.quizRecords);
        setPage(page + 1);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      dispatch(dialogError(error));
    }
  };

  const quizRequested = async () => {
    try {
      setLoading(true);
      const { data, status } = await requestPost({
        url: consts.apiUrl + '/book/quiz/',
        body: {
          answerList: totAnswer,
          isbn: isbn,
        },
      });
      if (status === 'SUCCESS') {
        setQuizScore(data.quizRecord);
        setQuizRecord(data.quizRecord[0].recordDetail);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      dispatch(dialogError(error));
    }
  };

  const answerSelect = (value) => {
    if (value === 1) {
      if (ans1 === undefined || ans1.length === 0) {

        dispatch(
          dialogOpenMessage({
            message: '1??? ????????? ????????? ??????????????????.',
          }),
        );
      } else {
        setAnswerno(value);
      }
    } else if (value === 2) {
      if (ans2 === undefined || ans2.length === 0) {
        dispatch(
          dialogOpenMessage({
            message: '2??? ????????? ????????? ??????????????????.',
          }),
        );
      } else {
        setAnswerno(value);
      }
    } else if (value === 3) {
      if (ans3 === undefined || ans3.length === 0) {
        dispatch(
          dialogOpenMessage({
            message: '3??? ????????? ????????? ??????????????????.',
          }),
        );
      } else {
        setAnswerno(value);
      }
    } else if (value === 4) {
      if (ans4 === undefined || ans4.length === 0) {
        dispatch(
          dialogOpenMessage({
            message: '4??? ????????? ????????? ??????????????????.',
          }),
        );
      } else {
        setAnswerno(value);
      }
    } else if (value === 5) {
      if (ans5 === undefined || ans5.length === 0) {
        dispatch(
          dialogOpenMessage({
            message: '5??? ????????? ????????? ??????????????????.',
          }),
        );
      } else {
        setAnswerno(value);
      }
    }


  }
  const createQuiz = async () => {
    //???????????? ?????? ??????
    var formData = new FormData();

    /*let totAns = [];
    if (ans1 !== undefined) {
      totAns.push(ans1);
    }
    if (ans2 !== undefined) {
      totAns.push(ans2);
    }
    if (ans3 !== undefined) {
      totAns.push(ans3);
    }
    if (ans4 !== undefined) {
      totAns.push(ans4);
    }
    if (ans5 !== undefined) {
      totAns.push(ans5);
    }*/
    try {
      if (subtype === 1) {
        formData.append('VPexam', contents);
        formData.append('answer', subanswer);
        formData.append('bookCd', isbn);
        formData.append('subJimun', subjm);
        formData.append('subjYn', 'S');
        const { data, status } = await requestFile(
          {
            url: consts.apiUrl + '/book/quiz/chul',
            method: 'post',
          },
          formData,
        );
        if (status === 'SUCCESS') {
          dispatch(
            dialogOpenMessage({
              message: `?????? ????????? ?????????????????????.${'\n'}????????? ?????? ??? ???????????????.`,
            }),
          );
          setQuizcreate(0);
          setContents('');
          setsubjm('');
          setsubanswer('');
        }
      } else {
        formData.append('OAnswer', Answerno);
        formData.append('instanceJimun1', ans1);
        formData.append('instanceJimun2', ans2);
        formData.append('instanceJimun3', ans3);
        formData.append('instanceJimun4', ans4);
        if (ans5 !== undefined) {
          formData.append('instanceJimun5', ans5);
        }
        formData.append('VPexam', contents);
        formData.append('bookCd', isbn);
        formData.append('subJimun', subjm);
        formData.append('subjYn', 'O');
        const { data, status } = await requestFile(
          {
            url: consts.apiUrl + '/book/quiz/chul',
            method: 'post',
          },
          formData,
        );
        if (status === 'SUCCESS') {
          dispatch(
            dialogOpenMessage({
              message: `?????? ????????? ?????????????????????.${'\n'}????????? ?????? ??? ???????????????.`,
            }),
          );
          setQuizcreate(0);
          setContents('');
          setsubjm('');
          setAnswerno(1);
          setans1();
          setans2();
          setans3();
          setans4();
          setans5();

        }
      }

    } catch (error) {

      if (subtype !== 1 && Answerno > totAns.length) {
        dispatch(
          dialogOpenMessage({
            message: '????????? ?????????????????????. ?????? ??????????????????.',
          }),
        );
      } else {
        dispatch(dialogError(error));
      }
    }

  }
  const quizGraph = async () => {
    try {
      const { data, status } = await requestPost({
        url: consts.apiUrl + '/mybooks/graph/quiz/',
        body: {
          isbn: isbn,
          type: 'exam',
        },
      });
      if (status === 'SUCCESS') {
        setQuizstart(1);
      }
    } catch (error) {
      dispatch(dialogError(error));
    }
  };

  const quizMultiCheck = (instanceNum) => {
    let answ = answer.toString().replace(instanceNum, '');
    let total = answ.toString().replace(',,', ',');

    if (total.endsWith(comma)) {
      setAnswer(total.slice(0, -1));
    } else if (total.startsWith(comma)) {
      setAnswer(total.substring(1));
    } else {
      setAnswer(total);
    }


  }
  const next = () => {
    if (titlenum !== bookQuiz.length) {
      if (totAnswer.length !== 0) {
        if (
          totAnswer[examnum] &&
          totAnswer[examnum] !== answer &&
          answer === ''
        ) {
        } else {
          if (answer !== undefined && answer.toString().length !== 0) {
            totAnswer[examnum] = answer.toString();
          } else {
            totAnswer[examnum] = '';
          }
        }
        setAnswer('');
        if (totAnswer.length > examnum) {
          setAnswer(totAnswer[examnum + 1]);
        }
      } else {
        if (answer !== undefined && answer.toString().length !== 0) {
          setTotAnswer([answer.toString()]);
        } else {
          setTotAnswer(['']);
        }

        setAnswer('');
      }

      setExamnum(examnum + 1);
      setTitlenum(titlenum + 1);

    } else {
      if (answer !== undefined) {
        if (answer.toString().endsWith(comma)) {
          setTotAnswer(totAnswer => [...totAnswer, answer.slice(0, -1)]);
        } else if (answer.toString().startsWith(comma)) {
          setTotAnswer(totAnswer => [...totAnswer, answer.substring(1)]);
        } else {
          setTotAnswer(totAnswer => [...totAnswer, answer]);
        }
      } else {
        setTotAnswer(totAnswer => [...totAnswer, '']);
      }
      setQuizEnd(1);
      //quizRequested();
    }
  };

  const prev = () => {
    if (examnum !== 0) {
      if (totAnswer[examnum - 1]) {
        setAnswer(totAnswer[examnum - 1]);
      } else {
        setAnswer('');
      }
      setExamnum(examnum - 1);
      setTitlenum(titlenum - 1);

    } else {
      setAnswer('');
      fetchRequested();
      setTotAnswer([]);
      setQuizstart(0);
    }
  };

  let hour = 0, minute = 0, second = -1;

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

  //page ?????? ?????? ??????
  useEffect(() => {
    if (isFocused) {
      var timer = setInterval(() => { timeCount() }, 1000);
    }

    if (!isFocused) {
      if (sessionTime !== '000000') {

        dispatch(browsingTime('????????????(???????????????)', sessionTime, user.member_id));
      }
    }
    return () => {
      clearInterval(timer);
      setSessionTime('000000');
    }
  }, [isFocused]);



  useEffect(() => {
    let mount = true;
    if (mount && isbn) {
      fetchRequested();
      setOpenRecord();
    }
    return () => {
      mount = false;
    };
  }, [isbn, isbn !== 0]);

  useEffect(() => {
    if (totAnswer.length === bookQuiz.length && bookQuiz.length !== 0) {
      quizRequested();
    }
    return () => { };
  }, [totAnswer]);

  useEffect(() => {
    //console.log(examnum);
  }, [examnum]);

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  return loading ? (
    <ActivityIndicator
      size="large"
      style={{ alignSelf: 'center', marginTop: 60 }}
      color={colors.blue}
    />
  ) : bookQuiz.length === 0 && quizcreate === 0 ? (
    <View>
      <TextWrap style={styles.noData} font={fonts.kopubWorldDotumProLight}>
        ?????? ????????? ????????? ????????????.{'\n'}?????? ?????? ???????????? ?????? ?????????
        ???????????????.
      </TextWrap>
      <TouchableOpacity
        style={styles.noDatabtn}
        onPress={() => {
          setQuizcreate(1);
        }}>
        <Image source={images.que_btn} style={styles.img} />
      </TouchableOpacity>
    </View>
  ) : bookQuiz.length === 0 && quizcreate === 1 ? (
    <View
      style={{
        width: screenWidth,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
      }}>
      <RadioForm animation={true} formHorizontal={true} labelHorizontal={true}>
        {/* To create radio buttons, loop through your array of options */}
        {radio_props.map((obj, i) => (
          <RadioButton labelHorizontal={true} key={i}>
            {/*  You can set RadioButtonLabel before RadioButtonInput */}
            <RadioButtonInput
              obj={obj}
              index={i}
              isSelected={subtype}
              onPress={value => {
                setsubType(value);
              }}
              borderWidth={widthPercentage(0.3)}
              buttonInnerColor={subtype === i + 1 ? '#0077ff' : '#fff'}
              buttonOuterColor={'#000'}
              buttonSize={screenWidth / 80}
              buttonOuterSize={screenWidth / 40}
              buttonStyle={{}}
              buttonWrapStyle={{}}
            />
            <RadioButtonLabel
              obj={obj}
              index={i}
              labelHorizontal={true}
              onPress={value => {
                setsubType(value);
              }}
              labelStyle={{
                fontSize: fontPercentage(12),
                height: screenHeight / 22,
                bottom: heightPercentage(3),
                lineHeight: screenHeight / 39,
              }}
              labelWrapStyle={{ marginRight: 20 }}
            />
          </RadioButton>
        ))}
      </RadioForm>
      <TextWrap style={styles.noData} font={fonts.kopubWorldDotumProLight}>
        ??????
      </TextWrap>
      <TextInput
        style={contents.length !== 0 ? styles.contentinputStyle : styles.placeStyle}
        inputStyle={styles.inputValue}
        value={contents}
        multiline={true}
        numberOfLines={10}
        onChangeText={eve => {
          setContents(eve);
        }}
        maxLength={200}
        placeholder="????????? ??????????????????."
        placeholderTextColor="#acacac"
      />
      <TextWrap style={styles.noData} font={fonts.kopubWorldDotumProLight}>
        ??????
      </TextWrap>
      <TextInput
        style={subjm.length !== 0 ? styles.contentinputStyle : styles.placeStyle}
        inputStyle={styles.inputValue}
        value={subjm}
        multiline={true}
        numberOfLines={10}
        onChangeText={eve => {
          setsubjm(eve);
        }}
        maxLength={200}
        placeholder="????????? ????????? ??????????????????."
        placeholderTextColor="#acacac"
      />
      {subtype === 1 ? (
        <View
          style={{
            width: screenWidth,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TextWrap style={styles.noData} font={fonts.kopubWorldDotumProLight}>
            ????????? ??????
          </TextWrap>
          <InputWrap2
            style={styles.inputStyle2}
            inputStyle={styles.inputValue2}
            value={subanswer}
            onChange={eve => {
              setsubanswer(eve);
            }}
            maxLength={30}
            placeholder="????????? ??????????????????."
            placeholderTextColor="#acacac"
          />
        </View>
      ) : (
        <View
          style={{
            width: screenWidth,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TextWrap style={styles.noData} font={fonts.kopubWorldDotumProLight}>
            ????????? ??????
          </TextWrap>
          {paths.map((path, index) => {
            return (
              <TextInput
                style={styles.inputStyle}
                inputStyle={styles.inputValue}
                key={index}
                value={index === 0
                  ? ans1
                  : index === 1
                    ? ans2
                    : index === 2
                      ? ans3
                      : index === 3
                        ? ans4
                        : ans5}
                multiline={false}
                numberOfLines={1}
                onChangeText={eve => {
                  index === 0
                    ? setans1(eve)
                    : index === 1
                      ? setans2(eve)
                      : index === 2
                        ? setans3(eve)
                        : index === 3
                          ? setans4(eve)
                          : setans5(eve);
                }}
                maxLength={20}
                placeholder={path.path}
                placeholderTextColor="#acacac"
              />
            );
          })}
          <View
            style={{
              width: screenWidth,
              alignItems: 'center',
              justifyContent: 'center',
              top: 40,
            }}>
            <View
              style={{
                width: screenWidth,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                bottom: 20,
              }}>
              <TextWrap style={styles.noData} font={fonts.kopubWorldDotumProLight}>
                ????????? ??????
              </TextWrap>
              <TextWrap style={styles.grayfont} font={fonts.kopubWorldDotumProLight}>
                &nbsp;(????????? ????????? ????????? ?????????.)
              </TextWrap>
            </View>
            <RadioForm
              animation={true}
              formHorizontal={true}
              labelHorizontal={true}>
              {/* To create radio buttons, loop through your array of options */}
              {subnum.map((num, i) => (
                <RadioButton labelHorizontal={true} key={i}>
                  {/*  You can set RadioButtonLabel before RadioButtonInput */}
                  <RadioButtonLabel
                    obj={num}
                    index={i}
                    labelHorizontal={true}
                    onPress={value => {
                      answerSelect(value);
                    }}
                    labelStyle={{
                      fontSize: fontPercentage(12),
                      height: screenHeight / 22,
                      bottom: heightPercentage(3),
                      lineHeight: screenHeight / 39,
                    }}
                    labelWrapStyle={{ marginRight: widthPercentage(8), marginLeft: widthPercentage(10), right: widthPercentage(8) }}
                  />
                  <RadioButtonInput
                    obj={num}
                    index={i}
                    isSelected={Answerno}
                    onPress={value => {
                      answerSelect(value);
                    }}
                    borderWidth={widthPercentage(0.3)}
                    buttonInnerColor={Answerno === i + 1 ? '#0077ff' : '#fff'}
                    buttonOuterColor={'#000'}
                    buttonSize={screenWidth / 80}
                    buttonOuterSize={screenWidth / 40}
                    buttonStyle={{}}
                    buttonWrapStyle={{ top: heightPercentage(3), right: widthPercentage(10) }}
                  />
                </RadioButton>
              ))}
            </RadioForm>
          </View>
        </View>
      )}
      <TouchableOpacity
        style={styles.noDatabtn2}
        onPress={() => {
          dispatch(dialogClose());
          dispatch(
            dialogOpenAction({
              titleColor: colors.blue,
              cancelTitle: '??????',
              message: '????????? ?????????????????????????',
              onPress: a => {
                if (a) {
                  createQuiz();
                }
              },
            }),
          )
        }}>
        <Image source={images.submit_btn} style={styles.img} />
      </TouchableOpacity>
    </View>
  ) : bookQuiz.length !== 0 && quizstart === 1 && quizEnd === 0 ? (
    <View style={{ width: screenWidth }}>
      <TextWrap style={styles.extitless} font={fonts.kopubWorldDotumProLight}>
        Q{titlenum}.
      </TextWrap>
      <TextWrap style={styles.excontents} font={fonts.kopubWorldDotumProLight}>
        {bookQuiz[examnum].exam}
      </TextWrap>
      {bookQuiz[examnum].subJimun !== null && bookQuiz[examnum].subJimun.length > 1 ? (
        <View style={styles.onData}>
          <HTMLView
            stylesheet={styles.onData}
            value={bookQuiz[examnum].subJimun}
            renderNode={renderNode}
          />
        </View>
      ) : null}
      {bookQuiz[examnum].subjYn === 'S' ? (
        <View style={styles.answerview}>
          <TextWrap
            style={styles.answertab}
            font={fonts.kopubWorldDotumProLight}>
            ?????? :
          </TextWrap>
          <TextInput
            style={styles.inputStyle3}
            inputStyle={styles.inputValue3}
            value={answer}
            onChangeText={eve => {
              setAnswer(eve);
            }}
            multiline={false}
            maxLength={30}
          />
        </View>
      ) : (
        bookQuiz[examnum].instances.map((quiz, index) => {
          return (
            <View key={index * page + 600} style={bookQuiz[examnum].subJimun !== null && bookQuiz[examnum].subJimun.length > 1 && index === 0 ? styles.subanswerview2 : styles.subanswerview}>
              <TouchableOpacity
                onPress={() => {
                  bookQuiz[examnum].answerCnt === 1
                    ? setAnswer(quiz.instanceNum)
                    : bookQuiz[examnum].answerCnt !== 1 && answer !== undefined && !answer.toString().includes(quiz.instanceNum) ? setAnswer((answer + ',' + quiz.instanceNum).toString().replace(',,', ','))
                      : bookQuiz[examnum].answerCnt !== 1 && answer !== undefined && answer.toString().includes(quiz.instanceNum) ? quizMultiCheck(quiz.instanceNum)
                        : setAnswer(quiz.instanceNum)
                }}>
                <TextWrap
                  style={
                    answer !== undefined && answer.toString().includes(quiz.instanceNum)
                      ? styles.selecttab
                      : totAnswer.length >= titlenum &&
                        totAnswer[examnum].toString().includes(quiz.instanceNum) &&
                        answer.length === 0
                        ? styles.selecttab
                        : styles.answertab
                  }
                  font={fonts.kopubWorldDotumProLight}>
                  {quiz.instanceNum}{')'} {quiz.instance}
                </TextWrap>
              </TouchableOpacity>
            </View>

          );
        })
      )}
      <View
        style={{
          width: screenWidth,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity style={styles.btn} onPress={prev}>
          <Image
            source={titlenum !== 1 ? images.prev_btn : images.cancel_btn}
            style={styles.img}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={next}>
          <Image source={images.next_btn} style={styles.img} />
        </TouchableOpacity>
      </View>
    </View>
  ) : bookQuiz.length !== 0 && quizstart === 1 && quizEnd === 1 ? (
    <View>
      <View style={styles.extitle3} >
        <Image source={images.note_icon} style={styles.note} />
        <TextWrap style={styles.extitle} font={fonts.kopubWorldDotumProLight}>
          ????????????
        </TextWrap>
      </View>
      {quizScore.length !== 0 ? (
        <View style={styles.quizdata}>
          <TextWrap
            style={styles.quizdata2}
            font={fonts.kopubWorldDotumProLight}>
            {quizScore[0].avgScore}???
          </TextWrap>
          <TextWrap
            style={styles.quizdata3}
            font={fonts.kopubWorldDotumProLight}>
            {quizScore[0].avgScore < 70 ? '  ?????? ??? ??????' : '  ??????'}
          </TextWrap>
          <TextWrap
            style={styles.quizdata4}
            font={fonts.kopubWorldDotumProLight}>
            {quizScore[0].quizExamDate.substring(0, 10)}
          </TextWrap>
        </View>
      ) : null}
      <View
        style={{
          marginTop: heightPercentage(10),
          width: screenWidth * 0.9,
          alignItems: 'center',
          justifyContent: 'flex-start',
          alignSelf: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {quizRecord.length !== 0
          ? quizRecord.map((data, index) => {
            return data.examNum % 5 === 0 ? (
              <View key={data.examNum + index * page + 1}>
                <TextWrap
                  style={styles.answernum}
                  font={fonts.kopubWorldDotumProLight}>
                  {data.examNum}
                </TextWrap>
                <TextWrap
                  style={styles.answer}
                  font={fonts.kopubWorldDotumProLight}>
                  {data.answerYn === 1 ? 'O' : 'X'}
                </TextWrap>
              </View>
            ) : (
              <View key={data.examNum + index * page + 1}>
                <TextWrap
                  style={styles.answernum}
                  font={fonts.kopubWorldDotumProLight}>
                  {data.examNum}
                </TextWrap>
                <TextWrap
                  style={styles.answer}
                  font={fonts.kopubWorldDotumProLight}>
                  {data.answerYn === 1 ? 'O' : 'X'}
                </TextWrap>
              </View>
            );
          })
          : null}
      </View>
      <View
        style={{
          width: screenWidth,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setQuizstart(0);
            setQuizEnd(0);
            setTotAnswer([]);
            setAnswer();
            setTitlenum(1);
            setExamnum(0);
            fetchRequested();
          }}>
          <Image source={images.check} style={styles.img} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setQuizstart(1);
            setQuizEnd(0);
            setAnswer();
            setTotAnswer([]);
            setTitlenum(1);
            setExamnum(0);
          }}>
          <Image source={images.retry} style={styles.img} />
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <View>
      <TouchableOpacity
        style={styles.noDatabtn}
        onPress={() => {
          quizGraph();
        }}>
        <Image source={images.quiz_btn} style={styles.img} />
      </TouchableOpacity>
      {totRecord.length !== 0 ? (
        <View style={styles.extitle2} >
          <Image source={images.note_icon} style={styles.note} />
          <TextWrap style={styles.extitle} font={fonts.kopubWorldDotumProLight}>
            ????????????
          </TextWrap>
        </View>

      ) : null}
      <View
        style={{
          marginTop: heightPercentage(0),
          width: screenWidth * 0.9,
          alignItems: 'center',
          justifyContent: 'flex-start',
          alignSelf: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginBottom: heightPercentage(20),
        }}>
        {totRecord.length !== 0
          ? totRecord.map((data, index) => {
            return (
              <View key={index * page + 2} style={styles.quizdata}>
                <TouchableOpacity
                  style={styles.recordopen}
                  onPress={() => {
                    openRecord === index
                      ? setOpenRecord()
                      : setOpenRecord(index);
                  }}>
                  <TextWrap
                    style={styles.quizdata2}
                    font={fonts.kopubWorldDotumProLight}>
                    {totRecord[index].avgScore}???
                  </TextWrap>
                  <TextWrap
                    style={styles.quizdata3}
                    font={fonts.kopubWorldDotumProLight}>
                    {totRecord[index].avgScore < 70 ? '  ?????? ??? ??????' : '  ??????'}
                  </TextWrap>
                  <TextWrap
                    style={styles.quizdata4}
                    font={fonts.kopubWorldDotumProLight}>
                    {totRecord[index].quizExamDate.substring(0, 10)}
                  </TextWrap>
                </TouchableOpacity>
                <View
                  style={
                    openRecord === index
                      ? {
                        marginTop: heightPercentage(10),
                        width: screenWidth * 0.9,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        alignSelf: 'center',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        display: 'flex',
                      }
                      : {
                        marginTop: heightPercentage(10),
                        width: screenWidth * 0.9,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        alignSelf: 'center',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        display: 'none',
                      }
                  }>
                  {totRecord[index].recordDetail.map((eve, cnt) => {
                    return (
                      <View key={cnt * page}>
                        <TextWrap
                          style={styles.answernum}
                          font={fonts.kopubWorldDotumProLight}>
                          {eve.examNum}
                        </TextWrap>
                        <TextWrap
                          style={styles.answer}
                          font={fonts.kopubWorldDotumProLight}>
                          {eve.answerYn === 1 ? 'O' : 'X'}
                        </TextWrap>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })
          : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pFont: {
    marginBottom: 0,
  },
  noData: {
    marginTop: heightPercentage(30),
    fontSize: fontPercentage(13),
    textAlign: 'center',
  },
  grayfont: {
    marginTop: heightPercentage(30),
    textAlign: 'center',
    fontSize: fontPercentage(10),
    color: '#999',
  },
  answerview: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginTop: heightPercentage(30),
    textAlign: 'center',
  },
  subanswerview: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: heightPercentage(10),
    textAlign: 'center',
    width: screenWidth * 0.9,
  },
  subanswerview2: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: heightPercentage(40),
    textAlign: 'center',
    width: screenWidth * 0.9,
  },
  answertab: {
    fontSize: fontPercentage(12),
    textAlign: 'left',
    marginRight: heightPercentage(5),
    color: '#000',
  },
  selecttab: {
    fontSize: fontPercentage(12),
    textAlign: 'left',
    marginRight: heightPercentage(5),
    color: '#0066ff',
  },
  extitle: {
    width: screenWidth * 0.7,
    marginTop: heightPercentage(30),
    left: widthPercentage(4),
    textAlign: 'left',
    fontSize: fontPercentage(14),
    fontWeight: 'bold',
  },
  extitless: {
    width: screenWidth * 0.9,
    marginTop: heightPercentage(30),
    textAlign: 'left',
    fontSize: fontPercentage(14),
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  extitle2: {
    width: screenWidth * 0.9,
    textAlign: 'left',
    fontSize: fontPercentage(14),
    bottom: heightPercentage(10),
    fontWeight: 'bold',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  extitle3: {
    width: screenWidth * 0.9,
    textAlign: 'left',
    marginTop: heightPercentage(30),
    fontSize: fontPercentage(14),
    fontWeight: 'bold',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  excontents: {
    width: screenWidth * 0.9,
    marginTop: heightPercentage(30),
    textAlign: 'left',
    fontSize: fontPercentage(14),
    alignSelf: 'center',
    marginBottom: heightPercentage(30),
  },
  quizdata: {
    flexDirection: 'row',
    width: screenWidth * 0.9,
    marginTop: heightPercentage(5),
    fontSize: fontPercentage(11),
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  recordopen: {
    flexDirection: 'row',
    width: screenWidth * 0.9,
    fontSize: fontPercentage(11),
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  quizdatasss: {
    backgroundColor: '#f2f2f2',
    width: screenWidth * 0.9,
    textAlign: 'left',
    fontSize: fontPercentage(12),
    alignSelf: 'center',
    borderRightWidth: 1,
    height: heightPercentage(30),
    textAlignVertical: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: Platform.OS === 'ios' ? heightPercentage(5) : 0,
  },
  quizdata2: {
    backgroundColor: '#f2f2f2',
    flex: 1,
    textAlign: 'center',
    fontSize: fontPercentage(12),
    alignSelf: 'center',
    borderRightWidth: 1,
    borderRightColor: '#c9c9c9',
    height: heightPercentage(30),
    textAlignVertical: 'center',
    paddingVertical: Platform.OS === 'ios' ? heightPercentage(5) : 0,
  },
  quizdata3: {
    backgroundColor: '#f2f2f2',
    flex: 3,
    textAlign: 'left',
    fontSize: fontPercentage(12),
    alignSelf: 'center',
    height: heightPercentage(30),
    textAlignVertical: 'center',
    paddingVertical: Platform.OS === 'ios' ? heightPercentage(5) : 0,
  },
  quizdata4: {
    backgroundColor: '#f2f2f2',
    flex: 2,
    textAlign: 'center',
    fontSize: fontPercentage(12),
    alignSelf: 'center',
    height: heightPercentage(30),
    textAlignVertical: 'center',
    paddingVertical: Platform.OS === 'ios' ? heightPercentage(5) : 0,
  },
  answernum: {
    backgroundColor: '#cdde95',
    width: (screenWidth * 0.9) / 5.02,
    textAlign: 'center',
    fontSize: fontPercentage(12),
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    height: heightPercentage(30),
    textAlignVertical: 'center',
    paddingVertical: Platform.OS === 'ios' ? heightPercentage(5) : 0,
  },
  answer: {
    backgroundColor: '#f2f2f2',
    width: (screenWidth * 0.9) / 5.02,
    textAlign: 'center',
    fontSize: fontPercentage(12),
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    height: heightPercentage(30),
    textAlignVertical: 'center',
    paddingVertical: Platform.OS === 'ios' ? heightPercentage(5) : 0,
  },
  onData: {
    textAlign: 'center',
    height: 'auto',
    borderWidth: 1,
    width: screenWidth * 0.9,
    alignSelf: 'center',
    fontSize: fontPercentage(12),
    textAlignVertical: 'center',
    alignItems: 'center',
  },
  noDatabtn: {
    marginTop: heightPercentage(30),
    textAlign: 'center',
    alignItems: 'center',
    width: screenWidth,
    height: heightPercentage(50),
  },
  noDatabtn2: {
    marginTop: heightPercentage(30),
    textAlign: 'center',
    alignItems: 'center',
    width: screenWidth,
    height: heightPercentage(50),
    marginBottom: 40,
  },
  btn: {
    marginTop: heightPercentage(30),
    textAlign: 'center',
    alignItems: 'center',
    width: screenWidth / 3.4,
    height: heightPercentage(50),
    marginBottom: 40,
  },
  img: {
    width: widthPercentage(100),
    height: heightPercentage(40),
    resizeMode: 'contain',
  },
  note: {
    width: widthPercentage(13),
    height: heightPercentage(18),
    resizeMode: 'stretch',
    marginTop: heightPercentage(31),
  },
  input: {
    color: colors.black,
  },
  inputValue: {
    fontFamily: fonts.kopubWorldDotumProMedium,
    fontSize: fontPercentage(12),
    height: 300,
    color: colors.black,
    textAlign: 'center',
    textAlignVertical: 'top',
  },
  inputValue2: {
    fontFamily: fonts.kopubWorldDotumProMedium,
    fontSize: fontPercentage(12),
    height: heightPercentage(55),
    color: colors.black,
    textAlign: 'left',
    borderBottomWidth: 0,
  },
  contentinputStyle: {
    color: colors.black,
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(24),
    display: 'flex',
    flexBasis: 300,
    flexShrink: 1,
    textAlign: 'left',
    textAlignVertical: 'top',
    top: heightPercentage(20),
    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',
    width: '90%',
    ...Platform.select({
      ios: {
        marginBottom: heightPercentage(70),
        height: heightPercentage(200),
      },
      android: {
        marginBottom: heightPercentage(20),
      },
    }),
  },
  inputStyle: {
    color: colors.black,
    fontSize: fontPercentage(12),
    display: 'flex',
    flexBasis: 300,
    flexShrink: 1,
    textAlign: 'left',
    textAlignVertical: 'top',
    top: heightPercentage(20),
    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',
    width: '90%',
    ...Platform.select({
      ios: {
        height: heightPercentage(50),
        marginBottom: heightPercentage(20),
      },
      android: {
        lineHeight: fontPercentage(24),
        marginBottom: heightPercentage(20),
      },
    }),
  },
  placeStyle: {
    color: colors.black,
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(24),
    display: 'flex',
    flexBasis: 300,
    flexShrink: 1,
    textAlign: 'center',
    top: heightPercentage(20),

    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',
    width: '90%',
    ...Platform.select({
      ios: {
        height: heightPercentage(200),
        marginBottom: heightPercentage(70),
      },
      android: {
        marginBottom: heightPercentage(20),
      },
    }),
  },
  inputStyle2: {
    color: colors.black,
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(24),
    display: 'flex',
    height: heightPercentage(40),
    textAlign: 'left',
    marginBottom: heightPercentage(20),
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    width: '90%',
  },
  inputStyle3: {
    color: colors.black,
    fontSize: fontPercentage(14),
    textAlign: 'left',
    justifyContent: 'center',
    marginBottom: heightPercentage(20),
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'black',
    width: screenWidth / 2,
    marginRight: widthPercentage(18),
    fontWeight: '300',
    height: heightPercentage(20),
    paddingVertical: 0,
  },
  inputValue3: {
    fontFamily: fonts.kopubWorldDotumProMedium,
    color: colors.black,
    fontSize: fontPercentage(13),
    textAlign: 'left',
    lineHeight: heightPercentage(8),
    fontWeight: '300',
  },
});
