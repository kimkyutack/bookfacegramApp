import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import TextWrap from '../../components/text-wrap/TextWrap';
export default function TabBar({state, descriptors, navigation}) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  if (focusedOptions.tabBarVisible === false) {
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
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, {keyword: '', tab: true});
          }
        };

        return (
          <TouchableOpacity
            key={label}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={[styles.tabItem, {borderTopWidth: isFocused ? 2 : 0}]}>
            {options?.tabBarIcon({focused: isFocused, name: route.name})}
            <TextWrap
              font={fonts.kopubWorldDotumProMedium}
              style={[
                styles.label,
                {
                  color: isFocused ? colors.primary : '#222',
                },
              ]}>
              {label}
            </TextWrap>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    justifyContent: 'space-around',
    borderTopColor: colors.border,
    height: 58,
  },
  tabItem: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    borderTopColor: colors.primary,
  },
  label: {
    lineHeight: 12,
    fontSize: 11,
    marginTop: 4,
  },
});
