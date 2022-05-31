import React, {useEffect} from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  View,
  Image,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import {
  dialogClose,
  dialogOpenAction,
  dialogOpenDrawerKeyBoard,
  dialogError,
} from '../../redux/dialog/DialogActions';
import images from '../../libs/images';
import routes from '../../libs/routes';
import {
  fontPercentage,
  heightPercentage,
  screenWidth,
  widthPercentage,
} from '../../services/util';
import {goBack, navigate} from '../../services/navigation';
import {requestPut, requestPost} from '../../services/network';

export default function DialogDrawer({}) {
  const dispatch = useDispatch();
  const {drawerDialog} = useSelector(s => s.dialog);

  useEffect(() => {
    if (drawerDialog.open) {
      Keyboard.dismiss();
    }
  }, [drawerDialog.open]);

  if (!drawerDialog.open) {
    return null;
  }

  const onPress = x => {
    dispatch(dialogClose());
    if (drawerDialog.from === 'list' || drawerDialog.from === 'detail') {
      dispatch(
        dialogOpenAction({
          titleColor: '#2699fb',
          cancelTitle: '확인',
          title: '바로가기',
          message: `선택한 책이 '${x[0].name}' 책서랍으로 이동되었습니다.`,
          onPress: a => {
            requestPost({
              url: consts.apiUrl + '/mypage/bookDrawer/content',
              body: {
                bookIdx: x[0]?.bookIdx,
                drawIdx: x[0]?.drawIdx,
                type: x[0]?.type,
              },
            })
              .then(res => {
                if (res.status === 'SUCCESS') {
                  if (a) {
                    navigate(routes.bookDrawerDetail, {
                      drawIdx: x[0].contentsIdx,
                      name: x[0].name,
                      timeKey: Date.now(),
                    });
                  }
                } else if (res.status === 'FAIL') {
                  dispatch(dialogError(res.data?.msg || 'fail'));
                } else {
                  dispatch(dialogError('fail'));
                }
              })
              .catch(error => {
                dispatch(dialogError(error));
              });
          },
        }),
      );
    } else {
      dispatch(
        dialogOpenAction({
          titleColor: '#2699fb',
          cancelTitle: '확인',
          title: '바로가기',
          message: `선택한 책이 '${x[0].name}' 책서랍으로 이동되었습니다.`,
          onPress: a => {
            requestPut({
              url: consts.apiUrl + '/mypage/bookDrawer/content',
              body: {
                contentsIdx: drawerDialog.selectedArr,
                curDrawIdx: drawerDialog.currentDrawerIndex,
                moveDrawIdx: x[0].contentsIdx,
              },
            })
              .then(res => {
                if (res.status === 'SUCCESS') {
                  if (a) {
                    navigate(routes.bookDrawerDetail, {
                      drawIdx: x[0].contentsIdx,
                      name: x[0].name,
                      timeKey: Date.now(),
                    });
                  } else {
                    navigate(routes.bookDrawerDetail, {
                      timeKey: Date.now(),
                    });
                  }
                } else if (res.status === 'FAIL') {
                  // error 일때 해야함
                  dispatch(dialogError(res.data?.msg || 'fail'));
                } else {
                  dispatch(dialogError('fail'));
                }
              })
              .catch(error => {
                dispatch(dialogError(error));
              });
          },
        }),
      );
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity
        style={styles.wrap}
        onPress={() => dispatch(dialogClose())}>
        <TouchableWithoutFeedback
          onPress={() => {
            return;
          }}>
          <View
            style={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              backgroundColor: colors.white,
              height: heightPercentage(350),
              alignItems: 'center',
            }}>
            <View
              style={{
                width: widthPercentage(31),
                borderBottomColor: '#c2c2c2',
                borderRadius: 3,
                borderBottomWidth: 4,
                position: 'absolute',
                top: 12,
                alignSelf: 'center',
              }}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: heightPercentage(30),
                left: widthPercentage(20),
              }}
              onPress={() => dispatch(dialogClose())}>
              <Image source={images.delete} style={styles.delete} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: heightPercentage(25),
                right: widthPercentage(20),
              }}
              onPress={() => {
                dispatch(dialogClose());
                if (drawerDialog.from === 'drawer') {
                  dispatch(
                    dialogOpenDrawerKeyBoard({
                      buttonTitle: '완료',
                      title: '새로운 책서랍 만들기',
                      from: 'drawer',
                      currentDrawerIndex: drawerDialog?.currentDrawerIndex,
                      selectedArr: drawerDialog?.selectedArr,
                    }),
                  );
                } else if (drawerDialog.from === 'list') {
                  dispatch(
                    dialogOpenDrawerKeyBoard({
                      buttonTitle: '완료',
                      title: '새로운 책서랍 만들기',
                      from: 'list',
                      bookIdx: drawerDialog?.bookIdx,
                      viewType: drawerDialog?.viewType,
                    }),
                  );
                } else if (drawerDialog.from === 'detail') {
                  dispatch(
                    dialogOpenDrawerKeyBoard({
                      buttonTitle: '완료',
                      title: '새로운 책서랍 만들기',
                      from: 'detail',
                      bookIdx: drawerDialog?.bookIdx,
                      viewType: drawerDialog?.viewType,
                    }),
                  );
                } else {
                  return;
                }
              }}>
              <Image source={images.drawerAdd} style={styles.add} />
            </TouchableOpacity>
            <TextWrap
              style={styles.inputTitle}
              font={fonts.kopubWorldDotumProBold}>
              {drawerDialog.title ? drawerDialog.title : '이동 책서랍 선택'}
            </TextWrap>
            {drawerDialog.title === '보관 책서랍 선택' ? (
            <TextWrap
              style={styles.inputTitle2}
              font={fonts.kopubWorldDotumProBold}>
              {'해당 도서가 보관되어 있는 책서랍은 보여지지 않습니다.'}
            </TextWrap>
            ): null}
            <View
              style={{
                width: screenWidth,
                borderBottomColor: '#eeeeee',
                borderBottomWidth: 1.5,
                position: 'absolute',
                top: heightPercentage(70),
              }}
            />
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                width: screenWidth,
                marginTop: heightPercentage(20),
                marginBottom: 20,
              }}>
              {drawerDialog.drawerList?.length > 0 
              ? drawerDialog?.drawerList?.map((x, index) => {
                  if (drawerDialog.currentDrawerIndex === x[0].contentsIdx) {
                    return <View key={index} />;
                  } else {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.iconContainer}
                        onPress={() => onPress(x)}>
                        <TextWrap
                          font={fonts.kopubWorldDotumProMedium}
                          style={styles.message}>
                          {x[0]?.name}
                        </TextWrap>
                      </TouchableOpacity>
                    );
                  }
                }) 
              : <View style={styles.root2}>
                  <Image source={images.nodata} style={styles.nodata} />
                  <TextWrap style={styles.text} font={fonts.barlowMedium}>
                    {'보관가능한 책서랍이 없습니다.'}
                  </TextWrap>
                </View>}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root2: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 100,
    color: '#999',
    // paddingTop: '40%',
  },
  nodata: {
    width: screenWidth / 10,
    height: screenWidth / 10,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  text: {
    fontSize: fontPercentage(14),
    lineHeight: fontPercentage(21),
    color: '#999',
  },

  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    bottom: 0,
    zIndex: consts.dialogZindex,
  },
  wrap: {flex: 1, justifyContent: 'flex-end'},
  inputTitle: {
    fontSize: fontPercentage(14),
    color: 'black',
    marginTop: heightPercentage(27),
    textAlign:'center'
  },
  inputTitle2: {
    fontSize: fontPercentage(10),
    color: '#707070',
  },
  message: {
    fontSize: fontPercentage(14),
    color: '#333333',
  },
  iconContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    width: '90%',
    height: 30,
    marginVertical: 3,
    marginLeft: widthPercentage(14),
  },
  delete: {
    width: widthPercentage(14),
    height: heightPercentage(14),
    resizeMode: 'contain',
  },
  add: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'contain',
  },
  inputContainer: {
    backgroundColor: colors.white,
    alignContent: 'center',
    alignItems: 'center',
    height: heightPercentage(206),
  },
});
