import React, {useEffect} from 'react';
import {
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import colors from '../../libs/colors';
import {phoneExts} from '../../services/bulk';
import TextWrap from '../text-wrap/TextWrap';
import Topbar from '../topbar/Topbar';
const Item = ({item, index, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <TextWrap>{item}</TextWrap>
    </TouchableOpacity>
  );
};
const PureItem = React.memo(Item, () => {
  return true;
});

export default function ExtPopup({onClose, onSelect}) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal animationType="slide" visible onRequestClose={handleClose}>
      <SafeAreaView style={styles.root}>
        <View style={styles.root}>
          <Topbar title="Select Country Code" onGoBack={handleClose} />
          <FlatList
            initialNumToRender={10}
            data={phoneExts}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            renderItem={({item, index}) => {
              return (
                <PureItem
                  item={item}
                  index={index}
                  onPress={() => {
                    const ext = item.split('+')[1];
                    if (!ext) {
                      return;
                    }
                    handleClose();
                    onSelect(ext);
                  }}
                />
              );
            }}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  item: {
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    marginHorizontal: 16,
    borderBottomColor: '#f2f2f2',
    paddingVertical: 14,
  },
});
