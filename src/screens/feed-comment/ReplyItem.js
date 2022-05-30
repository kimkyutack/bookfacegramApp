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
  onEditreReply,
  onDeleteRereply,
}) => {
  return (
    <View style={styles.replyContainer}>
      <View style={styles.infoContainer}>
        <Avatar
          size={widthPercentage(30)}
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
              numberOfLines={1}
              style={styles.info}
              ellipsizeMode="tail"
              font={fonts.kopubWorldDotumProBold}>
              {memberId}
            </TextWrap>
            {memberId === loginid ? <View style={{width:widthPercentage(65),justifyContent:'space-between', left:screenWidth / 2.3, position:'absolute',flexDirection:'row'}}><TextButton2 style={styles.replyedit} onPress={onEditreReply}  contents={contents}  replyIdx={reReplyIdx} styleTitle={styles.replyeditfont}>수정</TextButton2><TextButton2 style={styles.replydelete} styleTitle={styles.replydeletefont} onPress={onDeleteRereply} replyIdx={reReplyIdx}>삭제</TextButton2></View> : null}
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
      height: heightPercentage(18),
      width:widthPercentage(30),
      backgroundColor:'#215bff',
    },
    replydelete: {
      height: heightPercentage(18),
      width:widthPercentage(30),
      backgroundColor:'#fff',
      borderColor:'#215bff',
      borderWidth:0.5

    },
  replyeditfont: {
    height:heightPercentage(14),
    fontSize: fontPercentage(10),
    textAlignVertical:'center',
    textAlign: 'center',
    color:'#fff',
  },
  replydeletefont: {
    height:heightPercentage(14),
    fontSize: fontPercentage(10),
    textAlign: 'center',
    textAlignVertical:'center',
    color:'#215bff'

  },
  infoContainer: {
    flexDirection: 'row',
  },
  info: {
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(19),
    marginLeft: widthPercentage(7),
    color: '#333333',
    width:screenWidth / 3,
  },
  infoRight: {
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(19),
    marginLeft: widthPercentage(7),
    color: '#333333',
  },
  infoDate: {
    fontSize: fontPercentage(10),
    marginLeft: widthPercentage(7),
    color: '#727272',
  },
  infoDateRight: {
    fontSize: fontPercentage(10),
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
