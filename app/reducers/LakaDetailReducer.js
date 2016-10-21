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
  lakaDetail: {},
  listKendaraan: [],
  listKorban: [],
  isLoadingLakaDetail: false,
  isLoadingListKendaraan: false,
  isLoadingListKorban: false,
});

const lakaDetailReducer = (state = initialState, action) => {
  switch(action.type) {
    case types.LAKA_DETAIL_STARTED:
      state = state.set('isLoadingLakaDetail', true);
    break;

    case types.LAKA_DETAIL_RESULT:{
      state = state.set('lakaDetail', Immutable.fromJS(action.result))
                   .set('isLoadingLakaDetail', false);
      break;
    }

    case types.LAKA_DETAIL_FAILED:
      state = state.set('isLoadingLakaDetail', false);
    break;

    case types.LAKA_LIST_KORBAN_STARTED:
      state = state.set('isLoadingListKorban', true);
    break;

    case types.LAKA_LIST_KORBAN_RESULT:{
      const newDs = Immutable.fromJS(action.result.content);
      state = state.set('listKorban', newDs)
                   .set('isLoadingListKorban', false);
      break;
    }

    case types.LAKA_LIST_KORBAN_FAILED:
      state = state.set('isLoadingListKorban', false);
    break;

    case types.LAKA_LIST_KENDARAAN_STARTED:
      state = state.set('isLoadingListKendaraan', true);
    break;

    case types.LAKA_LIST_KENDARAAN_RESULT:{
      const newDs = Immutable.fromJS(action.result.content);
      state = state.set('listKendaraan', newDs)
                   .set('isLoadingListKendaraan', false);
      break;
    }

    case types.LAKA_LIST_KENDARAAN_FAILED:
      state = state.set('isLoadingListKendaraan', false);
    break;

    case types.UPDATE_LAKA_STARTED:
      state = state.set('isLoadingLakaDetail', true);
    break;

    case types.UPDATE_LAKA_RESULT:
      var dataLaka = {
        content: [action.data]
      };
      state = state.set('lakaDetail', Immutable.fromJS(dataLaka))
                   .set('isLoadingLakaDetail', false);
    break;

    case types.UPDATE_LAKA_FAILED:
      state = state.set('isLoadingLakaDetail', false);

    case types.ADD_KENDARAAN_STARTED:
      state = state.set('isLoadingListKendaraan', true);
    break;

    case types.ADD_KENDARAAN_RESULT:
      var dataKendaraan = action.data;
      var currentDS = state.get('listKendaraan');
      var listKendaraan = currentDS.toJS();
      listKendaraan.push(dataKendaraan);
      state = state.set('listKendaraan', Immutable.fromJS(listKendaraan))
                   .set('isLoadingListKendaraan', false);
    break;

    case types.ADD_KENDARAAN_FAILED:
      state = state.set('isLoadingListKendaraan', false);
    break;

    case types.UPDATE_KENDARAAN_STARTED:
      state = state.set('isLoadingListKendaraan', true);
    break;

    case types.UPDATE_KENDARAAN_RESULT:
      var dataKendaraan = action.data;
      var currentDS = state.get('listKendaraan');
      var index = currentDS.findIndex((item) => {
        var kendaraan = item.toJS();
        if (kendaraan.idAngkutanKecelakaan === dataKendaraan.idAngkutanKecelakaan){
          console.log("Matched Kendaraan found");
          return true;
        } else {
          return false;
        }
      });
      var listKendaraan = currentDS.toJS();
      listKendaraan[index] = dataKendaraan;
      state = state.set('listKendaraan', Immutable.fromJS(listKendaraan))
                   .set('isLoadingListKendaraan', false);
    break;

    case types.UPDATE_KENDARAAN_FAILED:
      state = state.set('isLoadingListKendaraan', false);
    break;

    case types.DELETE_KENDARAAN_STARTED:
      state = state.set('isLoadingListKendaraan', false);
    break;

    case types.DELETE_KENDARAAN_RESULT:
      const idKendaraan = action.data;
      const curDS = state.get('listKendaraan');
      const item = curDS.findIndex((item) => {
        var kendaraan = item.toJS();
        if (kendaraan.idAngkutanKecelakaan === idKendaraan.idAngkutanKecelakaan){
          return true;
        } else {
          return false;
        }
      });
      state = state.set('listKendaraan', curDS.delete(item));
    break;

    case types.DELETE_KENDARAAN_FAILED:
      state = state.set('isLoadingListKendaraan', false);
    break;

    case types.ADD_KORBAN_STARTED:
      state = state.set('isLoadingListKorban', true);
    break;

    case types.ADD_KORBAN_RESULT:
      var dataKorban = action.data;
      var currentDS = state.get('listKorban');
      var listKorban = currentDS.toJS();
      listKorban.push(dataKorban);
      state = state.set('listKorban', Immutable.fromJS(listKorban))
                   .set('isLoadingListKorban', false);
    break;

    case types.ADD_KORBAN_FAILED:
      state = state.set('isLoadingListKorban', false);
    break;

    case types.EDIT_KORBAN_STARTED:
      state = state.set('isLoadingListKorban', true);
    break;

    case types.EDIT_KORBAN_RESULT:
      var dataKorban = action.data;
      var currentDS = state.get('listKorban');
      var index = currentDS.findIndex((item) => {
        var korban = item.toJS();
        if (korban.idKorbanKecelakaan === dataKorban.idKorbanKecelakaan){
          console.log("Matched Korban found");
          return true;
        } else {
          return false;
        }
      });
      var listKorban = currentDS.toJS();
      listKorban[index] = dataKorban;
      state = state.set('listKorban', Immutable.fromJS(listKorban))
                   .set('isLoadingListKorban', false);
    break;

    case types.EDIT_KORBAN_FAILED:
      state = state.set('isLoadingListKorban', false);
    break;

    case types.DELETE_KORBAN_STARTED:
      state = state.set('isLoadingListKorban', false);
    break;

    case types.DELETE_KORBAN_RESULT:
      const idKorban = action.data;
      const currentDS = state.get('listKorban');
      const index = currentDS.findIndex((item) => {
        var korban = item.toJS();
        if (korban.idKorbanKecelakaan === idKorban){
          return true;
        } else {
          return false;
        }
      });
      state = state.set('listKorban', currentDS.delete(index));
    break;

    case types.DELETE_KORBAN_FAILED:
      state = state.set('isLoadingListKorban', false);

    break;

    default:

    break;

  }

  return state;
}


export default lakaDetailReducer;
