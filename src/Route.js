import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';

import routes from './libs/routes';
import {navigationRef} from './services/navigation';
import DrawerCustom from './components/drawer-custom/DrawerCustom';

import Splash from './screens/splash/Splash';
import Login from './screens/login/Login';
import Tabs from './screens/tabs/Tabs';
import homeTab from './screens/homeTab';
import Notice from './screens/notice/Notice';
import Event from './screens/event/Event';
import EventDetail from './screens/event/EventDetail';
import TopNewBooks from './screens/homeTab/TopNewBooks';
import TopMyBooks from './screens/homeTab/TopMyBooks';
import TopActivity from './screens/homeTab/TopActivity';

const Drawer = createDrawerNavigator();

export default function Router({}) {
  const dispatch = useDispatch();
  const {memberId} = useSelector(s => s.user, shallowEqual);
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Drawer.Navigator
          drawerStyle={{
            backgroundColor: '#ffffff',
            width: 240,
          }}
          headerMode="none"
          initialRouteName={routes.home}
          drawerContent={props => <DrawerCustom {...props} />}>
          <Drawer.Screen
            name={routes.splash}
            component={Splash}
            options={({route, navigation}) => {
              return {
                swipeEnabled: false,
              };
            }}
          />
          <Drawer.Screen
            name={routes.home}
            component={homeTab}
            options={({route, navigation}) => {
              return {
                swipeEnabled: false,
              };
            }}
          />
          <Drawer.Screen
            name={routes.login}
            component={Login}
            options={({route, navigation}) => {
              return {
                swipeEnabled: false,
              };
            }}
          />
          <Drawer.Screen
            name={routes.tab}
            component={Tabs}
            options={({route, navigation}) => {
              return {
                swipeEnabled: false,
              };
            }}
          />
          {/* <Drawer.Screen
                name={routes.topNewBooks}
                component={TopNewBooks}
                options={({route, navigation}) => {
                  return {
                    swipeEnabled: false,
                  };
                }}
              />
              <Drawer.Screen
                name={routes.topActivity}
                component={TopActivity}
                options={({route, navigation}) => {
                  return {
                    swipeEnabled: false,
                  };
                }}
              />
              <Drawer.Screen
                name={routes.topMyBooks}
                component={TopMyBooks}
                options={({route, navigation}) => {
                  return {
                    swipeEnabled: false,
                  };
                }}
              /> */}

          <Drawer.Screen
            name={routes.notice}
            component={Notice}
            options={({route, navigation}) => {
              return {
                swipeEnabled: false,
              };
            }}
          />
          <Drawer.Screen
            name={routes.event}
            component={Event}
            options={({route, navigation}) => {
              return {
                swipeEnabled: false,
              };
            }}
          />
          <Drawer.Screen
            name={routes.eventDetail}
            component={EventDetail}
            options={({route, navigation}) => {
              return {
                swipeEnabled: false,
              };
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
