import * as types from './ActionTypes';
import { processError } from '../api/Common';
import Util from '../api/Util';
import ReferenceService from '../api/ReferenceService';


function _downloadReferenceStarted() {
    return {
        type: types.REF_UPDATE_STARTED,
    };
}

function _downloadReferenceResult(msg) {
    return {
        type: types.REF_UPDATE_RESULT,
        msg
    };
}

function _downloadReferenceProgress(progress, msg) {
    return {
        type: types.REF_UPDATE_PROGRESS,
        progress,
        msg
    };
}

function _downloadReferenceFailed(msg) {
    return {
        type: types.REF_UPDATE_FAILED,
        msg
    };
}


export function updateReferenceData(force = false) {
    return (dispatch, getState) => {
      const accessToken = getState().getIn(['currentUser','accessToken']);

      //only fetch if on demand load or empty reference
      if (!ReferenceService.isEmpty() && !force) return;

      console.log('Calling ReferenceService');
      dispatch(_downloadReferenceStarted());
      ReferenceService.fetchReference(accessToken)
      .then((data) => {
        dispatch(_downloadReferenceProgress(.5, "Updating Local DB"));
        console.log('Processing reference data...');
        dispatch(_downloadReferenceProgress(.7, "Updating Local DB"));
        ReferenceService.refreshLocalDB(data);
        dispatch(_downloadReferenceResult(data.length));
        Util.showToast("Data Referensi telah sukses diperbaharui", Util.SHORT);
      })
      .catch((err) => {
        processError(err, dispatch,
                    () => _downloadReferenceFailed(err),
                    () => _downloadReferenceFailed(err));
        Util.showToast("GAGAL " + err.cause.error, Util.LONG);
      });
      //Check current STATE for reference loaded
      //if reference is empty then fetch
      //

    };
}
