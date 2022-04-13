import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, SafeAreaView} from 'react-native';
import routes from '../../libs/routes';
import images from '../../libs/images';
import colors from '../../libs/colors';
import TabIcon from './TabIcon';
import TabBar from './TabBar';
import Notice from '../notice/Notice';
import Faq from '../faq/Faq';
import Setting from '../setting/Setting';
import Home from './TabsHome';
import Back from './TabsBack';
import Menu from './TabsMenu';
import FeedBook from '../feed-book/FeedBook';

const BottomTab = createBottomTabNavigator();
export default function Tabs({route, navigation}) {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <BottomTab.Navigator
        tabBar={props => <TabBar {...props} />}
        initialRouteName={routes.feedBook}
        lazy={false}
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
          name={routes.tabMenu}
          component={Menu}
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
          name={routes.tabBack}
          component={Back}
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
          name={routes.tabHome}
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
          name={routes.feedBook}
          component={FeedBook}
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
        <BottomTab.Screen
          options={{
            tabBarLabel: 'faq',
            tabBarIcon: props => (
              <TabIcon
                {...props}
                icon={images.tabChatOff}
                focusedIcon={images.tabChatOn}
              />
            ),
          }}
          name={routes.faq}
          component={Faq}
        />
        <BottomTab.Screen
          options={{
            tabBarLabel: 'setting',
            tabBarIcon: props => (
              <TabIcon
                {...props}
                icon={images.tabChatOff}
                focusedIcon={images.tabChatOn}
              />
            ),
          }}
          name={routes.setting}
          component={Setting}
        />
      </BottomTab.Navigator>
    </SafeAreaView>
  );
}
