import React, {useState} from 'react';
import {Image, StyleSheet, View, Dimensions} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import TextWrap from '../text-wrap/TextWrap';

export default function SnapCarousel({data, sliderWidth, itemWidth}) {
  const windowWidth = Dimensions.get('window').width;
  const [activeSlide, setActiveSlide] = useState(0);
  const _renderItem = ({item, index}) => {
    return (
      <View
        style={{
          backgroundColor: 'green',
          marginTop: 25,
          height: 150,
          // padding: 50,
          // marginLeft: 25,
          // marginRight: 25,
        }}>
        <TextWrap style={{fontSize: 30}}>{item.title}</TextWrap>
      </View>
    );
  };

  return (
    <>
      <Carousel
        layout={'default'}
        // layoutCardOffset={'0'}
        data={data}
        renderItem={_renderItem}
        sliderWidth={windowWidth - 40}
        itemWidth={windowWidth - 40}
        onSnapToItem={index => setActiveSlide(index)}
        autoplay={true}
        loop={true}
        autoplayInterval={5000}
      />

      <Pagination
        dotsLength={data.length}
        activeDotIndex={activeSlide}
        containerStyle={{backgroundColor: 'transparent', paddingVertical: 10}}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 1,
          backgroundColor: '#919392',
          position: 'relative',
          top: -35,
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </>
  );
}
const styles = StyleSheet.create({
  root: {
    // flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
