'use-strict'

import {
    LOAD,
    SAVE
} from 'redux-storage';
import Immutable, {
    Map,
    List,
    fromJS
} from 'immutable';

import * as types from '../actions/ActionTypes';


const initialState = Immutable.fromJS({
    networkActivity: false,
    storageLoaded: false,
    networkStatus: false,
    updateIsLoading: false,
    updateLastCheck: 0,
    updateStatus: null,
    appVersion: '0.1',
    deviceId: '',
    deviceModel: '',
    deviceVersion: '',
    bundleId: '',
    codePushRelease: '', //code push label version
    codePushVersion: '', //code push app version to download the update
    longitude: null, // current user location
    latitude: null, // curretn user location
    locationLoading: false, // indicate location is loading
});

const statusReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD:
            //state = state.set('storageLoaded', true);
            return state;

        case SAVE:
            console.log('Something has changed and written to disk!');
            return state;

        case types.STORAGE_LOADED:
            state = state.set('storageLoaded', true);
            return state;

        case types.STATUS_NETWORK_UPDATE:
            console.log("Updating network Status", action.name);
            state = state.set('networkStatus', action.isConnected);
            return state;

        case types.APP_UPDATE_STARTED:
            console.log("App Update is Started");
            state = state.set('updateIsLoading', true);
            return state;

        case types.APP_UPDATE_IN_PROGRESS:
            console.log("App Update in progress");
            state = state.set('updateStatus', action.msg);
            return state;

        case types.APP_UPDATE_COMPLETED:
            console.log("App Update is completed");
            var curDate = new Date();
            curDate.setHours(23,59,59,0);
            state = state.set('updateStatus', action.msg)
                .set('updateIsLoading', false)
                .set('updateLastCheck', curDate.getTime());
            return state;

        case types.APP_UPDATE_FAILED:
            console.log("App Update failed");
            state = state.set('updateStatus', action.msg)
                .set('updateIsLoading', false);
            return state;

        case types.APP_SET_DEVICE_INFO:
            //console.log("Set Device Info", action);
            var newMap = Immutable.fromJS(action.deviceInfo);
            state = state.merge(newMap);

            return state;

        case types.GPS_LOCATION_UPDATE_RESULT:
            state = state.set('latitude', action.location.coords.latitude)
                        .set('longitude', action.location.coords.longitude);
            return state;

        default:
            return state;
    }
}

export default statusReducer;
