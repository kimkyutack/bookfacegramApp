import React, {useCallback} from 'react';
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

export const bookActionType = {
  loading: 'book/loading',
  refreshing: 'book/refreshing',
  followSuccess: 'book/follow/success',
  followSuccessPaging: 'book/follow/successPaging',
  userSuccess: 'book/user/success',
  userSuccessPaging: 'book/user/successPaging',
  allSuccess: 'book/all/success',
  allSuccessPaging: 'book/all/successPaging',
  followUpdate: 'book/follow/update',
  userUpdate: 'book/user/update',
  userPageUpdate: 'book/user/page/update',
  allUpdate: 'book/all/update',
  failure: 'book/failure',
  allFailure: 'book/all/failure',
  init: 'book/init',
};

export const getFeedHome =
  (page = 1, limit = 12, time) =>
  async dispatch => {
    dispatch({type: bookActionType.loading});
    requestGet({
      url: consts.apiUrl + '/mypage/feedBook/home',
      query: {
        startPaging: (page === 1 ? 0 : page - 1) * limit, // limit start
        endPaging: page * limit, // limit end
        time: time,
      },
    })
      .then(data => {
        if (data.status === 'SUCCESS') {
          if (data.data?.feedBookMainList.length === 0) {
            throw 'page end';
          }
          dispatch({
            type:
              page > 1
                ? bookActionType.followSuccessPaging
                : bookActionType.followSuccess,
            data: data.data?.feedBookMainList,
          });
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
        dispatch({
          type: bookActionType.failure,
          data:
            error?.data?.msg ||
            error?.message ||
            (typeof error === 'object' ? JSON.stringify(error) : error),
        });
      });
  };

export const getFeedUser =
  (memberIdx, page = 1, limit = 36, time) =>
  async dispatch => {
    dispatch({type: bookActionType.loading});
    requestGet({
      url: consts.apiUrl + '/mypage/feedBook/other',
      query: {
        memberIdx: memberIdx,
        startPaging: (page === 1 ? 0 : page - 1) * limit, // limit start
        endPaging: page * limit, // limit end
        time: time,
      },
    })
      .then(data => {
        if (data.status === 'SUCCESS') {
          if (data.data?.myFeedBook.length === 0) {
            throw 'page end';
          }
          dispatch({
            type:
              page > 1
                ? bookActionType.userSuccessPaging
                : bookActionType.userSuccess,
            data: data.data?.myFeedBook,
            page: page,
            limit: limit,
            profilePath: data.data?.profile,
            followerCnt: data.data?.followerCnt,
            followingCnt: data.data?.followingCnt,
          });
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
        dispatch({
          type: bookActionType.failure,
          data:
            error?.data?.msg ||
            error?.message ||
            (typeof error === 'object' ? JSON.stringify(error) : error),
        });
      });
  };

export const getFeedAll =
  (page, limit = 36, time) =>
  async dispatch => {
    dispatch({type: bookActionType.loading});
    requestGet({
      url: consts.apiUrl + '/mypage/feedBook/all',
      query: {
        startPaging: (page === 1 ? 0 : page - 1) * limit, // limit start
        endPaging: page * limit, // limit end
        time: time,
      },
    })
      .then(data => {
        if (data.status === 'SUCCESS') {
          if (data.data?.feedBookAllList.length === 0) {
            throw 'page end';
          }
          dispatch({
            type:
              page > 1
                ? bookActionType.allSuccessPaging
                : bookActionType.allSuccess,
            data: data.data?.feedBookAllList,
          });
        } else if (data.status === 'FAIL') {
          dispatch({type: bookActionType.failure, data: data?.msg});
        } else {
          dispatch({
            type: bookActionType.allFailure,
            data: `error code : ${data?.code}`,
          });
        }
      })
      .catch(error => {
        dispatch({
          type: bookActionType.allFailure,
          data:
            error?.data?.msg ||
            error?.message ||
            (typeof error === 'object' ? JSON.stringify(error) : error),
        });
      });
  };

export const booksUpdate = (books, viewType) => dispatch => {
  if (viewType === 'follow') {
    dispatch({type: bookActionType.followUpdate, data: books});
  } else if (viewType === 'user') {
    dispatch({type: bookActionType.userUpdate, data: books});
  } else {
    dispatch({type: bookActionType.allUpdate, data: books});
  }
};

export const userPageUpdate = page => dispatch => {
  dispatch({type: bookActionType.userPageUpdate, data: page});
};

export const setRefreshing = () => dispatch => {
  dispatch({type: bookActionType.refreshing});
};

export const initErrorMessage = () => dispatch => {
  dispatch({type: bookActionType.failure, data: ''});
};
