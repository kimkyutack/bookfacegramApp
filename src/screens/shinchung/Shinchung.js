import React, { useEffect, useState, useRef } from 'react';
import {
  FlatList,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import { dialogOpenDate } from '../../redux/dialog/DialogActions';
import { requestGet } from '../../services/network';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import images from '../../libs/images';
import { dialogClose } from '../../redux/dialog/DialogActions';
import Footer from '../../libs/footer';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
  fontPercentage,
  screenWidth,
} from '../../services/util';
import { navigate } from '../../services/navigation';
import { browsingTime } from '../../redux/session/SessionAction';
import NoFound from '../../components/no-found/NoFound';
import { Pressable } from 'react-native';
import { setDateOption } from '../../redux/dateaction/DateAction';
import OrderListitem from './orderListitem';
import DateTimePicker from 'react-native-modal-datetime-picker';


export default function ShinChung({ route, navigation }) {
  const [datas, setData] = useState([]);
  const [color1, setColor1] = useState('#c9c9c9');
  const [color2, setColor2] = useState('#FED500');
  const [sessionTime, setSessionTime] = useState('000000');
  const [category_, setCategory] = useState('신청');
  
  const listRef = useRef();
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 50;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  
  const dateoption = useSelector(s => s.dateoption, shallowEqual);

  const [startDate,setStartDate] = useState(dateoption.startdate);
  const [endDate,setEndDate] = useState(dateoption.enddate);
  const [orderdate, setOrderdate] = useState(dateoption.menu);
  const [selectpicker,setSelectPicker] = useState(1);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startpage , setStartpage] = useState(0);
  const user = useSelector(s => s.user, shallowEqual);
  const cancelcode = useSelector(s => s.PayAction.ordercode);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const changeStyle = type => {
    if (type === '취소') {
      setColor1('#FED500');
      setColor2('#c9c9c9');
    } else {
      setColor1('#c9c9c9');
      setColor2('#FED500');
    } 
    setCategory(type);
  };

  const showDatePicker = (pick) => {
    setSelectPicker(pick);
    if(pick === 1){
      setCurrentDate(to_date(startDate))
    }else{
      setCurrentDate(to_date(endDate))
    }
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    let selectdate = '';
    date.setHours(date.getHours() + 9);
    selectdate = date.toISOString().replace('T', ' ').substring(0, 11);
    if(selectpicker == 1){
      setStartDate(selectdate);
    }else{
      setEndDate(selectdate);
    }
    hideDatePicker();
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
  function to_date(date_str)
{
    var yyyyMMdd = String(date_str);
    var sYear = yyyyMMdd.substring(0,4);
    var sMonth = yyyyMMdd.substring(5,7);
    var sDate = yyyyMMdd.substring(8,10);

    //alert("sYear :"+sYear +"   sMonth :"+sMonth + "   sDate :"+sDate);
    return new Date(Number(sYear), Number(sMonth)-1, Number(sDate));
}

  const fetchRequested = async (start) => {
     try {
      const { data, status } = await requestGet({
        url: consts.apiUrl + '/mypage/village/list',
        query: {
        endDate: endDate,
        startDate: startDate, 
        startPaging: start, 
        state: category_,
        endPaging:20
      },
      });
      if (status === 'SUCCESS') {
          if(start === 0){
            setData([...data]);
          }else{
            setData(datas.concat([...data]));
          }
      }
      return status;
    } catch (error) {
      
    }
  }
  const loadMore = () => {
    if(datas.length === 20){
      fetchRequested(startpage + 20);
      setStartpage(startpage + 20);
    }else{
      console.log('끝')
    }
  }
  //page 로그 찍는 로직
  useEffect(() => {
    if (isFocused) {
      var timer = setInterval(() => { timeCount() }, 1000);
      fetchRequested(0);
    }

    if (!isFocused) {
      if (sessionTime !== '000000') {

        dispatch(browsingTime('신청내역', sessionTime, user.member_id));
      }
    }
    return () => {
      clearInterval(timer);
      setSessionTime('000000');
    }
  }, [isFocused]);

  useEffect(() => {
    setStartpage(0);
    fetchRequested(0);
  }, [category_,startDate,endDate,cancelcode]);

  useEffect(() => {
    let mount = true;
    if(mount){
      fetchRequested(0);
    }
    return () => {
      mount = false;
    }
  }, []);

  useEffect(() => {
    if(dateoption.menu != '직접입력'){
      setEndDate(dateoption.enddate)
      setStartDate(dateoption.startdate)
    }
   setOrderdate(dateoption.menu)
  }, [dateoption.menu]);

  useEffect(() => {
    //console.log(JSON.stringify(user));
    const unsubscribe = navigation.addListener('focus', () => {
      setCategory('신청');
      setColor1('#c9c9c9');
      setColor2('#FED500');
      //Put your Data loading function here instead of my loadData()
    });

    return unsubscribe;
  }, [navigate]);

  return (
    <RootLayout
      topbar={{
        title: '독서모임 신청내역',
        navigation: navigation,
        back: true,
      }}>
      <View style={styles.menu}>
        <View>
          <TouchableOpacity onPress={() => changeStyle('신청')}>
            {color2 === '#c9c9c9' ? (
              <TextWrap
                style={[styles.noselect,
                  {
                  borderBottomColor: color1,
                  borderBottomWidth: 0,
                  }]}>
                신청 내역
              </TextWrap>
            ) : (
              <View style={{
                borderBottomColor: color2,
                borderBottomWidth: 4,
              }}>
                <TextWrap style={styles.noselect}>
                  신청 내역
                </TextWrap>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => changeStyle('취소')}>
            {color1 === '#c9c9c9' ? (
              <TextWrap
                style={[styles.noselect,
                  {
                  borderBottomColor: color1,
                  borderBottomWidth: 0,
                  }]}>
                취소/환불 내역
              </TextWrap>
            ) : (
              <View style={{
                borderBottomColor: color1,
                borderBottomWidth: 4,
              }}>
                <TextWrap style={styles.noselect}>
                  취소/환불 내역
                </TextWrap>
              </View>
            )}
          </TouchableOpacity>
        </View>
       
      </View>
      <View
        style={{
          borderBottomColor: colors.borderLine,
        }}
      />
      <View style={styles.row2}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent:'center',
            }}
            onPress={() => {
              dispatch(dialogOpenDate(dialogClose(),startDate))
            }}>
            <View style={{ 
              justifyContent:'center',
              borderWidth:0,
              flex:1,
              
              }}>
              <TextWrap style={styles.selectfont}>{orderdate}</TextWrap>
              <Image source={images.selectbox} style={styles.select} />
            </View>
          </TouchableOpacity>
      </View>
      {orderdate == '직접입력' && (
      <View style={styles.row2}>
          <View
            style={{
              flex: 1,
              justifyContent:'center',
            }}
            >
            <View style={{ 
              justifyContent:'flex-start',
              borderWidth:0,
              flex:1,
              flexDirection:'row',
              alignItems:'center'
              }}>
              <TouchableOpacity style={{flexDirection:'row'}} onPress={() => showDatePicker(1)}>
              <TextWrap style={styles.datefont}>{startDate}</TextWrap>
              <Image source={images.datepic} style={styles.selectdate} />
              </TouchableOpacity>
              <TextWrap style={styles.datefont}>~</TextWrap>
              <TouchableOpacity style={{flexDirection:'row'}} onPress={() => showDatePicker(2)}>
              <TextWrap style={styles.datefont}>{endDate}</TextWrap>
              <Image source={images.datepic} style={styles.selectdate} />
              </TouchableOpacity>
            </View>
            <DateTimePicker
              isVisible={isDatePickerVisible}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              date={currentDate}
            />
          </View>
            
      </View>
      )}
      <View style={{flex:11}}>
      {datas.length !== 0 ? (
        <FlatList
          data={datas}
          ref={listRef}
          onScroll={event => {
            setContentVerticalOffset(event.nativeEvent.contentOffset.y);
          }}
          keyExtractor={(item, index) => {
            return item.orderCode + index.toString();
          }}
          renderItem={({ item, index }) => {
            return <OrderListitem item={item} type={category_}/>;
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.8}
        /> 
        ) : <NoFound message={category_ === '신청' ? '신청한 독서모임이 없습니다.' : '취소/환불된 독서모임이 없습니다.'} />
      }
      </View>
      {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
        <TouchableOpacity
          onPress={() => {
            listRef.current.scrollToOffset({ animated: true, offset: 0 });
          }}
          style={styles.topButton}>
          <Image source={images.scrollTop} style={styles.scrolltotop} />
        </TouchableOpacity>
      )}

      <Footer page="orderlist" />
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
  row2:{
    width:'90%',
    marginTop:'3%',
    marginLeft:'5%',
    justifyContent:'center',
    flex:1,
  },
  buttons: {
    width:widthPercentage(45),
    height:heightPercentage(30),
    backgroundColor:'#3f3f3f',
    color:colors.white,
    borderRadius:widthPercentage(8),
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
    marginLeft:'2%',
    marginTop:'2%',
    width: widthPercentage(14),
    height: heightPercentage(14),
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
});
