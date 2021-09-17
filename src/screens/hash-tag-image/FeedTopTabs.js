import React, {useEffect} from 'react';
import {Image} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

import HashTagPopularImage from './HashTagPopularImage';
import HashTagNewestImage from './HashTagNewestImage';
import HashTagFeed from './HashTagFeed';

import TabBar from './TabBar';
import routes from '../../libs/routes';
import images from '../../libs/images';

const Tab = createMaterialTopTabNavigator();

export default function FeedTopTabs({route}) {
  return (
    <Tab.Navigator
      initialRouteName={routes.hashTagPopularImage}
      swipeEnabled={false}
      tabBar={props => {
        return <TabBar {...props} />;
      }}
      tabBarOptions={{
        showIcon: true,
        showLabel: false,
      }}>
      <Tab.Screen
        name={routes.hashTagPopularImage}
        component={HashTagPopularImage}
        initialParams={route.params?.params}
        options={{
          tabBarLabel: '인기 피드북',
        }}
      />
      <Tab.Screen
        name={routes.hashTagNewestImage}
        component={HashTagNewestImage}
        initialParams={route.params?.params}
        options={{
          tabBarLabel: '최신 피드북',
        }}
      />
      <Tab.Screen
        name={routes.hashTagFeed}
        component={HashTagFeed}
        initialParams={route.params?.params}
      />
    </Tab.Navigator>
  );
}
