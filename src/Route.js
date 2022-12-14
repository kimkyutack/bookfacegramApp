import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { BackHandler } from 'react-native';
import { dialogClose, dialogOpenAction } from './redux/dialog/DialogActions';
import routes from './libs/routes';
import {
  navigationRef,
  reset,
  routeNameRef,
  navigate,
} from './services/navigation';
import DrawerCustom from './components/drawer-custom/DrawerCustom';
import { userSignOut } from './redux/user/UserActions';

import Splash from './screens/splash/Splash';
import Login from './screens/login/Login';
import Tabs from './screens/tabs/Tabs';
import BookContest from './screens/activity/bookcontest';
import Kbstest from './screens/activity/kbstest';
import Examtest from './screens/activity/examtest';
import Home from './screens/home/home-main';
import MainQuiz from './screens/activity/MainQuiz';
import HomeList from './screens/home/home-list';
import Payment from './services/payment';
import HomeDetail from './screens/home/home-detail';
import Notice from './screens/notice/Notice';
import ShinChung from './screens/shinchung/Shinchung';
import ShinChungDetail from './screens/shinchung/ShinchungDetail';
import Faq from './screens/faq/Faq';
import CancelDetail from './screens/shinchung/CancelDetail';
import Setting from './screens/setting/Setting';
import Profile from './screens/profile/profile';
import Event from './screens/event/Event';
import EventDetail from './screens/event/EventDetail';
import FeedBookShare from './screens/feed-book/FeedBookShare';
import FeedBook from './screens/feed-book/FeedBook';
import FeedBookImage from './screens/feed-book-image';
import Search from './screens/search/Search';
import SearchBook from './screens/search-book/SearchBook';
import Follow from './screens/follow/Follow';
import Comment from './screens/feed-comment/Comment';

import HashTagImage from './screens/hash-tag-image';
import { LogBox } from 'react-native';
import BookDrawer from './screens/book-drawer/BookDrawer';
import BookDrawerDetail from './screens/book-drawer-detail/BookDrawerDetail';

import Policy from './screens/register-form/Policy';
import RegisterForm from './screens/register-form/RegisterForm';
import RegisterFormInfo from './screens/register-form/RegisterFormInfo';
import RegisterFormToapingInfo from './screens/register-form/RegisterFormToapingInfo';
import Intro1 from './screens/register-form/Intro1';
import Intro2 from './screens/register-form/Intro2';
import Intro3 from './screens/register-form/Intro3';
import ToapingLogin from './screens/login/ToapingLogin';
import FindId from './screens/login/FindId';
import FindIdOk from './screens/login/FindIdOk';
import FindPw from './screens/login/FindPw';
import PasswordUpdate from './screens/login/PasswordUpdate';
import CameraRollPicker from './screens/cameraroll-picker/CameraRollPicker';
import PhotoEditor from './screens/photo-editor/PhotoEditor';
import FeedBookEditor from './screens/feed-book/FeedBookEditor';

import PolicyHome from './screens/terms-of-service/PolicyHome';
import Teenager from './screens/terms-of-service/Teenager';
import Provision from './screens/terms-of-service/Provision';
import paymentResult from './services/paymentResult';

import RNExitApp from 'react-native-exit-app';
import { widthPercentage } from './services/util';
import colors from './libs/colors';
import Activity from './screens/activity';
import { createStackNavigator } from '@react-navigation/stack';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


console.reportErrorsAsExceptions = false;

const StackNavigator = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName="MainScreen"
    >
      <Stack.Screen
        name={routes.home}
        component={Home}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.paymentResult}
        component={paymentResult}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.homeList}
        component={HomeList}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.homeDetail}
        component={HomeDetail}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.feedBook}
        component={FeedBook}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.feedShare}
        component={FeedBookShare}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.feedBookImage}
        component={FeedBookImage}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />

      <Stack.Screen
        name={routes.search}
        component={Search}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.kbstest}
        component={Kbstest}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.mainQuiz}
        component={MainQuiz}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.activity}
        component={Activity}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.examtest}
        component={Examtest}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.bookContest}
        component={BookContest}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.searchBook}
        component={SearchBook}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.follow}
        component={Follow}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.comment}
        component={Comment}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />

      <Stack.Screen
        name={routes.hashTagImage}
        component={HashTagImage}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />

      <Stack.Screen
        name={routes.bookDrawer}
        component={BookDrawer}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />

      <Stack.Screen
        name={routes.bookDrawerDetail}
        component={BookDrawerDetail}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />

      <Stack.Screen
        name={routes.tab}
        component={Tabs}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.shinchung}
        component={ShinChung}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.shinchungdetail}
        component={ShinChungDetail}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.canceldetail}
        component={CancelDetail}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.faq}
        component={Faq}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.notice}
        component={Notice}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.setting}
        component={Setting}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.profile}
        component={Profile}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.event}
        component={Event}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.eventDetail}
        component={EventDetail}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.cameraRollPicker}
        component={CameraRollPicker}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.photoEditor}
        component={PhotoEditor}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.feedBookEditor}
        component={FeedBookEditor}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.intro1}
        component={Intro1}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.intro2}
        component={Intro2}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.intro3}
        component={Intro3}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.policyHome}
        component={PolicyHome}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.teenager}
        component={Teenager}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.provision}
        component={Provision}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name={routes.payment}
        component={Payment}
        options={({ route, navigation }) => {
          return {
            swipeEnabled: false,
          };
        }}
      />
    </Stack.Navigator>
  );
}

