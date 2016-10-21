import Immutable from 'immutable';
import {
  Map,
  List,
  fromJS
} from 'immutable';
import * as types from '../actions/ActionTypes';
import debug from '../debug';
import { ERROR_SERVER, ERROR_NETWORK} from '../api/Common';

const initialState = Immutable.fromJS({
  dataSource : [],
  isLoading : false,
});

const santunanHistoryReducer = (state = initialState, action) => {
  switch(action.type){

    case types.FETCH_SANTUNAN_HISTORY_STARTED:
      state = state.set('isLoading', true);
      return state;

    case types.FETCH_SANTUNAN_HISTORY_RESULT:
      const newDs = Immutable.fromJS(action.result.content);
      state = state.set('dataSource', newDs)
                   .set('isLoading', false);
      return state;


    case types.FETCH_SANTUNAN_HISTORY_FAILED:
      state = state.set('isLoading', false);
      return state;

    case types.FETCH_SANTUNAN_HISTORY_CLEAR:
      // clear local storage if username != previous username
      state = state.set('dataSource', Immutable.fromJS([]));
      return state;

    break;

    default:
      return state;
  }
}


export default santunanHistoryReducer;
