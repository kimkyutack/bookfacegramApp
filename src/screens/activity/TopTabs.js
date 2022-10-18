import React from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import TopActivity from '../home/TopActivity';
import TopMyBooks from '../home/TopMyBooks';
import TopNewBooks from '../home/TopNewBooks';
import routes from '../../libs/routes';
import TabBar from '../activity/TabBar';

const Tab = createMaterialTopTabNavigator();

export default function TopTabs({type, rank}) {
  return (
    <Tab.Navigator
      initialRouteName={routes.topActivity}
      swipeEnabled={false}
      tabBar={props => {
        return <TabBar {...props} type={type} />;
      }}>
      <Tab.Screen
        name={routes.topNewBooks}
        component={TopNewBooks}
        initialParams={{type: type}}
        options={{
          tabBarLabel: 'NEW BOOKS',
        }}
      />
      <Tab.Screen
        name={routes.topMyBooks}
        component={TopMyBooks}
        initialParams={{type: type}}
        options={{tabBarLabel: 'MY BOOKS'}}
      />
      <Tab.Screen
        name={routes.topActivity}
        component={TopActivity}
        initialParams={{type: type, rank: rank}}
        options={{tabBarLabel: 'ACTIVITY'}}
      />
    </Tab.Navigator>
  );
}
