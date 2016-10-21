import * as types from './ActionTypes';

export function updateBackdatedDate(newBackdatedDate) {
  return {
    type: types.UPDATE_BACKDATED_DATE,
    backdatedDate: newBackdatedDate,
  };
}

export function updateGpsMode(gpsHighAccuracyMode) {
  return {
    type: types.UPDATE_GPS_MODE,
    gpsHighAccuracyMode: gpsHighAccuracyMode,
  };
}
