import React, {useCallback} from 'react';
import moment from 'moment';
import consts from '../../libs/consts';
import routes from '../../libs/routes';
import {reset} from '../../services/navigation';
import {
  requestFile,
  requestGet,
  requestPost,
  requestPut,
} from '../../services/network';
import {clearItem, getItem} from '../../services/preference';
import {dialogOpenMessage, dialogError} from '../dialog/DialogActions';

const k = [
  {
    id: 1,
    member_id: 'l879465213@naver.com',
    member_idx: 29,
    uri: '1',
    likes: 121,
    replys: 10,
    contents: '본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    likeMemberList: [45, 29],
    hashTag: [
      '심판',
      '베르나르베르베르',
      '독서',
      '기록',
      '심판',
      '베르나르베르베르',
      '독서',
      '기록',
      '심판',
      '베르나르베르베르',
      '독서',
      '기록',
      '심판',
      '베르나르베르베르',
      '독서',
      '기록',
      '심판',
      '베르나르베르베르',
      '독서',
      '기록',
      '심판',
      '베르나르베르베르',
      '독서',
      '기록',
    ],
    joinDate: '2021.07.31',
  },
  {
    id: 2,
    member_id: '아이디2',
    member_idx: 45,
    uri: '2',
    likes: 122,
    likeMemberList: [45, 29],
    replys: 12,
    contents:
      '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    hashTag: ['심판', '베르나르베르베르', '독서'],
    joinDate: '2021.07.31',
  },
  {
    id: 3,
    member_id: '아이디3',
    member_idx: 31,
    uri: '3',
    likeMemberList: [30],
    likes: 123,
    replys: 13,
    contents:
      '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.',
    hashTag: ['심판', '독서'],
    joinDate: '2021.07.31',
  },
  {
    id: 4,
    member_id: '아이디4',
    member_idx: 32,
    uri: '4',
    likeMemberList: [],
    likes: 124,
    replys: 14,
    contents:
      '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.',
    joinDate: '2021.07.31',
  },
  {
    id: 5,
    member_id: '아이디5',
    member_idx: 33,
    uri: '5',
    likeMemberList: [31],
    likes: 125,
    replys: 15,
    contents:
      '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용',
    joinDate: '2021.07.31',
  },
  {
    id: 6,
    member_id: '아이디6',
    member_idx: 34,
    uri: '6',
    likes: 126,
    likeMemberList: [32],
    replys: 16,
    contents:
      '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    joinDate: '2021.07.31',
  },
  {
    id: 7,
    member_id: '아이디7',
    member_idx: 35,
    uri: '7',
    likes: 127,
    likeMemberList: [33],
    replys: 17,
    contents:
      '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    joinDate: '2021.07.31',
  },
  {
    id: 8,
    member_id: '아이디8',
    member_idx: 36,
    uri: '8',
    likes: 128,
    likeMemberList: [34],
    replys: 18,
    contents:
      '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    joinDate: '2021.07.31',
  },
  {
    id: 9,
    member_id: '아이디9',
    member_idx: 37,
    uri: '9',
    likes: 129,
    likeMemberList: [35],
    replys: 19,
    contents:
      '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    joinDate: '2021.07.31',
  },
  {
    id: 10,
    member_id: '아이디10',
    member_idx: 38,
    uri: '10',
    likeMemberList: [36],
    likes: 121,
    replys: 10,
    contents:
      '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    joinDate: '2021.07.31',
  },
  {
    id: 11,
    member_id: '아이디11',
    member_idx: 39,
    uri: '11',
    likeMemberList: [37],
    likes: 121,
    replys: 11,
    contents:
      '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    joinDate: '2021.07.31',
  },
  {
    id: 12,
    member_id: '아이디12',
    member_idx: 40,
    uri: '12',
    likes: 122,
    likeMemberList: [38],
    replys: 12,
    contents:
      '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    joinDate: '2021.07.31',
  },
  // {
  //   id: 13,
  //   member_id: '아이디13',
  //   uri: '13',
  //   likes: 123,
  //   replys: 13,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 14,
  //   member_id: '아이디14',
  //   uri: '14',
  //   likes: 124,
  //   replys: 14,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 15,
  //   member_id: '아이디15',
  //   uri: '1',
  //   likes: 125,
  //   replys: 15,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 16,
  //   member_id: '아이디15',
  //   uri: '1',
  //   likes: 125,
  //   replys: 15,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 17,
  //   member_id: '아이디15',
  //   uri: '1',
  //   likes: 125,
  //   replys: 15,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 18,
  //   member_id: '아이디15',
  //   uri: '1',
  //   likes: 125,
  //   replys: 15,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 19,
  //   member_id: '아이디15',
  //   uri: '1',
  //   likes: 125,
  //   replys: 15,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 20,
  //   member_id: '아이디15',
  //   uri: '1',
  //   likes: 125,
  //   replys: 15,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 21,
  //   member_id: '아이디15',
  //   uri: '1',
  //   likes: 125,
  //   replys: 15,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 22,
  //   member_id: '아이디15',
  //   uri: '1',
  //   likes: 125,
  //   replys: 15,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 23,
  //   member_id: '아이디23',
  //   uri: '1',
  //   likes: 125,
  //   replys: 15,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 24,
  //   member_id: '아이디15',
  //   uri: '1',
  //   likes: 125,
  //   replys: 15,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 25,
  //   member_id: '아이디25',
  //   uri: '1',
  //   likes: 125,
  //   replys: 15,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 26,
  //   member_id: '아이디15',
  //   uri: '1',
  //   likes: 125,
  //   replys: 15,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 27,
  //   member_id: '아이디15',
  //   uri: '1',
  //   likes: 125,
  //   replys: 15,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 28,
  //   member_id: '아이디28',
  //   uri: '1',
  //   likes: 125,
  //   replys: 15,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 29,
  //   member_id: '아이디15',
  //   uri: '1',
  //   likes: 125,
  //   replys: 15,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 30,
  //   member_id: '아이디15',
  //   uri: '1',
  //   likes: 125,
  //   replys: 15,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
  // {
  //   id: 31,
  //   member_id: '아이디31',
  //   uri: '1',
  //   likes: 125,
  //   replys: 15,
  //   contents:
  //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
  //   joinDate: '2021.07.31',
  // },
];

