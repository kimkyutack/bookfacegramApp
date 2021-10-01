import React from 'react';
import {FlatList, View, TouchableOpacity, StyleSheet} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
  fontPercentage,
} from '../../services/util';
import fonts from '../../libs/fonts';
import colors from '../../libs/colors';
import Avatar from '../../components/avatar/Avatar';
import {ReplyItem} from './ReplyItem';

const renderItem = ({
  replyIdx,
  memberId,
  memberIdx,
  profile,
  reReplyList,
  contents,
  regDate,
  updateDate,
  index,
  replys,
  onChangeReply,
}) => {
  return (
    <>
      <View
        style={index === 0 ? styles.itemContainerFirst : styles.itemContainer}>
        <View style={styles.infoContainer}>
          <Avatar
            size={widthPercentage(25)}
            style={styles.avator}
            path={
              profile
                ? profile
                : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
            }
          />

          <View style={{flexDirection: 'column'}}>
            <View style={{flexDirection: 'column'}}>
              <TextWrap
                numberOfLines={1}
                style={styles.info}
                font={fonts.kopubWorldDotumProBold}>
                {memberId?.split('@')[0]}
              </TextWrap>
              <TextWrap style={styles.infoRight} onPress={() => {}}>
                {contents}
              </TextWrap>
            </View>
            <View
              style={{flexDirection: 'row', marginTop: heightPercentage(6)}}>
              <TextWrap style={styles.infoDate}>
                {updateDate ? updateDate : regDate}
              </TextWrap>
              <TextWrap
                style={styles.infoDateRight}
                onPress={() => onChangeReply(replyIdx)}>
                답글달기
              </TextWrap>
            </View>
          </View>
        </View>
      </View>
      {reReplyList && (
        <FlatList
          data={reReplyList}
          extraData={reReplyList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index1) => {
            return index1.toString();
          }}
          renderItem={({item, index1}) => {
            return <ReplyItem {...item} index={index1} />;
          }}
        />
      )}
    </>
  );
};

export const CommentItem = React.memo(renderItem);

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
