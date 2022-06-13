import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import TextWrap from '../text-wrap/TextWrap';
import { dialogClose, dialogOpenAction, dialogOpenMessage } from '../../redux/dialog/DialogActions';
import { requestDelete } from '../../services/network';
import consts from '../../libs/consts';
import routes from '../../libs/routes';
import { navigate } from '../../services/navigation';

export default function TextButton4({
  children,
  onPress,
  style,
  disabled,
  contents,
  styleTitle,
  font,
  replyIdx,
  bookHashtag,
  starRate
}) {
  const user = useSelector(s => s.user, shallowEqual);
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => { contents === undefined ? onPress(replyIdx) : onPress(replyIdx, contents, bookHashtag, starRate) }}
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