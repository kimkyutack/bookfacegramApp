import {Dimensions, Linking, Platform, PixelRatio} from 'react-native';
import {Provider, useDispatch, useSelector, shallowEqual} from 'react-redux';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import moment from 'moment-timezone';
import {phoneExts} from './bulk';
// import SimpleToast from 'react-native-simple-toast';
import {userUpdateProfileImage} from '../redux/user/UserActions';
import images from '../libs/images';
import routes from '../libs/routes';
import colors from '../libs/colors';
import {
  getImageFromCamera,
  checkMultiplePermissions,
  getImageFromGallery,
} from '../services/picker';
import {
  dialogError,
  dialogOpenAction,
  dialogOpenSelect,
} from '../redux/dialog/DialogActions';
import {navigate} from '../services/navigation';
import {openSettings, PERMISSIONS} from 'react-native-permissions';

let ZEPLIN_UI_WIDTH = 360;
let ZEPLIN_UI_HEIGHT = 740;

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;
export const isIos = Platform.OS === 'ios';

export const widthPercentage = width => {
  const percentage = ((width / ZEPLIN_UI_WIDTH) * 100)?.toFixed(2) * 1;
  return responsiveWidth(percentage);
};
export const heightPercentage = height => {
  const percentage = (height / ZEPLIN_UI_HEIGHT) * 100;
  return responsiveHeight(percentage)?.toFixed(2) * 1;
};
export const fontPercentage = size => {
  let percentage = size * 0.125;
  if (screenWidth >= 411) {
    percentage = size * 0.125;
  } else if (screenWidth >= 375 < 411) {
    percentage = size * 0.117;
  } else {
    percentage = size * 0.112;
  }
  return (
    (responsiveFontSize(percentage)?.toFixed(2) * 1) / PixelRatio.getFontScale()
  );
};

export const cameraItem = () => {
  return [
    {
      name: '카메라',
      source: images.cameraBtn,
      onPress: () =>
        getImageFromCamera()
          .then(async file => {
            if (!file) {
              return;
            }
            navigate(routes.photoEditor, {
              image: file,
              isNewFeed: true,
              key: Date.now(),
              name: 'camera',
            });
          })
          .catch(error => {
            if (
              error === 'getImageFromCamera' ||
              error === 'checkMultiplePermissions' ||
              error === 'getImageFromGallery'
            ) {
              useDispatch(
                dialogOpenAction({
                  title: '설정',
                  titleColor: colors.blue,
                  cancelTitle: '닫기',
                  message:
                    '파일 첨부를 위해 다음 권한이 필요합니다.\n- 저장소 접근 권한\n- 카메라 접근 권한\n설정>어플리케이션>토핑에서 권한을 허용으로 변경해 주세요.',
                  onPress: a => {
                    if (a) {
                      openSettings();
                    }
                  },
                }),
              );
            } else {
              useDispatch(dialogError(error));
            }
          }),
    },
    {
      name: '파일',
      source: images.fileBtn,
      onPress: async () =>
        await getImageFromGallery()
          .then(async file => {
            if (!file) {
              return;
            }
            navigate(routes.photoEditor, {
              image: file,
              isNewFeed: true,
              key: Date.now(),
              name: 'file',
            });
          })
          .catch(error => {
            if (
              error === 'getImageFromCamera' ||
              error === 'checkMultiplePermissions' ||
              error === 'getImageFromGallery'
            ) {
              useDispatch(
                dialogOpenAction({
                  title: '설정',
                  titleColor: colors.blue,
                  cancelTitle: '닫기',
                  message:
                    '파일 첨부를 위해 다음 권한이 필요합니다.\n- 저장소 접근 권한\n- 카메라 접근 권한\n설정>어플리케이션>토핑에서 권한을 허용으로 변경해 주세요.',
                  onPress: a => {
                    if (a) {
                      openSettings();
                    }
                  },
                }),
              );
            } else {
              useDispatch(dialogError(error));
            }
          }),
    },
    {
      name: '갤러리',
      source: images.albumBtn,
      onPress: async () =>
        await checkMultiplePermissions([
          PERMISSIONS.ANDROID.CAMERA,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ])
          .then(result => {
            if (result) {
              navigate(routes.cameraRollPicker, {
                route: routes.feedBook,
                key: Date.now(),
                name: 'gallery',
                type: 'upload',
              });
            }
          })
          .catch(error => {
            if (
              error === 'getImageFromCamera' ||
              error === 'checkMultiplePermissions' ||
              error === 'getImageFromGallery'
            ) {
              useDispatch(
                dialogOpenAction({
                  title: '설정',
                  titleColor: colors.blue,
                  cancelTitle: '닫기',
                  message:
                    '파일 첨부를 위해 다음 권한이 필요합니다.\n- 저장소 접근 권한\n- 카메라 접근 권한\n설정>어플리케이션>토핑에서 권한을 허용으로 변경해 주세요.',
                  onPress: a => {
                    if (a) {
                      openSettings();
                    }
                  },
                }),
              );
            } else {
              useDispatch(dialogError(error));
            }
          }),
    },
  ];
};

