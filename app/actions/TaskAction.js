'use strict'

import * as types from './ActionTypes';
import TaskService from '../api/TaskServiceJR';
import { removeToken } from './AuthAction';
import { executeWithRetry, processError, increaseRetryCount } from '../api/Common';
import Util from '../api/Util';
import { MAX_RETRY } from '../config/Config';


// --- List of thunk-function invoked by components/screens
export function runFetchAvailTask(forceReload){
	return (dispatch, getState) => {
		var accessToken = getState().getIn(['currentUser','accessToken']);
		var isLoading = getState().getIn(['availTasks','isLoading']);
		var limit = getState().getIn(['setting','maxNumberOfBackdatedDate']);

		if (!isLoading){
			//check if nextPageURL is set, if it is then pass in the next url
			var nextPageUrl = null;

			//if forcerelaod is false, get more data
			if (!forceReload) {
				nextPageUrl = getState().getIn(['availTasks','nextPageUrl']);
			}

			_fetchAvailTask(dispatch, accessToken, nextPageUrl, limit);
		}
  };
}

export function runFetchMyTask(forceReload, filter, sort){
	return (dispatch, getState) => {
		var accessToken = getState().getIn(['currentUser','accessToken']);
    var isLoading = getState().getIn(['myTasks','isLoading']);
    var limit = getState().getIn(['setting','maxNumberOfBackdatedDate']);

    if (!isLoading){
  		var nextPageUrl = null;
  		//check if nextPageURL is set, if it is then pass in the next url
  		if (!forceReload) {
  			var nextPageUrl = getState().getIn(['myTasks','nextPageUrl']);
  		}
  		_fetchMyTask(dispatch, accessToken, nextPageUrl, filter, sort, limit) ;
    }
  };
}

export function runFetchStatusSurveyor(forceReload, filter, sort){
	return (dispatch, getState) => {
		var accessToken = getState().getIn(['currentUser','accessToken']);
		var isLoading = getState().getIn(['statusSurveyor','isLoading']);
    var limit = getState().getIn(['setting','maxNumberOfBackdatedDate']);

		if (!isLoading){
			//check if nextPageURL is set, if it is then pass in the next url
			var nextPageUrl = null;

			//if forcerelaod is false, get more data
			if (!forceReload) {
				nextPageUrl = getState().getIn(['statusSurveyor','nextPageUrl']);
			}

			_fetchStatusSurveyor(dispatch, accessToken, nextPageUrl, filter, sort, limit);
		}
  };
}









// --- Private function used by thunk
function _fetchAvailTask (dispatch, accessToken, nextPageUrl, limit) {
	console.log("_fetchAvailTask Started");
	dispatch(_fetchAvailTaskStarted(nextPageUrl));

	TaskService.fetchAvailableTasks(accessToken, nextPageUrl, limit)
	.then((data) => {
			if (nextPageUrl) {
				console.log("Sending More Available Tasks Data via Action");
				dispatch(_moreAvailTaskResultReceived(data))
			} else {
				console.log("Sending Available Tasks Data via Action");
				dispatch(_fetchAvailTaskResultReceived(data))
			}
	})
	.catch((err) => {
		processError(err, dispatch,
								() => _fetchAvailTaskFailed(err),
								() => _fetchAvailTaskFailed(err));
		Util.showToast("GAGAL " + err.cause.error, Util.LONG);

		//console.log("Error", err);
		//dispatch(_fetchAvailTaskFailed(err))

	});
}


// list of Action Creator Function
function _fetchAvailTaskStarted(more) {
	return {
		type: types.FETCH_AVAIL_TASK_STARTED,
		more,
	};
}

function _fetchAvailTaskFailed (message) {
	return {
		type: types.FETCH_AVAIL_TASK_FAILED,
		message,
	};
}

function _fetchAvailTaskResultReceived(data) {
	return {
		type: types.FETCH_AVAIL_TASK_RESULT,
		data
	};
}

function _moreAvailTaskResultReceived (data) {
	return {
		type: types.FETCH_AVAIL_TASK_RESULT_MORE,
		data,
	};
}

// -- Related to My Tasks
function _fetchMyTask (dispatch, accessToken, nextPageUrl, filter, sort, limit) {
	console.log("_fetchMyTask - Started");
	dispatch(_fetchMyTaskStarted(nextPageUrl));

	TaskService.fetchMyTasks(accessToken, nextPageUrl, filter, sort, limit)
	.then((data) => {
			if (nextPageUrl) {
				console.log("_fetchMyTask - Sending More Available Tasks Data via Action");
				dispatch(_moreMyTaskResultReceived(data))
			} else {
				console.log("_fetchMyTask - Sending Available Tasks Data via Action");
				dispatch(_fetchMyTaskResultReceived(data))
			}
	})
	.catch((err) => {
		processError(err, dispatch,
								() => _fetchMyTaskFailed(err), //network Error action
		 						() => _fetchMyTaskFailed(err) // server error action
		);
		Util.showToast("GAGAL " + err.cause.error, Util.LONG);

	});
}

function _fetchMyTaskStarted(more) {
	return {
		type: types.FETCH_MY_TASK_STARTED,
		more,
	};
}

function _fetchMyTaskFailed (message) {
	return {
		type: types.FETCH_MY_TASK_FAILED,
		message,
	};
}

function _moreMyTaskResultReceived (data) {
	return {
		type: types.FETCH_MY_TASK_RESULT_MORE,
		data,
	};
}

function _fetchMyTaskResultReceived(data) {
	return {
		type: types.FETCH_MY_TASK_RESULT,
		data,
	};
}





// --- Private function used by thunk related to Status Surveyor
function _fetchStatusSurveyor (dispatch, accessToken, nextPageUrl, filter, sort, limit) {
	console.log("_fetchStatusSurveyor - Started");
	dispatch(_fetchStatusSurveyorStarted(nextPageUrl));

	TaskService.fetchMyTasks(accessToken, nextPageUrl, filter, sort, limit)
	.then((data) => {
			if (nextPageUrl) {
				console.log("_fetchStatusSurveyor - Sending More Available Tasks Data via Action");
				dispatch(_moreStatusSurveyorResultReceived(data))
			} else {
				console.log("_fetchStatusSurveyor - Sending Available Tasks Data via Action");
				dispatch(_fetchStatusSurveyorResultReceived(data))
			}
	})
	.catch((err) => {
		processError(err, dispatch,
								() => _fetchStatusSurveyorFailed(err),
								() => _fetchStatusSurveyorFailed(err));
		Util.showToast("GAGAL " + err.cause.error, Util.LONG);

		// console.log("_fetchStatusSurveyor - Error", err);
		// dispatch(_fetchStatusSurveyorFailed(err))

	});
}

//List of Action Creator Function for Status Surveyor
function _fetchStatusSurveyorStarted(more) {
	return {
		type: types.FETCH_STATUS_SURVEYOR_STARTED,
		more,
	};
}

function _fetchStatusSurveyorFailed (message) {
	return {
		type: types.FETCH_STATUS_SURVEYOR_FAILED,
		message,
	};
}

function _fetchStatusSurveyorResultReceived(data) {
	return {
		type: types.FETCH_STATUS_SURVEYOR_RESULT,
		data
	};
}

function _moreStatusSurveyorResultReceived (data) {
	return {
		type: types.FETCH_STATUS_SURVEYOR_RESULT_MORE,
		data,
	};
}

export function selectMyTaskTab () {
	return {
		type: types.MY_TASK_ON_FOCUS,
	};
}
