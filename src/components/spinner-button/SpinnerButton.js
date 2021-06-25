import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import TextWrap from '../text-wrap/TextWrap';
// import {Picker} from '@react-native-picker/picker';
import {screenHeight, screenWidth} from '../../services/util';
import colors from '../../libs/colors';

export default function SpinnerButton({
  style,
  data,
  value,
  onChange,
  allPlaceholder,
  placeholder,
  icon,
}) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (data && value) {
      setLabel(
        [...data, {label: allPlaceholder || 'All', value: 'all'}].filter(
          x => x.value === value,
        )[0]?.label || '',
      );
    } else {
      setLabel('');
    }
  }, [data, value]);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setOpen(o => !o);
        }}
        style={[styles.root, style]}>
        <TextWrap style={[styles.label, {color: label ? '#222' : '#ababab'}]}>
          {label || placeholder}
        </TextWrap>
        {Boolean(icon) && <Image style={styles.icon} source={icon} />}
      </TouchableOpacity>
      {open && (
        <Modal
          visible
          animationType="fade"
          transparent
          onRequestClose={() => {
            setOpen(false);
          }}>
          <View style={styles.modal}>
            <View style={styles.modalList}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {data &&
                  [{label: allPlaceholder || 'All', value: 'all'}, ...data].map(
                    (item, index) => {
                      return (
                        <TouchableOpacity
                          key={index.toString()}
                          style={styles.modalItem}
                          onPress={() => {
                            setOpen(false);
                            onChange && onChange(item.value);
                          }}>
                          <TextWrap style={styles.modalItemText}>
                            {item.label}
                          </TextWrap>
                        </TouchableOpacity>
                      );
                    },
                  )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalList: {
    borderRadius: 10,
    backgroundColor: colors.white,
    maxHeight: screenHeight / 2,
    width: screenWidth / 1.5,
  },
  modalItem: {
    alignSelf: 'stretch',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  modalItemText: {
    color: '#222',
    fontSize: 14,
    lineHeight: 20,
  },
  //
  root: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: '#222222',
    lineHeight: 17,
    fontSize: 14,
  },
  icon: {
    width: 20,
    resizeMode: 'contain',
    height: 20,
  },
});