export const cameraEditItem = () => {
  return [
    {
      name: '카메라',
      source: images.cameraBtn,
      onPress: () =>
        getImageFromCamera()
          .then(async file => {
            if (!file) {
              return;
            }
            navigate(routes.feedBookEditor, {
              image: file,
              isNewFeed: false,
              key: Date.now(),
              name: 'camera',
            });
          })
          .catch(error => {
            if (
              error === 'getImageFromCamera' ||
              error === 'checkMultiplePermissions' ||
              error === 'getImageFromGallery'
            ) {
              useDispatch(
                dialogOpenAction({
                  title: '설정',
                  titleColor: colors.blue,
                  cancelTitle: '닫기',
                  message:
                    '파일 첨부를 위해 다음 권한이 필요합니다.\n- 저장소 접근 권한\n- 카메라 접근 권한\n설정>어플리케이션>토핑에서 권한을 허용으로 변경해 주세요.',
                  onPress: a => {
                    if (a) {
                      openSettings();
                    }
                  },
                }),
              );
            } else {
              useDispatch(dialogError(error));
            }
          }),
    },
    {
      name: '파일',
      source: images.fileBtn,
      onPress: async () =>
        await getImageFromGallery()
          .then(async file => {
            if (!file) {
              return;
            }
            navigate(routes.feedBookEditor, {
              image: file,
              isNewFeed: false,
              key: Date.now(),
              name: 'file',
            });
          })
          .catch(error => {
            if (
              error === 'getImageFromCamera' ||
              error === 'checkMultiplePermissions' ||
              error === 'getImageFromGallery'
            ) {
              useDispatch(
                dialogOpenAction({
                  title: '설정',
                  titleColor: colors.blue,
                  cancelTitle: '닫기',
                  message:
                    '파일 첨부를 위해 다음 권한이 필요합니다.\n- 저장소 접근 권한\n- 카메라 접근 권한\n설정>어플리케이션>토핑에서 권한을 허용으로 변경해 주세요.',
                  onPress: a => {
                    if (a) {
                      openSettings();
                    }
                  },
                }),
              );
            } else {
              useDispatch(dialogError(error));
            }
          }),
    },
    {
      name: '갤러리',
      source: images.albumBtn,
      onPress: async () =>
        await checkMultiplePermissions([
          PERMISSIONS.ANDROID.CAMERA,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ])
          .then(result => {
            if (result) {
              navigate(routes.cameraRollPicker, {
                route: routes.feedBook,
                key: Date.now(),
                name: 'gallery',
                type: 'edit',
              });
            }
          })
          .catch(error => {
            if (
              error === 'getImageFromCamera' ||
              error === 'checkMultiplePermissions' ||
              error === 'getImageFromGallery'
            ) {
              useDispatch(
                dialogOpenAction({
                  title: '설정',
                  titleColor: colors.blue,
                  cancelTitle: '닫기',
                  message:
                    '파일 첨부를 위해 다음 권한이 필요합니다.\n- 저장소 접근 권한\n- 카메라 접근 권한\n설정>어플리케이션>토핑에서 권한을 허용으로 변경해 주세요.',
                  onPress: a => {
                    if (a) {
                      openSettings();
                    }
                  },
                }),
              );
            } else {
              useDispatch(dialogError(error));
            }
          }),
    },
  ];
};

