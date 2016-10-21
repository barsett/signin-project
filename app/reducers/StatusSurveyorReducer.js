'use-strict'

import * as types from '../actions/ActionTypes';

import Immutable from 'immutable';
import {
  Map,
  List,
  fromJS
} from 'immutable';

import { ERROR_SERVER, ERROR_NETWORK} from '../api/Common';
import debug from '../debug';

const initialState = Immutable.fromJS(
  {
    dataSource: [],
    isLoading: false,
    isLoadingTail: false, // to keep track background fetching for tail/more loading
    currentPage: 0,
    totalPages: 1,
    nextPageUrl: null,
    prevPageUrl: null,
    moreData: false, // flag for more data is available ... may be eliminated by checking nextPageURl
    pendingTask: [], // array for retry tasks

  },
);

const statusSurveyorReducer = (state = initialState, action) => {
  let newData,oldData,mergedData = null;

  switch (action.type) {
      case types.FETCH_STATUS_SURVEYOR_STARTED:
      console.log(action.type);
      if (action.more) {
          state = state.set('isLoadingTail', true);
      } else {
          state = state.set('isLoading', true);
      }

      return state;

    case types.FETCH_STATUS_SURVEYOR_RESULT:
      // The data returned from storage is always IMMUTABLE, therefore save in immutable format for mytask
      console.log("FETCH_STATUS_SURVEYOR_RESULT", action.data);

      state = _updateCommonState(state, action.data);

      // merge with old data, old data will always supersedes server
      newData = Immutable.fromJS(action.data.content);

      state = state.set('dataSource', newData)
                   .set('isFirstPage', true);

      return state;


    case types.FETCH_STATUS_SURVEYOR_RESULT_MORE:
      console.log("FETCH_STATUS_SURVEYOR_RESULT_MORE", action.data);

      state = _updateCommonState(state, action.data);

      newData = Immutable.fromJS(action.data.content);
      console.log('newData', newData);
      oldData = state.get('dataSource');
      console.log('oldData', oldData);
      // mergedData = oldData.mergeDeepWith((prev, next) => prev, newData);
      mergedData = oldData.concat(newData);
      console.log('mergedData', mergedData);


      // set state
      state = state.set('dataSource', mergedData)
          .set('isFirstPage', false)
          .set('isLoadingTail', false);

      return state;

    case types.FETCH_STATUS_SURVEYOR_FAILED:
      console.log("FETCH_STATUS_SURVEYOR_FAILED", action.name);
      state = state.set('isLoading', false);

      return state;

    case types.FETCH_STATUS_SURVEYOR_CLEAR:
      // clear local storage if username != previous username
      state = state.set('dataSource', Immutable.fromJS([]));

      return state;
    break;

    default:
      return state;
  }
}


const _updateCommonState = (state, data) => {
  const currentPage = data.page.number;
  const totalPages = data.page.totalPages;
  const moreData = (currentPage < totalPages - 1);

  const nextPage = data.links.find((link) => link.rel === 'next');
  const prevPage = data.links.find((link) => link.rel === 'prev');

  state = state.set('isLoading', false)
    .set('currentPage', currentPage)
    .set('totalPages', totalPages)
    .set('moreData', moreData);

  if (nextPage)
    state = state.set('nextPageUrl', nextPage.href);
  else
    state = state.set('nextPageUrl', null);

  if (prevPage)
    state = state.set('prevPageUrl', prevPage.href);
  else
    state = state.set('prevPageUrl', null);


  return state;

}

export default statusSurveyorReducer;
