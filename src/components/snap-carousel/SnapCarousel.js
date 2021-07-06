import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import image from '../../libs/image';
import colors from '../../libs/colors';
export default function SnapCarousel({name, sliderWidth, itemWidth}) {
  const isCarousel = useRef(null);
  const [loading, setLoading] = useState(false);
  const [renderData, setRenderData] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setLoading(true);
    switch (name) {
      case 'mainCarousel':
        setRenderData([
          {id: 1, title: image.bannerOne},
          {id: 2, title: image.bannerTwo},
        ]);
        setLoading(false);
        break;
      default:
        setLoading(false);
        break;
    }
  }, [name]);
  const _renderItem = ({item, index}) => {
    // console.log(item);
    return (
      <TouchableWithoutFeedback>
        <View style={styles.bannerContainer} key={index}>
          <Image style={styles.banner} source={item.title} />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.root}>
      {loading ? (
        <ActivityIndicator
          size="small"
          style={{alignSelf: 'center', marginBottom: 60}}
          color={colors.primary}
        />
      ) : (
        <>
          <View>
            <Carousel
              ref={isCarousel}
              layout={'default'}
              data={renderData ? renderData : []}
              enableSnap={true}
              renderItem={_renderItem}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
              onSnapToItem={index => setActiveSlide(index)}
              autoplay={true}
              loop={true}
              autoplayInterval={5000}
            />
          </View>
          <View>
            <Pagination
              dotsLength={renderData ? renderData.length : 0}
              carouselRef={isCarousel}
              activeDotIndex={activeSlide}
              containerStyle={{
                backgroundColor: 'transparent',
                paddingVertical: 0,
              }}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 1,
                backgroundColor: '#919392',
                position: 'relative',
                top: -25,
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
              tappableDots={true}
            />
          </View>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  banner: {
    height: 150,
    width: '100%',
    resizeMode: 'stretch',
  },
  bannerContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    height: 150,
  },
});
