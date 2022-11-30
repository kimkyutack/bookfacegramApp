import React, { useState} from 'react';
/* 아임포트 결제모듈을 불러옵니다. */
import IMP from 'iamport-react-native';
/* 로딩 컴포넌트를 불러옵니다. */
import Loading from './Loading';
import { View, StyleSheet } from 'react-native';
import { screenWidth, widthPercentage } from './util';

export function Payment({ route, navigation }) {
  const [param, setParam] = useState([route]);
  const [screenWidth, setScreenWidth] = useState(0);
  /* [필수입력] 결제 종료 후, 라우터를 변경하고 결과를 전달합니다. */
  function callback(response) {
    console.log(param.concat(response))
    navigation.replace('paymentResult', param.concat(response));
  }

  /* [필수입력] 결제에 필요한 데이터를 입력합니다. */
  const data = {
    pg: 'html5_inicis',
    pay_method: 'card',
    name: route.params.params.name,
    merchant_uid: `toaping_${new Date().getTime()}`,
    amount: route.params.params.amount,
    buyer_name: route.params.params.buyer_name,
    buyer_tel: route.params.params.buyer_tel,
    buyer_email: route.params.params.buyer_email,
    buyer_addr: '서울시 강남구 신사동 661-16',
    buyer_postcode: '06018',
    app_scheme: 'bookfacegram',
    // [Deprecated v1.0.3]: m_redirect_url
  };

  return (
    
      <View style={styles.container}>
          <IMP.Payment
            userCode={'iamport'}  // 가맹점 식별코드
            loading={<Loading />} // 로딩 컴포넌트
            data={data}           // 결제 데이터
            callback={callback}   // 결제 종료 후 콜백
          />
      </View>
  );

  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth
  },
});

export default Payment;