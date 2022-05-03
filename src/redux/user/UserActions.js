import {useCallback} from 'react';
import {addons} from 'react-native';
import Config from 'react-native-config';
import consts from '../../libs/consts';
import routes from '../../libs/routes';
import {reset} from '../../services/navigation';
import {
  requestFile,
  requestGet,
  requestPost,
  requestPut,
} from '../../services/network';
import {getImageFromGallery, getImageFromCamera} from '../../services/picker';
import {clearItem, getItem} from '../../services/preference';
import {dialogOpenMessage, dialogError} from '../dialog/DialogActions';
import {logout, unlink} from '@react-native-seoul/kakao-login';
import {NaverLogin, getProfile} from '@react-native-seoul/naver-login';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
GoogleSignin.configure({
  scopes: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/user.phonenumbers.read',
  ],
  webClientId: Config.GOOGLE_WEB_CLIENT_ID,
  offlineAccess: false,
});
// import messging from '@react-native-firebase/messaging';

export const userActionType = {
  token: 'user/token',
  update: 'user/update',
  signOut: 'user/signOut',
  init: 'user/init',
};

export const userUpdate = dispatch => {
  const {data, status} = requestGet({
    url: consts.apiUrl + '/mypage/info',
  })
    .then(res => {
      if (res.status === 'SUCCESS') {
        //alert(JSON.stringify(res));
        dispatch({
          type: userActionType.update,
          user: {...res.data},
        });
      } else if (res.status === 'FAIL') {
        // error 일때 해야함
        dispatch(dialogError(res.data.msg));
      } else {
      }
    })
    .catch(error => {
      dispatch(dialogError(error));
      // error 일때 해야함
    });
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
  } else if (platformType === 'naver') {
    NaverLogin.logout();
  } else if (platformType === 'google') {
    await GoogleSignin.signOut();
  } else if (platformType === 'facebook') {
    try {
      let tokenObj = await AccessToken.getCurrentAccessToken();
      let current_access_token = tokenObj.accessToken.toString();
      let facebookLogout = new GraphRequest(
        'me/permissions/',
        {
          accessToken: current_access_token,
          httpMethod: 'DELETE',
        },
        (error, result) => {
          if (error) {
            throw error?.toString();
          } else {
            LoginManager.logOut();
          }
        },
      );
      new GraphRequestManager().addRequest(facebookLogout).start();
    } catch (e) {
      // console.log(e);
    }
  }
};

export const userUpdateProfileImage = userId => async dispatch => {
  try {
    // if (toDefault) {
    //   await requestPut({
    //     url: consts.apiUrl + '/users/' + userId,
    //     body: {columns: ['profilePath'], values: ['']},
    //   });
    //   dispatch({type: userActionType.update, user: {profilePath: ''}});
    // } else {
    const {data, status} = await requestGet({
      url: consts.apiUrl + '/mypage/info',
    });
    const file = await getImageFromGallery();

    if (!file) {
      return;
    }

    const formData = new FormData();
    let originProfile;
    if (
      data.profilePath.includes(
        'https://api-storage.cloud.toast.com/v1/AUTH_2900a4ee8d4d4be3a5146f0158948bd1/profile',
      )
    ) {
      originProfile = data.profilePath.substring(
        data.profilePath.lastIndexOf('/') + 1,
      );
      formData.append('originProfile', originProfile);
    }
    formData.append('profile', file);

    // const user = await requestFile(
    //   {url: consts.apiUrl + '/mypage/info/profile', method: 'put'},
    //   formData,
    // );
    const user = await requestPut({
      url: consts.apiUrl + '/mypage/info/profile',
      body: {formData: formData},
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          alert(res.status);
          dispatch({
            type: userActionType.update,
            user: user,
          });
        } else if (res.status === 'FAIL') {
          dispatch(dialogError(res.data?.msg || 'fail'));
        } else {
          dispatch(dialogError('fail'));
        }
      })
      .catch(error => {
        dispatch(dialogError(error));
      });
    // alert(JSON.stringify(originProfile));
    // alert(JSON.stringify(file));
    // dispatch({type: userActionType.update, user});
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
