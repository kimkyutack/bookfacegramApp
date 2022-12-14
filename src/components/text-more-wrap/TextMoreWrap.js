import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextPropTypes } from 'react-native';
import fonts from '../../libs/fonts';
import colors from '../../libs/colors';
import propType from 'prop-types';
import { fontPercentage, widthPercentage } from '../../services/util';
import { navigationRef } from '../../services/navigation';

export default function TextMoreWrap(props) {
  const curRouteName = navigationRef.current.getCurrentRoute().name;
  const [textShown, setTextShown] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);
  const [startWidth, setStartWidth] = useState(0);
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };
  //console.log(props.numOfLines)
  const onTextLayout = useCallback(e => {

    setStartWidth(e.nativeEvent.lines[props.numOfLines - 1]?.width);
    setLengthMore(props.children.split(/\r\n|\r|\n/).length > props.numOfLines);

    //console.log('length', e.nativeEvent);
    // console.log('프롭스',props.children);
    // console.log('------------------------------');

  }, []);

  useEffect(() => {
    setTextShown(false);
  }, [curRouteName]);
  //  }, [props?.timeKey]);  scrollTop 설정시 작동해버려서 제거

  return (
    <View>
      <Text
        {...props}
        onTextLayout={onTextLayout}
        numberOfLines={textShown ? undefined : props.numOfLines}
        ellipsizeMode={'clip'}
        style={[
          props.style,
          { fontFamily: props.font || fonts.kopubWorldDotumProLight },
        ]}>
        {props.children}
      </Text>
      {lengthMore ? (
        <Text
          style={{
            fontSize: fontPercentage(13),
            lineHeight: fontPercentage(19),
            fontFamily: props.font || fonts.kopubWorldDotumProLight,
            left: 0,
            bottom: 0,
            color: '#727272',
          }}
          onPress={toggleNumberOfLines}>
          {textShown ? '...줄이기' : '...더보기'}
        </Text>
      ) : null}
    </View>
  );
}

TextMoreWrap.propTypes = {
  ...TextPropTypes,
  font: propType.string,
  style: propType.any,
};
