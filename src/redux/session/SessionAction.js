import consts from "../../libs/consts";
import { requestPost } from "../../services/network";
import {
  dialogOpenMessage,
  dialogError,
  dialogOpenSelect,
  dialogClose,
} from '../dialog/DialogActions';




export const SessionActionType = {
  main: 'session/main',
  init: 'session/init',
  active: 'session/active',
};

export const setSession =
  (referer, type) =>
    dispatch => {
      if (type === 'init') {
        dispatch({ type: SessionActionType.init, referer: referer });
      } else if (type === 'main') {
        dispatch({ type: SessionActionType.main });
      }
    };

export const browsingTime = (referer, date_state) => dispatch => {
  dispatch({
    type: SessionActionType.active, referer: referer, sessionTime: date_state,
  });


  // const formData = new FormData();
  // formData.append('sessionTime', date_state);
  // formData.append('url', referer);


  // const { data, status } = await requestFile(
  //   { url: consts.apiUrl + '/pagelog/insert', method: 'post' },
  //   formData,
  // );

  // if (status === 'SUCCESS') {
  //   console.log('success');
  // } else {
  //   console.log('fail');
  // }


}