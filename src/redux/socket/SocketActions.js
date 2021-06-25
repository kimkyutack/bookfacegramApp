// import socketIo from 'socket.io-client';
import consts from '../../libs/consts';

export const socketActionType = {
  connect: 'socket/connet',
  close: 'socket/close',
  connected: 'socket/connected',
  disconnected: 'socket/disconnected',
};

export const socketConnect = ({userId}) => (dispatch) => {
  // const socket = socketIo(consts.apiUrl, {
  //   query: `userId=${userId}`,
  //   secure: true,
  // });
  // socket.connect();
  // socket.on('connect', () => {
  //   dispatch({
  //     type: socketActionType.connected,
  //   });
  // });
  // socket.on('disconnect', () => {
  //   dispatch({
  //     type: socketActionType.disconnected,
  //   });
  //   //SimpleToast.show('인터넷 연결을 확인해주세요.');
  // });
  // dispatch({
  //   type: socketActionType.connect,
  //   socket,
  // });
};
export const socketClose = (socket, userId) => (dispatch) => {
  try {
    socket.off();
    socket.disconnect();
    socket.close();
  } catch (error) {}
  if (userId) {
    dispatch(socketConnect({userId}));
  } else {
    dispatch({
      type: socketActionType.close,
    });
  }
};
