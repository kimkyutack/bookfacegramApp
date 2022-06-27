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
  ({
    referer,
    type
  }) =>
    dispatch => {
      if (type === 'init') {
        dispatch({ type: SessionActionType.init, referer });
      }
    };

export const browsing_time =
  (referer) => {
    browsing_time2(referer, 0);
  };


const browsing_time2 = (referer, initDateState) => dispatch => {
  let hour = 0, minute = 0, second = -1;
  let dsp_hour, dsp_minute, dsp_second;

  second++;

  if (minute == 60) {
    hour++;
    minute = 0;
  }
  if (second == 60) {
    minute++;
    second = 0;
  }

  if (hour < 10)
    dsp_hour = '0' + hour;
  else
    dsp_hour = hour;

  if (minute < 10)
    dsp_minute = '0' + minute;
  else
    dsp_minute = minute;

  if (second < 10)
    dsp_second = '0' + second;
  else
    dsp_second = second;


  let date_state = dsp_hour + dsp_minute + dsp_second;

  setTimeout(browsing_time2(referer), 1000);

  dispatch({
    type: SessionActionType.active, referer: referer, sessionTime: date_state
  });

  if (initDateState === 0) {
    date_state = '000000';
  }
}
