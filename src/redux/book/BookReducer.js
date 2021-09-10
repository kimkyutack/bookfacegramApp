import {bookActionType} from './BookActions';

const initBook = {
  isLoading: false,
  isRefreshing: false,
  followBooks: [],
  userBooks: [],
  allBooks: [],
  allPage: 1,
  userPage: 1,
  currentUserId: '',
  profilePath: '',
  errorMessage: '',
  allErrorMessage: '',
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
        currentUserId: action.currentUserId,
        userPage: action.userPage,
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
        currentUserId: action.currentUserId,
        userPage: action.userPage,
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
        allPage: action.allPage,
        allErrorMessage: '',
      };
    case bookActionType.allSuccessPaging:
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        allBooks: [...state.allBooks, ...action.data],
        allPage: action.allPage,
        allErrorMessage: '',
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
        currentUserId: action.currentUserId,
        userPage: action.userPage,
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
        allPage: action.allPage,
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
