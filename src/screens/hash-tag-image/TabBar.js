import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import routes from '../../libs/routes';
import TextWrap from '../../components/text-wrap/TextWrap';
import {
  fontPercentage,
  widthPercentage,
  heightPercentage,
} from '../../services/util';
export default function TabBar({state, descriptors, navigation, position}) {
  const hideOnScreens = [routes.hashTagFeed];

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
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

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
          return (
            <TouchableOpacity
              key={label}
              onPress={onPress}
              style={[styles.tabItem, isFocused && styles.tabFocused]}
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options?.tabBarAccessibilityLabel}>
              <View>
                <TextWrap
                  font={fonts.kopubWorldDotumProMedium}
                  style={[
                    styles.label,
                    {
                      color: isFocused ? '#333333' : '#acacac',
                    },
                  ]}>
                  {label}
                </TextWrap>
              </View>
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
    width: widthPercentage(360),
    height: heightPercentage(35),
    elevation: 0,
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
    fontSize: fontPercentage(11),
  },
});
