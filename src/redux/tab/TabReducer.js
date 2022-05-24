import {tabActionType} from './TabAction';

const initTab = {
  tab: 'main',
  tabType: '',
  mainTab: {},
  listTab: {},
  detailTab: {viewType: ''},
  rank: '',
};

export default function loading(state = initTab, action) {
  //alert(action.selectType);
  switch (action.type) {
    case tabActionType.main:
      return {
        ...state,
        tab: action.tab,
        mainTab: {},
      };
    case tabActionType.list:
      return {
        ...state,
        tab: action.tab,
        listTab: {
          selectType: action.selectType,
          grade: action.grade,
          gradeStyle: action.gradeStyle,
          th: action.th,
        },
      };
    case tabActionType.mylist:
      return {
        ...state,
        tab: action.tab,
        listTab: {
          selectType: action.selectType,
        },
      };
    case tabActionType.detail:
      return {
        ...state,
        tab: action.tab,
        tabType: action.tabType,
        detailTab: {
          selectedBook: action.selectedBook,
          viewType: action.viewType,
          selectType: action.selectType,
        },
      };
    case tabActionType.quiz:
      return {
        ...state,
        tab: action.tab,
        tabType: action.tabType,
        rank: action.rank,
      };
    default:
      return state;
  }
}
