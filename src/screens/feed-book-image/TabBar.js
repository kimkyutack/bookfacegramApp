import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import routes from '../../libs/routes';
import {heightPercentage} from '../../services/util';

export default function TabBar({state, descriptors, navigation, position}) {
  const hideOnScreens = [routes.feedBookFeed];

  if (state.index === 2) {
    return <></>;
  } else {
    return (
      <View style={styles.root}>
        {state.routes.map((route, index) => {
          if (hideOnScreens.indexOf(route.name) > -1) {
            return false;
          }

          const {options} = descriptors[route.key];

          // const label =
          //   options.tabBarLabel !== undefined
          //     ? options.tabBarLabel
          //     : options.title !== undefined
          //     ? options.title
          //     : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // const onLongPress = () => {
          //   navigation.emit({
          //     type: 'tabLongPress',
          //     target: route.key,
          //   });
          // };

          // const inputRange = state.routes.map((_, i) => i);
          // const opacity = Animated.interpolate(position, {
          //   inputRange,
          //   outputRange: inputRange.map(i => (i === index ? 1 : 0)),
          // });

          return (
            <TouchableOpacity
              key={index?.toString()}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              // onLongPress={onLongPress}
              style={[styles.tabItem, isFocused && styles.tabFocused]}>
              {options.tabBarIcon}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    borderTopColor: '#e6e6e6',
    justifyContent: 'space-around',
    height: heightPercentage(30),
    marginTop: heightPercentage(10),
  },
  tabItem: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    borderBottomWidth: 2,
    borderBottomColor: colors.white,
  },
  tabFocused: {
    borderBottomWidth: 2,
    borderBottomColor: '#333333',
  },
  label: {
    lineHeight: 12,
    fontSize: 11,
    marginTop: 4,
  },
});
