// 액션
const showinfo = "activity/showinfo";
const noshow = "activity/noshow";

// 액션 생성 함수
export const setShowInfo = (ordernum, selectOption, price) => ({ type : showinfo, ordernum, selectOption, price });
export const setShowInfozero = () => ({ type : noshow });

// 초기값
const initialState = {
  what:'',
  ordernum: [],
  option:[],
  price:0
};

// 리덕스 스토어값 변경
export default function showInfo(state = initialState, action) {
  switch(action.type) {
    case showinfo :
      return {
        ...state,
        what: 'info',
        ordernum: action.ordernum,
        option: action.selectOption,
        price: action.price
      };
    case noshow :
      return {
        ...state,
        what: 'noshow',
        ordernum: [],
      };
    default:
      return state;
  }
}