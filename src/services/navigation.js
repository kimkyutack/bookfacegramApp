import * as React from 'react';
import BottomTab from '@react-navigation/bottom-tabs';
import {StackActions} from '@react-navigation/native';
export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function goBack() {
  navigationRef.current?.goBack();
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
