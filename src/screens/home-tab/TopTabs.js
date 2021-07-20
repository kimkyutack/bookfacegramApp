import React from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import TopActivity from './TopActivity';
import TopMyBooks from './TopMyBooks';
import TopNewBooks from './TopNewBooks';
import routes from '../../libs/routes';
import {screenWidth} from '../../services/util';

const Tab = createMaterialTopTabNavigator();

export default function TopTabs() {
  return (
    <Tab.Navigator
      initialRouteName={routes.topNewBooks}
      tabBarOptions={{
        labelStyle: {fontSize: 12},
        style: {
          elevation: 0, // defualt border color
        },
        indicatorStyle: {
          // width: screenWidth / 5,
          // left: screenWidth / 15,
          borderColor: '#FED500',
          borderWidth: 1,
          borderBottomWidth: 3,
        },
        indicatorContainerStyle: {
          marginHorizontal: 19,
          paddingHorizontal: 58,
          // flex: 1,
          // justifyContent: 'space-around',
          // backgroundColor: 'red',
        },
        tabStyle: {
          borderWidth: 0,
          borderBottomWidth: 0,
        },
      }}>
      <Tab.Screen
        name={routes.topNewBooks}
        component={TopNewBooks}
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
        options={{tabBarLabel: 'ACTIVITY'}}
      />
    </Tab.Navigator>
  );
}
