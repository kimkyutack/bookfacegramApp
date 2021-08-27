import {useCallback} from 'react';
import {addons} from 'react-native';
import consts from '../../libs/consts';
import routes from '../../libs/routes';
import {reset} from '../../services/navigation';
import {
  requestFile,
  requestGet,
  requestPost,
  requestPut,
} from '../../services/network';
import {getImageFromGallery} from '../../services/picker';
import {clearItem, getItem} from '../../services/preference';
import {dialogOpenMessage, dialogError} from '../dialog/DialogActions';
import {logout, unlink} from '@react-native-seoul/kakao-login';
// import messging from '@react-native-firebase/messaging';

export const userActionType = {
  token: 'user/token',
  update: 'user/update',
  signOut: 'user/signOut',
  init: 'user/init',
};

export const userUpdate =
  ({user, updated = true}) =>
  dispatch => {
    dispatch({type: userActionType.update, user});
  };

export const userSignOut = userId => async dispatch => {
  const platformType = await getItem('platformType');
  await clearItem('accessToken');
  await clearItem('refreshToken');
  await clearItem('platformType');
  await clearItem('accountLocal');
  await clearItem('hashTagLocal');
  dispatch({type: 'clear'});
  if (platformType === 'kakao') {
    await logout();
    // await unlink();
  }
};

export const userUpdateProfileImage = (userId, toDefault) => async dispatch => {
  try {
    if (toDefault) {
      await requestPut({
        url: consts.apiUrl + '/users/' + userId,
        body: {columns: ['profilePath'], values: ['']},
      });
      dispatch({type: userActionType.update, user: {profilePath: ''}});
    } else {
      const file = await getImageFromGallery();
      if (!file) {
        return;
      }

      const formData = new FormData();
      formData.append('profileImage', file);

      const user = await requestFile(
        {url: consts.apiUrl + '/users/' + userId, method: 'put'},
        formData,
      );
      dispatch({type: userActionType.update, user});
    }
  } catch (error) {
    dispatch(dialogError(error));
  }
};

export const userCheckToken = async dispatch => {
  try {
    const token = await getItem('accessToken');
    const refreshToken = await getItem('refreshToken');
    const platformType = await getItem('platformType');

    if (!token) {
      throw 'accessToken is null';
    }
    if (!refreshToken) {
      throw 'refreshToken is null';
    }
    if (!platformType) {
      throw 'platformType is null';
    }

    const {data, status} = await requestGet({
      url: consts.apiUrl + '/auth/checkJwt',
    });

    if (status === 'FAIL') {
      throw 'member is null';
    } else if (status === 'SUCCESS') {
      dispatch({type: userActionType.token, user: data});
    }
  } catch (error) {
    dispatch({type: userActionType.init});
  }
};
