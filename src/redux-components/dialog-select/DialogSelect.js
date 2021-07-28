import React, {useEffect} from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Image,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import {dialogClose} from '../../redux/dialog/DialogActions';
import images from '../../libs/images';

export default function DialogSelect({}) {
  const dispatch = useDispatch();
  const {selectDialog} = useSelector(s => s.dialog, shallowEqual);
  useEffect(() => {
    if (selectDialog.open) {
      Keyboard.dismiss();
    }
  }, [selectDialog.open]);

  if (!selectDialog.open) {
    return null;
  }

  const handleOnpress = onPress => {
    dispatch(dialogClose());
    onPress();
  };
  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity
        style={styles.wrap}
        onPress={() => dispatch(dialogClose())}>
        <TouchableHighlight style={styles.dialog}>
          <>
            {selectDialog.item.length > 0 &&
              selectDialog.item.map((x, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.iconContainer}
                    // onPress={x.onPress}
                    onPress={() => handleOnpress(x.onPress)}>
                    <Image style={styles.icon} source={x.source} />
                    <TextWrap style={styles.message}>{x.name}</TextWrap>
                  </TouchableOpacity>
                );
              })}
          </>
        </TouchableHighlight>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center'},
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    bottom: 0,
    zIndex: consts.dialogZindex,
  },
  wrap: {flex: 1, justifyContent: 'center'},
  dialog: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    marginHorizontal: 30,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  message: {
    lineHeight: 21,
    fontSize: 12,
    color: '#222222',
    fontWeight: '700',
    textAlign: 'center',
  },
  iconContainer: {
    width: '20%',
    paddingBottom: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});
