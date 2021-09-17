import {TagActionType} from './TagAction';

const initTag = {
  isPopularLoading: false,
  isNewestLoading: false,
  popularHashTags: [],
  newestHashTags: [],
  popularPage: 1,
  newestPage: 1,
  popularErrorMessage: '',
  newestErrorMessage: '',
  currentHashTag: '',
  totalCnt: 0,
};

const tag = (state = initTag, action) => {
  switch (action.type) {
    case TagActionType.popularloading:
      return {
        ...state,
        isPopularLoading: true,
        popularErrorMessage: '',
      };
    case TagActionType.popularSuccess:
      return {
        ...state,
        isPopularLoading: false,
        popularHashTags: action.data,
        popularPage: action.popularPage,
        popularErrorMessage: '',
        totalCnt: action.totalCnt,
        currentHashTag: action.currentHashTag,
      };
    case TagActionType.popularSuccessPaging:
      return {
        ...state,
        isPopularLoading: false,
        popularHashTags: [...state.popularHashTags, ...action.data],
        popularPage: action.popularPage,
        popularErrorMessage: '',
        totalCnt: action.totalCnt,
        currentHashTag: action.currentHashTag,
      };
    case TagActionType.popularFailure:
      return {
        ...state,
        isPopularLoading: false,
        popularPage: action.popularPage,
        popularErrorMessage: action.data,
        totalCnt: action.totalCnt,
        currentHashTag: action.currentHashTag,
      };

    case TagActionType.newestLoading:
      return {
        ...state,
        isNewestLoading: true,
        popularErrorMessage: '',
      };
    case TagActionType.newestSuccess:
      return {
        ...state,
        isNewestLoading: false,
        newestHashTags: action.data,
        newestPage: action.newestPage,
        newestErrorMessage: '',
      };
    case TagActionType.newestSuccessPaging:
      return {
        ...state,
        isNewestLoading: false,
        newestHashTags: [...state.newestHashTags, ...action.data],
        newestPage: action.newestPage,
        newestErrorMessage: '',
      };
    case TagActionType.newestFailure:
      return {
        ...state,
        isNewestLoading: false,
        newestPage: action.newestPage,
        newestErrorMessage: action.data,
      };

    case TagActionType.init:
      return {
        ...initTag,
      };
    default:
      return state;
  }
};

export default tag;
