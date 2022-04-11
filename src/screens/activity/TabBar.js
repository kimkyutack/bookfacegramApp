import React from 'react';
import {View, TouchableWithoutFeedback, Text, StyleSheet} from 'react-native';
import colors from '../../libs/colors';
import routes from '../../libs/routes';
import fonts from '../../libs/fonts';
import TextWrap from '../../components/text-wrap/TextWrap';
import {
  fontPercentage,
  widthPercentage,
  heightPercentage,
} from '../../services/util';

export default function TabBar({state, descriptors, navigation}) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  if (focusedOptions?.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={styles.root}>
      {state.routes.map((route, index) => {
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
          if (!event.defaultPrevented) {
            if (route.name === routes.topNewBooks) {
              navigation.navigate(routes.home, {
                screen: routes.topNewBooks,
                params: {
                  type: 'main',
                  key: Date.now(),
                },
              });
            } else if (route.name === routes.topActivity) {
              navigation.navigate(routes.home, {
                screen: routes.topActivity,
                params: {
                  type: 'main',
                  key: Date.now(),
                },
              });
            } else if (route.name === routes.topMyBooks) {
              navigation.navigate(routes.home, {
                screen: routes.topMyBooks,
                params: {
                  type: 'main',
                  key: Date.now(),
                },
              });
            }
          }
        };

        return (
          <TouchableWithoutFeedback key={label} onPress={onPress}>
            <View
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options?.tabBarAccessibilityLabel}
              style={[
                styles.tabItem,
                {
                  borderBottomColor: isFocused ? '#FED500' : 0,
                },
              ]}>
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
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    width: widthPercentage(360),
    paddingHorizontal: 16,
    height: heightPercentage(60),
    elevation: 0,
  },
  tabItem: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    width: widthPercentage(110.5),
    borderBottomWidth: 3,
    borderBottomColor: colors.white,
  },
  label: {
    fontSize: fontPercentage(15),
    fontFamily: fonts.kopubWorldDotumProMedium,
  },
});
