import React from 'react';

import {Animated, TouchableOpacity, View, Button} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import TopActivity from '../TopActivity';
import TopMyBooks from '../TopMyBooks';
import TopNewBooks from '../TopNewBooks';
import routes from '../../../libs/routes';
import {
  fontPercentage,
  heightPercentage,
  widthPercentage,
} from '../../../services/util';
import fonts from '../../../libs/fonts';
import TabBar from './activityTabBar';

const Tab = createMaterialTopTabNavigator();

export default function TopTabs({grade, type}) {
  return (
    <Tab.Navigator
      initialRouteName={routes.topNewBooks}
      swipeEnabled={false}
      tabBar={props => {
        return <TabBar {...props} />;
      }}>
      <Tab.Screen
        name={routes.topNewBooks}
        component={TopNewBooks}
        initialParams={{type: type, grade: grade}}
        options={{
          tabBarLabel: 'NEW BOOKS',
        }}
      />
      <Tab.Screen
        name={routes.topMyBooks}
        component={TopMyBooks}
        options={{tabBarLabel: 'MY BOOKS'}}
      />
      <Tab.Screen
        name={routes.topActivity}
        component={TopActivity}
        initialParams={{type: type}}
        options={{tabBarLabel: 'ACTIVITY'}}
      />
    </Tab.Navigator>
  );
}
