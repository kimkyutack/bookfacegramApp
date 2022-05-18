import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import TextWrap from '../../../components/text-wrap/TextWrap';
import colors from '../../../libs/colors';
import consts from '../../../libs/consts';
import fonts from '../../../libs/fonts';
import images from '../../../libs/images';
import InputWrap2 from '../../../components/input-wrap/InputWrap';
import HTMLView from 'react-native-htmlview';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {requestGet, requestPost} from '../../../services/network';
import {
  formatTime,
  screenWidth,
  widthPercentage,
  heightPercentage,
  screenHeight,
  fontPercentage,
} from '../../../services/util';
import {
  dialogError,
  dialogOpenDrawerSelect,
} from '../../../redux/dialog/DialogActions';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {createIconSetFromFontello} from 'react-native-vector-icons';

export default function BookDetailQuiz({isbn}) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [bookQuiz, setBookQuiz] = useState([]);
  const [quizcreate, setQuizcreate] = useState(0);
  const [quizEnd, setQuizEnd] = useState(0);
  const [quizstart, setQuizstart] = useState(0);
  const [contents, setContents] = useState();
  const [subjm, setsubjm] = useState();
  const [subtype, setsubType] = useState(1);
  const [Answerno, setAnswerno] = useState(1);
  const [answer, setAnswer] = useState('');
  const [subanswer, setsubanswer] = useState();
  const [examnum, setExamnum] = useState(0);
  const [quizRecord, setQuizRecord] = useState([]);
  const [quizScore, setQuizScore] = useState([]);
  const [titlenum, setTitlenum] = useState(1);
  const [totAnswer, setTotAnswer] = useState([]);
  const [ans1, setans1] = useState();
  const [ans2, setans2] = useState();
  const [ans3, setans3] = useState();
  const [ans4, setans4] = useState();
  const [ans5, setans5] = useState();
  const radio_props = [
    {label: '단답형', value: 1},
    {label: '객관식', value: 2},
  ];
  const paths = [
    {path: '1번 정답의 보기를 입력해주세요.'},
    {path: '2번 정답의 보기를 입력해주세요.'},
    {path: '3번 정답의 보기를 입력해주세요.'},
    {path: '4번 정답의 보기를 입력해주세요.'},
    {path: '5번 정답의 보기를 입력해주세요.'},
  ];
  const subnum = [
    {label: '1번:', value: 1},
    {label: '2번:', value: 2},
    {label: '3번:', value: 3},
    {label: '4번:', value: 4},
    {label: '5번:', value: 5},
  ];
  const fetchRequested = async () => {
    try {
      setLoading(true);
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/book/quiz/' + isbn,
      });
      if (status === 'SUCCESS') {
        setBookQuiz(data.bookQuiz);
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
      const {data, status} = await requestPost({
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

  const next = () => {
    //console.log(totAnswer);
    if (titlenum !== bookQuiz.length) {
      if (totAnswer.length !== 0) {
        if (
          totAnswer[examnum] &&
          totAnswer[examnum] !== answer &&
          answer === ''
        ) {
        } else {
          totAnswer[examnum] = answer;
        }
      } else {
        setTotAnswer([answer]);
      }

      setExamnum(examnum + 1);
      setTitlenum(titlenum + 1);
      setAnswer('');
    } else {
      setTotAnswer(totAnswer => [...totAnswer, answer]);
      setQuizEnd(1);
      //quizRequested();
    }
  };

  const prev = () => {
    if (examnum !== 0) {
      setExamnum(examnum - 1);
      setTitlenum(titlenum - 1);
      setAnswer('');
    } else {
      setTotAnswer([]);
      setQuizstart(0);
    }
  };

  useEffect(() => {
    let mount = true;
    if (mount && isbn) {
      fetchRequested();
    }
    return () => {
      mount = false;
    };
  }, [isbn, isbn !== 0]);

  useEffect(() => {
    if (totAnswer.length === bookQuiz.length && bookQuiz.length !== 0) {
      quizRequested();
    }
    return () => {};
  }, [totAnswer]);

  useEffect(() => {
    //console.log(examnum);
  }, [examnum]);

  return loading ? (
    <ActivityIndicator
      size="large"
      style={{alignSelf: 'center', marginTop: 60}}
      color={colors.blue}
    />
  ) : bookQuiz.length === 0 && quizcreate === 0 ? (
    <View>
      <TextWrap style={styles.noData} font={fonts.kopubWorldDotumProLight}>
        해당 도서는 퀴즈가 없습니다.{'\n'}직접 출제 하시려면 출제 버튼을
        눌러주세요.
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
              labelWrapStyle={{marginRight: 20}}
            />
          </RadioButton>
        ))}
      </RadioForm>
      <TextWrap style={styles.noData} font={fonts.kopubWorldDotumProLight}>
        문제
      </TextWrap>
      <TextInput
        style={styles.inputStyle}
        inputStyle={styles.inputValue}
        value={contents}
        multiline={true}
        numberOfLines={10}
        onChangeText={eve => {
          setContents(eve);
        }}
        maxLength={200}
        placeholder="문제를 입력해주세요."
        placeholderTextColor="#acacac"
      />
      <TextWrap style={styles.noData} font={fonts.kopubWorldDotumProLight}>
        예문
      </TextWrap>
      <TextInput
        style={styles.inputStyle}
        inputStyle={styles.inputValue}
        value={subjm}
        multiline={true}
        numberOfLines={10}
        onChangeText={eve => {
          setsubjm(eve);
        }}
        maxLength={200}
        placeholder="문제의 예문을 입력해주세요."
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
            단답형 정답
          </TextWrap>
          <InputWrap2
            style={styles.inputStyle2}
            inputStyle={styles.inputValue2}
            value={subanswer}
            onChange={eve => {
              setsubanswer(eve);
            }}
            maxLength={30}
            placeholder="정답을 입력해주세요."
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
            객관식 보기
          </TextWrap>
          {paths.map((path, index) => {
            return (
              <TextInput
                style={styles.inputStyle}
                inputStyle={styles.inputValue}
                value={subjm}
                multiline={false}
                numberOfLines={1}
                onChangeText={eve => {
                  index === 1
                    ? setans1(eve)
                    : index === 2
                    ? setans2(eve)
                    : index === 3
                    ? setans3(eve)
                    : index === 4
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
                      setAnswerno(value);
                    }}
                    labelStyle={{
                      fontSize: fontPercentage(12),
                      height: screenHeight / 22,
                      bottom: heightPercentage(3),
                      lineHeight: screenHeight / 39,
                    }}
                    labelWrapStyle={{marginRight: 5, marginLeft: 20}}
                  />
                  <RadioButtonInput
                    obj={num}
                    index={i}
                    isSelected={Answerno}
                    onPress={value => {
                      setAnswerno(value);
                    }}
                    borderWidth={widthPercentage(0.3)}
                    buttonInnerColor={Answerno === i + 1 ? '#0077ff' : '#fff'}
                    buttonOuterColor={'#000'}
                    buttonSize={screenWidth / 80}
                    buttonOuterSize={screenWidth / 40}
                    buttonStyle={{}}
                    buttonWrapStyle={{top: heightPercentage(3)}}
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
          alert('제작중');
        }}>
        <Image source={images.submit_btn} style={styles.img} />
      </TouchableOpacity>
    </View>
  ) : bookQuiz.length !== 0 && quizstart === 1 && quizEnd === 0 ? (
    <View>
      <TextWrap style={styles.extitle} font={fonts.kopubWorldDotumProLight}>
        Q{titlenum}.
      </TextWrap>
      <TextWrap style={styles.excontents} font={fonts.kopubWorldDotumProLight}>
        {bookQuiz[examnum].exam}
      </TextWrap>
      {bookQuiz[examnum].subjYn === 'S' ? (
        <View style={styles.onData}>
          <HTMLView
            stylesheet={styles.onData}
            value={bookQuiz[examnum].subJimun}
          />
        </View>
      ) : null}
      {bookQuiz[examnum].subjYn === 'S' ? (
        <View style={styles.answerview}>
          <TextWrap
            style={styles.answertab}
            font={fonts.kopubWorldDotumProLight}>
            정답 :
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
        bookQuiz[examnum].instances.map(quiz => {
          return (
            <View key={quiz.instance} style={styles.subanswerview}>
              <TouchableOpacity
                onPress={() => {
                  setAnswer(quiz.instanceNum);
                }}>
                <TextWrap
                  style={
                    answer === quiz.instanceNum
                      ? styles.selecttab
                      : totAnswer.length >= titlenum &&
                        totAnswer[examnum] === quiz.instanceNum &&
                        answer.length === 0
                      ? styles.selecttab
                      : styles.answertab
                  }
                  font={fonts.kopubWorldDotumProLight}>
                  {quiz.instanceNum}) {quiz.instance}
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
      <TextWrap style={styles.extitle} font={fonts.kopubWorldDotumProLight}>
        도전결과
      </TextWrap>
      {quizScore.length !== 0 ? (
        <View style={styles.quizdata}>
          <TextWrap
            style={styles.quizdata2}
            font={fonts.kopubWorldDotumProLight}>
            {quizScore[0].avgScore}점
          </TextWrap>
          <TextWrap
            style={styles.quizdata3}
            font={fonts.kopubWorldDotumProLight}>
            {quizScore[0].avgScore < 70 ? '한번 더 도전' : '성공'}
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
          marginTop: heightPercentage(20),
          width: screenWidth * 0.9,
          alignItems: 'center',
          justifyContent: 'flex-start',
          alignSelf: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {quizRecord.length !== 0
          ? quizRecord.map(data => {
              return data.examNum % 5 === 0 ? (
                <View key={data.examNum}>
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
                <View key={data.examNum}>
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
            setTitlenum(1);
            setExamnum(0);
          }}>
          <Image source={images.check} style={styles.img} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setQuizstart(1);
            setQuizEnd(0);
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
          setQuizstart(1);
        }}>
        <Image source={images.quiz_btn} style={styles.img} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  noData: {
    marginTop: heightPercentage(30),
    textAlign: 'center',
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
  answertab: {
    fontSize: fontPercentage(13),
    textAlign: 'center',
    marginTop: heightPercentage(5),
    marginRight: heightPercentage(5),
    color: '#000',
  },
  selecttab: {
    fontSize: fontPercentage(13),
    textAlign: 'center',
    marginTop: heightPercentage(5),
    marginRight: heightPercentage(5),
    color: '#0066ff',
  },
  extitle: {
    width: screenWidth * 0.9,
    marginTop: heightPercentage(30),
    textAlign: 'left',
    fontSize: fontPercentage(14),
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  excontents: {
    width: screenWidth * 0.9,
    marginTop: heightPercentage(30),
    textAlign: 'left',
    fontSize: fontPercentage(11),
    alignSelf: 'center',
    marginBottom: heightPercentage(30),
  },
  quizdata: {
    flexDirection: 'row',
    width: screenWidth * 0.9,
    marginTop: heightPercentage(20),
    fontSize: fontPercentage(11),
    alignSelf: 'center',
  },
  quizdata2: {
    backgroundColor: '#f2f2f2',
    flex: 1,
    textAlign: 'left',
    fontSize: fontPercentage(12),
    alignSelf: 'center',
    borderRightWidth: 1,
    height: heightPercentage(30),
    textAlignVertical: 'center',
  },
  quizdata3: {
    backgroundColor: '#f2f2f2',
    flex: 3,
    textAlign: 'left',
    fontSize: fontPercentage(12),
    alignSelf: 'center',
    height: heightPercentage(30),
    textAlignVertical: 'center',
  },
  quizdata4: {
    backgroundColor: '#f2f2f2',
    flex: 2,
    textAlign: 'center',
    fontSize: fontPercentage(12),
    alignSelf: 'center',
    height: heightPercentage(30),
    textAlignVertical: 'center',
  },
  answernum: {
    backgroundColor: '#cdde95',
    width: (screenWidth * 0.9) / 5,
    textAlign: 'center',
    fontSize: fontPercentage(12),
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    height: heightPercentage(30),
    textAlignVertical: 'center',
  },
  answer: {
    backgroundColor: '#f2f2f2',
    width: (screenWidth * 0.9) / 5,
    textAlign: 'center',
    fontSize: fontPercentage(12),
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    height: heightPercentage(30),
    textAlignVertical: 'center',
  },
  onData: {
    marginTop: heightPercentage(20),
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
    color: colors.black,
    textAlign: 'left',
  },
  inputStyle: {
    color: colors.black,
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(24),
    display: 'flex',
    flexBasis: 300,
    flexShrink: 1,
    textAlign: 'center',
    top: heightPercentage(20),
    marginBottom: heightPercentage(20),
    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',
    width: '90%',
  },
  inputStyle2: {
    color: colors.black,
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(24),
    display: 'flex',
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
    height: heightPercentage(30),
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
