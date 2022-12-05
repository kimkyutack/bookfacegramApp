import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, Text, Pressable } from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import routes from '../../libs/routes';
import { navigate } from '../../services/navigation';
import { widthPercentage, fontPercentage, heightPercentage } from '../../services/util';
import { dialogOpenCancel, dialogOpenMore } from '../../redux/dialog/DialogActions';

export default function OrderListitem({item, type}) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectOption, setSelectOption] = useState(item?.gatheringDate ? item.gatheringDate.split('|') : '');
  const dayOfWeek = (wantdate) => {
    let week = ['일', '월', '화', '수', '목', '금', '토'];
    let day = week[new Date(wantdate).getDay()];
    return day;
}	

  return (
    <View>
          <View
            style={styles.main}
            onPress={() => {
              setOpen(!open);
            }}>
            <View style={styles.mainContent}>
              <TextWrap
                font={fonts.kopubWorldDotumProMedium}
                style={styles.title}>
                {item?.orderDate ? item?.orderDate.substring(0,10) : '0'}
              </TextWrap>
              <View style={styles.buttonsview}>
              <Pressable style={styles.buttons} onPress={() => {
                  if(type == '신청'){
                      navigate(routes.shinchungdetail, {
                        data:item
                      });
                  }else{
                      navigate(routes.canceldetail, {
                        data:item
                      });
                  }
              }}>
                  <Text style={styles.btnfont}>상세보기</Text>
              </Pressable>
              </View>
            </View>
              <View style={styles.shininfo}>
                <View style={styles.shinContainer}>
                  <Image source={{
                    uri:'https://api-storage.cloud.toast.com/v1/AUTH_2900a4ee8d4d4be3a5146f0158948bd1/village/' + item.thumbnail
                  }} style={styles.thumbnail}/>
                  <View style={{flexDirection:'column', marginLeft: '4%'}}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.shinfont3}>
                    {item.orderName}
                  </TextWrap>
                  {selectOption.map((x, index) => {
                    if(index === 0){
                      return (
                        <TextWrap
                          key={'order'+index}
                          font={fonts.kopubWorldDotumProMedium}
                          style={styles.datefont}>
                          [선택] {x.substring(0,10)}({dayOfWeek(x.substring(0,10))}) | {x.substring(11,16)} {x.substring(11,13) < 13 ? 'AM' : 'PM'} | 
                        </TextWrap>
                        )
                    }else{
                      return (
                        <TextWrap
                          key={'order'+index}
                          font={fonts.kopubWorldDotumProMedium}
                          style={styles.datefont2}>
                          {x.substring(0,10)}({dayOfWeek(x.substring(0,10))}) | {x.substring(11,16)} {x.substring(11,13) < 13 ? 'AM' : 'PM'} | 
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
                    {item?.price ? item?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}원
                  </TextWrap>
                  </View>
                </View>
            </View>
            {item.cancelable == 'Y' && type == '신청' ? (
              <View style={{alignItems:'center', width:'100%'}}>
              <Pressable style={styles.buttoncontainer} onPress={() => { 
                    dispatch(dialogOpenCancel({message:'해당 독서모임을 취소 하시겠습니까? \n취소 후 영업일 기준 1~2일 내로 자동환불 처리 됩니다.' , orderCode: item?.orderCode})); 
                  }
                }>
                  <Text style={styles.btnfont2}>신청취소하기</Text>
              </Pressable>
              </View>
              ) : null}
          </View>
    </View>
  );
}

const styles = StyleSheet.create({
  descDate: {
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(15),
    color: '#777777',
    marginTop: 12,
  },


  desc: {
    padding: 16,
    paddingBottom: 0,
  },
  descText: {
    color: '#555555',
    fontSize: fontPercentage(14),
    fontFamily: fonts.kopubWorldDotumProLight,
    lineHeight: fontPercentage(20),
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
    paddingVertical: heightPercentage(20),
  },
buttons: {
    width:widthPercentage(60),
    height:heightPercentage(30),
    backgroundColor:colors.white,
    borderColor:'#3f3f3f',
    borderWidth:0.5,
    color:'#3f3f3f',
    borderRadius:7,
    justifyContent:'center',
    alignSelf:'flex-end',
    marginRight:'1%'
  },
  buttoncontainer: {
    width:'90%',
    height:heightPercentage(40),
    backgroundColor:'#3f3f3f',
    borderColor:'#3f3f3f',
    
    justifyContent:'center',
    alignSelf:'center',
  },
  buttonsview: {
    width:'70%',
    justifyContent:'center',
    alignItems:'flex-end'
  },
  btnfont: {
    fontSize: fontPercentage(12),
    alignSelf:'center',
    textAlign:'center',
    borderWidth:0,
    color:'#3f3f3f',
    zIndex:3,
  },
  btnfont2: {
    fontSize: fontPercentage(12),
    alignSelf:'center',
    textAlign:'center',
    borderWidth:0,
    color:colors.white,
    zIndex:3,
  },

  main: {
    justifyContent:'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    width:'90%',
    flexDirection:'row',
    height: heightPercentage(55),
  },
  mainOpend: { paddingVertical: 10 },
  date: {
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(15),
    color: '#999999',
    marginTop: 10,
  },
  title: {
    textAlignVertical: 'center',
    color: colors.black,
    fontSize: fontPercentage(15),
    lineHeight: fontPercentage(21),
    width:'30%',
    fontWeight:'bold'
  },
  up: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  pFont: {
    marginBottom: 0,
  },
shininfo: {
    flex:1,
    marginTop:'1%',
    width:'100%',
    alignSelf: 'center',
    alignItems:'flex-start',
    justifyContent: 'center',
  },
 shinContainer: {
    left:'10%',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent:'flex-start',
    flexDirection:'row',
    width:'90%',
    flex:1
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
thumbnail:{
    width:widthPercentage(100),
    height:heightPercentage(100),
    alignSelf:'center',
    justifyContent:'center',
    resizeMode:'contain',
    right:'4%',
    bottom:'3%'
    
  },

});
