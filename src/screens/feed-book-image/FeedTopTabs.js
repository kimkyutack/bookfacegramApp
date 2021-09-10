import React, {useEffect} from 'react';
import {Image} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import FeedBookAllImage from './FeedBookAllImage';
import FeedBookUserImage from './FeedBookUserImage';
import FeedBookFeed from './FeedBookFeed';
import TabBar from './TabBar';
import routes from '../../libs/routes';
import images from '../../libs/images';
import {heightPercentage} from '../../services/util';

const Tab = createMaterialTopTabNavigator();

export default function FeedTopTabs({route}) {
  return (
    <Tab.Navigator
      initialRouteName={routes.feedBookUserImage}
      swipeEnabled={false}
      tabBar={props => {
        return <TabBar {...props} />;
      }}
      tabBarOptions={{
        showIcon: true,
        showLabel: false,
      }}>
      <Tab.Screen
        name={routes.feedBookUserImage}
        component={FeedBookUserImage}
        initialParams={route.params?.params}
        options={{
          tabBarIcon: (
            <Image
              source={images.userFeed}
              style={{
                width: 24,
                height: 24,
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name={routes.feedBookAllImage}
        component={FeedBookAllImage}
        initialParams={route.params?.params}
        options={{
          tabBarIcon: (
            <Image
              source={images.allFeed}
              style={{
                width: 24,
                height: 24,
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name={routes.feedBookFeed}
        component={FeedBookFeed}
        initialParams={route.params?.params}
      />
    </Tab.Navigator>
  );
}
// tabBarOptions
// style: {
//   elevation: 0, // defualt border color
//   marginTop: heightPercentage(10),
// },
// indicatorStyle: {
//   borderColor: '#333333',
//   borderWidth: 1,
//   borderBottomWidth: 2,
// },
// indicatorContainerStyle: {
//   borderTopWidth: 1,
//   borderBottomWidth: 1,
//   borderBottomColor: '#e6e6e6',
//   borderTopColor: '#e6e6e6',
// },
// tabStyle: {
//   height: heightPercentage(35),
//   paddingBottom: heightPercentage(18),
//   borderWidth: 0,
//   borderBottomWidth: 0,
// },
