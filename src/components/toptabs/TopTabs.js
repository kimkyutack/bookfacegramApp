import React from 'react';
import {Dimensions} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import route from '../../libs/routes';
import TopActivity from '../../screens/homeTab/TopActivity';
import TopMyBooks from '../../screens/homeTab/TopMyBooks';
import TopNewBooks from '../../screens/homeTab/TopNewBooks';

const Tab = createMaterialTopTabNavigator();

export default function TopTabs() {
  return (
    <Tab.Navigator
      initialRouteName="NEW BOOKS"
      tabBarOptions={{
        labelStyle: {fontSize: 12},
        style: {
          elevation: 0, // defualt border color
        },
        indicatorStyle: {
          borderColor: '#FED500',
          borderWidth: 1,
          borderBottomWidth: 3,
        },
        indicatorContainerStyle: {marginHorizontal: 20, paddingHorizontal: 60},
        tabStyle: {
          borderWidth: 0,
          borderBottomWidth: 0,
        },
      }}>
      <Tab.Screen name="NEW BOOKS" component={TopNewBooks} />
      <Tab.Screen name="MY BOOKS" component={TopMyBooks} />
      <Tab.Screen name="ACTIVITY" component={TopActivity} />
    </Tab.Navigator>
  );
}
