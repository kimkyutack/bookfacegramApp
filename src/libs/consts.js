import {isIos} from '../services/util';
let devMode = false;
let emulator = false;
let devIp = isIos ? '192.168.179.1' : '10.0.2.2';

export default {
  devMode,
  packageName: isIos ? 'ios.' : 'android.',
  version: '1.0.0',
  apiUrl: devMode
    ? emulator
      ? 'http://' + devIp + ':8080/bookApp'
      : 'http://localhost:8080/bookApp'
    : 'http://133.186.219.126:8810/bookApp',
  fileApiUrl: devMode
    ? emulator
      ? 'http://' + devIp + ':8080/bookApp'
      : 'http://localhost:8080/bookApp'
    : 'http://133.186.219.126:8810/bookApp',
  imgUrl:
    'https://api-storage.cloud.toast.com/v1/AUTH_2900a4ee8d4d4be3a5146f0158948bd1/books',
  dialogZindex: 10,
};
