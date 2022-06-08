import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import Tooltip from 'react-native-walkthrough-tooltip';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import images from '../../libs/images';
import {heightPercentage, widthPercentage} from '../../services/util';
import TextWrap from '../../components/text-wrap/TextWrap';
import fonts from '../../libs/fonts';
import {
  dialogClose,
  dialogOpenAction,
  dialogOpenDrawerKeyBoard,
  dialogError,
  dialogOpenMessage,
} from '../../redux/dialog/DialogActions';
import {requestDelete} from '../../services/network';
export default function EditToolTip({item, index, length, onPress}) {
  const dispatch = useDispatch();
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [type, setType] = useState('');

  const removeDrawer = drawIdx => {
    requestDelete({
      url: consts.apiUrl + '/mypage/bookDrawer',
      query: {
        drawIdx: drawIdx,
      },
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          onPress();
        } else if (res.status === 'FAIL') {
          // error 일때 해야함
          dispatch(dialogError('fail'));
        } else {
          dispatch(dialogError('fail'));
        }
      })
      .catch(error => {
        // error 일때 해야함
        dispatch(dialogError(error));
      });
  };

  useEffect(() => {
    let mount = true;
    if (mount === true && !toolTipVisible && type === 'rename') {
      setType('');
      dispatch(dialogClose());
      dispatch(
        dialogOpenDrawerKeyBoard({
          title: '책서랍 이름 변경',
          buttonTitle: '완료',
          text: item?.name,
          drawIdx: item.drawIdx,
          onPress: onPress,
          from: 'rename',
        }),
      );
    }
    return () => {
      mount = false;
    };
  }, [toolTipVisible]);

  useEffect(() => {
    let isMounted = true;
     if(isMounted ){
      setToolTipVisible(false);
      setType('');
      } 
    return () => {
      isMounted = false;
    };
  }, []);

  const shareDrawer = () => {
    setToolTipVisible(false);
    setType('share');
    dispatch(dialogClose());
    dispatch(
      dialogOpenMessage({
        message: '해당 서비스는 준비중입니다. 곧 만나요!',
      }),
    );

  }

  return (
    <Tooltip
      isVisible={toolTipVisible}
      content={
        <View style={styles.root}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              setToolTipVisible(false);
              setType('rename');
            }}>
            <Image source={images.toolTipRename} style={styles.icon} />
            <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.text}>
              책서랍 이름 변경
            </TextWrap>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              setToolTipVisible(false);
              setType('delete');
              dispatch(
                dialogOpenAction({
                  title: '삭제',
                  titleColor: '#2699fb',
                  cancelTitle: '취소',
                  message: `선택한 책서랍을 삭제하시겠습니까?${'\n'}삭제된 책서랍은 복구가 불가능하며, 해당 책서랍에${'\n'}보관중인 책도 함께 삭제됩니다.`,
                  onPress: a => {
                    if (a) {
                      removeDrawer(item.drawIdx);
                    }
                  },
                }),
              );
            }}>
            <Image source={images.toolTipDelete} style={styles.icon} />
            <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.text}>
              책서랍 삭제
            </TextWrap>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => {
              shareDrawer();
            }}>
            <Image source={images.toolTipShare} style={styles.icon} />
            <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.text}>
              책서랍 공유
            </TextWrap>
          </TouchableOpacity>
        </View>
      }
      placement={
        length - 1 === index || length - 2 === index
          ? length - 2 === index && length % 2 === 1
            ? 'bottom'
            : 'top'
          : 'bottom'
      }
      arrowSize={{width: 0, height: 0}}
      backgroundColor="rgba(0,0,0,0)"
      contentStyle={{
        elevation: 4,
        width: widthPercentage(308.8) / 2,
        height: heightPercentage(103),
      }}
      tooltipStyle={index % 2 === 0 ? {left: 18} : {left: widthPercentage(190)}}
      showChildInTooltip={false}
      onClose={() => setToolTipVisible(false)}>
      <TouchableOpacity
        onPress={() => {
          setToolTipVisible(true);
        }}>
        <Image style={styles.editOpen} source={images.editOpen} />
      </TouchableOpacity>
    </Tooltip>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop: heightPercentage(8),
    marginBottom: heightPercentage(6),
    marginLeft: 6,
    height: heightPercentage(75),
  },
  editOpen: {
    width: widthPercentage(20),
    height: widthPercentage(12),
    resizeMode: 'contain',
    marginRight: 15,
    marginTop: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  icon: {
    width: widthPercentage(13),
    height: widthPercentage(13),
    resizeMode: 'contain',
  },
  text: {
    bottom: 2,
    marginLeft: 6,
  },
});
