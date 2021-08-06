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

const Tab = createMaterialTopTabNavigator();

export default function TopTabs({grade, type}) {
  return (
    <Tab.Navigator
      initialRouteName={routes.topNewBooks}
      swipeEnabled={false}
      tabBarOptions={{
        labelStyle: {
          fontSize: fontPercentage(15),
          fontFamily: fonts.kopubWorldDotumProMedium,
        },
        style: {
          width: widthPercentage(332),
          height: heightPercentage(60),
          alignSelf: 'center',
          justifyContent: 'center',
          elevation: 0, // defualt border color
        },
        indicatorStyle: {
          borderColor: '#FED500',
          borderWidth: 1,
          borderBottomWidth: 3,
        },
        indicatorContainerStyle: {},
        tabStyle: {
          borderWidth: 0,
          borderBottomWidth: 0,
        },
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
        options={{tabBarLabel: 'ACTIVITY'}}
      />
    </Tab.Navigator>
  );
}
