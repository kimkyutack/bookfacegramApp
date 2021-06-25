import {loadingActionType} from './LoadingActions';

const initLoading = {
  loading: false,
};

export default function loading(state = initLoading, action) {
  switch (action.type) {
    case loadingActionType.start:
      return {...state, loading: true};
    case loadingActionType.end:
      return {...state, loading: false};
    default:
      return state;
  }
}
