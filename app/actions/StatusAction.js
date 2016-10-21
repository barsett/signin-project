import * as types from './ActionTypes';
import Util from '../api/Util';

export function updateNetworkStatus(isConnected) {
  return {
    type: types.STATUS_NETWORK_UPDATE,
    isConnected,
  };
}


export function setDeviceInfo(deviceInfo) {
  return {
    type: types.APP_SET_DEVICE_INFO,
    deviceInfo
  };
}

export function saveState() {
  return {
    type: types.STATE_SAVE
  };
}

export function invalidateFreshInstall() {
  return {
    type: types.STATE_FRESH_INSTALL_FALSE
  };
}

export function setFreshInstall() {
  return {
    type: types.STATE_FRESH_INSTALL_TRUE
  };
}

export function storageLoaded() {
  return {
    type: types.STORAGE_LOADED
  };
}


export function getLocationStarted() {
  return {
    type: types.GPS_LOCATION_UPDATE_STARTED,
  };
}

export function getLocationCompleted(location) {
    return {
      type: types.GPS_LOCATION_UPDATE_RESULT,
      location,
    };
}

export function getLocationFailed(message) {
  return {
    type: types.GPS_LOCATION_UPDATE_FAILED,
    message,
  };
}

export function updateLocation(){
  return (dispatch, getState) => {
    console.log("Updating Location...");
    var gpsMode = getState().getIn(['setting','gpsHighAccuracyMode']);

    dispatch(getLocationStarted);

    return new Promise((resolve,reject) => {
      navigator.geolocation.getCurrentPosition(
        (currentLocation) => {
          //var currentLocation = JSON.stringify(position);
          //console.log("LOCATION", currentLocation);
          dispatch(getLocationCompleted(currentLocation));
          console.log("Returning Location...");
          resolve(currentLocation);
        },
        (error) => {
          console.log("Unable to get location", error);
          dispatch(getLocationFailed(error));
          reject(error);
        },
        {enableHighAccuracy: gpsMode, timeout: 30000, maximumAge: 10000}
      );

    });

  }
}
