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
import { fontPercentage } from '../../services/util';
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
        <View style={styles.dialog}>
          <TouchableHighlight style={styles.dialog2}>
            <View>
              <TextWrap style={styles.message2} />
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.dialog3}>
            <>
              {selectDialog.item.length > 0 &&
                selectDialog.item.map((x, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.iconContainer}
                      // onPress={x.onPress}
                      onPress={() => handleOnpress(x.onPress)}>
                      <Image
                        style={
                          x.type === 'login' ? styles.loginIcon : styles.icon
                        }
                        source={x.source}
                      />
                      <TextWrap style={styles.message}>{x.name}</TextWrap>
                    </TouchableOpacity>
                  );
                })}
            </>
          </TouchableHighlight>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    bottom: 0,
    zIndex: consts.dialogZindex,
  },
  wrap: {flex: 1, justifyContent: 'flex-end'},
  dialog: {
    flexDirection: 'column',
  },
  dialog2: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  dialog3: {
    // flex: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: colors.white,
    // paddingHorizontal: 3,
  },
  message: {
    lineHeight: 21,
    fontSize: fontPercentage(12),
    color: '#222222',
    fontWeight: '700',
    textAlign: 'center',
  },
  message2: {
    lineHeight: 21,
    fontSize: fontPercentage(18),
    // marginTop: 10,
    color: '#222222',
    fontWeight: '700',
    textAlign: 'center',
  },
  iconContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  loginIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});
