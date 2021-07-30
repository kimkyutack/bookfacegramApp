import ImageCropPicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import {
  check,
  checkMultiple,
  PERMISSIONS,
  request,
  requestMultiple,
  openSettings,
  RESULTS,
} from 'react-native-permissions';
import {isIos} from './util';
import {requestFile} from './network';
import consts from '../libs/consts';

export async function splashCheckMultiplePermissions(permissions) {
  if (!isIos) {
    for (var index in permissions) {
      let result = await check(permissions[index]);
      if (result !== 'granted' && result !== 'limited') {
        await request(permissions[index]);
      }
    }
  }
  return true;
}

export async function checkMultiplePermissions(permissions) {
  const statuses = await requestMultiple(permissions);
  for (var index in permissions) {
    if (statuses[permissions[index]] !== RESULTS.GRANTED) {
      throw 'checkMultiplePermissions';
      // throw '파일 첨부를 위해 다음 권한이 필요합니다.\n- 저장소 접근 권한\n- 카메라 접근 권한\n설정>어플리케이션>토핑에서 권한을 허용으로 변경해 주세요.';
    }
  }
  return true;
}

export const getImageFromCamera = async () => {
  try {
    const item = await ImageCropPicker.openCamera({
      mediaType: 'photo',
    });
    return {
      name: item.path.split('/')[item.path.split('/').length - 1],
      type: item.mime,
      size: item.size,
      width: item.width,
      height: item.height,
      uri: item.path,
    };
  } catch (error) {
    if (error.code !== 'E_PICKER_CANCELLED') {
      throw 'getImageFromCamera';
      // throw error;
    } else {
      return false;
    }
  }
};

export const getMultiplePhoto = async () => {
  try {
    const data = await ImageCropPicker.openPicker({
      mediaType: 'photo',
      multiple: true,
    });
    return data.map(item => {
      return {
        name: item.path.split('/')[item.path.split('/').length - 1],
        type: item.mime,
        size: item.size,
        width: item.width,
        height: item.height,
        uri: item.path,
      };
    });
  } catch (error) {
    if (error.code !== 'E_PICKER_CANCELLED') {
      throw error;
    }
  }
};

export const getMUltipleVideo = async () => {
  try {
    const data = await ImageCropPicker.openPicker({
      mediaType: 'video',
      multiple: true,
    });
    return data.map(item => {
      return {
        name: item.path.split('/')[item.path.split('/').length - 1],
        type: item.mime,
        size: item.size,
        width: item.width,
        height: item.height,
        uri: item.path,
      };
    });
  } catch (error) {
    if (error.code !== 'E_PICKER_CANCELLED') {
      throw error;
    }
  }
};

export const getImageFromGallery = async canVideo => {
  try {
    let p = isIos
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

    let result = await check(p);
    if (result !== 'granted' && result !== 'limited') {
      result = await request(p);
      if (result !== 'granted' && result !== 'limited') {
        throw 'getImageFromGallery';
      }
    }
    const item = await ImageCropPicker.openPicker({
      mediaType: canVideo ? 'any' : 'photo',
    });

    if (
      !['video/mp4', 'video/quicktime', 'video/x-msvideo'].includes(
        item.mime,
      ) &&
      !item.mime.includes('image')
    ) {
      throw "Doesn't support that video format";
    }
    return {
      name: item.path.split('/')[item.path.split('/').length - 1],
      type: item.mime,
      size: item.size,
      width: item.width,
      height: item.height,
      uri: item.path,
    };
  } catch (error) {
    if (error.code === 'E_PERMISSION_MISSING') {
      throw '설정에서 카메라 권한을 허용해주세요.';
    } else if (error.code !== 'E_PICKER_CANCELLED') {
      throw error;
    }
  }
};
export const getFile = async () => {
  try {
    const res = await DocumentPicker.pick({
      type: [
        DocumentPicker.types.images,
        DocumentPicker.types.pptx,
        DocumentPicker.types.ppt,
        DocumentPicker.types.pdf,
        DocumentPicker.types.doc,
        DocumentPicker.types.docx,
        DocumentPicker.types.xls,
        DocumentPicker.types.xlsx,
        DocumentPicker.types.zip,
        DocumentPicker.types.audio,
      ],
    });
    return res;
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      return;
    } else {
      throw error;
    }
  }
};
