import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import RootLayout from '../../layouts/root-layout/RootLayout';
import fonts from '../../libs/fonts';
import colors from '../../libs/colors';
import images from '../../libs/images';
import {
  fontPercentage,
  heightPercentage,
  widthPercentage,
  screenWidth
} from '../../services/util';
import Footer from '../../libs/footer';
import TextWrap from '../../components/text-wrap/TextWrap';

export default function Teenager({ route, navigation }) {

  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 300;
  const listRef = useRef();

  return (
    <RootLayout
      topbar={{
        title: '청소년보호정책',
        back: true,
        navigation: navigation,
      }}>
      <ScrollView
        ref={listRef}
        style={styles.root}
        onScroll={event => {
          setContentVerticalOffset(event.nativeEvent.contentOffset.y);
        }}
      >
        <View style={styles.userInfoContainer}>
          <View>
            <TextWrap style={styles.contents}>
              ㈜피씨엔씨가 운영하는 ‘토핑’ 앱 서비스(이하 ‘회사’라 함)는
              청소년이 정신적·신체적으로 유해한 환경으로부터 보호받고 건전하게
              성장할 수 있도록 하기 위하여 정보통신망이용촉진 및 정보보호 등에
              관한 법률 및 청소년 보호정책을 수립, 시행하고 있습니다. {'\n'}
              {'\n'}
              회사는 방송통신심의위원회의 정보통신에 관한 심의 규정 및
              청소년보호법상의 청소년유해매체물 심의기준 등에 따라 19세 미만의
              청소년들이 유해정보에 접근할 수 없도록 방지하고 있는 바, 본 청소년
              보호정책을 통하여 회사가 청소년보호를 위해 어떠한 조치를 취하고
              있는지를 알려드립니다. {'\n'}
            </TextWrap>
            <TextWrap style={styles.title}>
              1.유해정보에 대한 청소년접근제한 및 관리조치
            </TextWrap>
            <TextWrap style={styles.contents}>
              회사는 청소년이 아무런 제한장치 없이 유해정보에 노출되지 않도록
              청소년유해매체물에 대해서는 인증장치를 마련·적용하고 있으며,
              유해정보가 노출되지 않게 하기 위한 예방 차원의 조치를 강구하고
              있습니다.{'\n'}
            </TextWrap>
            <TextWrap style={styles.title}>
              2.유해정보로부터의 청소년 보호를 위한 교육 시행
            </TextWrap>
            <TextWrap style={styles.contents}>
              회사는 청소년보호책임자를 대상으로 청소년 보호를 위한 각종 관련
              법령 및 제재개준, 유해정보 발견 시 대처방법, 위반사항 처리에 대한
              보고절차 등을 교육하고 있습니다. {'\n'}
            </TextWrap>
            <TextWrap style={styles.title}>
              3.유해정보로 인한 피해상담 및 고충처리
            </TextWrap>
            <TextWrap style={styles.contents}>
              회사는 유해정보로 인한 피해상담 및 고충처리를 위한 전문인력을
              배치하여 구제조치의 지연 및 처리 미숙으로 인한 피해가 확산되지
              않도록 노력하고 있습니다. {'\n'}
            </TextWrap>
            <TextWrap style={styles.title}>4.청소년보호책임팀 지정</TextWrap>
            <TextWrap style={styles.contents}>
              회사는 청소년보호정책 수립 등 청소년보호 업무에 최선을 다하고
              있습니다. {'\n'}- 담당팀 : 기획운영팀{'\n'}- 문의 :
              pcncrekr@pcnc.dooray.com │ 02-2281-3322
            </TextWrap>
          </View>
        </View>
      </ScrollView>
      {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
        <TouchableOpacity
          onPress={() => {
            listRef.current.scrollTo({ animated: true, offset: 0 });
          }}
          style={styles.topButton}>
          <Image source={images.scrollTop} style={styles.scrolltotop} />
        </TouchableOpacity>
      )}
      <Footer page={'home'} />
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#f9f9f9',
  },
  userInfoContainer: {
    alignItems: 'center',
    marginVertical: heightPercentage(30),
    backgroundColor: '#fff',
    paddingHorizontal: widthPercentage(10),
    paddingVertical: heightPercentage(15),
    marginHorizontal: widthPercentage(20),
  },
  title: {
    marginTop: heightPercentage(33),
    marginBottom: heightPercentage(5),
    fontWeight: 'bold',
    fontSize: fontPercentage(15),
  },
  contents: {
    fontSize: fontPercentage(13),
  },
  scrolltotop: {
    width: widthPercentage(35),
    height: heightPercentage(35),
    resizeMode: 'contain',
  },
  topButton: {
    alignItems: 'center',
    width: widthPercentage(35),
    height: heightPercentage(35),
    position: 'absolute',
    bottom: heightPercentage(65),
    left: screenWidth / 2.2,
    display: 'flex',
  },
});
