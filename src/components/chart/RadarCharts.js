import React, { useState, useEffect, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import {
  Image,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  processColor,
  Text,
} from 'react-native';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
  screenHeight,
} from '../../services/util';
import images from '../../libs/images';
import { requestGet } from '../../services/network';
import consts from '../../libs/consts';
import colors from '../../libs/colors';

import { RadarChart } from 'react-native-charts-wrapper';

export default function RadarCharts() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    data: {},
    legend: {
      enabled: true,
      textSize: 14,
      form: 'CIRCLE',
      wordWrapEnabled: true,
    },
    marker: {
      enabled: true,
      markerColor: processColor('red'),
      textColor: processColor('red'),
      markerFontSize: 14,
    },
  });

  const user = useSelector(s => s.user, shallowEqual);
  const [aScore, setAScore] = useState('');
  const [bScore, setBScore] = useState('');
  const [cScore, setCScore] = useState('');
  const [dScore, setDScore] = useState('');
  const [eScore, setEScore] = useState('');

  useEffect(async () => {
    setLoading(true);
    await requestGet({ url: consts.apiUrl + '/mybooks/graph' })
      .then(res => {
        let chartData = [];
        setAScore(res.data.a);
        setBScore(res.data.b);
        setCScore(res.data.c);
        setDScore(res.data.d);
        setEScore(res.data.e);

        chartData.push(res.data.a);
        chartData.push(res.data.b);
        chartData.push(res.data.c);
        chartData.push(res.data.d);
        chartData.push(res.data.e);

        setData({
          data: {
            dataSets: [
              {
                values: chartData,
                label: 'DS 1',
                config: {
                  color: processColor('blue'),
                  drawFilled: false,
                  fillColor: processColor('blue'),
                  fillAlpha: 0,
                  lineWidth: 2,
                  drawValues: false,
                },
              },
            ],
          },
          xAxis: {
            valueFormatter: ['A', 'B', 'C', 'D', 'E'],
            textSize: fontPercentage(20),
          },
          yAxis: {
            axisMinimum: 0,
            axisMaximum: 100,
            labelCount: 6,
            labelCountForce: true,
          },
          legend: {
            enabled: false,
            textSize: 20,
            form: 'CIRCLE',
            wordWrapEnabled: false,
          },
          marker: {
            enabled: true,
            markerColor: processColor('red'),
            textColor: processColor('red'),
            markerFontSize: 14,
          },
        });
        setLoading(false);
      })
      .catch(e => {
        // console.log(e);
        // dispatch(dialogError(e));
      });


  }, []);

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  return (

    <View style={{ flex: 1, alignItems: 'center', marginBottom: heightPercentage(30), }}>
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{ alignSelf: 'center', marginBottom: 60 }}
          color={colors.blue}
        />
      ) : (<View style={styles.container}>
        <Image
          source={images.image_a1}
          borderRadius={100}
          style={styles.image}
        />
        {(() => {
          if (
            aScore >= 1 ||
            bScore >= 1 ||
            cScore >= 1 ||
            dScore >= 1 ||
            eScore >= 1
          ) {
            return (
              <Image
                source={images.image_a2}
                borderRadius={100}
                style={styles.image2}
              />
            );
          }
        })()}

        {(function () {
          if (
            aScore >= 20 ||
            bScore >= 20 ||
            cScore >= 20 ||
            dScore >= 20 ||
            eScore >= 20
          ) {
            return (
              <Image
                source={images.image_a3}
                borderRadius={100}
                style={styles.image2}
              />
            );
          }
        })()}

        {(function () {
          if (
            aScore >= 40 ||
            bScore >= 40 ||
            cScore >= 40 ||
            dScore >= 40 ||
            eScore >= 40
          ) {
            return (
              <Image
                source={images.image_a4}
                borderRadius={100}
                style={styles.image2}
              />
            );
          }
        })()}

        {(function () {
          if (aScore >= 60) {
            return (
              <Image
                source={images.image_a5}
                borderRadius={100}
                style={styles.image2}
              />
            );
          }
        })()}

        {(function () {
          if (aScore >= 80) {
            return (
              <Image
                source={images.image_a6}
                borderRadius={100}
                style={styles.image2}
              />
            );
          }
        })()}

        {(function () {
          if (bScore >= 60) {
            return (
              <Image
                source={images.image_b5}
                borderRadius={100}
                style={styles.image2}
              />
            );
          }
        })()}

        {(function () {
          if (bScore >= 80) {
            return (
              <Image
                source={images.image_b6}
                borderRadius={100}
                style={styles.image2}
              />
            );
          }
        })()}
        {(function () {
          if (cScore >= 60) {
            return (
              <Image
                source={images.image_c5}
                borderRadius={100}
                style={styles.image2}
              />
            );
          }
        })()}
        {(function () {
          if (cScore >= 80) {
            return (
              <Image
                source={images.image_c6}
                borderRadius={100}
                style={styles.image2}
              />
            );
          }
        })()}
        {(function () {
          if (dScore >= 60) {
            return (
              <Image
                source={images.image_d5}
                borderRadius={100}
                style={styles.image2}
              />
            );
          }
        })()}

        {(function () {
          if (dScore >= 80) {
            return (
              <Image
                source={images.image_d6}
                borderRadius={100}
                style={styles.image2}
              />
            );
          }
        })()}
        {(function () {
          if (eScore >= 60) {
            return (
              <Image
                source={images.image_e5}
                borderRadius={100}
                style={styles.image2}
              />
            );
          }
        })()}
        {(function () {
          if (eScore >= 80) {
            return (
              <Image
                source={images.image_e6}
                borderRadius={100}
                style={styles.image2}
              />
            );
          }
        })()}
        <RadarChart
          style={styles.chart}
          data={data.data}
          xAxis={data.xAxis}
          yAxis={data.yAxis}
          chartDescription={{ text: '' }}
          legend={data.legend}
          drawWeb={true}
          webLineWidth={1}
          webLineWidthInner={1}
          webAlpha={30} //오각형 밝기
          webColor={processColor('black')}
          webColorInner={processColor('black')}
          skipWebLineCount={0}
          rotationEnabled={false}
          touchEnabled={false}
          marker={data.marker}
        />
      </View>)}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: widthPercentage(250),
    height: 240,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    width: '100%',
    height: 200,
  },
  image: {
    flex: 1,
    width: '100%',
    height: 240,
    position: 'absolute',
    resizeMode: 'contain',
  },
  image2: {
    flex: 1,
    width: '65%',
    height: '80%',
    position: 'absolute',
    resizeMode: 'stretch',
  },
});
