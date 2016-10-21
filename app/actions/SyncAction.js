
import { Platform } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';

import * as types from './ActionTypes';
import { retryAvailTask, retryUpdateMyTask } from './TaskUpdateAction';
import { BG_DELAY } from '../config/Config';


export function syncPendingStarted() {
  return {
    type: types.SYNC_PENDING_STARTED
  };
}

export function syncPendingCompleted() {
  return {
    type: types.SYNC_PENDING_COMPLETED
  };
}

export function syncPendingError() {
  return {
    type: types.SYNC_PENDING_ERROR
  };
}

export function startBackgroundTimer() {
  return (dispatch, getState) => {
    let pendingTaskCount = getState().getIn(['availTasks','pendingTask']).size;
    pendingTaskCount += getState().getIn(['myTasks','pendingTask']).size;

    if (Platform.OS === 'android' && pendingTaskCount > 0){
      BackgroundTimer.start(BG_DELAY);
    }

  }
}

export function stopBackgroundTimer() {
  return (dispatch, getState) => {
    //let pendingTaskCount = getState().getIn(['availTasks','pendingTask']).size;

    if (Platform.OS === 'android'){
      BackgroundTimer.stop();
    }

  }
}

export function syncPending(){
	return (dispatch, getState) => {
    console.log("Sync Pending Started");
    // if pendingTask is not empty then call retryTask
    var availPendingTask = getState().getIn(['availTasks','pendingTask']);
    var myPendingTask = getState().getIn(['myTasks','pendingTask']);

    if (availPendingTask.size > 0){
      console.log("Pending Task: " + availPendingTask.size);
      dispatch(retryAvailTask());
    }
    if (myPendingTask.size > 0){
      console.log("Pending Task: " + myPendingTask.size);
      dispatch(retryUpdateMyTask());

    }


    if (availPendingTask.size == 0 && myPendingTask.size == 0) {
      // stop background timer if there no pending task... Bg timer will trigger next time app go to background and there is pending task
      console.log("no more pending task. Stopping Timer");
      if (Platform.OS === 'android') BackgroundTimer.stop();
    }

    // if lakaTask is not empty then call retryLakaTask


  };
}
