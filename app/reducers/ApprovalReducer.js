'use-strict'

import Immutable from 'immutable';
import {
  Map,
  List,
  fromJS
} from 'immutable';
import * as types from '../actions/ActionTypes';
import debug from '../debug';

const initialState = Immutable.fromJS({
  dataSource : [],
  isLoading : false,
  isLoadingTail : false,
  nextPageUrl : null,
  prevPageUrl : null,
  moreData: false,
});

const approvalReducer = (state = initialState, action) => {
  let newData, oldData, mergedData = null;
  switch(action.type){
    case types.FETCH_APPROVAL_STARTED:
      console.log(action.type);

      if(action.more){
        state = state.set('isLoadingTail', true);
      }
      else{
        state = state.set('isLoading', true);
      }
      return state;

    case types.FETCH_APPROVAL_RESULT:
      state = _updateCommonState(state, action.data);
      state = state.set('dataSource', Immutable.fromJS(action.data.content))
              .set('isLoading', false);

      return state;

    case types.FETCH_APPROVAL_RESULT_MORE:
      console.log(action.type);

      state = _updateCommonState(state, action.data);
      newData = Immutable.fromJS(action.data.content);
      console.log('newData', newData.size);
      oldData = state.get('dataSource');
      console.log('oldData', oldData.size);
      mergedData = oldData.concat(newData);
      console.log('mergedData', mergedData.size);
      state = state.set('dataSource', mergedData)
          .set('isFirstPage', false)
          .set('isLoadingTail', false);
      return state;

    case types.FETCH_APPROVAL_FAILED:
      console.log(action.type);
      state = state.set('isLoading', false)
          .set('isLoadingTail', false)

      return state;

    case types.FETCH_APPROVAL_CLEAR:
      state = state.set('dataSource', Immutable.fromJS([]))
                    .set('isLoading', false)
                    .set('isLoadingTail', false);
      return state;

    case types.APPROVE_AUTHORIZATION_STARTED:
      console.log(action.type);
      //state = state.set()
      return state;

    case types.APPROVE_AUTHORIZATION_RESULT:
      console.log(action.type);
      var authorizedTask = action

      // remove claimed task from availTask list
      console.log("Prune Available Task");
      const currentDS = state.get('dataSource');
      const index = currentDS.findIndex((item) => {
        //if (item.getIn(['survey','surveyId']) === acceptedTask.survey.surveyId){
        if (item.getIn(['survey','kodeSurvey']) === authorizedTask.data.kodeSurvey){
          console.log("Matched Task found");
          return true;
        } else {
          return false;
        }
      });
      state = state.set('dataSource', currentDS.delete(index))
                   .set('isLoading', false);

      return state;

    case types.APPROVE_AUTHORIZATION_FAILED:
      console.log(action.type);
      state = state.set('isLoading', false);
      return state;

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

    state = state.set('currentPage', currentPage)
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

export default approvalReducer;