export default function Router() {
  const [currentRouteName, setCurrentRoutName] = useState(null);
  const user = useSelector(s => s.user, shallowEqual);
  const dialog = useSelector(s => s.dialog, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.inited && !user.signed) {
      reset(routes.login);
    } else if (user.inited && user.signed) {
      if (!user.intro_setting) {
        if(user.category != 'partner'){
          navigate(routes.intro1, { age: user.age, initGrade: user.grade });
        }else{
          navigate(routes.intro2, { grade : 10 , category: user.category});
        }
      }
    }
  }, [user.signed, user.inited]);

  useEffect(() => {
    const backAction = () => {
      dispatch(
        dialogOpenAction({
          titleColor: colors.blue,
          cancelTitle: '??????',
          message: '?????? ??????????????????????????',
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
      dispatch(userSignOut(user.member_id));
      return true;
    };
    if (currentRouteName === 'splash') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        true,
      );
      return () => backHandler.remove();
    } else if (currentRouteName === 'login') {
      let backHandler = null;
      if (!dialog.selectKakaoLoginDialog?.open) {
        backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
        return () => backHandler.remove();
      } else {
        backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backLogoutAction,
        );
        return () => backHandler.remove();
      }
    } else if (currentRouteName === 'RegisterFormToapingInfo') {
      let backHandler = null;
      if (!dialog.selectKakaoLoginDialog?.open) {
        backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
        return () => backHandler.remove();
      } else {
        backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backLogoutAction,
        );
        return () => backHandler.remove();
      }
    } else if (currentRouteName === 'registerFormInfo') {
      let backHandler = null;
      if (!dialog.selectKakaoLoginDialog?.open) {
        backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
        return () => backHandler.remove();
      } else {
        backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backLogoutAction,
        );
        return () => backHandler.remove();
      }
    } else if (currentRouteName === 'intro1') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backLogoutAction,
      );
      return () => backHandler.remove();
    }
  }, [currentRouteName, dialog.selectKakaoLoginDialog?.open]);

  useEffect(() => {
    const backDialogCloseAction = () => {
      dispatch(dialogClose());
      return true;
    };
    let backHandler = null;
    if (
      dialog.messageDialog?.open ||
      dialog.actionDialog?.open ||
      dialog.selectKakaoLoginDialog?.open ||
      dialog.drawerDialog?.open ||
      dialog.drawerKeyBoardDialog?.open ||
      dialog.selectDialog?.open ||
      dialog.openDialog?.open
    ) {
      backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backDialogCloseAction,
      );
      return () => backHandler.remove();
    }
  }, [
    dialog.messageDialog?.open,
    dialog.actionDialog?.open,
    dialog.selectKakaoLoginDialog?.open,
    dialog.drawerDialog?.open,
    dialog.drawerKeyBoardDialog?.open,
    dialog.selectDialog?.open,
    dialog.openDialog?.open,
  ]);

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
              options={({ route, navigation }) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.login}
              component={Login}
              options={({ route, navigation }) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.policy}
              component={Policy}
              options={({ route, navigation }) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.toapingLogin}
              component={ToapingLogin}
              options={({ route, navigation }) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.findId}
              component={FindId}
              options={({ route, navigation }) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.findIdOk}
              component={FindIdOk}
              options={({ route, navigation }) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.findPw}
              component={FindPw}
              options={({ route, navigation }) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.passwordUpdate}
              component={PasswordUpdate}
              options={({ route, navigation }) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.registerForm}
              component={RegisterForm}
              options={({ route, navigation }) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              initialParams={{}}
              name={routes.registerFormInfo}
              component={RegisterFormInfo}
              options={({ route, navigation }) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              initialParams={{}}
              name={routes.registerFormToapingInfo}
              component={RegisterFormToapingInfo}
              options={({ route, navigation }) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.intro1}
              component={Intro1}
              options={({ route, navigation }) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.intro2}
              component={Intro2}
              options={({ route, navigation }) => {
                return {
                  swipeEnabled: false,
                };
              }}
            />
            <Drawer.Screen
              name={routes.intro3}
              component={Intro3}
              options={({ route, navigation }) => {
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
            initialRouteName={"HomeScreens"}
            drawerContent={props => <DrawerCustom {...props} />}
            swipeEnabled="false">
            <Drawer.Screen name="Main" component={StackNavigator}
              options={({ route, navigation }) => {
                return {
                  swipeEnabled: false,
                };
              }} />
          </Drawer.Navigator>
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}
