import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, SafeAreaView} from 'react-native';
import routes from '../../libs/routes';
import images from '../../libs/image';
import Splash from '../splash/Splash';
import colors from '../../libs/colors';
import TabIcon from './TabIcon';
import TabBar from './TabBar';

import Home from '../homeTab';

const BottomTab = createBottomTabNavigator();
export default function Tabs({route, navigation}) {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <BottomTab.Navigator
        tabBar={props => <TabBar {...props} />}
        initialRouteName={routes.home}
        tabBarOptions={{
          keyboardHidesTabBar: true,
          activeTintColor: colors.primary,
          inactiveBackgroundColor: '#343434',
        }}>
        <BottomTab.Screen
          options={{
            tabBarLabel: 'menu',
            // tabBarIcon: props => (
            //   <TabIcon
            //     {...props}
            //     icon={image.tabFriendOff}
            //     focusedIcon={image.tabFriendOn}
            //   />
            // ),
          }}
          name={routes.topActivity}
          component={Home}
        />
        <BottomTab.Screen
          options={{
            tabBarLabel: '<',
            // tabBarIcon: (props) => (
            //   <TabIcon
            //     {...props}
            //     icon={image.tabChatOff}
            //     focusedIcon={image.tabChatOn}
            //   />
            // ),
          }}
          name={routes.login}
          component={Home}
        />
        <BottomTab.Screen
          options={{
            tabBarLabel: 'home',
            // tabBarIcon: (props) => (
            //   <TabIcon
            //     {...props}
            //     icon={image.tabChatOff}
            //     focusedIcon={image.tabChatOn}
            //   />
            // ),
          }}
          name={routes.home}
          component={Home}
        />
        <BottomTab.Screen
          options={{
            tabBarLabel: 'feed',
            // tabBarIcon: (props) => (
            //   <TabIcon
            //     {...props}
            //     icon={image.tabFindOff}
            //     focusedIcon={image.tabFindOn}
            //   />
            // ),
          }}
          name={routes.event}
          component={Home}
        />
        <BottomTab.Screen
          options={{
            tabBarLabel: 'my',
            // tabBarIcon: (props) => (
            //   <TabIcon
            //     {...props}
            //     icon={image.tabFindOff}
            //     focusedIcon={image.tabFindOn}
            //   />
            // ),
          }}
          name={routes.tab}
          component={Home}
        />
      </BottomTab.Navigator>
    </SafeAreaView>
  );
}
