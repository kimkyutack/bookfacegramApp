export const tabActionType = {
  main: 'tab/main',
  list: 'tab/list',
  mylist: 'tab/mylist',
  detail: 'tab/detail',
  quiz: 'tab/quiz',
  audio: 'tab/audio',
  gather: 'tab/gather',
  gatherlist: 'tab/gatherlist',
  gatherdetail: 'tab/gatherdetail',
};

export const setTab =
  ({
    tab,
    tabType,
    grade,
    selectedBook,
    selectedGather,
    gradeStyle,
    viewType,
    selectType,
    rank,
    region,
    num,
  }) =>
  dispatch => {
    if (tab === 'main') {
      dispatch({type: tabActionType.main, tab, grade});
    } else if (tab === 'list') {
      dispatch({type: tabActionType.list, tab, grade, gradeStyle});
    } else if (tab === 'mylist') {
      dispatch({type: tabActionType.mylist, tab, selectType});
    } else if (tab === 'quiz') {
      dispatch({
        type: tabActionType.quiz,
        tab,
        tabType,
        selectedBook,
        viewType,
        selectType,
        rank,
      });
    } else if (tab === 'audio') {
      dispatch({
        type: tabActionType.audio,
        tab,
        selectedBook,
      });
    } else if (tab === 'gather') {
      dispatch({
        type: tabActionType.gather,
        tab,
        selectedBook,
        region,
      });
    } else if (tab === 'gatherlist') {
      dispatch({
        type: tabActionType.gatherlist,
        tab,
        region,
        rank,
      });
    } else if (tab === 'gatherdetail') {
      dispatch({
        type: tabActionType.gatherdetail,
        tab,
        num,
      });
    } else {
      dispatch({
        type: tabActionType.detail,
        tab,
        tabType,
        selectedBook,
        viewType,
        selectType,
      });
    }
  };