export const bookActionType = {
  loading: 'book/loading',
  success: 'book/success',
  successPaging: 'book/successPaging',
  failure: 'book/failure',
  update: 'book/update',
  init: 'book/init',
};

export const getFeeds =
  (memberIdx, page = 1, limit = 12) =>
  async dispatch => {
    console.log(
      'getFeeds action : memberIdx',
      memberIdx,
      'page',
      page,
      'limit',
      limit,
      'time',
      moment().format('YYYY-MM-DD HH:mm:ss'),
    );

    dispatch({type: bookActionType.loading});
    requestGet({
      url: consts.apiUrl + '/users/' + memberIdx + '/signout',
      query: {
        member_idx: memberIdx,
        page,
        limit: limit,
        time: moment().format('YYYY-MM-DD hh:mm:ss'),
      },
    })
      .then(data => {
        if (data.status === 'SUCCESS') {
          if (page > 1) {
            dispatch({
              type: bookActionType.successPaging,
              data: data?.feedBookMainList,
            });
          } else {
            dispatch({
              type: bookActionType.success,
              data: data?.feedBookMainList,
            });
          }
        } else if (data.status === 'FAIL') {
          dispatch({type: bookActionType.failure, data: data?.msg});
        } else {
          dispatch({
            type: bookActionType.failure,
            data: `error code : ${data?.code}`,
          });
        }
      })
      .catch(error => {
        if (page > 1) {
          dispatch({type: bookActionType.successPaging, data: k});
        } else {
          dispatch({type: bookActionType.success, data: k});
        }
        dispatch({
          type: bookActionType.failure,
          data: error.message,
        });
      });
  };

export const booksUpdate = books => dispatch => {
  dispatch({type: bookActionType.update, data: books});
};
