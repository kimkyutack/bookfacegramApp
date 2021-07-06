import {isIos} from '../services/util';
let devMode = true;
let emulator = false;
let devIp = isIos ? '192.168.179.1' : '10.0.2.2';

export default {
  devMode,
  // androidPushChannel: 'bookfagegram-push',
  // packageName: isIos
  //   ? 'ios.'
  //   : 'android.',
  version: '1.0.0',
  apiUrl: devMode
    ? emulator
      ? 'http://' + devIp + ':8080/bookApp'
      : 'http://localhost:8080/bookApp'
    : '', //product url
  fileApiUrl: devMode
    ? emulator
      ? 'http://' + devIp + ':8080/bookApp'
      : 'http://localhost:8080/bookApp'
    : '', //product url

  dialogZindex: 10,
};
