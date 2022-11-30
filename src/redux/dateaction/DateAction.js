// 액션
const SET_OPTION = "dateaction/SET_OPTION";
const now = new Date();
  
const year = now.getFullYear();
const month = now.getMonth() + 1 >= 10 ? now.getMonth() + 1 : '0' + now.getMonth() + 1;
const date = now.getDate() >= 10 ? now.getDate() : '0' + now.getDate();
const nowDate = year + '-' + month + '-' + date;
const eyear = new Date(year, now.getMonth() - 1, now.getDate()).getFullYear();
const emonth = new Date(year, now.getMonth() - 1, now.getDate()).getMonth() + 1 >= 10 ? new Date(year, now.getMonth() - 1, now.getDate()).getMonth() + 1 : '0' + new Date(year, now.getMonth() - 1, now.getDate()).getMonth() + 1;
const edate = new Date(year, now.getMonth() - 1, now.getDate()).getDate() >= 10 ? new Date(year, now.getMonth() - 1, now.getDate()).getDate() : '0' + new Date(year, now.getMonth() - 1, now.getDate()).getDate();
const eDate = eyear + '-' + emonth + '-' + edate;

// 액션 생성 함수
export const setDateOption = (start,end,menu) => ({ type : SET_OPTION, start, end, menu });


// 초기값
const initialState = {
  menu:'최근 1개월',
  startdate: eDate,
  enddate: nowDate,
};

// 리덕스 스토어값 변경
export default function setoption(state = initialState, action) {
  switch(action.type) {
    case SET_OPTION :
      return {
        ...state,
        startdate: action.start,
        enddate: action.end,
        menu: action.menu
      };
    default:
      return state;
  }
}