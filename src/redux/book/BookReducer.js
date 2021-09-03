import {bookActionType} from './BookActions';
const initBook = {
  followBooks: [],
  userBooks: [],
  allBooks: [],
  isLoading: false,
  isRefreshing: false,
  errorMessage: '',
  allErrorMessage: '',
  profilePath: '',
};

const book = (state = initBook, action) => {
  switch (action.type) {
    case bookActionType.loading:
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      };
    case bookActionType.followSuccess:
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        followBooks: action.data,
        errorMessage: '',
      };
    case bookActionType.followSuccessPaging:
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        followBooks: [...state.followBooks, ...action.data],
        errorMessage: '',
      };
    case bookActionType.userSuccess:
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        userBooks: action.data,
        errorMessage: '',
        profilePath: action.profilePath,
        followerCnt: action.followerCnt,
        followingCnt: action.followingCnt,
        totalCnt: action.totalCnt,
      };
    case bookActionType.userSuccessPaging:
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        userBooks: [...state.userBooks, ...action.data],
        errorMessage: '',
        profilePath: action.profilePath,
        followerCnt: action.followerCnt,
        followingCnt: action.followingCnt,
        totalCnt: action.totalCnt,
      };
    case bookActionType.allSuccess:
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        allBooks: action.data,
        allErrorMessage: '',
      };
    case bookActionType.allSuccessPaging:
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        allBooks: [...state.allBooks, ...action.data],
        allErrorMessage: '',
      };
    case bookActionType.followUpdatete:
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        followBooks: action.data,
      };
    case bookActionType.userUpdate:
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        userBooks: action.data,
      };
    case bookActionType.allUpdate:
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        allBooks: action.data,
      };
    case bookActionType.failure:
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        errorMessage: action.data,
      };
    case bookActionType.userFailure:
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        errorMessage: action.data,
        profilePath: action.profilePath,
        followerCnt: action.followerCnt,
        followingCnt: action.followingCnt,
        totalCnt: action.totalCnt,
      };
    case bookActionType.allFailure:
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        allErrorMessage: action.data,
      };
    case bookActionType.init:
      return {
        ...initBook,
      };
    default:
      return state;
  }
};

export default book;
