export const tabActionType = {
  main: 'tab/main',
  list: 'tab/list',
  detail: 'tab/detail',
};

export const setTab =
  ({tab, tabType, grade, selectedBook, gradeStyle, viewType}) =>
  dispatch => {
    if (tab === 'main') {
      dispatch({type: tabActionType.main, tab, grade});
    } else if (tab === 'list') {
      dispatch({type: tabActionType.list, tab, grade, gradeStyle});
    } else {
      dispatch({
        type: tabActionType.detail,
        tab,
        tabType,
        selectedBook,
        viewType,
      });
    }
  };
