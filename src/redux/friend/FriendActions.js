import consts from '../../libs/consts';
import {requestPost} from '../../services/network';
import {dialogError} from '../dialog/DialogActions';

export const friendRequest = ({userId, userIdTo, onSuccess}) => async (
  dispatch,
) => {
  try {
    await requestPost({
      url: consts.apiUrl + '/users/' + userId + '/friends/users/' + userIdTo,
    });
    onSuccess();
  } catch (error) {
    dispatch(dialogError(error));
  }
};
