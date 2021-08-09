import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {BackHandler} from 'react-native';
import {dialogOpenAction, dialogClose} from './redux/dialog/DialogActions';
import routes from './libs/routes';
import {navigationRef, reset, routeNameRef} from './services/navigation';
import DrawerCustom from './components/drawer-custom/DrawerCustom';
import {userSignOut} from './redux/user/UserActions';

import Splash from './screens/splash/Splash';
import Login from './screens/login/Login';
import Tabs from './screens/tabs/Tabs';
import Home from './screens/home/home-main';
import HomeList from './screens/home/home-list';
import HomeDetail from './screens/home/home-detail';
import Notice from './screens/notice/Notice';
import Event from './screens/event/Event';
import EventDetail from './screens/event/EventDetail';

import FeedBook from './screens/feed-book/FeedBook';

import Policy from './screens/register-form/Policy';
import RegisterForm from './screens/register-form/RegisterForm';
import RegisterFormInfo from './screens/register-form/RegisterFormInfo';
import Intro1 from './screens/register-form/Intro1';
import Intro2 from './screens/register-form/Intro2';
import Intro3 from './screens/register-form/Intro3';
import ToapingLogin from './screens/login/ToapingLogin';
import CameraRollPicker from './screens/cameraroll-picker/CameraRollPicker';
import PhotoEditor from './screens/photo-editor/PhotoEditor';

import RNExitApp from 'react-native-exit-app';
import {widthPercentage} from './services/util';
import colors from './libs/colors';

const Drawer = createDrawerNavigator();

export default function Router() {
  const [currentRouteName, setCurrentRoutName] = useState(null);
  const user = useSelector(s => s.user, shallowEqual);
  const dialog = useSelector(s => s.dialog, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user.signed) {
      reset(routes.splash);
    }
  }, [user.signed]);

  useEffect(() => {
    const backAction = () => {
      dispatch(
        dialogOpenAction({
          titleColor: '#000',
          cancelTitle: '취소',
          message: 'Exit App\nDo you want to exit?',
          onPress: a => {
            if (a) {
              RNExitApp.exitApp();
            }
          },
        }),
      );
      return true;
    };
    const backLogoutAction = () => {
      dispatch(userSignOut(user.memberId));
      return true;
    };
    if (currentRouteName === 'splash' || currentRouteName === 'login') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    } else if (currentRouteName === 'intro1') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backLogoutAction,
      );
      return () => backHandler.remove();
    }
  }, [currentRouteName]);

  return (
    <SafeAreaProvider>
      {!user.signed ? (
        <NavigationContainer
          ref={navigationRef}
          onReady={() =>
            (routeNameRef.current =
              navigationRef.current.getCurrentRoute().name)
          }
          onStateChange={async () => {
            const preRouteName = routeNameRef.current;
            const curRouteName = navigationRef.current.getCurrentRoute().name;
            if (preRouteName !== curRouteName) {
              setCurrentRoutName(curRouteName);
            }
            routeNameRef.current = curRouteName;
          }}>
          <Drawer.Navigator
            drawerStyle={{
              backgroundColor: colors.white,
              width: widthPercentage(210),
            }}
            headerMode="none"
            initialRouteName={routes.splash}
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
              name={routes.login}
              component={Login}
              options={({route, navigation}) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.policy}
              component={Policy}
              options={({route, navigation}) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.toapingLogin}
              component={ToapingLogin}
              options={({route, navigation}) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.registerForm}
              component={RegisterForm}
              options={({route, navigation}) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              initialParams={{}}
              name={routes.registerFormInfo}
              component={RegisterFormInfo}
              options={({route, navigation}) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.intro1}
              component={Intro1}
              options={({route, navigation}) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.intro2}
              component={Intro2}
              options={({route, navigation}) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.intro3}
              component={Intro3}
              options={({route, navigation}) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      ) : (
        <NavigationContainer
          ref={navigationRef}
          onReady={() =>
            (routeNameRef.current =
              navigationRef.current.getCurrentRoute().name)
          }
          onStateChange={async () => {
            const preRouteName = routeNameRef.current;
            const curRouteName = navigationRef.current.getCurrentRoute().name;
            if (preRouteName !== curRouteName) {
              setCurrentRoutName(curRouteName);
            }
            routeNameRef.current = curRouteName;
          }}>
          <Drawer.Navigator
            drawerStyle={{
              backgroundColor: colors.white,
              width: widthPercentage(210),
            }}
            headerMode="none"
            initialRouteName={routes.home}
            drawerContent={props => <DrawerCustom {...props} />}>
            <Drawer.Screen
              name={routes.home}
              component={Home}
              options={({route, navigation}) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.homeList}
              component={HomeList}
              options={({route, navigation}) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.homeDetail}
              component={HomeDetail}
              options={({route, navigation}) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.feedBook}
              component={FeedBook}
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
            <Drawer.Screen
              name={routes.cameraRollPicker}
              component={CameraRollPicker}
              options={({route, navigation}) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.photoEditor}
              component={PhotoEditor}
              options={({route, navigation}) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}
