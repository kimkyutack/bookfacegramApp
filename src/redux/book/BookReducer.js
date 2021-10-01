import {bookActionType} from './BookActions';

const initBook = {
  isFollowLoading: false,
  followBooks: [],
  followErrorMessage: '',

  isUserLoading: false,
  userBooks: [],
  userPage: 1,
  userErrorMessage: '',

  isAllLoading: false,
  allBooks: [],
  allPage: 1,
  allErrorMessage: '',

  currentUserId: '',
  profilePath: '',
  followerList: [],
  followerCnt: 0,
  followingList: [],
  followingCnt: 0,
  official: 0,
  totalCnt: 0,
};

const book = (state = initBook, action) => {
  switch (action.type) {
    case bookActionType.followLoading:
      return {
        ...state,
        isFollowLoading: true,
        followErrorMessage: '',
      };
    case bookActionType.followSuccess:
      return {
        ...state,
        isFollowLoading: false,
        followBooks: action.data,
        followErrorMessage: '',
      };
    case bookActionType.followSuccessPaging:
      return {
        ...state,
        isFollowLoading: false,
        followBooks: [...state.followBooks, ...action.data],
        followErrorMessage: '',
      };
    case bookActionType.followFailure:
      return {
        ...state,
        isFollowLoading: false,
        followBooks: [],
        followErrorMessage: action.data,
      };

    case bookActionType.userSuccess:
      return {
        ...state,
        isUserLoading: false,
        userBooks: action.data,
        userPage: action.userPage,
        userErrorMessage: '',
        currentUserId: action.currentUserId,
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
        isUserLoading: false,
        userBooks: [...state.userBooks, ...action.data],
        userPage: action.userPage,
        userErrorMessage: '',
        currentUserId: action.currentUserId,
        profilePath: action.profilePath,
        followerCnt: action.followerCnt,
        followerList: action.followerList,
        followingCnt: action.followingCnt,
        followingList: action.followingList,
        totalCnt: action.totalCnt,
        official: action.official,
      };
    case bookActionType.userFailure:
      return {
        ...state,
        isUserLoading: false,
        userBooks: [],
        userErrorMessage: action.data,
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

    case bookActionType.allLoading:
      return {
        ...state,
        isAllLoading: true,
        allErrorMessage: '',
      };
    case bookActionType.allSuccess:
      return {
        ...state,
        isAllLoading: false,
        allBooks: action.data,
        allPage: action.allPage,
        allErrorMessage: '',
      };
    case bookActionType.allSuccessPaging:
      return {
        ...state,
        isAllLoading: false,
        allBooks: [...state.allBooks, ...action.data],
        allPage: action.allPage,
        allErrorMessage: '',
      };
    case bookActionType.allFailure:
      return {
        ...state,
        isAllLoading: false,
        allBooks: [],
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
