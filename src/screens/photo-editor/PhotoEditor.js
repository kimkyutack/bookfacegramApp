import {useRoute} from '@react-navigation/native';
import React from 'react';
import {Image, SafeAreaView, TouchableOpacity, View} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import Topbar from '../../components/topbar/Topbar';
import RootLayout from '../../layouts/root-layout/RootLayout';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import {goBack, navigate} from '../../services/navigation';
export default function PhotoEditor({}) {
  const {params} = useRoute();

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: '#000'}}>
        <View
          style={{
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={goBack}
            style={{paddingHorizontal: 16, paddingVertical: 16}}>
            <Image
              source={images.back}
              style={{width: 24, height: 24, tintColor: '#fff'}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigate(params.route, {
                [params.dataKey]: params.image,
                key: params.key,
                isImage: true,
              });
            }}
            style={{
              paddingHorizontal: 16,
              alignSelf: 'stretch',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TextWrap
              font={fonts.robotoMedium}
              style={{fontSize: 15, color: '#fff', lineHeight: 19}}>
              Send
            </TextWrap>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, marginVertical: 16}}>
          <Image
            source={{uri: params.image.uri}}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
