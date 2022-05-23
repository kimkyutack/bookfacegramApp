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
  console.log(contents.length);
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
        setAnswer('');
        if(totAnswer.length > examnum){
          setAnswer(totAnswer[examnum+1]);
        }
      } else {
        setTotAnswer([answer]);
        setAnswer('');
      }

      setExamnum(examnum + 1);
      setTitlenum(titlenum + 1);
      
    } else {
      setTotAnswer(totAnswer => [...totAnswer, answer]);
      setQuizEnd(1);
      //quizRequested();
    }
  };

  const prev = () => {
    if (examnum !== 0) {
      if(totAnswer[examnum-1]){
        setAnswer(totAnswer[examnum-1]);
      }else{
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
    return () => {};
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
        style={contents.length !== 0 ? styles.inputStyle : styles.placeStyle}
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
        style={subjm.length !== 0 ? styles.inputStyle : styles.placeStyle}
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
                key={index}
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
                    labelWrapStyle={{marginRight: widthPercentage(8), marginLeft: widthPercentage(10), right:widthPercentage(8)}}
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
                    buttonWrapStyle={{top: heightPercentage(3), right:widthPercentage(10)}}
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
    <View style={{width:screenWidth}}>
      <TextWrap style={styles.extitless} font={fonts.kopubWorldDotumProLight}>
        Q{titlenum}.
      </TextWrap>
      <TextWrap style={styles.excontents} font={fonts.kopubWorldDotumProLight}>
        {bookQuiz[examnum].exam}
      </TextWrap>
      {bookQuiz[examnum].subjYn === 'S' && bookQuiz[examnum].subJimun.length > 1 ? (
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
        bookQuiz[examnum].instances.map((quiz,index) => {
          return (
            <View key={index * page+ 600} style={styles.subanswerview}>
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
      <View style={styles.extitle2} >
      <Image source={images.note_icon} style={styles.note} />
      <TextWrap style={styles.extitle} font={fonts.kopubWorldDotumProLight}>
        도전결과
      </TextWrap>
      </View>
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
            {quizScore[0].avgScore < 70 ? '  한번 더 도전' : '  성공'}
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
          ? quizRecord.map((data,index) => {
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
          setQuizstart(1);
        }}>
        <Image source={images.quiz_btn} style={styles.img} />
      </TouchableOpacity>
        {totRecord.length !== 0 ? (
          <View style={styles.extitle2} >
         <Image source={images.note_icon} style={styles.note} />
          <TextWrap style={styles.extitle} font={fonts.kopubWorldDotumProLight}>
            도전결과
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
                        {totRecord[index].avgScore}점
                    </TextWrap>
                    <TextWrap
                      style={styles.quizdata3}
                      font={fonts.kopubWorldDotumProLight}>
                      {totRecord[index].avgScore < 70 ? '  한번 더 도전' : '  성공'}
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
    fontSize: fontPercentage(12),
    textAlign: 'center',
    marginRight: heightPercentage(5),
    color: '#000',
  },
  selecttab: {
    fontSize: fontPercentage(12),
    textAlign: 'center',
    marginRight: heightPercentage(5),
    color: '#0066ff',
  },
  extitle: {
    width: screenWidth * 0.7,
    marginTop: heightPercentage(30),
    left:widthPercentage(4),
    textAlign: 'left',
    fontSize: fontPercentage(14),
    fontWeight: 'bold',
  },
  extitless: {
    width: screenWidth * 0.9,
    marginTop: heightPercentage(30),
    textAlign: 'left',
    fontSize: fontPercentage(14),
    alignSelf:'center',
    fontWeight: 'bold',
  },
  extitle2: {
    width: screenWidth * 0.9,
    marginTop: heightPercentage(30),
    textAlign: 'left',
    fontSize: fontPercentage(14),
    fontWeight: 'bold',
    alignSelf: 'center',
    flexDirection:'row',
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
    width: (screenWidth * 0.9) / 5.02,
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
    width: (screenWidth * 0.9) / 5.02,
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
  note: {
    width: widthPercentage(13),
    height: heightPercentage(20),
    resizeMode: 'stretch',
    marginTop: heightPercentage(30),
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
    textAlign: 'left',
    textAlignVertical:'top',
    top: heightPercentage(20),
    marginBottom: heightPercentage(20),
    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',
    width: '90%',
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
