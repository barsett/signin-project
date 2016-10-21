'use-strict'

import Immutable from 'immutable';
import * as types from '../actions/ActionTypes';

import {
    Map,
    List,
    fromJS
} from 'immutable';

const initialState = Immutable.fromJS({
    pendingRequests: [],
    lastUpdateTime: null,
    lastUpdateStatus: 200,
    isLoading: false,
}, );

const syncPendingReducer = (state = initialState, action) => {
    switch (action.type) {

        case types.SYNC_PENDING_STARTED:
            // sync is started
            state = state.set('isLoading', true)
                .set('error', null);
            break;

        case types.SYNC_PENDING_COMPLETED:
            // sync is completed
            state = state.set('isLoading', false);
            break;

        case types.SYNC_PENDING_ERROR:
            // sync is completed with error

            state = state.set('isLoading', false);
            break;


        default:
            break;


    }

    return state;

}

export default syncPendingReducer;
