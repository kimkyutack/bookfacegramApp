import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import { requestGet, requestPost } from '../../services/network';
import {
  fontPercentage,
  heightPercentage,
  screenWidth,
  screenHeight
} from '../../services/util';
import TextWrap from '../../components/text-wrap/TextWrap';
import AudioCarouselImage from './AudioCarouselImage';
import { setShowAudio, setShowWhat } from '../../redux/audiobook/AudioAction';
import AudioPlayer from './audioplayer';

export default function AudioItem({item, playtime, index}) {
  const dispatch = useDispatch();
  const [play, setPlay] = useState(0);
  const [show, setShow] = useState(false);
  const showaudio = useSelector(state => state.showaudio);
  const user = useSelector(s => s.user);
  const [currentTime, setCurrentTime] = useState(0);
  const [open, setOpen] = useState(false);
  
  let cnt = 0;

  const setPlayCount = async () => {
    try {
      const formData = new FormData();
      formData.append('memberId', user.member_id);
      formData.append('title',item.title);

      const {data, status} = await requestPost({
        url: consts.apiUrl + '/audio/count',
        body: formData,
      });
      console.log(status)
      if (status === 'SUCCESS') {
        
      }
      return status;
    } catch (error) {
    }
  };

  //이어서 듣기
  const openModalWhitData = async () => {
    //데이터 받아온 후 모달 열기
    await fetchRequested(); 
    setOpen(true);
  }

  //처음부터 듣기
  const openModalWithNoData = () =>{
    setCurrentTime(0);  //재생 시점 0으로 초기화
    setPlayCount(); //재생 횟수 증가
    setOpen(true);
  }
  const fetchRequested = async () => {
    try {
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/audio/getCurrentsTime',
        query: {
          memberId: user.member_id,
          title: item.title,
        },
      });
      if (status === 'SUCCESS') {
        setCurrentTime(data.currents_time);
        // setplaytime();
        setPlayCount();
      }
      return status;
    } catch (error) {
    }
  };
  
  useEffect(() => {
    let mount = true;
    if (mount) {
      setShow(false);
    }
    return () => {
      mount = false;
    };
  }, [showaudio.showwt]);
  return (
    <>
    {playtime.length !== 0 && playtime.map((data, Index) => {
      if (data.title === item.title && data.currentsTime < item.durationTime - 2) {
        cnt  = 1;
      }else if(data.title === item.title && data.currentsTime >= item.durationTime - 2){
        cnt  = 2;
      }
    })}
      <View style={styles.headerContainer} />
      
      <View style={styles.root}>
        {open && (
          <AudioPlayer
            track={{  //오디오 정보
            url: consts.toapingUrl+'/aud_file/'+item.audFile, //'https://toaping.com/aud_file/adg40009.mp3',
            artwork: consts.toapingUrl+'/aud_file/'+item.audImg,//'https://toaping.com/aud_file/adb1.jpg',
            title: item.title,
            duration: item.durationTime,
            wirter: item.writer,
            }}
            currentTime={currentTime} //현재 시간
            userId ={user.member_id}  //사용자 ID
            onClose={() => {
              setOpen(false);
            }}
          />
          )}
        <TouchableOpacity
          style={styles.main}
          onPress={() => {
            dispatch(setShowWhat(index));
            if ( cnt != 1 ) {
              dispatch(setShowAudio(index,item.title,0,0,0));
              openModalWithNoData();  //독서전, 독서 완료일 경우 처음부터 듣기로
            }
          }}>
          <View style={styles.mainContent}>
            {showaudio.showwt === index && cnt == 1 ? (
              <View style={styles.showContent}>
                <TouchableOpacity
                  style={styles.playbtn}
                  onPress={() => {
                    dispatch(setShowAudio(index,item.title,0,0,0));
                    openModalWhitData();  //이어서 듣기
                  }}>
                    <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={styles.playtext}
                      numberOfLines={1}>
                      이어서 듣기
                    </TextWrap>
                  </TouchableOpacity>

                  <TouchableOpacity
                  style={styles.playbtn}
                  onPress={() => {
                    openModalWithNoData();  //처음부터 듣기
                  }}>
                    <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={styles.playtext}
                      numberOfLines={1}>
                      처음부터 듣기
                    </TextWrap>

                  </TouchableOpacity>

              </View>
            ) :null }
            <AudioCarouselImage item={item} style={styles.thumbnail} />
            <View style={styles.info}>
              <TextWrap
                font={fonts.kopubWorldDotumProMedium}
                style={styles.title}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.title}
              </TextWrap>
              <TextWrap
                style={styles.writer}
                font={fonts.kopubWorldDotumProLight}>
                {item.writer}
              </TextWrap>
              
              {cnt === 0 ?
              (
              <TextWrap
                font={fonts.kopubWorldDotumProLight}
                style={styles.writer}
                >
                독서전 | {Math.floor(item.durationTime / 60) < 10 ? '0'+ Math.floor(item.durationTime / 60) : Math.floor(item.durationTime % 60)}분 {Math.floor(item.durationTime % 60) < 10 ? '0'+ Math.floor(item.durationTime % 60) : Math.floor(item.durationTime % 60)}초 
              </TextWrap>
              ) : cnt === 2 ? (
                <TextWrap
                  font={fonts.kopubWorldDotumProLight}
                  style={styles.writer}>
                  독서완료 | {Math.floor(item.durationTime / 60) < 10 ? '0'+ Math.floor(item.durationTime / 60) : Math.floor(item.durationTime / 60)}분 {Math.floor(item.durationTime % 60) < 10 ? '0'+ Math.floor(item.durationTime % 60) : Math.floor(item.durationTime % 60)}초 
                </TextWrap>
              ) : (
                <TextWrap
                  font={fonts.kopubWorldDotumProLight}
                  style={styles.writer}>
                  독서중 | {Math.floor(item.durationTime / 60) < 10 ? '0'+ Math.floor(item.durationTime / 60) : Math.floor(item.durationTime / 60)}분 {Math.floor(item.durationTime % 60) < 10 ? '0'+ Math.floor(item.durationTime % 60) : Math.floor(item.durationTime % 60)}초 
                </TextWrap>
              )
              }
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    margin: 5,
    //paddingRight: widthPercentage(10),
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  main: {
    flex: 1,
  },
  mainContent: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    position:'relative',
    flexWrap:'nowrap'
  },
  date: {
    marginTop: 5,
    fontWeight: '700',
  },
  title: {
    color: colors.black,
    marginVertical: 3,
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(17),
    textAlign: 'center',
    top: 10,
  },
  writer: {
    color: colors.black,
    marginVertical: heightPercentage(5),
    fontSize: fontPercentage(9),
    lineHeight: fontPercentage(17),
    textAlign: 'center',
  },
  divider: {
    marginHorizontal: 16,
    borderWidth: 0.3,
    borderColor: '#ccc',
  },
  thumbnail: {
    height: screenWidth / 2.8,
    width: screenWidth / 3.3,
    resizeMode: 'cover',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
      },
      android: {
        backgroundColor: 'white',
      },
    }),
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'center',
  },
  buttonContainer: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
  button1: {
    width: 40,
    height: 40,
    flex: 1,
    resizeMode: 'contain',
    marginRight: 10,
  },
  button2: {
    width: 40,
    height: 40,
    flex: 1,
    resizeMode: 'contain',
  },
  headerContainer: {
    backgroundColor: colors.white,
  },
  header: {
    fontSize: fontPercentage(14),
    lineHeight: fontPercentage(18),
    color: colors.black,
    // fontWeight: '700',
  },
  cardHeaderTitle: {
    color: colors.black,
    fontSize: fontPercentage(14),
    lineHeight: fontPercentage(18),
  },
  blueText: {
    color: colors.blue,
  },
  showContent: {
    opacity:0.8,
    position:'absolute',
    backgroundColor:colors.black,
    height: screenWidth / 3,
    width: screenWidth / 3.3,
    bottom:screenHeight / 8.4,
    zIndex:9999,
    alignItems:'center'
  },
  playbtn: {
    width:'85%',
    height:'20%',
    borderWidth:1,
    borderColor:colors.white,
    marginTop:'23%',
    alignSelf:'center',
    justifyContent:'center'
  },
  playtext: {
    height:'100%',
    color:colors.white,
    fontSize:fontPercentage(13),
    alignSelf:'center',
    textAlignVertical:'center',
    fontWeight:'bold'
    
  },

});
