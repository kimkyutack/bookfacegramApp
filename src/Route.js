import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';

import routes from './libs/routes';
// import Home from './screens/homeTab';
// import Settings from './screens/settingsTab';
import Splash from './screens/splash/Splash';
// import Tabs from './screens/tabs/Tabs';
import Login from './screens/login/Login';
// import RegisterPhoneVerify from './screens/register-phone-verify/RegisterPhoneVerify';
// import FindIdPassword from './screens/find-id-password/FindIdPassword';
import Tabs from './screens/tabs/Tabs';
import homeTab from './screens/homeTab';
import DrawerCustom from './components/drawer-custom/DrawerCustom';
import {navigate, navigationRef} from './services/navigation';
import TopNewBooks from './screens/homeTab/TopNewBooks';
import TopActivity from './screens/homeTab/TopActivity';
import TopMyBooks from './screens/homeTab/TopMyBooks';
import Notice from './screens/notice/Notice';
import Event from './screens/event/Event';
import EventDetail from './screens/event/EventDetail';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function Router({}) {
  const dispatch = useDispatch();
  const {userId} = useSelector(s => s.user, shallowEqual);
  const login = true;
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        {!login ? (
          <>
            <Stack.Navigator headerMode="none" initialRouteName={routes.splash}>
              <Stack.Screen name={routes.splash} component={Splash} />
              <Stack.Screen name={routes.login} component={Login} />
            </Stack.Navigator>
          </>
        ) : (
          <>
            <Drawer.Navigator
              drawerStyle={{
                backgroundColor: '#ffffff',
                width: 240,
              }}
              headerMode="none"
              initialRouteName={routes.home}
              drawerContent={props => <DrawerCustom {...props} />}>
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
                name={routes.tab}
                component={Tabs}
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
              />
              <Drawer.Screen
                name={routes.topNewBooks}
                component={TopNewBooks}
                options={({route, navigation}) => {
                  return {
                    swipeEnabled: false,
                  };
                }}
              />
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
          </>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
