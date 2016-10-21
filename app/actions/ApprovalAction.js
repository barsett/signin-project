'use strict'

import * as types from './ActionTypes';
import ApprovalService from '../api/TaskServiceJR'; //used for testing (FIRST TRIAL NIH DOAKAN AKU SUKSES YA!)
import { processError, executeWithRetry } from '../api/Common';
import Util from '../api/Util';
import { Actions } from 'react-native-router-flux';

/*
Below section is a list of thunk function that will be used by the components
*/
export function runFetchApproval(forceReload){
  return(dispatch, getState) => {
    var accessToken = getState().getIn(['currentUser', 'accessToken']);
    var isLoading = getState().getIn(['approvals', 'isLoading']);

    if(!isLoading){
      var nextPageUrl = null;
      if(!forceReload){
        nextPageUrl = getState().getIn(['approvals', 'nextPageUrl']);
      }
      return _fetchApproval(dispatch, accessToken, nextPageUrl);
    }
  }
}

export function runApproveAuthorization(task){
  return(dispatch, getState) => {
    var accessToken = getState().getIn(['currentUser','accessToken']);
    //console.log("### APPROVAL ACTION - APPROVE AUTHORIZATION - THUNK ###");
    _approveAuthorization(dispatch, accessToken, task);
  }
}

/*
Below section is a list of private function that will be used by thunk function
*/
function _fetchApproval(dispatch, accessToken, nextPageUrl){
  console.log("_fetchApproval Started");
  dispatch(_fetchApprovalStarted(nextPageUrl));

  return ApprovalService.fetchOtorisasi(accessToken, nextPageUrl)
  .then((data) => {
    if(nextPageUrl){
      console.log("Sending more available approval data via action");
      dispatch(_fetchMoreApprovalResultReceived(data));
    }
    else{
      console.log("Sending available approval data via action");
      dispatch(_fetchApprovalResultReceived(data));
    }
  })
  .catch((err) => {
    processError(err,
                 dispatch,
                 () => _fetchApprovalFailed(err),
                 () => _fetchApprovalFailed(err)),
    Util.showToast('GAGAL ' + err.cause.error, Util.LONG);
  });
}


function _approveAuthorization(dispatch, accessToken, data){
  console.log("_approveAuthorization Started");
  dispatch(_approveAuthorizationStarted(data));
  Util.showToast("Saving...", Util.LONG);
  ApprovalService.authorizeTask(accessToken, data)
  .then((resp) => {
    //masuk kesini kalau ada data balikannya
    if (resp.status === 'success'){
      // kalau sukses, remove otorisasi dari list otorisasi
      console.log("### APPROVAL SUCCESS ###");
      dispatch(_approveAuthorizationResult(data));
      Util.showToast("Saved", Util.LONG);
      Actions.pop();
    } else {
      // kalau ga sukses, otorisasi ga diremove
      console.log("### APPROVAL FAILED ###");
      dispatch(_approveAuthorizationFailed(resp));
      Util.showToast("GAGAL " + resp.description, Util.LONG);
    }
  })
  .catch((err) => {
    processError(err,
                 dispatch,
                 () => _approveAuthorizationFailed(err),
                 () => _approveAuthorizationFailed(err)),
    //masuk kesini kalau error
    Util.showToast("GAGAL " + err.cause.error, Util.LONG);
  });
}


function _fetchApprovalStarted(more){
  return {
    type : types.FETCH_APPROVAL_STARTED,
    more
  }
}

function _fetchApprovalFailed(msg){
  return {
    type : types.FETCH_APPROVAL_FAILED,
    msg
  }
}

function _fetchApprovalResultReceived(data){
  return {
    type : types.FETCH_APPROVAL_RESULT,
    data
  }
}

function _fetchMoreApprovalResultReceived(data){
  return {
    type : types.FETCH_APPROVAL_RESULT_MORE,
    data
  }
}

function _approveAuthorizationStarted(data){
  return {
    type : types.APPROVE_AUTHORIZATION_STARTED,
    data,
  }
}

function _approveAuthorizationResult(data){
  return {
    type : types.APPROVE_AUTHORIZATION_RESULT,
    data,
  }
}

function _approveAuthorizationFailed(resp){
  return {
    type : types.APPROVE_AUTHORIZATION_FAILED,
    resp,
  }
}
