'use-strict'

import Immutable from 'immutable';
import {
    Map,
    List,
    fromJS
} from 'immutable';

import * as types from '../actions/ActionTypes';
import { ERROR_SERVER, ERROR_NETWORK} from '../api/Common';

import debug from '../debug';

const initialState = Immutable.fromJS({
    dataSource: [], // data list
    isLoading: false, // to keep track background fetching and display progress bar
    isLoadingTail: false, // to keep track background fetching for tail/more loading
    isFirstPage: true, // ????
    currentPage: 0, // ????
    totalPages: 1, // total pages return by server
    nextPageUrl: null, // to fetch more data url
    prevPageUrl: null, // not sure for what?
    moreData: false, // flag for more data is available ... may be eliminated by checking nextPageURl
    pendingTask: [], // array for retry tasks
    rowCount: 0,
}, );

const availTaskReducer = (state = initialState, action) => {
    let newData, oldData, mergedData = null;

    switch (action.type) {
        case types.FETCH_AVAIL_TASK_STARTED:
            console.log(action.type);
            if (action.more) {
                state = state.set('isLoadingTail', true);
            } else {
                state = state.set('isLoading', true);
            }

            return state;

        case types.FETCH_AVAIL_TASK_RESULT:
            console.log(action.type);

            state = _updateCommonState(state, action.data);

            state = state.set('dataSource', Immutable.fromJS(action.data.content))
                .set('isFirstPage', true)
                .set('isLoading', false)
                .set('pendingTask', Immutable.fromJS([])) //everytime a list is refreshed .. then pending task is purged
                .set('rowCount', action.data.page.totalElements);



            return state;

        case types.FETCH_AVAIL_TASK_RESULT_MORE:
            console.log(action.type);

            state = _updateCommonState(state, action.data);

            // filter only task with status = 'NEW'
            // var dataFromAction = action.data.content;
            // var filteredData = dataFromAction.reduce(function(accum, current) {
            //   console.log("current", current);
            //   var survey = current.survey;
            //   if (survey.status === 'NEW') {
            //     console.log("push data with status=NEW");
            //     accum.push(current);
            //   } else {
            //     console.log("skip data");
            //   }
            //   return accum;
            // }, []);

            // merge with old data
            // var newData = Immutable.fromJS(filteredData);
            newData = Immutable.fromJS(action.data.content);
            console.log('newData', newData.size);
            oldData = state.get('dataSource');
            console.log('oldData', oldData.size);
            mergedData = oldData.concat(newData);
            console.log('mergedData', mergedData.size);

            // set state
            //state = state.set('dataSource', Immutable.fromJS(mergedData));
            state = state.set('dataSource', mergedData)
                .set('isFirstPage', false)
                .set('isLoadingTail', false);

            return state;

        case types.FETCH_AVAIL_TASK_FAILED:
            console.log(action.type);
            state = state.set('isLoading', false)
                .set('isLoadingTail', false)

            return state;

        case types.TASK_ACCEPT_STARTED: {
            console.log(action.type);
            // set task row state to different color
            /* action.task = {
              survey = {
                kodeSurvey:
              },
              link = {
                self:
              },
              mark= false
            }
            */

            const acceptedTask = action.task;
            const currentDS = state.get('dataSource');

            const newDS = _setTaskMarkStatus(acceptedTask, currentDS, true);
            //update taskData
            state = state.set('dataSource', newDS);

            //state = state.set('isLoading', true);
            return state;
        }
        case types.TASK_ACCEPT_RESULT: {
            console.log(action.type);
            const acceptedTask = action.task;

            // remove claimed task from availTask list
            console.log("Prune Available Task");
            const currentDS = state.get('dataSource');
            const index = currentDS.findIndex((item) => {
              //if (item.getIn(['survey','surveyId']) === acceptedTask.survey.surveyId){
              if (item.getIn(['survey','kodeSurvey']) === acceptedTask.survey.kodeSurvey){
                console.log("Matched Task found");
                return true;
              } else {
                return false;
              }
            });

            //reduce rowcount to avoid screen refresh
            state = state.set('dataSource', currentDS.delete(index))
                         .set('isLoading', false)
                         .set('rowCount', state.get('rowCount') - 1);


            return state;
        }

        case types.TASK_ACCEPT_PENDING:
            console.log("TASK_PENDING ");
            console.log("Network Error. Add to pending task");
            // network error > push to pending task
            let pendingTask = state.get('pendingTask');
            pendingTask = pendingTask.push(Immutable.fromJS(action.task));

            //update taskData
            state = state.set('pendingTask', pendingTask);
            state = state.set('isLoading', false);


            return state;

        case types.TASK_ACCEPT_FAILED:
            console.log("TASK_FAILED ");


            // need to check which error permit retry
            // copy taskData to pendingRequests
            // if (action.message.status === "failed" || action.message.status > 200){
              console.log("Receive Error Response from Server. Will not Retry");
              //error response so no retry
              //set mark to false to enable manual retry
              const currentDS = state.get('dataSource');
              const newDS = _setTaskMarkStatus(action.task, currentDS, false);
              //update taskData
              state = state.set('dataSource', newDS);

            state = state.set('isLoading', false);
            return state;

        case types.TASK_ACCEPT_PENDING_CLEAR:
            console.log("Clearing Pending Task");
            state = state.set('pendingTask', Immutable.fromJS([]));
            return state;

        case types.FETCH_AVAIL_TASK_CLEAR:
          // clear local storage if username != previous username
          state = state.set('dataSource', Immutable.fromJS([]))
                        .set('pendingTask', Immutable.fromJS([]))
                        .set('isLoading', false)
                        .set('isLoadingTail', false);

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


const _setTaskMarkStatus = (acceptedTask, currentDS, markState) => {
  //loop the array to find a task being accepted
  const index = currentDS.findIndex((item) => {
    //if (item.getIn(['survey','kodeSurvey']) === acceptedTask.survey.kodeSurvey){
    if (item.getIn(['survey','kodeSurvey']) === acceptedTask.survey.kodeSurvey){
      console.log("Matched Task found");
      return true;
    } else {
      return false;
    }
  });

  console.log("Index of accepted task: " + index);
  //add attribute mark as true
  const updatedTask = currentDS.get(index).set('mark', markState);
  //update taskData
  return currentDS.set(index,updatedTask);

}

export default availTaskReducer;
