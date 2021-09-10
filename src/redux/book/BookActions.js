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
  followSuccess: 'book/follow/success',
  followSuccessPaging: 'book/follow/successPaging',
  userSuccess: 'book/user/success',
  userSuccessPaging: 'book/user/successPaging',
  allSuccess: 'book/all/success',
  allSuccessPaging: 'book/all/successPaging',
  followUpdate: 'book/follow/update',
  userUpdate: 'book/user/update',
  allUpdate: 'book/all/update',
  failure: 'book/failure',
  userFailure: 'book/user/failure',
  allFailure: 'book/all/failure',
  init: 'book/init',
};

export const getFeedHome = (page, limit, time) => async dispatch => {
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
          if (page === 1) {
            throw {data: {msg: 'nodata'}};
          }
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
  (memberId, memberIdx, page, limit, time) => async dispatch => {
    dispatch({type: bookActionType.loading});
    requestGet({
      url: consts.apiUrl + '/mypage/feedBook/other',
      query: {
        memberIdx: memberIdx,
        startPaging: (page === 1 ? 0 : page - 1) * limit, // limit start
        endPaging: limit, // limit end
        time: time,
      },
    })
      .then(data => {
        if (data.status === 'SUCCESS') {
          if (data.data?.myFeedBook.length === 0) {
            if (page === 1) {
              throw {
                data: {
                  msg: 'nodata',
                  currentUserId: memberId,
                  userPage: page,
                  profilePath: data.data?.profile,
                  followerCnt: data.data?.followerCnt,
                  followingCnt: data.data?.followingCnt,
                  totalCnt: data.data?.totalCnt,
                },
              };
            } else {
              throw {
                data: {
                  msg: 'nomoredata',
                  currentUserId: memberId,
                  userPage: page,
                  profilePath: data.data?.profile,
                  followerCnt: data.data?.followerCnt,
                  followingCnt: data.data?.followingCnt,
                  totalCnt: data.data?.totalCnt,
                },
              };
            }
          }
          dispatch({
            type:
              page > 1
                ? bookActionType.userSuccessPaging
                : bookActionType.userSuccess,
            data: data.data?.myFeedBook,
            currentUserId: memberId,
            userPage: page,
            profilePath: data.data?.profile,
            followerCnt: data.data?.followerCnt,
            followingCnt: data.data?.followingCnt,
            totalCnt: data.data?.totalCnt,
          });
        } else if (data.status === 'FAIL') {
          dispatch({
            type: bookActionType.userFailure,
            data: data?.msg,
            currentUserId: memberId,
            userPage: page,
            profilePath: data.data?.profile,
            followerCnt: data.data?.followerCnt,
            followingCnt: data.data?.followingCnt,
            totalCnt: data.data?.totalCnt,
          });
        } else {
          dispatch({
            type: bookActionType.userFailure,
            data: `error code : ${data?.code}`,
            currentUserId: memberId,
            userPage: page,
            profilePath: data.data?.profile,
            followerCnt: data.data?.followerCnt,
            followingCnt: data.data?.followingCnt,
            totalCnt: data.data?.totalCnt,
          });
        }
      })
      .catch(error => {
        dispatch({
          type: bookActionType.userFailure,
          data:
            error?.data?.msg ||
            error?.message ||
            (typeof error === 'object' ? JSON.stringify(error) : error),
          currentUserId: memberId,
          userPage: page,
          profilePath: error?.data?.profile,
          followerCnt: error?.data?.followerCnt,
          followingCnt: error?.data?.followingCnt,
          totalCnt: error.data?.totalCnt,
        });
      });
  };

export const getFeedAll = (page, limit, time) => async dispatch => {
  dispatch({type: bookActionType.loading});
  requestGet({
    url: consts.apiUrl + '/mypage/feedBook/all',
    query: {
      startPaging: (page === 1 ? 0 : page - 1) * limit, // limit start
      endPaging: limit, // limit end
      time: time,
    },
  })
    .then(data => {
      if (data.status === 'SUCCESS') {
        if (data.data?.feedBookAllList.length === 0) {
          if (page === 1) {
            throw {data: {msg: 'nodata'}};
          } else {
            throw {data: {msg: 'nomoredata'}};
          }
        }
        dispatch({
          type:
            page > 1
              ? bookActionType.allSuccessPaging
              : bookActionType.allSuccess,
          data: data.data?.feedBookAllList,
          allPage: page,
        });
      } else if (data.status === 'FAIL') {
        dispatch({
          type: bookActionType.allFailure,
          data: data?.msg,
          allPage: page,
        });
      } else {
        dispatch({
          type: bookActionType.allFailure,
          data: `error code : ${data?.code}`,
          allPage: page,
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
        allPage: page,
      });
    });
};
