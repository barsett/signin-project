'use-strict'

import Immutable from 'immutable';

import {
  Map,
  List,
  fromJS
} from 'immutable';
import * as types from '../actions/ActionTypes';


const initialState = Immutable.fromJS({
  lang: 'id',
  isFreshInstall: true,
  isReferenceDownloaded: false,
  isReferenceLoading: false,
  referenceLoadingProgress: 0,
  referenceLoadingProgressDescription: null,
  maxNumberOfBackdatedDate: 30,
  gpsHighAccuracyMode: false,
}, );

const settingReducer = (state = initialState, action) => {
  // if action then collect all the info. only run this on application start

  switch (action.type) {
    case types.STATE_FRESH_INSTALL_FALSE:
        state = state.set('isFreshInstall', false);
        return state;

    case types.REF_UPDATE_STARTED:
        state = state.set('isReferenceLoading', true)
                     .set('referenceLoadingProgressDescription', "Downloading...")
                     .set('referenceLoadingProgress', 0.2);

    break;
    case types.REF_UPDATE_PROGRESS:
        state = state.set('referenceLoadingProgress', action.progress)
                     .set('referenceLoadingProgressDescription', action.msg);


    break;
    case types.REF_UPDATE_RESULT:
      state = state.set('isReferenceLoading', false)
                   .set('referenceLoadingProgressDescription', "Completed")
                   .set('referenceLoadingProgress', 1)
                   .set('isReferenceDownloaded', true);


    break;
    case types.REF_UPDATE_FAILED:
      state = state.set('isReferenceLoading', false)
                   .set('referenceLoadingProgress', 0)
                   .set('referenceLoadingProgressDescription', action.msg.cause.error)
                   .set('isReferenceDownloaded', false);
    break;

    case types.UPDATE_BACKDATED_DATE:
      state = state.set('maxNumberOfBackdatedDate', action.backdatedDate);
    break;

    case types.UPDATE_GPS_MODE:
      state = state.set('gpsHighAccuracyMode', action.gpsHighAccuracyMode);
    break;


    default:
      return state;
    break;
  }

  return state;
}

export default settingReducer;
