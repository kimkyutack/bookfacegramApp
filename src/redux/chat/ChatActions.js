import consts from '../../libs/consts';
import routes from '../../libs/routes';
import {navigate, replace} from '../../services/navigation';
import {requestPost} from '../../services/network';
import {dialogError} from '../dialog/DialogActions';

export const chatActionType = {
  updateLength1: 'chat/updateLength1',
  updateLength: 'chat/updateLength',
};
export const chatMake = ({userId, others, stack = true, onSuccess}) => async (
  dispatch,
) => {
  try {
    const userIds = others.map((x) => x.userId || x);

    const {chatId} = await requestPost({
      url: consts.apiUrl + '/chats',
      body: {
        userId,
        userIds,
      },
    });

    if (onSuccess) {
      onSuccess(chatId);
    } else {
      if (!stack) {
        replace(routes.message, {
          chatId,
        });
      } else {
        navigate(routes.message, {
          chatId,
        });
      }
    }
  } catch (error) {
    dispatch(dialogError(error));
  }
};
