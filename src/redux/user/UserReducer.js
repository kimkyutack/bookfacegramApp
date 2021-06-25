import {userActionType} from './UserActions';
const initUser = {
  inited: false,
  signed: false,
};

const user = (state = initUser, action) => {
  switch (action.type) {
    case userActionType.signOut:
      return {
        ...initUser,
        signed: false,
        inited: false,
      };
    case userActionType.update:
      return {
        ...state,
        ...action.user,
      };
    case userActionType.init:
      return {
        ...initUser,
        inited: true,
      };
    case userActionType.token:
      return {
        ...state,
        ...action.user,
        inited: true,
        signed: true,
      };
    default:
      return state;
  }
};

export default user;
