import {useCallback} from 'react';
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
import {dialogError} from '../dialog/DialogActions';
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

export const userSignOut = userId => dispatch => {
  requestPost({url: consts.apiUrl + '/users/' + userId + '/signout'})
    .then(() => {
      clearItem('token').then(() => {
        dispatch({type: 'clear'});
      });
    })
    .catch(e => {
      console.log(e);
      dispatch(dialogError('Please check internet'));
    });
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
      console.log(file);
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
    console.log(error);
    dispatch(dialogError(error));
  }
};

export const userCheckToken = async dispatch => {
  try {
    const token = await getItem('token');
    if (!token) {
      throw '';
    }

    // let fcm = '';
    // const ftoken = await messging().getToken();

    // if (ftoken) {
    //   fcm = ftoken;
    // }
    // console.log('ftoken');
    // console.log(ftoken);

    const user = await requestGet({
      // query: {fcmToken: fcm},
      url: consts.apiUrl + '/users/tokens/' + token,
    });
    if (!user) {
      throw '';
    }

    dispatch({type: userActionType.token, user});
  } catch (error) {
    dispatch({type: userActionType.init});
  }
};
