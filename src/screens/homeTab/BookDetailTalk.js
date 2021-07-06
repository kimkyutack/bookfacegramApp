import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import InputWrap from '../../components/input-wrap/InputWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import images from '../../libs/image';
import {formatTime, screenWidth} from '../../services/util';
import BookDetailTalkItem from './BookDetailTalkItem';

export default function BookDetailTalk({}) {
  const [data, setData] = useState([
    {
      comment:
        '북핑에서 제공하는 도서추천 서비스 덕분에 점점 독서에 더 흥미가 생겼어요. 책을 읽고 나서 다양한 독서활동까지 할 수 있으니깐 너무너무 재밌고, 친구들한테도 추천하고 있답니다. 북핑 짱!!',
      register: '피치못할피치:D',
      register_dt: '2021.09.05',
      hash: '#존리 #존리의부자되는습관 #부자를꿈꾼다 #부자되기_도전! #로또당첨',
    },
    {
      comment:
        '독서가 지루하다고만 생각했는데 독서퀴즈도 하고, 생각을 자유롭게 펼칠 수 있는 독후감대회도 있어서 재밌게 이용하고 있어요:) 북핑덕분에 재밌게 책을 읽고 있습니다.',
      register: '자두자두',
      register_dt: '2021.09.05',
      hash: '#존리 #존리의부자되는습관 #부자를꿈꾼다 #부자되기_도전! #로또당첨',
    },
    {
      comment:
        '북핑에서 제공하는 도서추천 서비스 덕분에 점점 독서에 더 흥미가 생겼어요. 책을 읽고 나서 다양한 독서활동까지 할 수 있으니깐 너무너무 재밌고, 친구들한테도 추천하고 있답니다. 북핑 짱!!',
      register: '피치못할피치:D',
      register_dt: '2021.09.05',
      hash: '#존리 #존리의부자되는습관 #부자를꿈꾼다 #부자되기_도전! #로또당첨',
    },
    {
      comment:
        '독서가 지루하다고만 생각했는데 독서퀴즈도 하고, 생각을 자유롭게 펼칠 수 있는 독후감대회도 있어서 재밌게 이용하고 있어요:) 북핑덕분에 재밌게 책을 읽고 있습니다.',
      register: '자두자두',
      register_dt: '2021.09.05',
      hash: '#존리 #존리의부자되는습관 #부자를꿈꾼다 #부자되기_도전! #로또당첨',
    },
    {
      comment:
        '북핑에서 제공하는 도서추천 서비스 덕분에 점점 독서에 더 흥미가 생겼어요. 책을 읽고 나서 다양한 독서활동까지 할 수 있으니깐 너무너무 재밌고, 친구들한테도 추천하고 있답니다. 북핑 짱!!',
      register: '피치못할피치:D',
      register_dt: '2021.09.05',
      hash: '#존리 #존리의부자되는습관 #부자를꿈꾼다 #부자되기_도전! #로또당첨',
    },
    {
      comment:
        '독서가 지루하다고만 생각했는데 독서퀴즈도 하고, 생각을 자유롭게 펼칠 수 있는 독후감대회도 있어서 재밌게 이용하고 있어요:) 북핑덕분에 재밌게 책을 읽고 있습니다.',
      register: '자두자두',
      register_dt: '2021.09.05',
      hash: '#존리 #존리의부자되는습관 #부자를꿈꾼다 #부자되기_도전! #로또당첨',
    },
  ]);
  const [raplyContent, setReplyContent] = useState('');

  return (
    <View style={styles.replyContainer}>
      <InputWrap
        style={styles.input}
        value={raplyContent}
        onChange={setReplyContent}
        borderColor={colors.border}
        maxLength={200}
        optionComponent={
          <TextWrap style={styles.contentCount}>
            ({raplyContent.length} / 200)
          </TextWrap>
        }
        multiline
      />
      <View style={styles.buttonContainer}>
        <ButtonWrap styleTitle={styles.buttonAddTitle} style={styles.buttonAdd}>
          등록
        </ButtonWrap>
      </View>
      <View style={{flex: 1}}>
        {data.map((u, i) => {
          return <BookDetailTalkItem {...u} key={i} />;
        })}
        {/* <FlatList
                  data={data}
                  nestedScrollEnabled
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => {
                    return <EventReplyItem {...item} />;
                  }}
                /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  replyContainer: {
    width: screenWidth,
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  reply: {
    fontWeight: '700',
    color: colors.black,
  },
  input: {
    marginVertical: 12,
    height: 100,
    fontSize: 14,
    color: colors.black,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
  },
  contentCount: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: -8,
    right: 4,
  },
  buttonAdd: {
    width: 60,
    height: 30,
    backgroundColor: colors.black,
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  buttonAddTitle: {
    color: colors.white,
    // fontWeight: '700',
    fontSize: 13,
  },
});
