import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import image from '../../libs/image';
import {openMail} from '../../services/util';

export default function ServiceCenter({keyboardDismiss, primary}) {
  const {show} = useSelector((s) => s.keyboard, []);
  return (
    <View>
      {(!keyboardDismiss || (!show && keyboardDismiss)) && (
        <>
          <TextWrap style={styles.footer}>{primary},</TextWrap>
          <View style={styles.footerWrap}>
            <TextWrap style={styles.footer2}>please contact </TextWrap>
            <TextWrap onPress={openMail} style={styles.footerBold}>
              the Contact Center.
            </TextWrap>
            <Image
              style={styles.arrowHalfRight}
              source={image.arrowHalfRight}
            />
          </View>
        </>
      )}
      {(!keyboardDismiss || (!show && keyboardDismiss)) && (
        <View style={styles.footer3}>
          <Image style={styles.clock} source={image.clock} />
          <TextWrap style={styles.footer3T1}>
            Operating Hours | Week days 09:00~18:00 (KST)
          </TextWrap>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  clock: {width: 15, height: 15, marginRight: 2},
  footer3: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 30,
  },
  footer3T1: {
    lineHeight: 15,
    fontSize: 12,
    color: '#777777',
  },
  footerWrap: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'center',
  },
  arrowHalfRight: {
    resizeMode: 'contain',
    width: 10,
    height: 4.2,
    marginLeft: 4,
  },
  footer: {
    marginHorizontal: 16,
    color: '#999999',
    lineHeight: 18,
    fontSize: 12,
  },
  footer2: {
    marginLeft: 16,
    color: '#999999',
    lineHeight: 18,
    fontSize: 12,
  },
  footerBold: {
    fontSize: 12,
    lineHeight: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
    color: '#222222',
  },
});
