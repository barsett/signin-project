'use-strict'

import Immutable from 'immutable';
import * as types from '../actions/ActionTypes';

import {
    Map,
    List,
    fromJS
} from 'immutable';

const initialState = Immutable.fromJS({
    surveyStat: {},
    isLoading: false,
    lastUpdateTime: 0,
}, );

const StatisticReducer = (state = initialState, action) => {
    switch (action.type) {

        case types.STAT_GET_STARTED:
            // sync is started
            state = state.set('isLoading', true);
            break;

        case types.STAT_GET_RESULT:
            // sync is completed
            const currentTime = new Date();

            state = state.set('isLoading', false)
                         .set('surveyStat' , Immutable.fromJS(action.stat))
                         .set('lastUpdateTime', currentTime.getTime());
            break;

        case types.STAT_GET_FAILED:
            // sync is completed with error
            state = state.set('isLoading', false);
            break;

        case types.FETCH_MY_TASK_CLEAR:
            state = state.set('isLoading', false)
                        .set('surveyStat', new Map({}))
                        .set('lastUpdateTime', 0);
            break;

        default:
            break;


    }

    return state;

}

export default StatisticReducer;