export const cameraProfile = profile_path => {
  return [
    {
      name: '카메라',
      source: images.cameraBtn,
      onPress: async () =>
        getImageFromCamera()
          .then(async file => {
            if (!file) {
              return;
            }
            navigate(routes.profile, {
              image: file,
            });
          })
          .catch(error => {
            if (
              error === 'getImageFromCamera' ||
              error === 'checkMultiplePermissions' ||
              error === 'getImageFromGallery'
            ) {
              useDispatch(
                dialogOpenAction({
                  title: '설정',
                  titleColor: colors.blue,
                  cancelTitle: '닫기',
                  message:
                    '파일 첨부를 위해 다음 권한이 필요합니다.\n- 저장소 접근 권한\n- 카메라 접근 권한\n설정>어플리케이션>토핑에서 권한을 허용으로 변경해 주세요.',
                  onPress: a => {
                    if (a) {
                      openSettings();
                    }
                  },
                }),
              );
            } else {
              useDispatch(dialogError(error));
            }
          }),
    },
    {
      name: '파일',
      source: images.fileBtn,
      onPress: async () =>
        await getImageFromGallery()
          .then(async file => {
            if (!file) {
              return;
            }
            navigate(routes.profile, {
              image: file,
            });
          })
          .catch(error => {
            if (
              error === 'getImageFromCamera' ||
              error === 'checkMultiplePermissions' ||
              error === 'getImageFromGallery'
            ) {
              useDispatch(
                dialogOpenAction({
                  title: '설정',
                  titleColor: colors.blue,
                  cancelTitle: '닫기',
                  message:
                    '파일 첨부를 위해 다음 권한이 필요합니다.\n- 저장소 접근 권한\n- 카메라 접근 권한\n설정>어플리케이션>토핑에서 권한을 허용으로 변경해 주세요.',
                  onPress: a => {
                    if (a) {
                      openSettings();
                    }
                  },
                }),
              );
            } else {
              useDispatch(dialogError(error));
            }
          }),
    },
    {
      name: '갤러리',
      source: images.albumBtn,
      onPress: async () =>
        await checkMultiplePermissions([
          PERMISSIONS.ANDROID.CAMERA,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ])
          .then(result => {
            if (result) {
              navigate(routes.cameraRollPicker, {
                route: routes.profile,
                type: 'profile',
              });
            }
          })
          .catch(error => {
            if (
              error === 'getImageFromCamera' ||
              error === 'checkMultiplePermissions' ||
              error === 'getImageFromGallery'
            ) {
              useDispatch(
                dialogOpenAction({
                  title: '설정',
                  titleColor: colors.blue,
                  cancelTitle: '닫기',
                  message:
                    '파일 첨부를 위해 다음 권한이 필요합니다.\n- 저장소 접근 권한\n- 카메라 접근 권한\n설정>어플리케이션>토핑에서 권한을 허용으로 변경해 주세요.',
                  onPress: a => {
                    if (a) {
                      openSettings();
                    }
                  },
                }),
              );
            } else {
              useDispatch(dialogError(error));
            }
          }),
    },
  ];
};

export const chunk = (arr, size) => {
  let i,
    j,
    temparray = [],
    chunkSize = size;
  for (i = 0, j = arr?.length; i < j; i += chunkSize) {
    temparray.push(arr?.slice(i, i + chunkSize));
  }
  return temparray;
};

export const validationEmail = email => {
  // eslint-disable-next-line no-useless-escape
  return email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
};

