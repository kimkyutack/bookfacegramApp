import {isIos} from '../services/util';
let devMode = true;

let devIp = isIos ? '192.168.179.1' : '10.0.2.2';

export default {
  devMode,
  // androidPushChannel: 'bookfagegram-push',
  // packageName: isIos
  //   ? 'ios.'
  //   : 'android.',
  version: '1.0.0',
  apiUrl: devMode
    ? // ? 'http://' + devIp + ':8081'
      'http://' + devIp + ':8081'
    : '',
  fileApiUrl: devMode
    ? // ? 'http://' + devIp + ':8081'
      'http://' + devIp + ':8081'
    : '',
  dialogZindex: 10,
};
