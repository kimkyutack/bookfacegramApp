import {userActionType} from './UserActions';
const initUser = {
  inited: false,
  signed: false,
  update: 0,
};

const user = (state = initUser, action) => {
  switch (action.type) {
    case userActionType.signOut:
      return {
        ...initUser,
        signed: false,
        inited: false,
        update: 0,
      };
    case userActionType.update:
      //alert(JSON.stringify(action.user));
      return {
        ...state,
        ...action.user,
        update: state.update + 1,
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
