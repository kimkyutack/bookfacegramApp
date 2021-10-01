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
  followLoading: 'book/follow/loading',
  followSuccess: 'book/follow/success',
  followSuccessPaging: 'book/follow/successPaging',
  followFailure: 'book/follow/failure',
  userLoading: 'book/user/loading',
  userSuccess: 'book/user/success',
  userSuccessPaging: 'book/user/successPaging',
  userFailure: 'book/user/failure',
  allLoading: 'book/all/loading',
  allSuccess: 'book/all/success',
  allSuccessPaging: 'book/all/successPaging',
  allFailure: 'book/all/failure',

  followUpdate: 'book/update',
  init: 'book/init',
};

export const getFeedHome = (page, limit, time) => async dispatch => {
  dispatch({type: bookActionType.followLoading});
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
            throw {data: {msg: '검색 결과가 없습니다.'}};
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
        dispatch({type: bookActionType.followFailure, data: data?.msg});
      } else {
        dispatch({
          type: bookActionType.followFailure,
          data: `error code : ${data?.code}`,
        });
      }
    })
    .catch(error => {
      dispatch({
        type: bookActionType.followFailure,
        data:
          error?.data?.msg ||
          error?.message ||
          (typeof error === 'object' ? JSON.stringify(error) : error),
      });
    });
};

export const getFeedUser =
  (memberId, memberIdx, page, limit, time) => async dispatch => {
    dispatch({type: bookActionType.userLoading});
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
                  msg: '검색 결과가 없습니다.',
                  currentUserId: memberId,
                  userPage: page,
                  profilePath: data.data?.profile,
                  followerCnt: data.data?.followerCnt,
                  followerList: data.data?.followerList,
                  followingCnt: data.data?.followingCnt,
                  followingList: data.data?.followingList,
                  totalCnt: data.data?.totalCnt,
                  official: data.data?.official ? data.data?.official : 0,
                },
              };
            }
            // else {
            //   throw {
            //     data: {
            //       msg: 'nomoredata',
            //       currentUserId: memberId,
            //       userPage: page,
            //       profilePath: data.data?.profile,
            //       followerCnt: data.data?.followerCnt,
            //       followerList: data.data?.followerList,
            //       followingCnt: data.data?.followingCnt,
            //       followingList: data.data?.followingList,
            //       totalCnt: data.data?.totalCnt,
            //       official: data.data?.official ? data.data?.official : 0,
            //     },
            //   };
            // }
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
            followerList: data.data?.followerList,
            followingCnt: data.data?.followingCnt,
            followingList: data.data?.followingList,
            totalCnt: data.data?.totalCnt,
            official: data.data?.official ? data.data?.official : 0,
          });
        } else if (data.status === 'FAIL') {
          dispatch({
            type: bookActionType.userFailure,
            data: data?.msg,
            currentUserId: memberId,
            userPage: page,
            profilePath: data.data?.profile,
            followerCnt: data.data?.followerCnt,
            followerList: data.data?.followerList,
            followingCnt: data.data?.followingCnt,
            followingList: data.data?.followingList,
            totalCnt: data.data?.totalCnt,
            official: data.data?.official ? data.data?.official : 0,
          });
        } else {
          dispatch({
            type: bookActionType.userFailure,
            data: `error code : ${data?.code}`,
            currentUserId: memberId,
            userPage: page,
            profilePath: data.data?.profile,
            followerCnt: data.data?.followerCnt,
            followerList: data.data?.followerList,
            followingCnt: data.data?.followingCnt,
            followingList: data.data?.followingList,
            totalCnt: data.data?.totalCnt,
            official: data.data?.official ? data.data?.official : 0,
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
          profilePath: error?.data?.profilePath,
          followerCnt: error.data?.followerCnt,
          followerList: error.data?.followerList,
          followingCnt: error.data?.followingCnt,
          followingList: error.data?.followingList,
          totalCnt: error.data?.totalCnt,
          official: error.data?.official ? error.data?.official : 0,
        });
      });
  };

export const getFeedAll = (page, limit, time) => async dispatch => {
  dispatch({type: bookActionType.allLoading});
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
            throw {data: {msg: '검색 결과가 없습니다.'}};
          }
          // else {
          //   throw {data: {msg: 'nomoredata'}};
          // }
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

export const followUpdate =
  (followerCount, followerList, followingCount, followingList) => dispatch => {
    dispatch({
      type: bookActionType.followUpdate,
      followerCnt: followerCount,
      followerList: followerList,
      followingCnt: followingCount,
      followingList: followingList,
    });
  };
