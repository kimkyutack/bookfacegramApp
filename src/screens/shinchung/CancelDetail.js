import React, { useEffect, useState, useRef } from 'react';
import {
  FlatList,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Platform
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import { dialogOpenDate, dialogOpenSelect } from '../../redux/dialog/DialogActions';
import { requestGet } from '../../services/network';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import images from '../../libs/images';
import { dialogClose } from '../../redux/dialog/DialogActions';
import Footer from '../../libs/footer';
import routes from '../../libs/routes';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
  fontPercentage,
  screenWidth,
  screenHeight
} from '../../services/util';
import { navigate } from '../../services/navigation';
import { browsingTime } from '../../redux/session/SessionAction';
import NoFound from '../../components/no-found/NoFound';
import DialogDate from '../../redux-components/dialog-date/DialogDate';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import { Pressable } from 'react-native';
import { setDateOption } from '../../redux/dateaction/DateAction';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Button } from 'react-native';
import OrderListitem from './orderListitem';
import fonts from '../../libs/fonts';


export default function CancelDetail({ route, navigation }) {
  //console.log(route.params.data)
  const [selectOption, setSelectOption] = useState(route.params.data);
  const [gathering, setGathering] = useState(selectOption.gatheringDate.split('|'));
  
  const dispatch = useDispatch();
  
  const dayOfWeek = (wantdate) => {
    let week = ['일', '월', '화', '수', '목', '금', '토'];
    let day = week[new Date(wantdate).getDay()];
    return day;
}	

  return (
    <RootLayout
      topbar={{
        title: '취소/환불 내역 상세보기',
        navigation: navigation,
        back: true,
      }}>
      <View
        style={{
          borderBottomColor: colors.borderLine,
        }}
      />
          <View
            style={{
              backgroundColor: colors.white,
              alignItems: 'center',
              marginBottom:heightPercentage(60)
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                width: screenWidth,
              }}>
            <View style={styles.shinbox2}>
            <View style={{flex:1, flexDirection:'column',justifyContent:'center', marginLeft:'5%'}}>
            <TextWrap
              style={styles.shinTitles}
              font={fonts.kopubWorldDotumProBold}>
              [취소완료]
            </TextWrap>
            <TextWrap
              style={styles.shinTitles}
              font={fonts.kopubWorldDotumProBold}>
              {selectOption.orderDate.substring(0,11)}
            </TextWrap>
            </View>
            <View style={{flex:2,justifyContent:'center', marginRight:'10%'}}>
            <TextWrap
              style={styles.pointtext2}
              font={fonts.kopubWorldDotumProBold}>
              신청번호 : {selectOption.orderCode}
            </TextWrap>
            </View>
            </View>
            <View style={styles.shinbox}>
            <View style={[styles.shinTitle,{marginTop: heightPercentage(35)}]} />
            <View style={styles.shininfo}>
                <View style={styles.shinContainer}>
                  <Image source={{
                    uri:'https://api-storage.cloud.toast.com/v1/AUTH_2900a4ee8d4d4be3a5146f0158948bd1/village/' + selectOption.thumbnail
                  }} style={styles.thumbnail}/>
                  <View style={{flexDirection:'column'}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont3}>
                    {selectOption.orderName}
                  </TextWrap>
                  {gathering.map((x, index) => {
                    if(index === 0){
                      return (
                        <TextWrap
                          key={'gather'+index}
                          font={fonts.kopubWorldDotumProMedium}
                          style={styles.datefont}>
                          [선택] {x.substring(0,10)}({dayOfWeek(x.substring(0,10))}) | {x.substring(11,16)} {x.substring(11,13) < 13 ? 'AM' : 'PM'} | {selectOption.orderName}
                        </TextWrap>
                        )
                    }else{
                      return (
                        <TextWrap
                          key={'gather'+index}
                          font={fonts.kopubWorldDotumProMedium}
                          style={styles.datefont2}>
                          {x.substring(0,10)}({dayOfWeek(x.substring(0,10))}) | {x.substring(11,16)} {x.substring(11,13) < 13 ? 'AM' : 'PM'} | {selectOption.orderName}
                        </TextWrap>
                        )
                    }
                  })}
                  <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={styles.datefont}>
                      [신청수량] {gathering.length}개
                    </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont2}>
                    {selectOption.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                  </TextWrap>
                  </View>
                </View>
            </View>
            </View>
            <View style={styles.shinbox}>
            <TextWrap
              style={styles.shinTitle}
              font={fonts.kopubWorldDotumProBold}>
              취소/환불 요약
            </TextWrap>
            <View style={styles.shininfo}>
                <View style={styles.shinContainer}>
                  <View style={{flexDirection:'column'}}>
                  <View style={{flexDirection:'row'}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.pricetext}>
                    총 취소 금액
                  </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.pricetext2}>
                    {selectOption.cancelPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                  </TextWrap>
                  </View>
                  <View style={{flexDirection:'row'}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={[styles.pointtext,{bottom: '2%', fontWeight:'bold'}]}>
                    포인트 차감
                  </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={[styles.pointtext3,{bottom: '2%', fontWeight:'bold'}]}>
                    {selectOption.point * 0.05}포인트
                  </TextWrap>
                  </View>
                  <View style={{flexDirection:'row'}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={[styles.pricetext,{fontSize:fontPercentage(15), fontWeight:'bold'}]}>
                    총 취소 금액
                  </TextWrap>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={[styles.pricetext2,{fontSize:fontPercentage(15)}]}>
                    {selectOption.cancelPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                  </TextWrap>
                  </View>
                  </View>
                </View>
            </View>
            </View>
            <View style={[styles.shinbox,{borderBottomWidth:0}]}>
            <TextWrap
              style={styles.shinTitle}
              font={fonts.kopubWorldDotumProBold}>
              취소/환불 상세정보
            </TextWrap>
            <View style={styles.shininfo}>
                <View style={styles.shinContainer}>
                  <View style={{flexDirection:'column'}}>
                  <View style={{flexDirection:'row',marginLeft:widthPercentage(5)}}>
                    <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={styles.pricetext3}>
                      환불수단
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
                      환불정보
                    </TextWrap>
                    <View style={styles.pricetext4}>
                    <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={styles.pricetext5}>
                      {selectOption.paymentName.replace('카드','')}({selectOption.paymentNumber.substring(0,selectOption.paymentNumber.length - 4)}****)
                    </TextWrap>
                    <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={styles.pricetext6}>
                      취소일시 | {selectOption.cancelDate.substring(0,16)}
                    </TextWrap>
                    </View>
                  </View>
                  </View>
                </View>
            </View>
            </View>
          </ScrollView>
          </View>
          <View style={styles.footerstyle}>
            <Footer page="orderlist" />
          </View>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  noselect:{
    width: screenWidth / 2,
    height: heightPercentage(40),
    alignItems: 'center',
    alignSelf: 'stretch',
    fontSize: fontPercentage(13),
    textAlign: 'center',
  },
  footerstyle:{
    position:'absolute',
    bottom:0,
    alignItems:'center',
    justifyContent:'center'
  },
  row2:{
    width:'90%',
    marginTop:'3%',
    marginLeft:'5%',
    justifyContent:'center',
    flex:2,
  },
  buttons: {
    width:widthPercentage(40),
    height:heightPercentage(30),
    backgroundColor:'#3f3f3f',
    color:colors.white,
    borderRadius:7,
    justifyContent:'center',
    alignSelf:'flex-end',
  },
  btnfont: {
    fontSize: fontPercentage(12),
    alignSelf:'center',
    textAlign:'center',
    borderWidth:0,
    color:colors.white,
    zIndex:3,
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  select: {
    position: 'absolute',
    width: '100%',
    height: heightPercentage(40),
    resizeMode: 'stretch',
    borderWidth:0
  },
  datefont: {
    fontSize: fontPercentage(12),
    marginLeft: widthPercentage(5),
    borderWidth:0,
    color:'#7f7f7f',
    zIndex:3,
  },
  selectfont: {
    fontSize: fontPercentage(10),
    marginLeft: widthPercentage(5),
    borderWidth:0,
    color:'black',
    zIndex:3,
  },
  selectdate: {
    marginLeft:'1%',
    width: widthPercentage(15),
    height: heightPercentage(15),
    resizeMode: 'contain',
  },
  menu: {
    resizeMode: 'cover',
    flexDirection: 'row',
    width: screenWidth,
    height: heightPercentage(42),
  },
  tapmenu: {
    width: '100%',
    height: heightPercentage(40),
    alignItems: 'center',
    alignSelf: 'stretch',
    fontSize: 20,
    paddingHorizontal: '8.5%',
  },
  selectmenu: {
    width: '100%',
    height: heightPercentage(40),
    alignItems: 'center',
    alignSelf: 'stretch',
    fontSize: 20,
    paddingHorizontal: '8.5%',
    borderBottomWidth: 4,
  },
  scrolltotop: {
    width: widthPercentage(35),
    height: heightPercentage(35),
    resizeMode: 'contain',
  },
  topButton: {
    alignItems: 'center',
    width: widthPercentage(35),
    height: heightPercentage(35),
    position: 'absolute',
    bottom: heightPercentage(65),
    left: screenWidth / 2.2,
    display: 'flex',
  },
  shinbox: {
    width:screenWidth * 0.95,
    flex:1,
    alignSelf: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor:'#F0F0F0'
  },
  shinbox2: {
    height:screenHeight / 6,
    width:'100%',
    flex:1,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    backgroundColor:'#F0F0F0'
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
    bottom: 30,
    zIndex: 3,
    elevation: 3,
  },
  shinTitles: {
    width:'100%',
    fontSize: fontPercentage(16),
    color: '#3F3F3F',
    fontWeight:'bold',
    marginTop: heightPercentage(10),
    textAlign:'left',
    alignSelf:'center',
    justifyContent:'center'
  },
  pointtext2: {
    fontSize: fontPercentage(13),
    marginTop: heightPercentage(55),
    color: '#a0a0a0',
    height:heightPercentage(30),
    width:'100%',
    alignSelf:'center',
    textAlign:'left',
    fontWeight:'bold',
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
    bottom: 30,
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
    marginTop:heightPercentage(5)
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
    height: heightPercentage(35),
    fontFamily: fonts.kopubWorldDotumProMedium,
    marginBottom:heightPercentage(13),
  },
  input2: {
    borderColor: '#ddd',
    borderWidth: 0.5,
    color: colors.text,
    width: widthPercentage(100),
    height: heightPercentage(35),
    fontFamily: fonts.kopubWorldDotumProMedium,
    marginBottom:heightPercentage(13),
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
    marginTop:'10%',
    bottom: '1%',
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
  textother: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(13),
    color:'#3F3F3F',
    fontWeight: 'bold',
  },
});
