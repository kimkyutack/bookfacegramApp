import {tabActionType} from './TabAction';

const initTab = {
  tab: 'main',
  tabType: '',
  mainTab: {},
  listTab: {},
  detailTab: {viewType: ''},
  rank: '',
  region: '',
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
    case tabActionType.audio:
      return {
        ...state,
        tab: action.tab,
        detailTab: {
          selectedBook: action.selectedBook,
        },
      };
    case tabActionType.gather:
      return {
        ...state,
        tab: action.tab,
        region: action.region,
        detailTab: {
          selectedBook: action.selectedBook,
        },
      };
    case tabActionType.gatherlist:
      return {
        ...state,
        tab: action.tab,
        listTab: {
          region: action.region,
          rank: action.rank,
        },
      };
    case tabActionType.gatherdetail:
      return {
        ...state,
        tab: action.tab,
        detailTab: {
          num: action.num,
        },
      };
      
    default:
      return state;
  }
}
