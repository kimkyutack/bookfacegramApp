import {bookActionType} from './BookActions';
const initBook = {
  books: [],
  isLoading: false,
  errorMessage: '',
};

const book = (state = initBook, action) => {
  switch (action.type) {
    case bookActionType.loading:
      return {
        ...state,
        isLoading: true,
      };
    case bookActionType.success:
      return {
        ...state,
        isLoading: false,
        books: action.data,
      };
    case bookActionType.successPaging:
      return {
        ...state,
        isLoading: false,
        books: [...state.books, ...action.data],
      };
    case bookActionType.failure:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.data,
      };
    case bookActionType.update:
      return {
        ...state,
        isLoading: false,
        books: action.data,
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
