import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import colors from '../../libs/colors';
import images from '../../libs/images';
import {isIos} from '../../services/util';
import Topbar from '../../components/topbar/Topbar';
import {useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';

const RootLayout = ({
  backgroundColor,
  safeBackgroundColor,
  style,
  children,
  topbar,
  rootComponent,
  absoluteComponent,
}) => {
  const {show} = useSelector(s => s.keyboard, shallowEqual);
  const render = (
    <SafeAreaView
      forceInset={{top: 'never', bottom: show ? 0 : 'always'}}
      style={[
        styles.safe,
        backgroundColor && {backgroundColor},
        safeBackgroundColor && {backgroundColor: safeBackgroundColor},
      ]}>
      <View style={{flex: 1}}>
        {Boolean(topbar) && <Topbar {...topbar} />}
        <View
          style={[styles.root, style, backgroundColor && {backgroundColor}]}>
          {children}
        </View>
        {<StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />}
        {absoluteComponent}
      </View>
      {rootComponent}
    </SafeAreaView>
  );
  if (!isIos) {
    return render;
  }
  return (
    <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
      {render}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.white,
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default React.memo(RootLayout);
