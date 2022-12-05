// 액션
const paycancel = "payment/paycancel";

// 액션 생성 함수
export const setPayCancel = (ordercode) => ({ type : paycancel, ordercode });

// 초기값
const initialState = {
  ordercode:''
};

// 리덕스 스토어값 변경
export default function PayAction(state = initialState, action) {
  switch(action.type) {
    case paycancel :
      return {
        ...state,
        ordercode: action.ordercode,
      };
    default:
      return state;
  }
}