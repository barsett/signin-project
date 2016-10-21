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
    selectedKorbanId: null,
    selectedLakaId: null,
    updated: false, //use to show ! for the tab label
  },
);

const myTaskReducer = (state = initialState, action) => {
  let newData,oldData,mergedData = null;

  switch (action.type) {
      case types.FETCH_MY_TASK_STARTED:
      console.log(action.type);
      if (action.more) {
          state = state.set('isLoadingTail', true);
      } else {
          state = state.set('isLoading', true);
      }

      return state;

    case types.FETCH_MY_TASK_RESULT:
      // The data returned from storage is always IMMUTABLE, therefore save in immutable format for mytask
      //console.log("FETCH_MY_TASK_RESULT", action.data);

      state = _updateCommonState(state, action.data);

      // merge with old data, old data will always supersedes server
      newData = Immutable.fromJS(action.data.content);
      //console.log('newData', newData);
      //oldData = state.get('dataSource');
      //console.log('oldData', oldData);
      //mergedData = oldData.mergeWith((prev, next) => prev ? prev : next, newData);
      //console.log('mergedData', mergedData.toJS());

      //state = state.set('dataSource', mergedData)
      state = state.set('dataSource', newData)
                   .set('isFirstPage', true);

      return state;


    case types.FETCH_MY_TASK_RESULT_MORE:
      //console.log("FETCH_MY_TASK_RESULT_MORE", action.data);

      state = _updateCommonState(state, action.data);

      newData = Immutable.fromJS(action.data.content);
      //console.log('newData', newData);
      oldData = state.get('dataSource');
      //console.log('oldData', oldData);
      // mergedData = oldData.mergeDeepWith((prev, next) => prev, newData);
      mergedData = oldData.concat(newData);
      //console.log('mergedData', mergedData);


      // set state
      state = state.set('dataSource', mergedData)
          .set('isFirstPage', false)
          .set('isLoadingTail', false);

      return state;

    case types.FETCH_MY_TASK_FAILED:
      console.log("FETCH_MY_TASK_FAILED", action.name);
      state = state.set('isLoading', false);

      return state;

    case types.TASK_ACCEPT_STARTED:
      //console.log("TASK_ACCEPT_STARTED", action);
      //state = state.set('isLoading', true);
      return state;

    case types.TASK_ACCEPT_RESULT:
      console.log(action.type);

      // append accepted task to myTask list
      const myTaskList  = state.get('dataSource');
      action.task.survey.tenggatResponse = action.resp.tenggatResponse;
      action.task.survey.statusJaminan = action.resp.statusJaminan;
      const newTaskList = myTaskList.push(Immutable.fromJS(action.task));
      console.log("myTaskList after size: ", myTaskList.size);
      state = state.set('dataSource', newTaskList);
      state = state.set('updated', true);
      state = state.set('isLoading', false);
      return state;

    case types.TASK_ACCEPT_FAILED:
      console.log("TASK_FAILED", action.name);
      state = state.set('isLoading', false);
      return state;


    case types.FETCH_MY_TASK_CLEAR:
      // clear local storage if username != previous username
      state = state.set('dataSource', Immutable.fromJS([]));
      state = state.set('pendingTask', Immutable.fromJS([]));

      return state;
    break;


    case types.TASK_UPDATE_STARTED: {
      //update local task list
      const updatedTask = action.task;
      const currentDS = state.get('dataSource');

      // update local DS and mark as pending
      const newDS = _updateTask(updatedTask, currentDS, 'pending');
      //update taskData
      state = state.set('dataSource', newDS);

      //state = state.set('isLoading', true);
      return state;
    }


      case types.TASK_UPDATE_RESULT: {
          console.log(action.type);

          // already set from the Screent KunjunganEditScreen
          // action.task.survey.statusJaminan = 'F1';
          const updatedTask = action.task;
          const currentDS = state.get('dataSource');

          const newDS = _updateTask(updatedTask, currentDS, 'synced');
          state = state.set('dataSource', newDS);

          return state;
      }

      case types.TASK_UPDATE_PENDING: {
        const currentDS = state.get('dataSource');

        console.log("Network Error. Add to pending task");
        const newDS = _updateTask(action.task, currentDS, 'retry');
        // network error > push to pending task
        let pendingTask = state.get('pendingTask');
        pendingTask = pendingTask.push(Immutable.fromJS(action.task));
        console.log("Update Pending Task Size: ", pendingTask.size);

        //update taskData
        state = state.set('pendingTask', pendingTask);
        //update taskData
        state = state.set('dataSource', newDS);
        return state;
      }

      case types.TASK_UPDATE_FAILED: {
          console.log("TASK_FAILED ", action.message);
          // need to check which error permit retry
          // copy taskData to pendingRequests
          const currentDS = state.get('dataSource');

          console.log("Receive Error Response from Server. Will not Retry", action.message);
          //error response so no retry
          //set mark to false to enable manual retry
          const newDS = _updateTask(action.task, currentDS, 'failed');
          //update taskData
          state = state.set('dataSource', newDS);

          return state;
        }

    case types.TASK_UPDATE_PENDING_CLEAR:
        console.log("Clearing Update Pending Task");
        state = state.set('pendingTask', Immutable.fromJS([]));
        return state;

    case types.TASK_SET_KORBAN: {
      // action sends survey and laka korbanLakaId
      // find survey
      state = state.set('selectedKorbanId', action.lakaKorbanId);
      state = state.set('selectedLakaId', action.kodeLaka);

      return state;
    }

    case types.TASK_CLEAR_KORBAN: {
      // action sends survey and laka korbanLakaId
      // find survey
      state = state.set('selectedKorbanId', null);
      state = state.set('selectedLakaId', null);

      return state;
    }

    case types.MY_TASK_ON_FOCUS: {
      // invalidate new update
      state = state.set('updated', false);
      return state;
    }

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



const _updateTask = (updatedTask, currentDS, syncState) => {
  //loop the array to find a task being accepted
  const index = currentDS.findIndex((item) => {
    //console.log(item);
    //if (item.getIn(['survey','kodeSurvey']) === acceptedTask.survey.kodeSurvey){
    if (item.getIn(['survey','kodeSurvey']) === updatedTask.survey.kodeSurvey){
      console.log("Matched Task found");
      return true;
    } else {
      return false;
    }
  });

  console.log("Index of updated task: " + index);
  //add attribute sync as true
  updatedTask.sync = syncState;
  //update taskData
  return currentDS.set(index, Immutable.fromJS(updatedTask));

}
export default myTaskReducer;
