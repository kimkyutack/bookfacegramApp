import * as React from 'react';
import {requestGet, requestPost} from '../../services/network';

export function browsing_time(referer, startYN) {
  const {sessiontime,setSessiontime} = React.useState('000000');
  const fetchRequested = async () => {
    try {
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/session',
        query: {
          referer: referer,
          sessiontime: sessiontime,
        },
      });
      if (status === 'SUCCESS') {
        setSessiontime('000000');
      }
      return status;
    } catch (error) {

    } finally {

    }
  };
  var hour = 0,minute =0, second =-1;  
  var dsp_hour, dsp_minute, dsp_second;

  if(startYN == 0){
      second++;
      
      if(minute == 60){
        hour++;
        minute = 0;
      }
      if(second == 60){
        minute++;
        second = 0;
      }
      
      if(hour < 10)
        dsp_hour = '0' + hour;
      else
        dsp_hour = hour;
      
      if(minute < 10)
        dsp_minute = '0' + minute;
      else
        dsp_minute = minute;
      
      if(second < 10)
        dsp_second = '0' + second;
      else
        dsp_second = second;
      

      var date_state = dsp_hour + dsp_minute + dsp_second;
      
      setTimeout(browsing_time(), 1000);
      setSessiontime(date_state);
    }else{
      fetchRequested();
    }
  }
