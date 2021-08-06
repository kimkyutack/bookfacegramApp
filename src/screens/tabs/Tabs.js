import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, SafeAreaView} from 'react-native';
import routes from '../../libs/routes';
import images from '../../libs/images';
import Splash from '../splash/Splash';
import colors from '../../libs/colors';
import TabIcon from './TabIcon';
import TabBar from './TabBar';
import TopActivity from '../home/TopActivity';
import TopMyBooks from '../home/TopMyBooks';
import Event from '../event/Event';
import Notice from '../notice/Notice';
import Home from '../home/homeMain';

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
            tabBarIcon: props => (
              <TabIcon
                {...props}
                icon={images.tabChatOff}
                focusedIcon={images.tabChatOn}
              />
            ),
          }}
          name={routes.event}
          component={Event}
        />
        <BottomTab.Screen
          options={{
            tabBarLabel: '<',
            tabBarIcon: props => (
              <TabIcon
                {...props}
                icon={images.tabChatOff}
                focusedIcon={images.tabChatOn}
              />
            ),
          }}
          name={routes.topActivity}
          component={TopActivity}
        />
        <BottomTab.Screen
          options={{
            tabBarLabel: 'home',
            tabBarIcon: props => (
              <TabIcon
                {...props}
                icon={images.tabChatOff}
                focusedIcon={images.tabChatOn}
              />
            ),
          }}
          name={routes.home}
          component={Home}
        />
        <BottomTab.Screen
          options={{
            tabBarLabel: 'feed',
            tabBarIcon: props => (
              <TabIcon
                {...props}
                icon={images.tabChatOff}
                focusedIcon={images.tabChatOn}
              />
            ),
          }}
          name={routes.topMyBooks}
          component={TopMyBooks}
        />
        <BottomTab.Screen
          options={{
            tabBarLabel: 'my',
            tabBarIcon: props => (
              <TabIcon
                {...props}
                icon={images.tabChatOff}
                focusedIcon={images.tabChatOn}
              />
            ),
          }}
          name={routes.notice}
          component={Notice}
        />
      </BottomTab.Navigator>
    </SafeAreaView>
  );
}
