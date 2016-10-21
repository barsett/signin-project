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
  dataSources: [],
  isLoading: false,
  criteria: {
    namaKorban: null,
    tanggalKejadianText: new Date().toLocaleDateString(),
    tanggalKejadianDate: new Date(),
    tanggalLaporanText: new Date().toLocaleDateString(),
    tanggalLaporanDate: new Date(),
    instansi: null,
  },
});

const lakaSearchReducer = (state = initialState, action) => {
  switch(action.type){
    case types.LAKA_SEARCH_STARTED:
      state = state.set('isLoading', true);
    break;

    case types.LAKA_SEARCH_RESULT:
      const newDs = Immutable.fromJS(action.result.content);
      state = state.set('dataSources', newDs)
                   .set('isLoading', false);
      break;


    case types.LAKA_SEARCH_FAILED:
      state = state.set('isLoading', false);
    break;

    default:

    break;

  }

  return state;
}


export default lakaSearchReducer;
