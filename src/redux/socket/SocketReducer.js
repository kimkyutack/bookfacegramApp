import {socketActionType} from './SocketActions';

const initSocket = {
  socket: null,
  connected: false,
};

export default function socket(state = initSocket, action) {
  switch (action.type) {
    case socketActionType.connected:
      return {
        ...state,
        connected: true,
      };
    case socketActionType.disconnected:
      return {
        ...state,
        connected: false,
      };
    case socketActionType.close:
        return {...initSocket};
    case socketActionType.connect:
      return {
        ...state,
        socket: action.socket,
      };
    default:
      return state;
  }
}
