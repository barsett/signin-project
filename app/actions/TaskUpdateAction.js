import * as types from './ActionTypes';
import TaskService from '../api/TaskServiceJR';
//import TaskService from '../api/TaskService';
import { executeWithRetry, processError, increaseRetryCount, ERROR_SERVER } from '../api/Common';
import Util from '../api/Util';
import {MAX_RETRY} from '../config/Config';

function _updateTaskStarted(task) {
    return {
        type: types.TASK_UPDATE_STARTED,
        task,
    };
}

function _updateTaskResult(task) {
    return {
        type: types.TASK_UPDATE_RESULT,
        task,
    };
}

function _updateTaskPending(task) {
    return {
        type: types.TASK_UPDATE_PENDING,
        task,
    };
}

function _updateTaskFailed(message, task) {
    return {
        type: types.TASK_UPDATE_FAILED,
        message,
        task,
    };
}

function _clearPendingUpdateTask() {
    return {
        type: types.TASK_UPDATE_PENDING_CLEAR,
    };
}



export function updateTask(task) {
    return (dispatch, getState) => {
        var accessToken = getState().getIn(['currentUser', 'accessToken']);
        console.log("updateTask Started", task.survey.kodeSurvey);
        //console.log("AccepTask Started", taskData.survey.surveyId);

        dispatch(_updateTaskStarted(task));

        return TaskService.updateTask(accessToken, task.survey)
            .then((resp) => {
                if (resp.status === "success") {
                    console.log("Update Task Successful. save to mytask");
                    dispatch(_updateTaskResult(task));

                    Util.showToast("Data Berhasil Disimpan", Util.LONG);
                    //Util.showToast("Data Berhasil Disimpan, Data akan dikirimkan ke Otorisator", Util.LONG);

                    if (task.survey.idKorbanLaka){
                      dispatch(mapLakaWithSurvey(task));
                    } else {
                      dispatch(unmapLakaWithSurvey(task));
                      //Util.showToast("Sukses", Util.SHORT);
                    }


                } else {
                  // tobe deprecated once the response from backend is modified to return error
                    console.log("Failed Update Task");
                    dispatch(_updateTaskFailed(resp, task));
                    Util.showToast("GAGAL " + resp.description, Util.LONG);
                }

            })
            .catch((err) => {
              console.log("Error", err);
              processError(err, dispatch,
                          () => _updateTaskPending(task),
                          () => _updateTaskFailed(err,task));
              Util.showToast("GAGAL " + err.cause.error, Util.LONG);

            });
    };
}

export function saveLocation(task) {
    return (dispatch, getState) => {
        var accessToken = getState().getIn(['currentUser', 'accessToken']);
        console.log("saveLocation Started", task.survey.kodeSurvey);
        //console.log("AccepTask Started", taskData.survey.surveyId);
        //add GPS location
        task.survey.longitudeSurveyor = getState().getIn(['status','longitude']);
        task.survey.latitudeSurveyor = getState().getIn(['status','latitude']);

        dispatch(_updateTaskStarted(task));
        return TaskService.checkin(accessToken, task.survey)
            .then((resp) => {
              if (resp.status === "success") {
                    console.log("saveLocation Successful. save to mytask");
                    dispatch(_updateTaskResult(task));

                    Util.showToast("CheckIn Berhasil", Util.LONG);
              } else {
                    throw {type: ERROR_SERVER,  cause: {error: resp.description}};
              }
            })
            .catch((err) => {
              console.log("Error", err);
              processError(err, dispatch,
                          () => _updateTaskPending(task),
                          () => _updateTaskFailed(err,task));
              Util.showToast("GAGAL " + err.cause.error, Util.LONG);

              // rethrow error to if rq is not pending
              if (err.type === ERROR_SERVER) throw err;
            });
    };
}


export function retryUpdateMyTask(){
	return (dispatch, getState) => {
		// get pendingTask
		let pendingTask = getState().getIn(['myTasks','pendingTask']);
		console.log("Total Pending Update Task : " + pendingTask.size);
		dispatch(_clearPendingUpdateTask());

		console.log("Looping pending update task");
		while (pendingTask.size > 0) {
				let taskData = pendingTask.get(0);
				pendingTask = pendingTask.shift();
				console.log("pendingTask", taskData.getIn(['survey','kodeSurvey']));
        taskData = increaseRetryCount(taskData);
        if (taskData.get('retry') < MAX_RETRY){
            dispatch(updateTask(taskData.toJS()));
        } else {
            console.log('Discarding update. Exceeding MAX Retry', taskData.toJS());
        }
		}
		console.log("Looping pending task - completed");
  };
}

export function setKorbanLaka(kodeLaka, lakaKorbanId) {
    return {
        type: types.TASK_SET_KORBAN,
        kodeLaka,
        lakaKorbanId,
    };
}

export function clearKorbanLaka() {
    return {
        type: types.TASK_CLEAR_KORBAN,
    };
}


function _mapTaskWithLakaStarted(task) {
    return {
        type: types.TASK_MAP_LAKA_STARTED,
        task,
    };
}

function _mapTaskWithLakaResult(task) {
    return {
        type: types.TASK_MAP_LAKA_RESULT,
        task,
    };
}

function _mapTaskWithLakaFailed(message, task) {
    return {
        type: types.TASK_MAP_LAKA_FAILED,
        message,
        task,
    };
}

