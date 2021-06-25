import React, {useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {useSelector, shallowEqual} from 'react-redux';
import Length from '../../components/length/Length';
import routes from '../../libs/routes';
export default function TabIcon({focused, icon, focusedIcon, name}) {
  const {length} = useSelector(s => s.chat, shallowEqual);

  return (
    <View>
      <Image
        source={focused ? focusedIcon : icon}
        style={{
          width: 24,
          height: 24,
          resizeMode: 'contain',
        }}
      />
      {name === routes.tabChat && parseInt(length) > 0 && (
        <Length top={-4} right={length < 10 ? -5 : length < 100 ? -12 : -18}>
          {length}
        </Length>
      )}
    </View>
  );
}
