import React from 'react';
import {FlatList, View, TouchableOpacity, StyleSheet} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
  fontPercentage,
  screenWidth,
} from '../../services/util';
import fonts from '../../libs/fonts';
import colors from '../../libs/colors';
import TextButton2 from '../../components/text-button/TextButton2';
import Avatar from '../../components/avatar/Avatar';
import TextButton3 from '../../components/text-button/TextButton3';

const renderItem = ({
  reReplyIdx,
  memberId,
  memberIdx,
  profile,
  contents,
  regDate,
  updateDate,
  loginid,
}) => {
  return (
    <View style={styles.replyContainer}>
      <View style={styles.infoContainer}>
        <Avatar
          size={widthPercentage(25)}
          style={styles.avator}
          path={
            profile
              ? profile
              : 'https://toaping.me/bookfacegram/images/menu_left/icon/toaping.png'
          }
        />

        <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'column'}}>
            <TextWrap
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.info}
              font={fonts.kopubWorldDotumProBold}>
              {memberId?.split('@')[0]}
            </TextWrap>
            {memberId === loginid ? <View style={{width:widthPercentage(55),justifyContent:'space-between', left:screenWidth / 2.5, position:'absolute',flexDirection:'row'}}><TextButton3 style={styles.replyedit} styleTitle={styles.replyeditfont}>수정</TextButton3><TextButton2 style={styles.replydelete} styleTitle={styles.replydeletefont}>삭제</TextButton2></View> : null}
            <TextWrap style={styles.infoRight} onPress={() => {}}>
              {contents}
            </TextWrap>
          </View>
          <View style={{flexDirection: 'row', marginTop: heightPercentage(6)}}>
            <TextWrap style={styles.infoDate}>
              {updateDate ? updateDate : regDate}
            </TextWrap>
          </View>
        </View>
      </View>
    </View>
  );
};

export const ReplyItem = React.memo(renderItem);

const styles = StyleSheet.create({
  itemContainerFirst: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: heightPercentage(14),
  },
  replyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: heightPercentage(14),
    marginLeft: widthPercentage(30),
  },
  replyedit: {
    
    width:widthPercentage(25),
    backgroundColor:'#215bff',
  },
  replydelete: {
    width:widthPercentage(25),
    backgroundColor:'#fff',
    borderColor:'#215bff',
    borderWidth:0.5

  },
  replyeditfont: {
    height:heightPercentage(14),
    fontSize: fontPercentage(8),
    textAlignVertical:'center',
    textAlign: 'center',
    color:'#fff',
  },
  replydeletefont: {
    height:heightPercentage(14),
    fontSize: fontPercentage(8),
    textAlign: 'center',
    textAlignVertical:'center',
    color:'#215bff'

  },
  infoContainer: {
    flexDirection: 'row',
  },
  info: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(19),
    marginLeft: widthPercentage(7),
    color: '#333333',
  },
  infoRight: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(19),
    marginLeft: widthPercentage(7),
    color: '#333333',
  },
  infoDate: {
    fontSize: fontPercentage(8),
    marginLeft: widthPercentage(7),
    color: '#727272',
  },
  infoDateRight: {
    fontSize: fontPercentage(8),
    marginLeft: widthPercentage(7),
    color: '#727272',
  },

  avator: {
    resizeMode: 'cover',
  },
  button: {
    borderWidth: 0.5,
    borderColor: '#707070',
    backgroundColor: colors.white,
    borderRadius: 0,
    width: widthPercentage(50),
    height: heightPercentage(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(16),
  },
});
