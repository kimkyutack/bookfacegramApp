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
import {dialogOpenMessage} from '../dialog/DialogActions';
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
  await clearItem('token').then(() => {
    dispatch({type: 'clear'});
  });
  await clearItem('platformType').then(() => {
    dispatch({type: 'clear'});
  });

  if (platformType === 'kakao') {
    // await logout();
    await unlink();
  }
  // requestPost({url: consts.apiUrl + '/users/' + userId + '/signout'})
  //   .then(() => {
  //     clearItem('token').then(() => {
  //       dispatch({type: 'clear'});
  //     });
  //   })
  //   .catch(e => {
  //     console.log(e);
  //     dispatch(dialogError('Please check internet'));
  //   });
};

// export const userUpdateProfileImage = (userId, toDefault) => async dispatch => {
//   try {
//     if (toDefault) {
//       await requestPut({
//         url: consts.apiUrl + '/users/' + userId,
//         body: {columns: ['profilePath'], values: ['']},
//       });
//       dispatch({type: userActionType.update, user: {profilePath: ''}});
//     } else {
//       const file = await getImageFromGallery();
//       console.log(file);
//       if (!file) {
//         return;
//       }

//       const formData = new FormData();
//       formData.append('profileImage', file);

//       const user = await requestFile(
//         {url: consts.apiUrl + '/users/' + userId, method: 'put'},
//         formData,
//       );
//       dispatch({type: userActionType.update, user});
//     }
//   } catch (error) {
//     console.log(error);
//     dispatch(dialogError(error));
//   }
// };

export const userCheckToken = async dispatch => {
  try {
    const token = await getItem('token');
    const platformType = await getItem('platformType');

    if (!token) {
      throw 'token is null';
    }
    if (!platformType) {
      throw 'platformType is null';
    }
    // let fcm = '';
    // const ftoken = await messging().getToken();

    // if (ftoken) {
    //   fcm = ftoken;
    // }
    // console.log('ftoken');
    // console.log(ftoken);

    if (platformType === 'app' || platformType === 'toaping') {
      const {member} = await requestPost({
        url: consts.apiUrl + '/checkJwt',
        body: {
          token,
        },
      });
      // if (!member) {
      //   throw 'member is null';
      // }
      dispatch({type: userActionType.token, user: member[0]});
    } else if (platformType === 'kakao') {
      const {member} = await requestPost({
        url: consts.apiUrl + '/checkSnsId',
        body: {
          token: token,
          platform_type: platformType,
        },
      });
      // if (!member) {
      //   throw 'member is null';
      // }
      dispatch({type: userActionType.token, user: member[0]});
    }
  } catch (error) {
    dispatch({type: userActionType.init});
  }
};
