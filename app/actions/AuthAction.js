import { Actions } from 'react-native-router-flux';


import AuthService from '../api/AuthService';
import Util from '../api/Util';
import i18n from '../i18n.js';
import { processError } from '../api/Common';
import * as types from './ActionTypes';


export function setToken(username, token) {
    return {
        type: types.AUTH_SET_TOKEN,
        username,
        token,
    };
}

export function removeToken() {
    return {
        type: types.AUTH_REMOVE_TOKEN,
    };
}

export function loginError(error) {
    return {
        type: types.AUTH_LOGIN_ERROR,
        error
    };
}

export function setInfo(username) {
    return {
        type: types.AUTH_SET_INFO,
        username,
    };
}

export function setPushNotificationToken(token) {
    return {
        type: types.PUSH_NOTIFICATION_SET_TOKEN,
        token
    };
}

export function tokenVerified() {
    return {
        type: types.AUTH_TOKEN_VERIFIED,
    };
}

export function tokenExpired() {
    return {
        type: types.AUTH_TOKEN_EXPIRED,
    };
}

export function tokenFailed() {
    return {
        type: types.AUTH_TOKEN_FAILED,
    };
}


export function clearAvailableTaskData() {
    return {
        type: types.FETCH_AVAIL_TASK_CLEAR,
    };
}

export function clearMyTaskData() {
    return {
        type: types.FETCH_MY_TASK_CLEAR,
    };
}

export function clearStatusSurveyorData() {
    return {
        type: types.FETCH_STATUS_SURVEYOR_CLEAR,
    };
}

export function clearSearchSantunanData() {
    return {
        type: types.SEARCH_SANTUNAN_CLEAR,
    };
}

export function clearSantunanDetailData() {
    return {
        type: types.FETCH_SANTUNAN_DETAIL_CLEAR,
    };
}

export function clearSantunanHistoryData() {
    return {
        type: types.FETCH_SANTUNAN_HISTORY_CLEAR,
    };
}

export function clearOtorisasiData(){
  return {
    type: types.FETCH_APPROVAL_CLEAR,
  };
}

export function verifyCredential(username, password) {
    return function(dispatch, getState) {
        console.log("Login Started: ", username);
        // convert username to low caps for safety
        username = (username) ? username.toLowerCase() : '';
        previousUsername = getState().getIn(['currentUser', 'previousUsername']);
        console.log("COMPARE" + username + "=" + previousUsername);

        dispatch(setInfo(username));

        // check if user or pass empty return error
        if (username.length < 1 || password.length < 1) {
            dispatch(loginError(i18n.invalidLoginInput));
            return;
        }

        AuthService.login(username, password)
            .then((data) => {
                console.log("Login Success");
                dispatch(setToken(username, data));

                if (previousUsername !== username) {
                    console.log("Clear Local Task Data");
                    dispatch(clearAvailableTaskData());
                    dispatch(clearMyTaskData());
                    dispatch(clearStatusSurveyorData());
                    dispatch(clearSearchSantunanData());
                    dispatch(clearSantunanDetailData());
                    dispatch(clearSantunanHistoryData());
                    dispatch(clearOtorisasiData());
                }

                // dispatch Register token
                // Register Device to server
                dispatch(registerPushToken());

            })
            .catch((error) => {
                console.log("Error: ", error);
                dispatch(loginError(error));
            })
            .done();
    };
}

export function clearLocalData(){
  return function(dispatch){
    console.log('Clearing local data');
    dispatch(clearAvailableTaskData());
    dispatch(clearMyTaskData());
    dispatch(clearOtorisasiData());
    dispatch(clearStatusSurveyorData());
    Util.showToast(i18n.clearDataInfo, Util.SHORT);
  };
}

export function checkToken() {
    return function(dispatch, getState) {
        var accessToken = getState().getIn(["currentUser", "accessToken"]);

        //console.log("Check Token Started: ", accessToken);
        //dispatch(setInfo(accessToken));

        AuthService.isLoggedIn(accessToken)
        .then((resp) => {
          console.log("Token Verified");
          //NO NEED TO CHANGE ANY STATE
          //dispatch(tokenVerified());
        })
        .catch((err) => {
          console.log("Check Token Error", err);
          processError(err, dispatch,
      								() => tokenFailed(err),
      								() => tokenExpired(err));
      	  //Util.showToast("Check token error ");

        });
    };
}


export function registerPushToken() {
    return function(dispatch, getState) {
        const accessToken = getState().getIn(["currentUser", "accessToken"]);
        const pushToken = getState().getIn(['currentUser', 'pushToken']);
        const pushTokenOS = getState().getIn(['status', 'deviceOS']);
        const deviceUniqueId = getState().getIn(['status', 'deviceUniqueId']);

        console.log("Registering push token: ", pushToken);

        if (pushToken) {
            AuthService.registerPushToken(accessToken, pushToken, pushTokenOS, deviceUniqueId)
                .then((data) => {
                    //console.log("Token Return: ", data);
                    Util.showToast('Device registration is successful', Util.SHORT);
                })
                .catch((error) => {
                    console.log("Error registering token. ", error);
                    Util.showToast('Device registration failed', Util.SHORT);
                });
        } else {
            console.log("WARNING: push token is empty.");
        }
    };
}
