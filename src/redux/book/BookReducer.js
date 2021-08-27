import {bookActionType} from './BookActions';
const initBook = {
  followBooks: [],
  userBooks: [],
  allBooks: [],
  isLoading: false,
  errorMessage: '',
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
        followBooks: action.data,
        errorMessage: '',
      };
    case bookActionType.followSuccessPaging:
      return {
        ...state,
        isLoading: false,
        followBooks: [...state.followBooks, ...action.data],
        errorMessage: '',
      };
    case bookActionType.userSuccess:
      return {
        ...state,
        isLoading: false,
        userBooks: action.data,
        errorMessage: '',
        profilePath: action.profilePath,
        followerCnt: action.followerCnt,
        followingCnt: action.followingCnt,
      };
    case bookActionType.userSuccessPaging:
      return {
        ...state,
        isLoading: false,
        userBooks: [...state.userBooks, ...action.data],
        errorMessage: '',
        profilePath: action.profilePath,
        followerCnt: action.followerCnt,
        followingCnt: action.followingCnt,
      };
    case bookActionType.allSuccess:
      return {
        ...state,
        isLoading: false,
        allBooks: action.data,
        errorMessage: '',
      };
    case bookActionType.allSuccessPaging:
      return {
        ...state,
        isLoading: false,
        allBooks: [...state.allBooks, ...action.data],
        errorMessage: '',
      };
    case bookActionType.followUpdatete:
      return {
        ...state,
        isLoading: false,
        followBooks: action.data,
      };
    case bookActionType.userUpdate:
      return {
        ...state,
        isLoading: false,
        userBooks: action.data,
      };
    case bookActionType.allUpdate:
      return {
        ...state,
        isLoading: false,
        allBooks: action.data,
      };
    case bookActionType.failure:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.data,
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
