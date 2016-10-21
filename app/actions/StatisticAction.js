import * as types from './ActionTypes';
import StatisticService from '../api/StatisticService';
//import TaskService from '../api/TaskService';
import { executeWithRetry, processError, increaseRetryCount } from '../api/Common';
import Util from '../api/Util';
import {MAX_RETRY} from '../config/Config';

function _getStatStarted() {
    return {
        type: types.STAT_GET_STARTED,
    };
}

function _getStatResult(stat) {
    return {
        type: types.STAT_GET_RESULT,
        stat,
    };
}

function _getStatFailed(message) {
    return {
        type: types.STAT_GET_FAILED,
        message,
    };
}


export function getSurveyStatistic() {
    return (dispatch, getState) => {
        var accessToken = getState().getIn(['currentUser', 'accessToken']);
        var limit = getState().getIn(['setting','maxNumberOfBackdatedDate']);
        console.log("getting statistic");

        dispatch(_getStatStarted());
        //dispatch update local with status not syncPending

        StatisticService.getSurveyStatistic(accessToken, limit)
            .then((resp) => {
              dispatch(_getStatResult(resp));

            })
            .catch((err) => {
              console.log("Error", err);
              processError(err, dispatch,
                          () => _getStatFailed(err),
                          () => _getStatFailed(err));

            });
    };
}
