import * as React from 'react';
import {StackActions, CommonActions} from '@react-navigation/native';
import routes from '../libs/routes';
export const navigationRef = React.createRef();
export const routeNameRef = React.createRef();
export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function goBack() {
  if (navigationRef.current?.canGoBack()) {
    navigationRef.current?.goBack();
  }
  // else {
  //   navigationRef.current?.dispatch(
  //     CommonActions?.reset({
  //       index: 0,
  //       routes: [{name: routes.home}],
  //     }),
  //   );
  // }
}

export function replace(name, params) {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
}

export function reset(name, params, moreRoutes = []) {
  navigationRef.current?.reset({
    index: 0,
    routes: [{name, params}, ...moreRoutes],
  });
}
