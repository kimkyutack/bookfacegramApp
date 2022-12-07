import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  View,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Text,
  StatusBar
} from 'react-native';
import colors from '../libs/colors';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import { screenHeight, screenWidth, widthPercentage, heightPercentage, fontPercentage, cameraItem } from './util';
import { dialogClose, dialogPayment, dialogOpenSelect, dialogCloseMessage } from '../redux/dialog/DialogActions';
import routes from '../libs/routes';
import { setTab } from '../redux/tab/TabAction';
import { navigate } from './navigation';
import { requestPost } from './network';
import fonts from '../libs/fonts';
import consts from '../libs/consts';
import { setShowInfo } from '../redux/activity/ActivityAction';
import TextWrap from '../components/text-wrap/TextWrap';
import Topbar from '../components/topbar/Topbar';
import images from '../libs/images';
import axios from 'axios';
import Footer from '../libs/footer';

export default function paymentResult({ route, navigation }) {
  //console.log('route::::::::',route);
  const dispatch = useDispatch();
  
  const [item,setItem] = useState([route.params[0].params?.params?.selectOption]);
  const [ordernum, setOrdernum] = useState(0);
  const [totalPrice , setTotalPrice] = useState(route.params[0].params?.params.amount);
  const gatheringDateArray = route.params[0].params?.params?.selectOption[0].gatheringDate.split('|');
  const [cardname, setCardName] = useState('');
  const [cardnumber, setCardNumber] = useState('');
  const dayOfWeek = (wantdate) => {
    let week = ['일', '월', '화', '수', '목', '금', '토'];
    let day = week[new Date(wantdate).getDay()];
    return day;
  }	
  const responsedata = async () => {
    try {
      const getToken = await axios({
        url: "https://api.iamport.kr/users/getToken",
        method: "post", // POST method
        headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
        data: {
          imp_key: "0857543567523211", // REST API 키
          imp_secret: "9klvboXthryMSA7QaZBBjlKZj0wnkqZF3zCAoq3wSzVdhSaFbhfbTQ6tlxHng61rYFZAvHE0jHxs9Tim" // REST API Secret
        }
      });

      const { access_token } = getToken.data.response; 

      const getPaymentData = await axios({
        url: 'https://api.iamport.kr/payments/' + route.params[1].imp_uid,
        method: "get",
        headers: { "Authorization": access_token } 
      });
      
      const paymentData = getPaymentData.data.response;
      setCardName(paymentData.card_name);
      setCardNumber(paymentData.card_number);
      fetchRequested(paymentData.card_name,paymentData.card_number);
      
    } catch (e) {
      console.log(e);
    }
  };

   //결제 성공 시 독서모임 신청
  const fetchRequested = async (card, cardnum) => {
      const formData = new FormData();
      //console.log(route.params[0].params?.params)
      formData.append('TId', route.params[1].imp_uid);
      formData.append('gatheringCode',route.params[0].params?.params.gatheringcode);
      formData.append('mail', route.params[0].params?.params.buyer_email);
      formData.append('paymentMethod','카드');
      formData.append('paymentName', card);
      formData.append('paymentNumber',cardnum);
      formData.append('price', route.params[0].params?.params.amount);
      formData.append('tel',route.params[0].params?.params.buyer_tel.substring(0,3) + '-' + route.params[0].params?.params.buyer_tel.substring(3,7) + '-' + route.params[0].params?.params.buyer_tel.substring(7,11));
      formData.append('userId', route.params[0].params?.params.user_id);
      formData.append('userName',route.params[0].params?.params.buyer_name);
      
    try {
      const { data, status } = await requestPost({
        url: consts.apiUrl + '/village/member/order',
        body: formData,
      });
      
      if (status === 'SUCCESS') {
        setOrdernum(data);
        dispatch(dialogPayment('결제가 완료되었습니다.', dispatch(dialogCloseMessage())));
      }
    } catch (error) {
      dispatch(dialogPayment(route.params[1].error_msg, dispatch(dialogClose())));
    }
  };
  
  useEffect(() => {
    let mount = true;
    if (mount) {
        if(route.params[1].imp_success == 'true'){
          responsedata();
        }else{
          dispatch(
            setTab({
                tab: 'gather',
              }),
            );
            navigate(routes.activity, {
              type: 'gather',
            });
          dispatch(dialogPayment(route.params[1].error_msg, dispatch(dialogClose())))
        }
    }
    return () => {
      mount = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.shinroot}>
      {route.params[1].imp_success ? (
            <View
              style={{
                backgroundColor: colors.white,
                alignItems: 'center',
              }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                width: screenWidth,
                marginBottom:heightPercentage(50)
              }}>
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
                    uri:'https://api-storage.cloud.toast.com/v1/AUTH_2900a4ee8d4d4be3a5146f0158948bd1/village/' + item[0][0].thumbnail
                  }} style={styles.thumbnail}/>
                  <View style={{flexDirection:'column'}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont3}>
                    {item[0][0].title}
                  </TextWrap>
                  {gatheringDateArray.map((x, index) => {
                    if(index === 0){
                      return (
                        <TextWrap
                          key={'gather'+index}
                          font={fonts.kopubWorldDotumProMedium}
                          style={styles.datefont}>
                          [선택] {x.substring(0,10)}({dayOfWeek(x.substring(0,10))}) | {x.substring(11,16)} {x.substring(11,13) < 13 ? 'AM' : 'PM'} | {item[0][0].title}
                        </TextWrap>
                        )
                    }else{
                      return (
                        <TextWrap
                          key={'gather'+index}
                          font={fonts.kopubWorldDotumProMedium}
                          style={styles.datefont2}>
                          {x.substring(0,10)}({dayOfWeek(x.substring(0,10))}) | {x.substring(11,16)} {x.substring(11,13) < 13 ? 'AM' : 'PM'} | {item[0][0].title}
                        </TextWrap>
                        )
                    }
                  })}
                  <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={styles.datefont}>
                      [신청수량] {gatheringDateArray.length}개
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
                      신용카드
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
                      {cardname.replace('카드','')}({cardnumber})
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
                <Pressable style={styles.buttons} onPress={() => {
                  dispatch(setShowInfo(ordernum,item,totalPrice));
                  dispatch(dialogClose());
                }}>
                  <Text style={styles.text}>다른 독서모임 둘러보기</Text>
                </Pressable>
            </View>
          </ScrollView>
          <View style={styles.footerstyle}>
            <Footer page="orderlist" />
          </View>
          </View>
           ) : (
          <View style={{height: screenHeight*0.85, alignItems:'center', justifyContent:'center'}}>
            <ActivityIndicator
              size="large"
              style={{ alignSelf: 'center'}}
              color={colors.blue}
            />
          </View>
        )

        }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footerstyle:{
    position:'absolute',
    bottom:0,
    alignItems:'center',
    justifyContent:'center'
  },
  shinbox: {
    width:screenWidth * 0.95,
    flex:1,
    alignSelf: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor:'#F0F0F0'
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  shininfo: {
    height:'100%',
    width: '100%',
    alignSelf: 'center',
    alignItems:'flex-start',
    justifyContent: 'center',
  },
  shinroot: {
    backgroundColor:colors.white,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 3,
    elevation: 3,
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
  shinTitles: {
    width:'100%',
    fontSize: fontPercentage(16),
    color: '#3F3F3F',
    fontWeight:'bold',
    marginTop: heightPercentage(60),
    textAlign:'center'
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
  shinfont3: {
    fontSize: fontPercentage(13),
    marginBottom:heightPercentage(10),
    color: '#333333',
    width:'100%',
    alignSelf:'center',
    textAlign:'left',
    fontWeight:'bold'
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
    marginBottom:heightPercentage(12),
    color: '#1D8EEC',
    height:heightPercentage(20),
    width:'50%',
    alignSelf:'center',
    textAlign:'left',
    fontWeight:'bold',
    left:widthPercentage(3)
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
  },
  message: {
    fontSize: fontPercentage(14),
    color: '#333333',
    width:'88%',
    alignSelf:'center',
    textAlign:'left',
    fontWeight:'bold'
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 0.5,
    color: colors.text,
    width: widthPercentage(45),
    height: heightPercentage(35),
    fontFamily: fonts.kopubWorldDotumProMedium,
    marginBottom:heightPercentage(13),
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
  shinContainer: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent:'flex-start',
    flexDirection:'row',
    width:'100%',
    flex:1
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
  thumbnail:{
    width:widthPercentage(120),
    height:heightPercentage(120),
    alignSelf:'center',
    justifyContent:'center',
    resizeMode:'contain',
    right:'4%',
    bottom:'3%'
    
  },
  totalsbutton: {
    flex:1,
    width: '90%',
    alignSelf:'center',
    justifyContent:'center',
    marginTop:'2%',
    height:heightPercentage(100),
    bottom: 0,
    ...Platform.select({
      ios: {
        backgroundColor: 'black',
      }
  }),
  elevation:10
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
    backgroundColor: 'white',
    borderWidth:0.5,
    borderColor:'#3F3F3F'
  },
  text: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(13),
    color:'#3F3F3F',
    fontWeight: 'bold',
  },
});
