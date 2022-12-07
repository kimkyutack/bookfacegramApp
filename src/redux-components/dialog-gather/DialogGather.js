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
  Text,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import {
  dialogClose,
  dialogCloseMessage,
  dialogError,
} from '../../redux/dialog/DialogActions';
import images from '../../libs/images';
import {
  fontPercentage,
  heightPercentage,
  screenHeight,
  screenWidth,
  widthPercentage,
} from '../../services/util';
import { useState } from 'react';
import { requestGet, requestPost } from '../../services/network';
import consts from '../../libs/consts';
import InputWrap from '../../components/input-wrap/InputWrap';
import CheckBox2 from '../../components/check-box2/CheckBox2';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { navigate } from '../../services/navigation';
import routes from '../../libs/routes';
import { setShowInfo } from '../../redux/activity/ActivityAction';
import { useRef } from 'react';

export default function DialogGather({}) {
  const dispatch = useDispatch();
  const {gatherDialog} = useSelector(s => s.dialog);
  const [open, setOpen] = useState(true);
  const [subopen, setSubOpen] = useState(false);
  const [gatheringcode, setGatheringcode] = useState('');
  const [shinchung, setShinchung] = useState(false);
  const [pay, setPay] = useState(false);
  const [optionData, setOption] = useState([]);
  const [selectOption, setSelectOption] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const user = useSelector(s => s.user, shallowEqual);
  
  const [min1, setMin1] = useState(user?.handphone ? user.handphone.substring(0,3) : '');
  const [min2, setMin2] = useState(user?.handphone ? user.handphone.substring(3,7) : '');
  const [min3, setMin3] = useState(user?.handphone ? user.handphone.substring(7,11) : '');
  const [email1, setEmail1] = useState(user?.email ? user.email.split('@')[0] : '');
  const [email2, setEmail2] = useState(user?.email ? user.email.split('@')[1] : '');
  const [agree, setAgree] = useState(false);
  const [totalcode, setTotalcode] = useState([]);
  const [applySuccess, setApplySuccess] = useState(false);
  const [ordernum, setOrdernum] = useState(0);
  const [erroropen, setErroropen] = useState(false);
  const [errorselect, setErrorselect] = useState(false);
  const [sucpay, setSucpay] = useState(false);
  const scrollRef = useRef();
  const radio_props = [
    {label: '신용카드', value: 'card'},
  ];
  
  const dayOfWeek = (wantdate) => {
    let week = ['일', '월', '화', '수', '목', '금', '토'];
    let day = week[new Date(wantdate).getDay()];
    return day;
}	

  //해당 모임별 데이터 가져오기
  const fetchRequested = async () => {
    try {
      const { data, status } = await requestGet({
        url: consts.apiUrl + '/village/member/option',
        query: {
          num: gatherDialog.num,
        },
      });
      if (status === 'SUCCESS') {
        setOption([...data]);
      }
      return status;
    } catch (error) {
      dispatch(dialogError(error));
    }
  };
    
   //무료 독서모임 신청
  const freeRequested = async () => {
      const formData = new FormData();

      formData.append('TId', '무료');
      formData.append('gatheringCode',totalcode.join('|'));
      formData.append('mail', email1 + '@' + email2);
      formData.append('paymentMethod','카드');
      formData.append('paymentName', '무료');
      formData.append('paymentNumber','0000-0000-0000-0000');
      formData.append('price', totalPrice);
      formData.append('tel',min1 + '-' +  min2 + '-' + min3);
      formData.append('userId', user?.member_id ? user?.member_id : user?.memberId);
      formData.append('userName',user?.kor_nm ? user?.kor_nm : user?.korNm);
      
    try {
      const { data, status } = await requestPost({
        url: consts.apiUrl + '/village/member/order',
        body: formData
      });
      if (status === 'SUCCESS') {
        setOrdernum(data);
        setApplySuccess(true);
        setSucpay(true);
      }
    } catch (error) {
      dispatch(dialogClose());
      dispatch(dialogError(error), dialogCloseMessage());
    }
  };

  useEffect(() => {
    if (gatherDialog.open) {
      setMin1(user?.handphone ? user.handphone.substring(0,3) : '');
      setMin2(user?.handphone ? user.handphone.substring(3,7) : '');
      setMin3(user?.handphone ? user.handphone.substring(7,11) : '');
      setEmail1(user?.email ? user.email.split('@')[0] : '');
      setEmail2(user?.email ? user.email.split('@')[1] : '');
      fetchRequested();
      setShinchung(false);
      setOpen(true);
      setOrdernum(0);
      setPay(false);
      setErrorselect(false);
      setSubOpen(false);
      setApplySuccess(false);
      setSucpay(false);
      setGatheringcode('');
      setSelectOption([]);
      setTotalPrice(0);
      setAgree(false);
      setTotalcode([]);
      setErroropen(false);
      Keyboard.dismiss();
    }
    return () => {
      setMin1(user?.handphone ? user.handphone.substring(0,3) : '');
      setMin2(user?.handphone ? user.handphone.substring(3,7) : '');
      setMin3(user?.handphone ? user.handphone.substring(7,11) : '');
      setEmail1(user?.email ? user.email.split('@')[0] : '');
      setEmail2(user?.email ? user.email.split('@')[1] : '');
      setOption([]);
      setShinchung(false);
      setOpen(true);
      setPay(false);
      setSubOpen(false);
      setOrdernum(0);
      setApplySuccess(false);
      setSelectOption([]);
      setSucpay(false);
      setErrorselect(false);
      setTotalPrice(0);
      setTotalcode([]);
      setErroropen(false);
      setGatheringcode('');
      setAgree(false);
    };
  }, [gatherDialog.open]);


  useEffect(() => {
    setMin1(user?.handphone ? user.handphone.substring(0,3) : '');
    setMin2(user?.handphone ? user.handphone.substring(3,7) : '');
    setMin3(user?.handphone ? user.handphone.substring(7,11) : '');
    setEmail1(user?.email ? user.email.split('@')[0] : '');
    setEmail2(user?.email ? user.email.split('@')[1] : '');
  },[user?.handphone]);

  if (!gatherDialog.open) {
    return null;
  }

  return (
    <SafeAreaView style={shinchung ? styles.shinroot : styles.root}>
       {erroropen ? (
                <View style={styles.rooterr}>
                  <View style={styles.wraperr}>
                    <View style={styles.dialogerr}>
                      <TextWrap
                        style={[
                          styles.message2err,
                          {
                            marginTop: 33,
                            fontWeight: 'bold',
                          },
                        ]}>
                        알림
                      </TextWrap>
                      <TextWrap style={[styles.messageerr]}>이미 선택한 옵션입니다.</TextWrap>
                      <View style={styles.row2err}>
                          <View style={{flex:1}}>
                          </View>
                      <TouchableOpacity
                        style={styles.buttonerr}
                        onPress={() => {
                            setErroropen(false);
                        }}>
                        <TextWrap
                          font={fonts.kopubWorldDotumProMedium}
                          style={styles.titleerr}>
                          닫기
                        </TextWrap>
                      </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  </View>
                  ) : null}
      {errorselect ? (
                <View style={styles.rooterr}>
                  <View style={styles.wraperr}>
                    <View style={styles.dialogerr}>
                      <TextWrap
                        style={[
                          styles.message2err,
                          {
                            marginTop: 33,
                            fontWeight: 'bold',
                          },
                        ]}>
                        알림
                      </TextWrap>
                      <TextWrap style={[styles.messageerr]}>필수옵션을 선택해주세요.</TextWrap>
                      <View style={styles.row2err}>
                          <View style={{flex:1}}>
                          </View>
                      <TouchableOpacity
                        style={styles.buttonerr}
                        onPress={() => {
                            setErrorselect(false);
                        }}>
                        <TextWrap
                          font={fonts.kopubWorldDotumProMedium}
                          style={styles.titleerr}>
                          닫기
                        </TextWrap>
                      </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  </View>
                  ) : null}
        {sucpay ? (
                <View style={styles.rooterr}>
                  <View style={styles.wraperr}>
                    <View style={styles.dialogerr}>
                      <TextWrap
                        style={[
                          styles.message2err,
                          {
                            marginTop: 33,
                            fontWeight: 'bold',
                          },
                        ]}>
                        알림
                      </TextWrap>
                      <TextWrap style={[styles.messageerr]}>신청이 완료되었습니다.</TextWrap>
                      <View style={styles.row2err}>
                          <View style={{flex:1}}>
                          </View>
                      <TouchableOpacity
                        style={styles.buttonerr}
                        onPress={() => {
                            setSucpay(false);
                        }}>
                        <TextWrap
                          font={fonts.kopubWorldDotumProMedium}
                          style={styles.titleerr}>
                          닫기
                        </TextWrap>
                      </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  </View>
                  ) : null}
      <TouchableOpacity
        style={styles.wrap}
        onPress={() => dispatch(dialogClose())}>
        <TouchableWithoutFeedback
          onPress={() => {
            return;
          }}>
          {!applySuccess && !shinchung && (selectOption.length == 0 || selectOption.length == undefined)  ? (
          <View
            style={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              backgroundColor: colors.white,
              height: heightPercentage(290),
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
                {open ? optionData.map((x, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={x.overFlag == 0 ? styles.dataContainer : [styles.dataContainer,{backgroundColor:'#D2D2D2'}]}
                        onPress={() => {
                          if(x.overFlag == 0){
                          setSelectOption([x]);
                          setGatheringcode(x.code); //모임코드 입력
                          setTotalPrice(totalPrice + parseInt(x.fee));
                          }else{
                            console.log('정원초과');
                          }
                        }}>
                        <TextWrap
                          font={fonts.kopubWorldDotumProMedium}
                          style={styles.message2}>
                          {x.gatheringDate.substring(0,10)}({dayOfWeek(x.gatheringDate.substring(0,10))}) | {x.gatheringDate.substring(11,16)} {x.gatheringDate.substring(11,13) < 13 ? 'AM' : 'PM'}
                          {'\n'}{x.title}
                        </TextWrap>
                      </TouchableOpacity>
                    )
                  })
                 : null}
              </ScrollView>
            </View>
            <View style={styles.button}>
                <Pressable style={styles.buttons} onPress={() => {
                    if(gatheringcode != ''){
                      setShinchung(true)
                    }else{
                        setErrorselect(true);
                    }
                  }
                }>
                  <Text style={styles.text}>신청하기</Text>
                </Pressable>
            </View>
          </View>
          ) : !applySuccess && !shinchung && selectOption.length > 0 && selectOption.length != undefined ? (
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
                <ScrollView styles={{height:heightPercentage(120)}}>
                {subopen ? optionData.map((x, index) => {
                    return (
                        <TouchableOpacity
                          key={index}
                          style={x.overFlag == 0 ? styles.subdataContainer : [styles.subdataContainer,{backgroundColor:'#D2D2D2'}]}
                          onPress={() => {
                            if(x.overFlag == 0){
                              if(!gatheringcode.includes(x.code)){
                                setSelectOption(selectOption.concat([x]));
                                setGatheringcode(x.code); //모임코드 입력
                                setTotalPrice(totalPrice + parseInt(x.fee));
                              }else{
                                setErroropen(true);
                              }
                            }else{
                              console.log('정원초과');
                            }
                          }}>
                          <TextWrap
                            font={fonts.kopubWorldDotumProMedium}
                            style={styles.message2}>
                            {x.gatheringDate.substring(0,10)}({dayOfWeek(x.gatheringDate.substring(0,10))}) | {x.gatheringDate.substring(11,16)} {x.gatheringDate.substring(11,13) < 13 ? 'AM' : 'PM'}
                            {'\n'}{x.title}
                          </TextWrap>
                        </TouchableOpacity>
                      
                    )
                  })
                 : null}
                 </ScrollView>
                <ScrollView
                style={{
                  width: screenWidth*0.9,
                  backgroundColor:'#F4F3F3',
                  marginTop:heightPercentage(15)
                }}>
                {selectOption.map((x, index) => {
                  return (
                      <View key={x.code} style={styles.priceContainer}>
                        <TextWrap
                          font={fonts.kopubWorldDotumProMedium}
                          style={styles.message3}>
                          {x.gatheringDate.substring(0,10)}({dayOfWeek(x.gatheringDate.substring(0,10))}) | {x.gatheringDate.substring(11,16)} {x.gatheringDate.substring(11,13) < 13 ? 'AM' : 'PM'}
                          {'\n'}{x.title}
                        </TextWrap>
                        
                        <TouchableOpacity
                          style={styles.closebtn}
                          onPress={() => {
                              selectOption.splice(index,1);
                              if(selectOption.length == 0){
                                setSelectOption([]);
                              }else{
                                setSelectOption(selectOption);
                              }
                              setTotalPrice(totalPrice - parseInt(x.fee));
                          }}>
                          <Image source={images.del} style={styles.closebtn}/>
                        </TouchableOpacity>
                      </View>
                    
                  )
                })}
                
                <View style={styles.price}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.pricemessage}>
                    {totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                  </TextWrap>
                </View>
              </ScrollView>
              <View style={styles.totalContent}>
                <TextWrap
                  font={fonts.kopubWorldDotumProMedium}
                  style={styles.totalmessage}>
                  총 상품금액({selectOption.length}개)     {totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                </TextWrap>
              </View>
            </View>
            <View style={styles.totalbutton}>
                <Pressable style={styles.buttons} onPress={() => {
                  selectOption.map((x) => {
                    setTotalcode(total => [...total, x.code]);
                  });
                  setShinchung(true)
                }}>
                  <Text style={styles.text}>신청하기</Text>
                </Pressable>
            </View>
          </View>
          ) : applySuccess ? (
            <View
              style={{
                backgroundColor: colors.white,
                alignItems: 'center',
              }}>
            <ScrollView
              ref={scrollRef}
              showsVerticalScrollIndicator={false}
              contentOffset={{x:0, y:0}}
              style={{
                width: screenWidth,
              }}>
          <TouchableWithoutFeedback>
           <View>
            <View style={styles.shinbox}>
            <TextWrap
              style={styles.shinTitles}
              font={fonts.kopubWorldDotumProBold}>
              신청번호
            </TextWrap>
            <TextWrap
              style={styles.pointtext2}
              font={fonts.kopubWorldDotumProBold}>
              [{ordernum}]
            </TextWrap>
            </View>
            <View style={styles.shinbox}>
            <TextWrap
              style={styles.shinTitle}
              font={fonts.kopubWorldDotumProBold}>
              신청 독서모임 정보
            </TextWrap>
            <View style={styles.shininfo}>
                <View style={styles.shinContainer}>
                  <Image source={{
                    uri:'https://api-storage.cloud.toast.com/v1/AUTH_2900a4ee8d4d4be3a5146f0158948bd1/village/' + selectOption[0].thumbnail
                  }} style={styles.thumbnail}/>
                  <View style={{flexDirection:'column'}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont3}>
                    {selectOption[0].title}
                  </TextWrap>
                  {selectOption.map((x, index) => {
                    if(index === 0){
                      return (
                        <TextWrap
                          key={'gather'+index}
                          font={fonts.kopubWorldDotumProMedium}
                          style={styles.datefont}>
                          [선택] {x.gatheringDate.substring(0,10)}({dayOfWeek(x.gatheringDate.substring(0,10))}) | {x.gatheringDate.substring(11,16)} {x.gatheringDate.substring(11,13) < 13 ? 'AM' : 'PM'} | {x.title}
                        </TextWrap>
                        )
                    }else{
                      return (
                        <TextWrap
                          key={'gather'+index}
                          font={fonts.kopubWorldDotumProMedium}
                          style={styles.datefont2}>
                          {x.gatheringDate.substring(0,10)}({dayOfWeek(x.gatheringDate.substring(0,10))}) | {x.gatheringDate.substring(11,16)} {x.gatheringDate.substring(11,13) < 13 ? 'AM' : 'PM'} | {x.title}
                        </TextWrap>
                        )
                    }
                  })}
                  <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={styles.datefont}>
                      [신청수량] {selectOption.length}개
                    </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont2}>
                    {totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
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
                  <View style={{flexDirection:'column'}}>
                  <View style={{flexDirection:'row'}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.pricetext}>
                    총 결제 금액
                  </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.pricetext2}>
                    {totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                  </TextWrap>
                  </View>
                  <View style={{flexDirection:'row'}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={[styles.pointtext,{bottom: '2%', fontWeight:'bold'}]}>
                    포인트 적립
                  </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={[styles.pointtext3,{bottom: '2%', fontWeight:'bold'}]}>
                    {totalPrice * 0.05}포인트
                  </TextWrap>
                  </View>
                  <View style={{flexDirection:'row'}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={[styles.pricetext,{fontSize:fontPercentage(15), fontWeight:'bold'}]}>
                    총 결제 금액
                  </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={[styles.pricetext2,{fontSize:fontPercentage(15)}]}>
                    {totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                  </TextWrap>
                  </View>
                  </View>
                </View>
            </View>
            </View>
            <View style={styles.shinbox}>
            <TextWrap
              style={styles.shinTitle}
              font={fonts.kopubWorldDotumProBold}>
              결제 상세정보
            </TextWrap>
            <View style={styles.shininfo}>
                <View style={styles.shinContainer}>
                  <View style={{flexDirection:'column'}}>
                  <View style={{flexDirection:'row',marginLeft:widthPercentage(5)}}>
                    <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={styles.pricetext3}>
                      결제수단
                    </TextWrap>
                    <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={styles.pricetext4}>
                      -
                    </TextWrap>
                  </View>
                  <View style={{flexDirection:'row',marginLeft:widthPercentage(5)}}>
                    <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={[styles.pricetext3,{bottom:'3%'}]}>
                      결제정보
                    </TextWrap>
                    <View style={styles.pricetext4}>
                    <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={styles.pricetext5}>
                      무료
                    </TextWrap>
                    <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={styles.pricetext6}>
                      승인일시 | 2022.10.30 15:30
                    </TextWrap>
                    </View>
                  </View>
                  </View>
                </View>
            </View>
            </View>
            <View style={styles.totalsbutton}>
                <Pressable style={[styles.buttons, {
                  backgroundColor: 'white',
                  borderWidth:0.5,
                  borderColor:'#3F3F3F'}]} onPress={() => {
                    dispatch(setShowInfo(ordernum,selectOption,totalPrice));
                    dispatch(dialogClose());
                  }
                }>
                  <Text style={styles.textother}>다른 독서모임 둘러보기</Text>
                </Pressable>
            </View>
            </View>
            </TouchableWithoutFeedback>
          </ScrollView>
          </View>
          ) : (
            <View
            style={{
              backgroundColor: colors.white,
              alignItems: 'center',
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                width: screenWidth,
                zIndex: 6,
                elevation: 6,
              }}>
            <TouchableWithoutFeedback>
           <View>
            <View style={styles.shinbox}>
            <TextWrap
              style={styles.shinTitle}
              font={fonts.kopubWorldDotumProBold}>
              신청 독서모임 정보
            </TextWrap>
            <View style={styles.shininfo}>
                <View style={styles.shinContainer}>
                  <Image source={{
                    uri:'https://api-storage.cloud.toast.com/v1/AUTH_2900a4ee8d4d4be3a5146f0158948bd1/village/' + selectOption[0].thumbnail
                  }} style={styles.thumbnail}/>
                  <View style={{flexDirection:'column'}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont3}>
                    {selectOption[0].title}
                  </TextWrap>
                  {selectOption.map((x, index) => {
                    if(index === 0){
                      return (
                        <TextWrap
                          key={'gather'+index}
                          font={fonts.kopubWorldDotumProMedium}
                          style={styles.datefont}>
                          [선택] {x.gatheringDate.substring(0,10)}({dayOfWeek(x.gatheringDate.substring(0,10))}) | {x.gatheringDate.substring(11,16)} {x.gatheringDate.substring(11,13) < 13 ? 'AM' : 'PM'} | {x.title}
                        </TextWrap>
                        )
                    }else{
                      return (
                        <TextWrap
                          key={'gather'+index}
                          font={fonts.kopubWorldDotumProMedium}
                          style={styles.datefont2}>
                          {x.gatheringDate.substring(0,10)}({dayOfWeek(x.gatheringDate.substring(0,10))}) | {x.gatheringDate.substring(11,16)} {x.gatheringDate.substring(11,13) < 13 ? 'AM' : 'PM'} | {x.title}
                        </TextWrap>
                        )
                    }
                  })}
                  <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={styles.datefont}>
                      [신청수량] {selectOption.length}개
                    </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont2}>
                    {totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
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
                  <View style={{flexDirection:'column'}}>
                    <View style={{flexDirection:'row',marginTop:heightPercentage(2),marginBottom:heightPercentage(2)}}>
                      <TextWrap
                        font={fonts.kopubWorldDotumProMedium}
                        style={styles.people}>
                        신청자명
                      </TextWrap>
                      <TextWrap
                        font={fonts.kopubWorldDotumProMedium}
                        style={styles.people}>
                        {user.kor_nm}
                      </TextWrap>
                    </View>
                    <View style={{flexDirection:'row',marginTop:heightPercentage(2),marginBottom:heightPercentage(2)}}>
                      <TextWrap
                        font={fonts.kopubWorldDotumProMedium}
                        style={styles.people}>
                        연락처
                      </TextWrap>
                      <InputWrap
                        style={styles.input}
                        inputStyle={styles.inputValue}
                        value={min1}
                        onChange={setMin1}
                        maxLength={3}
                        onChangeText={t => {
                          if (t.length >= 4) {
                            return;
                          }
                        }}
                      />
                      <Text style={{fontSize:fontPercentage(14),justifyContent:'center', alignSelf:'center',marginBottom:heightPercentage(13)}}> - </Text>
                      <InputWrap
                        style={styles.input}
                        inputStyle={styles.inputValue}
                        value={min2}
                        onChange={setMin2}
                        maxLength={4}
                        onChangeText={t => {
                          if (t.length >= 5) {
                            return;
                          }
                        }}
                      />
                      <Text style={{fontSize:fontPercentage(14),justifyContent:'center', alignSelf:'center',marginBottom:heightPercentage(13)}}> - </Text>
                      <InputWrap
                        style={styles.input}
                        inputStyle={styles.inputValue}
                        value={min3}
                        onChange={setMin3}
                        maxLength={4}
                        onChangeText={t => {
                          if (t.length >= 5) {
                            return;
                          }
                        }}
                      />
                    </View>
                    <View style={{flexDirection:'row',marginTop:heightPercentage(2),marginBottom:heightPercentage(2)}}>
                      <TextWrap
                        font={fonts.kopubWorldDotumProMedium}
                        style={styles.people}>
                        이메일
                      </TextWrap>
                      <InputWrap
                        style={styles.input2}
                        inputStyle={styles.inputValue}
                        value={email1}
                        onChange={setEmail1}
                      />
                      <Text style={{fontSize:fontPercentage(14),justifyContent:'center', alignSelf:'center',marginBottom:heightPercentage(13)}}> @ </Text>
                      <InputWrap
                        style={styles.input2}
                        inputStyle={styles.inputValue}
                        value={email2}
                        onChange={setEmail2}
                      />
                    </View>
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
                  <View style={{flexDirection:'column'}}>
                  <View style={{flexDirection:'row', borderBottomColor:'#F0F0F0', borderBottomWidth:0.5}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.pricetext}>
                    총 결제 금액
                  </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.pricetext2}>
                    {totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                  </TextWrap>
                  </View>
                  <View style={{flexDirection:'row'}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.pointtext}>
                    ({totalPrice * 0.05} 포인트 적립예정)
                  </TextWrap>
                  </View>
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
                  <View style={{flexDirection:'row',marginLeft:widthPercentage(5)}}>
                    <RadioForm animation={true} formHorizontal={true} labelHorizontal={true}>
                        {/* To create radio buttons, loop through your array of options */}
                        {radio_props.map((obj, i) => (
                          <RadioButton labelHorizontal={true} key={i}>
                            {/*  You can set RadioButtonLabel before RadioButtonInput */}
                            <RadioButtonInput
                              obj={obj}
                              index={i}
                              isSelected={true}
                              onPress={value => {
                                console.log(value);
                              }}
                              borderWidth={widthPercentage(0.3)}
                              buttonInnerColor={colors.black}
                              buttonOuterColor={'#000'}
                              buttonSize={screenWidth / 79}
                              buttonOuterSize={screenWidth / 40}
                              buttonStyle={{}}
                              buttonWrapStyle={{}}
                            />
                            <RadioButtonLabel
                              obj={obj}
                              index={i}
                              labelHorizontal={true}
                              onPress={value => {
                                console.log(value);
                              }}
                              labelStyle={{
                                fontSize: fontPercentage(13),
                                height: screenHeight / 22,
                                bottom: heightPercentage(3),
                                lineHeight: screenHeight / 39,
                              }}
                              labelWrapStyle={{ right: widthPercentage(7) }}
                            />
                          </RadioButton>
                        ))}
                      </RadioForm>
                  </View>
                </View>
            </View>
            </View>
            <View style={[styles.shinbox,{borderBottomWidth:0}]}>
            <CheckBox2
              style={styles.cb}
              // border
              label="구매조건 확인 및 결제진행에 동의합니다."
              labelStyle={styles.label}
              checked={agree}
              onCheckedChange={v => {
                setAgree(v);
              }}
            />
            </View>
            <View style={styles.totalsbutton}>
                <Pressable style={styles.buttons} onPress={() => {
                    if(agree){
                      if(totalPrice != 0){
                        setPay(true);

                        navigate(routes.payment, {
                          screen: routes.topActivity,
                          params: {
                            name: selectOption[0].title,
                            buyer_name: user?.kor_nm ? user?.kor_nm : user?.korNm,
                            buyer_email: email1 + '@' + email2,
                            buyer_tel: min1 + min2 + min3,
                            amount: totalPrice,
                            user_id: user?.member_id ? user?.member_id : user?.memberId,
                            gatheringcode: totalcode.join('|'),
                            selectOption: selectOption
                          },
                        });
                        dispatch(dialogClose());
                      }else{
                        setPay(true);
                        freeRequested();
                      }
                    }else{
                        setErrorselect(true);
                    }
                  }
                }>
                  <Text style={styles.text}>신청하기</Text>
                </Pressable>
            </View>
            </View>
            </TouchableWithoutFeedback>
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
  cb: {
    marginTop: heightPercentage(20),
    marginBottom: heightPercentage(20),
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(12),
  },
  label: {
    color: colors.black,
    fontSize: fontPercentage(12),
  },
  shinbox: {
    width:screenWidth * 0.95,
    flex:1,
    alignSelf: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor:'#F0F0F0'
  },
  shininfo: {
    height:'100%',
    width: '100%',
    alignSelf: 'center',
    alignItems:'flex-start',
    justifyContent: 'center',
  },
  selectbox: {
    height:'57%',
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
    bottom: heightPercentage(60),
  },
  shinTitles: {
    width:'100%',
    fontSize: fontPercentage(16),
    color: '#3F3F3F',
    fontWeight:'bold',
    marginTop: heightPercentage(60),
    textAlign:'center'
  },
  pointtext2: {
    fontSize: fontPercentage(13),
    marginTop: heightPercentage(5),
    marginBottom:heightPercentage(5),
    color: '#1D8EEC',
    height:heightPercentage(40),
    width:'100%',
    alignSelf:'center',
    textAlign:'center',
    fontWeight:'bold',
    left:widthPercentage(3)
  },
  pointtext3: {
    fontSize: fontPercentage(11),
    marginBottom:heightPercentage(12),
    color: '#1D8EEC',
    height:heightPercentage(20),
    width:'50%',
    alignSelf:'center',
    textAlign:'right',
    fontWeight:'bold',
    left:widthPercentage(3)
  },
  shinroot: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: heightPercentage(60),
    zIndex: 5,
    elevation: 5,
  },
  errorroot:{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    bottom: 0,
    zIndex: consts.dialogZindex,
    elevation: consts.dialogZindex,
  },
  wrap: {flex: 1, justifyContent: 'flex-end'},
  shinTitle: {
    width:'100%',
    fontSize: fontPercentage(16),
    color: '#3F3F3F',
    fontWeight:'bold',
    marginTop: heightPercentage(60),
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
  datefont: {
    fontSize: fontPercentage(11),
    marginTop:heightPercentage(2),
    color: '#7f7f7f',
    width:'100%',
    alignSelf:'center',
    textAlign:'left',
    fontWeight:'normal'
  },
  datefont2: {
    fontSize: fontPercentage(11),
    marginTop:heightPercentage(2),
    left:widthPercentage(24.5),
    color: '#7f7f7f',
    width:'100%',
    alignSelf:'center',
    textAlign:'left',
    fontWeight:'normal'
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
    marginTop:heightPercentage(20),
    marginBottom:heightPercentage(20),
    color: '#333333',
    width:'100%',
    alignSelf:'center',
    textAlign:'left',
    fontWeight:'bold'
  },
  rooterr: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    bottom: 0,
    zIndex: consts.dialogZindex,
    elevation: consts.dialogZindex,
  },
  row2err: {flexDirection: 'row', alignSelf: 'flex-end', justifyContent : 'flex-end' ,width : '50%'},
  wraperr: {flex: 1, justifyContent: 'center'},
  dialogerr: {
    backgroundColor: colors.white,
    marginHorizontal: 30,
    borderRadius: 8,
  },
  message2err: {
    ...Platform.select({
      android:{
        lineHeight: 21,
      },
    }),
    fontSize: fontPercentage(16),
    color: '#222222',
    textAlign: 'left',
    paddingHorizontal: 30,
  },
  messageerr: {
    ...Platform.select({
      android:{
        lineHeight: 21,
      },
    }),
    fontSize: fontPercentage(14),
    color: '#222222',
    textAlign: 'left',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  labelerr: {
    paddingHorizontal: 30,
    color: '#222222',
    lineHeight: 20,
    fontSize: fontPercentage(15),
    textAlign: 'left',
  },
  buttonerr: {
    // borderTopWidth: 1,
    flex:1,
    paddingVertical: 18,
    // borderTopColor: colors.prussianBlue,
    alignItems: 'center',
    // colors: colors.prussianBlue,
    justifyContent: 'center',
  },
  titleerr: {
    fontSize: fontPercentage(15),
    lineHeight: 21,
    color: colors.blue,
  },
  shinfont3: {
    fontSize: fontPercentage(13),
    marginBottom:heightPercentage(10),
    color: '#333333',
    width:'100%',
    alignSelf:'center',
    textAlign:'left',
    fontWeight:'bold'
  },
  textbox: {
    fontSize: fontPercentage(13),
    marginBottom:heightPercentage(13),
    color: '#333333',
    width:widthPercentage(30),
    height:10,
    alignSelf:'center',
    textAlign:'center',
    fontWeight:'bold',
    borderWidth:0.5
  },
  people: {
    fontSize: fontPercentage(13),
    marginBottom:heightPercentage(13),
    color: '#333333',
    width:widthPercentage(70),
    alignSelf:'center',
    textAlign:'left',
    fontWeight:'bold',
    left:widthPercentage(3)
  },
  pricetext: {
    fontSize: fontPercentage(13),
    marginBottom:heightPercentage(13),
    color: '#333333',
    width:'50%',
    alignSelf:'center',
    textAlign:'left',
    left:widthPercentage(3)
  },
  pricetext2: {
    fontSize: fontPercentage(13),
    marginBottom:heightPercentage(13),
    color: '#333333',
    width:'50%',
    alignSelf:'center',
    textAlign:'right',
    fontWeight:'bold',
  },
  pricetext3: {
    fontSize: fontPercentage(13),
    marginBottom:heightPercentage(13),
    color: '#333333',
    width:'30%',
    alignSelf:'center',
    textAlign:'left',
    left:widthPercentage(3)
  },
  pricetext4: {
    fontSize: fontPercentage(13),
    marginBottom:heightPercentage(13),
    color: '#333333',
    width:'70%',
    alignSelf:'center',
    textAlign:'left',
    left:widthPercentage(3)
  },
  pricetext5: {
    fontSize: fontPercentage(13),
    color: '#333333',
    width:'70%',
    textAlign:'left',
  },
  pricetext6: {
    fontSize: fontPercentage(13),
    color: '#7f7f7f',
    width:'70%',
    textAlign:'left',
  },
  pointtext: {
    fontSize: fontPercentage(11),
    marginTop: heightPercentage(20),
    marginBottom:heightPercentage(5),
    color: '#1D8EEC',
    height:heightPercentage(40),
    width:'50%',
    alignSelf:'center',
    textAlign:'left',
    fontWeight:'bold',
    left:widthPercentage(3)
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
  input: {
    borderColor: '#ddd',
    borderWidth: 0.5,
    color: colors.text,
    width: widthPercentage(45),
    height: heightPercentage(28),
    fontFamily: fonts.kopubWorldDotumProMedium,
    marginBottom:heightPercentage(12),
  },
  input2: {
    borderColor: '#ddd',
    borderWidth: 0.5,
    color: colors.text,
    width: widthPercentage(100),
    height: heightPercentage(28),
    fontFamily: fonts.kopubWorldDotumProMedium,
    marginBottom:heightPercentage(12),
  },
  inputValue: {
    color: '#848484',
    padding: 0,
    textAlign:'center',
    fontSize: fontPercentage(13),
    letterSpacing: -0.5,
    textDecorationLine: 'none',
    fontFamily: fonts.kopubWorldDotumProMedium,
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
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent:'flex-start',
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
    borderBottomWidth:2,
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
    resizeMode:'contain',
    right:'4%',
    bottom:'3%'
    
  },
  arrowimg:{
    width:widthPercentage(25),
    height:heightPercentage(15),
    alignSelf:'center',
    resizeMode:'stretch'
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
    bottom: heightPercentage(10),
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
    bottom: '1%',
    ...Platform.select({
      ios: {
        backgroundColor: 'black',
      }
  }),
  },
  button: {
    width: '90%',
    bottom: heightPercentage(10),
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
  textother: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(13),
    color:'#3F3F3F',
    fontWeight: 'bold',
  },
});
