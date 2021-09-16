import {bookActionType} from './BookActions';

const initBook = {
  isLoading: false,
  isAllLoading: false,
  isRefreshing: false,
  followBooks: [],
  userBooks: [],
  allBooks: [],
  allPage: 1,
  userPage: 1,
  currentUserId: '',
  profilePath: '',
  followerList: [],
  followerCnt: 0,
  followingList: [],
  followingCnt: 0,
  errorMessage: '',
  allErrorMessage: '',
  official: 0,
};

const book = (state = initBook, action) => {
  switch (action.type) {
    case bookActionType.loading:
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      };
    case bookActionType.allLoading:
      return {
        ...state,
        isAllLoading: true,
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
        followerList: action.followerList,
        followingCnt: action.followingCnt,
        followingList: action.followingList,
        totalCnt: action.totalCnt,
        official: action.official,
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
        followerList: action.followerList,
        followingCnt: action.followingCnt,
        followingList: action.followingList,
        totalCnt: action.totalCnt,
        official: action.official,
      };
    case bookActionType.allSuccess:
      return {
        ...state,
        isAllLoading: false,
        isRefreshing: false,
        allBooks: action.data,
        allPage: action.allPage,
        allErrorMessage: '',
      };
    case bookActionType.allSuccessPaging:
      return {
        ...state,
        isAllLoading: false,
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
        followerList: action.followerList,
        followingCnt: action.followingCnt,
        followingList: action.followingList,
        totalCnt: action.totalCnt,
        official: action.official,
      };
    case bookActionType.allFailure:
      return {
        ...state,
        isAllLoading: false,
        isRefreshing: false,
        allPage: action.allPage,
        allErrorMessage: action.data,
      };
    case bookActionType.followUpdate:
      return {
        ...state,
        followerCnt: action.followerCnt,
        followerList: action.followerList,
        followingCnt: action.followingCnt,
        followingList: action.followingList,
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
