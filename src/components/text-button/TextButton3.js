import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import { useDispatch,useSelector,shallowEqual } from 'react-redux';
import TextWrap from '../text-wrap/TextWrap';
import { dialogClose, dialogOpenAction,dialogOpenMessage } from '../../redux/dialog/DialogActions';
import { requestPut } from '../../services/network';
import consts from '../../libs/consts';
import routes from '../../libs/routes';
import { navigate } from '../../services/navigation';

export default function TextButton3({
  children,
  onPress,
  style,
  disabled,
  styleTitle,
  font,
  feedIdx,
}) {
const user = useSelector(s => s.user, shallowEqual);
const dispatch = useDispatch();
const editReply = (onPress) => {
  console.log(onPress)
}

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => {editReply(onPress)}}
      style={[styles.root, style]}>
      <TextWrap font={font} style={[styleTitle]}>
        {children}
      </TextWrap>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