export function mapLakaWithSurvey(task){
	return (dispatch, getState) => {
		// get pendingTask
    const accessToken = getState().getIn(['currentUser', 'accessToken']);

		dispatch(_mapTaskWithLakaStarted());

    TaskService.mapLakaWithSurvey(accessToken, task.survey.kodeSurvey, task.survey.idKorbanLaka, task.survey.kodeLaka)
    .then( (resp) => {
      if (resp.status === "success") {
          console.log("Mapping Task Successful. save to mytask");
          dispatch(_mapTaskWithLakaResult(task));
          Util.showToast("Sukses", Util.SHORT);

      } else {
        // tobe deprecated once the response from backend is modified to return error
          console.log("Failed Map Task");
          dispatch(_mapTaskWithLakaFailed(resp, task));
          Util.showToast("GAGAL " + resp.description, Util.LONG);
      }
    })
    .catch( (err) => {
      console.log("Error", err);
      processError(err, dispatch,
                  () => _mapTaskWithLakaFailed(err, task),
                  () => _mapTaskWithLakaFailed(err, task));
      Util.showToast("GAGAL " + err.cause.error, Util.LONG);
    });
  };
}

function _unmapTaskWithLakaStarted(kodeSurvey, idKorbanLaka, kodeLaka) {
    return {
        type: types.TASK_UNMAP_LAKA_STARTED,
        kodeSurvey,
        idKorbanLaka,
        kodeLaka,
    };
}

function _unmapTaskWithLakaResult(kodeSurvey, idKorbanLaka, kodeLaka) {
    return {
        type: types.TASK_UNMAP_LAKA_RESULT,
        kodeSurvey,
        idKorbanLaka,
        kodeLaka,
    };
}

function _unmapTaskWithLakaFailed(message) {
    return {
        type: types.TASK_UNMAP_LAKA_FAILED,
        message,
    };
}

export function unmapLakaWithSurvey(task){
	return (dispatch, getState) => {
		// get pendingTask
    const accessToken = getState().getIn(['currentUser', 'accessToken']);

		dispatch(_unmapTaskWithLakaStarted());

    TaskService.unmapLakaWithSurvey(accessToken, task.survey.kodeSurvey, task.survey.idKorbanLaka, task.survey.kodeLaka)
    .then( (resp) => {
      if (resp.status === "success") {
          console.log("Mapping Task Successful. save to mytask");
          dispatch(_unmapTaskWithLakaResult(task));
          Util.showToast("Sukses", Util.SHORT);

      } else {
          console.log("Failed Map Task");
          dispatch(_unmapTaskWithLakaFailed(resp, task));
          Util.showToast("GAGAL " + resp.description, Util.LONG);
      }
    })
    .catch( (err) => {
      console.log("Error", err);
      processError(err, dispatch,
                  () => _unmapTaskWithLakaFailed(err,task),
                  () => _unmapTaskWithLakaFailed(err,task));
      Util.showToast("GAGAL " + err.cause.error, Util.LONG);
    });
  };
}


export function runClaimMyTask(taskData){
	return (dispatch, getState) => {


		var accessToken = getState().getIn(['currentUser','accessToken']);
		console.log("runClaimMyTask - started");
		_acceptTask(dispatch, accessToken, taskData)

		//executeWithRetry("_acceptTask", () => _acceptTask(dispatch, accessToken, taskData) , 10, getState);
		console.log("runClaimMyTask - completed");

  };
}

// -- Related to Claim Tasks
function _acceptTask(dispatch, accessToken, taskData){
	console.log("AccepTask Started", taskData.survey.kodeSurvey);
	//console.log("AccepTask Started", taskData.survey.surveyId);
	dispatch(_acceptTaskStarted(taskData));

	//TaskService.acceptTask(accessToken, taskData.survey.surveyId, function(error,data){
	TaskService.acceptTask(accessToken, taskData.survey)
	.then((resp) => {
		if (resp.status === "success"){
			console.log("Move task from availTask to myTask");
			dispatch(_acceptTaskResult(taskData, resp));
		} else {
			console.log("Failed myTask");
			dispatch(_acceptTaskFailed(resp, taskData));
			Util.showToast("GAGAL " + resp.description, Util.LONG);
		}

	})
	.catch((err) => {
		processError(err, dispatch,
		 						() => _acceptTaskPending(taskData), // server error action
								() => _acceptTaskFailed(err,taskData), //network Error action
								//() => removeToken() // token Error action
		);
		Util.showToast("GAGAL " + err.cause.error, Util.LONG);


	});
}

function _acceptTaskStarted(task) {
	return {
		type: types.TASK_ACCEPT_STARTED,
		task,
	};
}

function _acceptTaskResult(task, resp) {
	return {
		type: types.TASK_ACCEPT_RESULT,
		task,
    resp,
	};
}

function _acceptTaskPending(task) {
	return {
		type: types.TASK_ACCEPT_PENDING,
		task,
	};
}


function _acceptTaskFailed(message,task) {
	return {
		type: types.TASK_ACCEPT_FAILED,
		message,
		task,
	};
}

function _clearPendingTask() {
	return {
		type: types.TASK_ACCEPT_PENDING_CLEAR,
	};
}


export function retryAvailTask(){
	return (dispatch, getState) => {
		// get pendingTask
		let pendingTask = getState().getIn(['availTasks','pendingTask']);
		console.log("Total Pending Task : " + pendingTask.size);
		dispatch(_clearPendingTask());

		console.log("Looping pending task");
		while (pendingTask.size > 0) {
				let taskData = pendingTask.get(0);
				pendingTask = pendingTask.shift();
				console.log("pendingTask", taskData.getIn(['survey','kodeSurvey']));
        taskData = increaseRetryCount(taskData);
        if (taskData.get('retry') < MAX_RETRY){
		        dispatch(runClaimMyTask(taskData.toJS()));
        } else {
          console.log('Discarding kunjungi task action');
        }
		}
		console.log("Looping pending task - completed");
  };
}
