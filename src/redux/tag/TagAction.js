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

export const TagActionType = {
  popularloading: 'tag/popular/loading',
  popularSuccess: 'tag/popular/success',
  popularSuccessPaging: 'tag/popular/successPaging',
  popularFailure: 'tag/popular/failure',

  newestLoading: 'tag/newest/loading',
  newestSuccess: 'tag/newest/success',
  newestSuccessPaging: 'tag/newest/successPaging',
  newestFailure: 'tag/newest/failure',

  init: 'tag/init',
};

export const getPopularHashTag =
  (hashTag, type, page, limit, time) => async dispatch => {
    dispatch({type: TagActionType.popularloading});
    requestGet({
      url: consts.apiUrl + '/mypage/feedBook/search/hashTag',
      query: {
        hashTag: hashTag,
        type: type,
        startPaging: (page === 1 ? 0 : page - 1) * limit, // limit start
        endPaging: limit, // limit end
        time: time,
      },
    })
      .then(data => {
        if (data.status === 'SUCCESS') {
          if (data.data?.feedList.length === 0) {
            if (page === 1) {
              throw {
                data: {
                  msg: 'nodata',
                  popularPage: page,
                  totalCnt: data.data?.totalCnt,
                  currentHashTag: hashTag,
                },
              };
            } else {
              throw {
                data: {
                  msg: 'nomoredata',
                  popularPage: page,
                  totalCnt: data.data?.totalCnt,
                  currentHashTag: hashTag,
                },
              };
            }
          }
          dispatch({
            type:
              page > 1
                ? TagActionType.popularSuccessPaging
                : TagActionType.popularSuccess,
            data: data.data?.feedList,
            popularPage: page,
            totalCnt: data.data?.totalCnt,
            currentHashTag: hashTag,
          });
        } else if (data.status === 'FAIL') {
          dispatch({
            type: TagActionType.popularFailure,
            data: data?.msg,
            popularPage: page,
            totalCnt: data.data?.totalCnt,
            currentHashTag: hashTag,
          });
        } else {
          dispatch({
            type: TagActionType.popularFailure,
            data: `error code : ${data?.code}`,
            popularPage: page,
            totalCnt: data.data?.totalCnt,
            currentHashTag: hashTag,
          });
        }
      })
      .catch(error => {
        dispatch({
          type: TagActionType.popularFailure,
          data:
            error?.data?.msg ||
            error?.message ||
            (typeof error === 'object' ? JSON.stringify(error) : error),
          popularPage: page,
          totalCnt: error.data?.totalCnt,
          currentHashTag: hashTag,
        });
      });
  };

export const getNewestHashTag =
  (hashTag, type, page, limit, time) => async dispatch => {
    dispatch({type: TagActionType.newestLoading});
    requestGet({
      url: consts.apiUrl + '/mypage/feedBook/search/hashTag',
      query: {
        hashTag: hashTag,
        type: type,
        startPaging: (page === 1 ? 0 : page - 1) * limit, // limit start
        endPaging: limit, // limit end
        time: time,
      },
    })
      .then(data => {
        if (data.status === 'SUCCESS') {
          if (data.data?.feedList.length === 0) {
            if (page === 1) {
              throw {data: {msg: 'nodata'}};
            } else {
              throw {data: {msg: 'nomoredata'}};
            }
          }
          dispatch({
            type:
              page > 1
                ? TagActionType.newestSuccessPaging
                : TagActionType.newestSuccess,
            data: data.data?.feedList,
            newestPage: page,
          });
        } else if (data.status === 'FAIL') {
          dispatch({
            type: TagActionType.newestFailure,
            data: data?.msg,
            newestPage: page,
          });
        } else {
          dispatch({
            type: TagActionType.newestFailure,
            data: `error code : ${data?.code}`,
            newestPage: page,
          });
        }
      })
      .catch(error => {
        dispatch({
          type: TagActionType.newestFailure,
          data:
            error?.data?.msg ||
            error?.message ||
            (typeof error === 'object' ? JSON.stringify(error) : error),
          newestPage: page,
        });
      });
  };
