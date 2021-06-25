import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import TextWrap from '../text-wrap/TextWrap';
import {calculateTimer} from '../../services/util';
export default function Timer({second, style, onTimeOut}) {
  const [renderSecond, setRenderSecond] = useState(0);

  useEffect(() => {
    let ts = second;
    let tm = setInterval(() => {
      setRenderSecond(ts);
      ts--;

      if (ts === 0) {
        clearInterval(tm);
        tm = null;
        onTimeOut();
      }
    }, 900);

    return () => {
      if (tm) {
        clearInterval(tm);
      }
    };
  }, [second]);
  return (
    <TextWrap style={[styles.timer, style]}>
      {renderSecond ? calculateTimer(renderSecond) : '00:00'}
    </TextWrap>
  );
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 12,
    lineHeight: 14,
  },
});
