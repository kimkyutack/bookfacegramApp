import React, {useState, useCallback} from 'react';
import {View, Text, TextPropTypes} from 'react-native';
import fonts from '../../libs/fonts';
import colors from '../../libs/colors';
import propType from 'prop-types';
import {fontPercentage, widthPercentage} from '../../services/util';

export default function TextMoreWrap(props) {
  const [textShown, setTextShown] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);
  const [startWidth, setStartWidth] = useState(0);

  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };
  const onTextLayout = useCallback(e => {
    setStartWidth(e.nativeEvent.lines[props.numOfLines - 1]?.width);
    setLengthMore(e.nativeEvent.lines.length > props.numOfLines);
  }, []);

  return (
    <View>
      <Text
        {...props}
        onTextLayout={onTextLayout}
        numberOfLines={textShown ? undefined : props.numOfLines}
        ellipsizeMode={'clip'}
        style={[
          props.style,
          {fontFamily: props.font || fonts.kopubWorldDotumProLight},
        ]}>
        {props.children}
      </Text>
      {lengthMore ? (
        <Text
          style={{
            fontSize: fontPercentage(11),
            lineHeight: fontPercentage(19),
            fontFamily: props.font || fonts.kopubWorldDotumProLight,
            left: startWidth ? startWidth : widthPercentage(296),
            bottom: 0,
            color: '#727272',
            position: 'absolute',
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
