import {tabActionType} from './TabAction';

const initTab = {
  tab: 'main',
  mainTab: {},
  listTab: {},
  detailTab: {viewType: ''},
};

export default function loading(state = initTab, action) {
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
    case tabActionType.detail:
      return {
        ...state,
        tab: action.tab,
        detailTab: {
          selectedBook: action.selectedBook,
          viewType: action.viewType,
        },
      };
    default:
      return state;
  }
}
