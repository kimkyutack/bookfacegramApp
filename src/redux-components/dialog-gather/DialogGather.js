import React, {useEffect} from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  View,
  Image,
  Pressable,
  Text
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import {
  dialogClose,
  dialogOpenAction,
  dialogOpenDrawerKeyBoard,
  dialogError,
} from '../../redux/dialog/DialogActions';
import images from '../../libs/images';
import routes from '../../libs/routes';
import {
  fontPercentage,
  heightPercentage,
  screenHeight,
  screenWidth,
  widthPercentage,
} from '../../services/util';
import {goBack, navigate} from '../../services/navigation';
import {requestPut, requestPost} from '../../services/network';
import { useState } from 'react';

export default function DialogGather({}) {
  const dispatch = useDispatch();
  const {gatherDialog} = useSelector(s => s.dialog);
  const [open, setOpen] = useState(true);
  const [subopen, setSubOpen] = useState(false);
  const [gatheringcode, setGatheringcode] = useState('');
  const [shinchung, setShinchung] = useState(false);

  useEffect(() => {
    if (gatherDialog.open) {
      setShinchung(false);
      setOpen(true);
      setSubOpen(false);
      setGatheringcode('');
      Keyboard.dismiss();
    }
    return () => {
      setShinchung(false);
      setOpen(true);
      setSubOpen(false);
      setGatheringcode('');
    };
  }, [gatherDialog.open]);


  if (!gatherDialog.open) {
    return null;
  }

  const onPress = x => {
    dispatch(dialogClose());
  };

  return (
    <SafeAreaView style={shinchung ? styles.shinroot : styles.root}>
      <TouchableOpacity
        style={styles.wrap}
        onPress={() => dispatch(dialogClose())}>
        <TouchableWithoutFeedback
          onPress={() => {
            return;
          }}>
          {!shinchung && gatheringcode == '' ? (
          <View
            style={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              backgroundColor: colors.white,
              height: heightPercentage(250),
              alignItems: 'center',
            }}>
              <View
              style={{
                width: widthPercentage(31),
                borderBottomColor: '#c2c2c2',
                borderRadius: 3,
                borderBottomWidth: 4,
                position: 'absolute',
                top: 8,
                alignSelf: 'center',
              }}
            />
            <TextWrap
              style={styles.inputTitle}
              font={fonts.kopubWorldDotumProBold}>
              필수옵션
            </TextWrap>
            <View style={styles.selectbox}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  width: screenWidth,
                }}>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => {
                    setOpen(!open);
                  }}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.message}>
                    선택
                  </TextWrap>
                  <Image source={open ? images.angleUp : images.angleDown} style={styles.arrowimg}/>
                </TouchableOpacity>
                {open ? (
                <TouchableOpacity
                  style={gatheringcode !== 1111 ? styles.dataContainer : styles.dataselectContainer}
                  onPress={() => {
                    if(gatheringcode != 1111){
                      setGatheringcode(1111); //모임코드 입력
                    }else{
                      setGatheringcode(''); //모임코드 초기화
                    }
                  }}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={gatheringcode !== 1111 ? styles.message2 : styles.selectmessage}>
                    2022.11.05(토) | 10:00AM
                    {'\n'}모임명A
                  </TextWrap>
                </TouchableOpacity>
                ) : null}
              </ScrollView>
            </View>
            <View style={styles.button}>
                <Pressable style={styles.buttons} onPress={() => {
                    if(gatheringcode != ''){
                      setShinchung(true)
                    }else{
                        dispatch(dialogError('필수옵션을 선택해주세요.'))
                    }
                  }
                }>
                  <Text style={styles.text}>신청하기</Text>
                </Pressable>
            </View>
          </View>
          ) : !shinchung && gatheringcode != '' ? (
            <View
            style={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              backgroundColor: colors.white,
              height: heightPercentage(400),
              alignItems: 'center',
            }}>
              <View
              style={{
                width: widthPercentage(31),
                borderBottomColor: '#c2c2c2',
                borderRadius: 3,
                borderBottomWidth: 4,
                position: 'absolute',
                top: 8,
                alignSelf: 'center',
              }}
            />
            <TextWrap
              style={styles.inputTitle}
              font={fonts.kopubWorldDotumProBold}>
              필수옵션
            </TextWrap>
            <View style={styles.selectbox2}>
              
                <TouchableOpacity
                  style={styles.iconContainer2}
                  onPress={() => {
                    setSubOpen(!subopen);
                  }}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.message}>
                    선택
                  </TextWrap>
                  <Image source={subopen ? images.angleUp : images.angleDown} style={styles.arrowimg}/>
                </TouchableOpacity>
                {subopen ? (
                <TouchableOpacity
                  style={styles.subdataContainer}
                  onPress={() => {
                    if(gatheringcode != 1111){
                      setGatheringcode(1111); //모임코드 입력
                    }else{
                      setGatheringcode(''); //모임코드 초기화
                    }
                  }}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.message2}>
                    2022.11.05(토) | 10:00AM
                    {'\n'}모임명A
                  </TextWrap>
                </TouchableOpacity>
                ) : null}
                <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  width: screenWidth*0.9,
                  backgroundColor:'#F4F3F3',
                  marginTop:heightPercentage(15)
                }}>
                <View style={styles.priceContainer}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.message3}>
                    2022.11.05(토) | 10:00AM
                    {'\n'}모임명A
                  </TextWrap>
                  
                  <TouchableOpacity
                    style={styles.closebtn}
                    onPress={() => {
                      if(gatheringcode != 1111){
                        setGatheringcode(1111); //모임코드 입력
                      }else{
                        setGatheringcode(''); //모임코드  초기화
                      }
                    }}>
                    <Image source={images.del} style={styles.closebtn}/>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.price}
                  onPress={() => {
                    if(gatheringcode != 1111){
                      setGatheringcode(1111); //모임코드 입력
                    }else{
                      setGatheringcode(''); //모임코드  초기화
                    }
                  }}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.pricemessage}>
                    10,000원
                  </TextWrap>
                </TouchableOpacity>
              </ScrollView>
              <View style={styles.totalContent}>
                <TextWrap
                  font={fonts.kopubWorldDotumProMedium}
                  style={styles.totalmessage}>
                  총 상품금액(1개)     10,000원
                </TextWrap>
              </View>
            </View>
            <View style={styles.totalbutton}>
                <Pressable style={styles.buttons} onPress={() => setShinchung(true)}>
                  <Text style={styles.text}>신청하기</Text>
                </Pressable>
            </View>
          </View>
          ) : (
            <View
            style={{
              backgroundColor: colors.white,
              height: screenHeight * 0.76,
              alignItems: 'center',
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                width: screenWidth,
              }}>
            <View style={styles.shinbox}>
            <TextWrap
              style={styles.shinTitle}
              font={fonts.kopubWorldDotumProBold}>
              신청 독서모임 정보
            </TextWrap>
            <View style={styles.shininfo}>
                <View style={styles.shinContainer}>
                  <Image source={images.noMybooks} style={styles.thumbnail}/>
                  <View style={{flexDirection:'column'}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont2}>
                    모임명A
                  </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont}>
                    [선택] 2022.11.05(토) | 10:00AM | 모임명A{'\n'}
                    [신청수량] 1개
                  </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont2}>
                    10,000원
                  </TextWrap>
                  </View>
                </View>
            </View>
            </View>
            <View style={styles.shinbox}>
            <TextWrap
              style={styles.shinTitle}
              font={fonts.kopubWorldDotumProBold}>
              참여자 정보
            </TextWrap>
            <View style={styles.shininfo}>
                <View style={styles.shinContainer}>
                  <Image source={images.noMybooks} style={styles.thumbnail}/>
                  <View style={{flexDirection:'column'}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont2}>
                    모임명A
                  </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont}>
                    [선택] 2022.11.05(토) | 10:00AM | 모임명A{'\n'}
                    [신청수량] 1개
                  </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont2}>
                    10,000원
                  </TextWrap>
                  </View>
                </View>
            </View>
            </View>
            <View style={styles.shinbox}>
            <TextWrap
              style={styles.shinTitle}
              font={fonts.kopubWorldDotumProBold}>
              신청요약
            </TextWrap>
            <View style={styles.shininfo}>
                <View style={styles.shinContainer}>
                  <Image source={images.noMybooks} style={styles.thumbnail}/>
                  <View style={{flexDirection:'column'}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont2}>
                    모임명A
                  </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont}>
                    [선택] 2022.11.05(토) | 10:00AM | 모임명A{'\n'}
                    [신청수량] 1개
                  </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont2}>
                    10,000원
                  </TextWrap>
                  </View>
                </View>
            </View>
            </View>
            <View style={styles.shinbox}>
            <TextWrap
              style={styles.shinTitle}
              font={fonts.kopubWorldDotumProBold}>
              결제수단
            </TextWrap>
            <View style={styles.shininfo}>
                <View style={styles.shinContainer}>
                  <Image source={images.noMybooks} style={styles.thumbnail}/>
                  <View style={{flexDirection:'column'}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont2}>
                    모임명A
                  </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont}>
                    [선택] 2022.11.05(토) | 10:00AM | 모임명A{'\n'}
                    [신청수량] 1개
                  </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont2}>
                    10,000원
                  </TextWrap>
                  </View>
                </View>
            </View>
            </View>
            <View style={styles.totalsbutton}>
                <Pressable style={styles.buttons} onPress={() => {
                    if(gatheringcode != ''){
                      setShinchung(true)
                    }else{
                        dispatch(dialogError('필수옵션을 선택해주세요.'))
                    }
                  }
                }>
                  <Text style={styles.text}>신청하기</Text>
                </Pressable>
            </View>
          </ScrollView>
          </View>
          )}

        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root2: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    color: '#999',

    // paddingTop: '40%',
  },
  nodata: {
    width: screenWidth / 10,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  text: {
    fontSize: fontPercentage(14),
    lineHeight: fontPercentage(21),
    color: '#999',
  },
  shinbox: {
    flex:1,
    alignSelf: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor:'#F4F3F3'
  },
  shininfo: {
    height:'100%',
    width: '100%',
    alignSelf: 'center',
    alignItems:'center',
    justifyContent: 'center',
  },
  selectbox: {
    height:'50%',
    width: '93%',
    marginBottom:heightPercentage(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectbox2: {
    height:'65%',
    width: '93%',
    marginBottom:heightPercentage(19),
    alignItems: 'center',
    justifyContent: 'center',
  },
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    bottom: 30,
    zIndex: 5,
  },
  shinroot: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 30,
    zIndex: 5,
  },
  wrap: {flex: 1, justifyContent: 'flex-end'},
  shinTitle: {
    width:'100%',
    fontSize: fontPercentage(16),
    color: '#3F3F3F',
    fontWeight:'bold',
    marginTop: heightPercentage(35),
    textAlign:'left'
  },
  inputTitle: {
    width:'90%',
    fontSize: fontPercentage(14),
    color: '#3F3F3F',
    fontWeight:'bold',
    marginTop: heightPercentage(35),
    marginBottom: heightPercentage(5),
    textAlign:'left'
  },
  inputTitle2: {
    fontSize: fontPercentage(10),
    color: '#707070',
  },
  shinfont: {
    fontSize: fontPercentage(11),
    marginTop:heightPercentage(20),
    marginBottom:heightPercentage(20),
    color: '#333333',
    width:'100%',
    alignSelf:'center',
    textAlign:'left',
    fontWeight:'normal'
  },
  shinfont2: {
    fontSize: fontPercentage(13),
    color: '#333333',
    width:'100%',
    alignSelf:'center',
    textAlign:'left',
    fontWeight:'bold'
  },
  message: {
    fontSize: fontPercentage(14),
    color: '#333333',
    width:'88%',
    alignSelf:'center',
    textAlign:'left',
    fontWeight:'bold'
  },
  message2: {
    fontSize: fontPercentage(14),
    color: '#333333',
    width:'95%',
    alignSelf:'center',
    textAlign:'left',
    fontWeight:'bold'
  },
  message3: {
    fontSize: fontPercentage(14),
    color: '#333333',
    width:'98%',
    alignSelf:'center',
    textAlign:'left',
    fontWeight:'bold'
  },
  pricemessage: {
    fontSize: fontPercentage(14),
    color: '#333333',
    width:'100%',
    alignSelf:'center',
    textAlign:'right',
    fontWeight:'bold'
  },
  totalContent: {
    width:'95%',
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center',
    height:heightPercentage(30),
    top:'8%'
  },
  totalmessage: {
    width:'95%',
    fontSize: fontPercentage(16),
    color: '#333333',
    textAlign:'right',
    fontWeight:'normal',
  },
  selectmessage: {
    fontSize: fontPercentage(14),
    color: 'white',
    width:'95%',
    alignSelf:'center',
    textAlign:'left',
    fontWeight:'bold'
  },
  price: {
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent:'center',
    marginTop:0,
    width: '90%',
    height:heightPercentage(70),
    borderWidth:0,
  },
  closebtn: {
    alignSelf: 'center',
    justifyContent:'center',
    width:widthPercentage(20),
    height:heightPercentage(20),
    right:'5%',
    resizeMode:'contain'
  },
  shinContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent:'center',
    flexDirection:'row',
    width:'100%',
    flex:1
  },
  priceContainer: {
    alignSelf: 'center',
    flexDirection:'row',
    alignItems: 'flex-start',
    justifyContent:'center',
    marginTop:heightPercentage(10),
    width: '90%',
    height:heightPercentage(70),
    borderBottomWidth:1,
    borderBottomColor: '#ddd'
  },
  iconContainer: {
    marginTop:'1%',
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent:'center',
    flexDirection:'row',
    width: '90%',
    height:heightPercentage(45),
    borderWidth:0.5,
    borderColor: '#3F3F3F',
  },
  iconContainer2: {
    marginTop:'1%',
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent:'center',
    flexDirection:'row',
    width: screenWidth * 0.9,
    height:heightPercentage(45),
    borderWidth:0.5,
    borderColor: '#ddd',
  },
  dataContainer: {
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent:'center',
    width: '90%',
    height:heightPercentage(70),
    borderWidth:0.5,
    borderTopWidth:0,
    borderColor: '#3F3F3F',
  },
  subdataContainer: {
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent:'center',
    width: screenWidth * 0.9,
    height:heightPercentage(70),
    borderWidth:0.5,
    borderTopWidth:0,
    borderColor: '#ddd',
  },
  dataselectContainer: {
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent:'center',
    width: '90%',
    height:heightPercentage(70),
    borderWidth:0.5,
    borderTopWidth:0,
    borderColor: '#3F3F3F',
    backgroundColor: '#3F3F3F',
  },
  thumbnail:{
    width:widthPercentage(120),
    height:heightPercentage(120),
    alignSelf:'center',
    justifyContent:'center',
    resizeMode:'stretch',
    right:'2%'
  },
  arrowimg:{
    width:widthPercentage(25),
    height:heightPercentage(15),
    alignSelf:'center',
    resizeMode:'stretch'
  },
  delete: {
    width: widthPercentage(14),
    height: heightPercentage(14),
    resizeMode: 'contain',
  },
  add: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'contain',
  },
  inputContainer: {
    backgroundColor: colors.white,
    alignContent: 'center',
    alignItems: 'center',
    height: heightPercentage(206),
  },
  totalbutton: {
    width: '90%',
    bottom: 0,
    position:'absolute',
    ...Platform.select({
      ios: {
        backgroundColor: 'black',
      }
  }),
  },
  totalsbutton: {
    width: '90%',
    alignSelf:'center',
    justifyContent:'center',
    bottom: 0,
    marginTop:heightPercentage(40),
    ...Platform.select({
      ios: {
        backgroundColor: 'black',
      }
  }),
  },
  button: {
    width: '90%',
    bottom: 0,
    position:'absolute',
    ...Platform.select({
      ios: {
        backgroundColor: 'black',
      }
  }),
  },
  buttons: {
    paddingVertical:heightPercentage(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3F3F3F',
  },
  text: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(13),
    fontWeight: 'bold',
    ...Platform.select({
      android: {
        color: 'white',
      },
      ios: {
        color: 'black',
      }
  }),
  },
});