export const isVideo = path => {
  if (path) {
    const ext = path.split('.').pop();
    if (['mp4', 'avi', 'mov'].includes(ext)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const getFileData = createdAt => {
  if (!createdAt) {
    return '';
  }

  return moment(createdAt).add(3, 'months').format('YY. MM. DD');
};

export const parseName = (f, l) => {
  return `${f || ''}${l ? ' ' + l : ''}`;
};
export const calculateTimer = second => {
  if (!second) {
    return '00:00';
  }

  if (typeof second === 'string') {
    second = parseInt(second, 10);
  }
  const minute = Math.floor(second / 60);
  const second2 = Math.floor(second % 60);

  let mstr = '';
  let sstr = '';
  if (minute < 10) {
    mstr = '0' + minute;
  } else {
    mstr = minute.toString();
  }
  if (second2 < 10) {
    sstr = '0' + second2;
  } else {
    sstr = second2.toString();
  }

  return mstr + ':' + sstr;
};

export const splitMatchString = (target, value, mask) => {
  if (target && value) {
    let target2 = String(target).toLowerCase();
    let value2 = String(value).toLowerCase();

    const startIndex = target2.indexOf(value2);
    const endIndex = startIndex + value2.length;

    const s = [];
    const end = [];
    const match = [];
    target.split('').map((x, i) => {
      if (i >= startIndex && i < endIndex) {
        match.push(x);
      } else if (i < startIndex) {
        s.push(x);
      } else if (i >= endIndex) {
        end.push(x);
      }
    });
    const result = [s.join(''), match.join(''), end.join('')];
    return result;
  } else {
    return [];
  }
};

export const splitMatchKeyword = (target, value, mask) => {
  if (target && value) {
    let target2 = String(target).toLowerCase();
    let value2 = String(value).toLowerCase();

    const startIndex = target2.indexOf(value2);
    const endIndex = startIndex + value2.length;

    const s = [];
    const end = [];
    const match = [];
    target.split('').map((x, i) => {
      if (i >= startIndex && i < endIndex) {
        match.push(x);
      } else if (i < startIndex) {
        s.push(x);
      } else if (i >= endIndex) {
        end.push(x);
      }
    });
    if (match.length) {
      return match[0];
    } else {
      return false;
    }
    // return false;
  }
};

export const splitMatchIndex = (target, value, mask) => {
  if (target && value) {
    let target2 = String(target).toLowerCase();
    let value2 = String(value).toLowerCase();

    const startIndex = target2.indexOf(value2);
    const endIndex = startIndex + value2.length;

    if (startIndex < 0) {
      return false;
    }
    const s = [];
    const end = [];
    const match = [];
    target.split('').map((x, i) => {
      if (i >= startIndex && i < endIndex) {
        match.push(x);
      } else if (i < startIndex) {
        s.push(x);
      } else if (i >= endIndex) {
        end.push(x);
      }
    });

    if (match.length) {
      return [startIndex, endIndex];
    } else {
      return false;
    }
    // return false;
  }
};

export const checkStringMatch = (i1, i2, include) => {
  if (i1 && i2) {
    if (include) {
      if (
        String(i1)
          .toLowerCase()
          .trim()
          .includes(String(i2).toLowerCase().trim())
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (String(i1).toLowerCase().trim() === String(i2).toLowerCase().trim()) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
};

export const replaceStudentId = st => {
  if (st) {
    let result = st.substring(0, st.length - 2);
    return result + ('••' || '●●');
  } else {
    return '';
  }
};

export const formatPhone = f => {
  if (!f) {
    return '';
  }
  if (f.match(/^\d{11}$/)) {
    return f.substr(0, 3) + '-' + f.substr(3, 4) + '-' + f.substr(7, 4);
  }
  // eslint-disable-next-line no-useless-escape
  const f_val = f.replace(/\D[^\.]/g, '');
  return f_val.slice(0, 3) + '-' + f_val.slice(3, 6) + '-' + f_val.slice(6);
};
// export const openMail = () => {
//   Linking.openURL('mailto:kdischool.connect@gmail.com?subject=&body=');
// };
// export const toast = message => {
//   SimpleToast.show(message);
// };

export const getAgeFromMoment = (birthday, format, isMan) => {
  if (!birthday) {
    throw '계산 오류.';
  }
  const nowTime = moment();
  const birthTime = moment(birthday, format);

  if (isMan) {
    return '';
  }

  if (!birthTime) {
    return '';
  }

  if (birthTime.invalidAt() === 1) {
    return '';
  }
  return nowTime.get('years') - birthTime.get('years') + 1;
};

export const formatTime = (time, format) => {
  if (!time) {
    return '';
    // time = moment();
  } else {
    time = moment(time);
  }
  time = time.tz('Asia/Seoul');
  switch (format) {
    case 'ymd':
      return time.format('YYYYMMDD');
    case 'date':
      return time.format('YYYY-MM-DD');
    case 'date-time':
      return time.format('YYYY-MM-DD HH:mm');
    default:
      return time.format(format);
  }
};

export const formatLastMessageTime = time => {
  if (!time) {
    return '';
  }

  if (moment().format('YYYYMMDD') === moment(time).format('YYYYMMDD')) {
    return formatTime(time, 'HH:mm A');
  } else if (moment().format('YYYYMM') === moment(time).format('YYYYMM')) {
    return formatTime(time, 'MM-DD HH:mm A');
  } else {
    return formatTime(time, 'YYYY-MM-DD HH:mm A');
  }
};

export function numFormat(nStr) {
  if (!nStr) {
    nStr = '0';
  }
  nStr += '';
  let x = nStr.split('.');
  let x1 = x[0];
  let x2 = x.length > 1 ? '.' + x[1] : '';
  let rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}

export function containPasswordCheck(str) {
  /*
    (?=.*\d)          // should contain at least one digit
    (?=.*[a-z])       // should contain at least one lower case
    (?=.*[A-Z])       // should contain at least one upper case
    [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
  */
  return str.match(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  );
}

export function convertKorPhoneFormat(str) {
  const phoneExtsSelected = phoneExts.find(
    x => x.indexOf(str.split(' ')[0]) !== -1,
  );
  if (phoneExtsSelected.indexOf('Korea(South)') !== -1) {
    return ('0' + str.split(' ')[1]).replace(/-/g, '');
  } else {
    return str;
  }
}
