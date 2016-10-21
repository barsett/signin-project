import * as types from './ActionTypes';
import LakaService from '../api/LakaService';

import { executeWithRetry, processError } from '../api/Common';
import { Actions } from 'react-native-router-flux';
import Util from '../api/Util';

function _searchLakaStarted(criteria) {
    return {
        type: types.LAKA_SEARCH_STARTED,
        criteria,
    };
}

function _searchLakaResult(criteria, result) {
    return {
        type: types.LAKA_SEARCH_RESULT,
        criteria,
        result,
    };
}

function _searchLakaFailed(criteria, message) {
    return {
        type: types.LAKA_SEARCH_FAILED,
        criteria,
        message,
    };
}

export function runSearchLaka(criteria) {
    return (dispatch, getState) => {
        var accessToken = getState().getIn(['currentUser', 'accessToken']);
        var isLoading = getState().getIn(['searchLaka', 'isLoading']);

        if (isLoading !== true) {
            console.log("_searchLakaStarted()");
            dispatch(_searchLakaStarted(criteria));

            LakaService.searchLaka(accessToken, criteria)
                .then((data) => {
                    console.log("_searchLakaResult()");
                    dispatch(_searchLakaResult(criteria,data));

                })
                .catch((err) => {
                  processError(err, dispatch,
                              () => _searchLakaFailed(criteria, err),
                              () => _searchLakaFailed(criteria, err));
                  Util.showToast("GAGAL " + err.cause.error, Util.LONG);

                });
        }
    };
}


function _getLakaDetailStarted(lakaId) {
    return {
        type: types.LAKA_DETAIL_STARTED,
        lakaId,
    };
}

function _getLakaDetailResult(lakaId, result) {
    return {
        type: types.LAKA_DETAIL_RESULT,
        lakaId,
        result,
    };
}

function _getLakaDetailFailed(lakaId, message) {
    return {
        type: types.LAKA_DETAIL_FAILED,
        lakaId,
        message,
    };
}


export function runGetLakaDetail(lakaId, flagIrsms) {
    return (dispatch, getState) => {
        var accessToken = getState().getIn(['currentUser', 'accessToken']);
        var isLoading = getState().getIn(['lakaInfo', 'isLoadingLakaDetail' , lakaId]);

        if (isLoading !== true) {
            console.log("_getLakaDetailStarted()");
            dispatch(_getLakaDetailStarted(lakaId));

            LakaService.getLakaDetail(accessToken, lakaId, flagIrsms)
                .then((data) => {
                    console.log("_searchLakaResult()");
                    dispatch(_getLakaDetailResult(lakaId,data));

                })
                .catch((err) => {
                  processError(err, dispatch,
                              () => _getLakaDetailFailed(lakaId, err),
                              () => _getLakaDetailFailed(lakaId, err));
                  Util.showToast("GAGAL " + err.cause.error, Util.LONG);

                });
        }
    };
}


function _getLakaListKorbanStarted(lakaId) {
    return {
        type: types.LAKA_LIST_KORBAN_STARTED,
        lakaId,
    };
}

function _getLakaListKorbanResult(lakaId, result) {
    return {
        type: types.LAKA_LIST_KORBAN_RESULT,
        lakaId,
        result,
    };
}

function _getLakaListKorbanFailed(lakaId, message) {
    return {
        type: types.LAKA_LIST_KORBAN_FAILED,
        lakaId,
        message,
    };
}

export function runGetLakaListKorban(lakaId, flagIrsms) {
    return (dispatch, getState) => {
        var accessToken = getState().getIn(['currentUser', 'accessToken']);
        var isLoading = getState().getIn(['lakaInfo', 'isLoadingListKorban' , lakaId]);

        if (isLoading !== true) {
            console.log("_getLakaListKorbanStarted()");
            dispatch(_getLakaListKorbanStarted(lakaId));

            LakaService.getKorbanByLakaId(accessToken, lakaId, flagIrsms)
                .then((data) => {
                    console.log("_getLakaListKorbanResult()");
                    dispatch(_getLakaListKorbanResult(lakaId,data));

                })
                .catch((err) => {
                  processError(err, dispatch,
                              () => _getLakaListKorbanFailed(lakaId, err),
                              () => _getLakaListKorbanFailed(lakaId, err));
                  Util.showToast("GAGAL " + err.cause.error, Util.LONG);

                });
        }
    };
}



function _getLakaListKendaraanStarted(lakaId) {
    return {
        type: types.LAKA_LIST_KENDARAAN_STARTED,
        lakaId,
    };
}

function _getLakaListKendaraanResult(lakaId, result) {
    return {
        type: types.LAKA_LIST_KENDARAAN_RESULT,
        lakaId,
        result,
    };
}

function _getLakaListKendaraanFailed(lakaId, message) {
    return {
        type: types.LAKA_LIST_KENDARAAN_FAILED,
        lakaId,
        message,
    };
}


export function runGetLakaListKendaraan(lakaId, flagIrsms) {
    return (dispatch, getState) => {
        var accessToken = getState().getIn(['currentUser', 'accessToken']);
        var isLoading = getState().getIn(['lakaInfo', 'isLoadingListKendaraan' , lakaId]);

        if (isLoading !== true) {
            console.log("_getLakaListKendaraanStarted()");
            dispatch(_getLakaListKendaraanStarted(lakaId));

            LakaService.getKendaraanByLakaId(accessToken, lakaId, flagIrsms)
                .then((data) => {
                    console.log("_searchLakaResult()");
                    dispatch(_getLakaListKendaraanResult(lakaId,data));

                })
                .catch((err) => {
                  processError(err, dispatch,
                              () => _getLakaListKendaraanFailed(lakaId, err),
                              () => _getLakaListKendaraanFailed(lakaId, err));
                  Util.showToast("GAGAL " + err.cause.error, Util.LONG);

                });
        }
    };
}

function _updateLaka(dispatch, accessToken, laka){
  console.log("Update laka");
  dispatch(_updateLakaStarted(laka));
  Util.showToast("Saving...", Util.LONG);
  LakaService.updateLakaDetail(accessToken, laka)
  .then((resp) => {
    if (resp.status === 'success'){
      dispatch(_updateLakaResult(laka));
      Util.showToast("Data laka telah diupdate", Util.LONG);
      Actions.pop();
    } else {
      dispatch(_updateLakaFailed(resp));
      Util.showToast("GAGAL UPDATE LAKA " + resp.description, Util.LONG);
    }
  })
  .catch((err) => {
    //masuk kesini kalau error
    processError(err, dispatch,
                () => _updateLakaFailed(laka.idKecelakaan, err),
                () => _updateLakaFailed(laka.idKecelakaan, err));
    Util.showToast("GAGAL " + err.cause.error, Util.LONG);
  });
}

export function runUpdateLaka(laka) {
  return (dispatch, getState) => {
    var accessToken = getState().getIn(['currentUser', 'accessToken']);
    _updateLaka(dispatch, accessToken, laka)
  }
}

function _updateLakaStarted(data){
  return {
    type: types.UPDATE_LAKA_STARTED,
    data: data,
  }
}

function _updateLakaFailed(resp){
  return {
    type: types.UPDATE_LAKA_FAILED,
    data: resp,
  }
}

function _updateLakaResult(data){
  return {
    type: types.UPDATE_LAKA_RESULT,
    data: data,
  }
}

function _addKendaraan(dispatch, accessToken, kendaraan){
  console.log("Add kendaraan");
  dispatch(_addKendaraanStarted(kendaraan));
  Util.showToast("Saving...", Util.LONG);
  LakaService.addKendaraan(accessToken, kendaraan)
  .then((resp) => {
      if (resp.status === 'success'){
        dispatch(_addKendaraanResult(resp.kendaraan));
        Util.showToast("Data Kendaraan ditambahkan", Util.LONG);
        Actions.pop();
      } else {
        dispatch(_addKendaraanFailed(resp));
        Util.showToast("Data Kendaraaan gagal ditambahkan " + resp.description, Util.LONG);
      }
  })
  .catch((err) => {
    processError(err, dispatch,
								() => _addKendaraanFailed(err),
								() => _addKendaraanFailed(err));
    Util.showToast("GAGAL " + err.cause.error, Util.LONG);
  });
}

export function runAddKendaraan(kendaraan) {
  return (dispatch, getState) => {
    var accessToken = getState().getIn(['currentUser', 'accessToken']);
    _addKendaraan(dispatch, accessToken, kendaraan)
  }
}



function _addKendaraanStarted(data){
  return {
    type: types.ADD_KENDARAAN_STARTED,
    data: data,
  }
}

function _addKendaraanFailed(resp){
  return {
    type: types.ADD_KENDARAAN_FAILED,
    data: resp,
  }
}

function _addKendaraanResult(data){
  return {
    type: types.ADD_KENDARAAN_RESULT,
    data: data,
  }
}

function _addKorban(dispatch, accessToken, korban){
  console.log("Add korban");
  dispatch(_addKorbanStarted(korban));
  Util.showToast("Saving...", Util.LONG);
  LakaService.addKorban(accessToken, korban)
  .then((resp) => {
    if (resp.status === 'success'){
      dispatch(_addKorbanResult(resp.korban));
      Util.showToast("Data korban ditambahkan", Util.LONG);
      Actions.pop();
    } else {
      dispatch(_addKorbanFailed(resp));
      Util.showToast("GAGAL ADD KORBAN " + resp.description, Util.LONG);
    }
  })
  .catch((err) => {
    //masuk kesini kalau error
    processError(err, dispatch,
                () => _addKorbanFailed(korban.idKorbanKecelakaan, err),
                () => _addKorbanFailed(korban.idKorbanKecelakaan, err));
    Util.showToast("GAGAL " + err.cause.error, Util.LONG);
  });
}

export function runAddKorban(korban) {
  return (dispatch, getState) => {
    var accessToken = getState().getIn(['currentUser', 'accessToken']);
    _addKorban(dispatch, accessToken, korban)
  }
}

function _addKorbanStarted(data){
  return {
    type: types.ADD_KORBAN_STARTED,
    data: data,
  }
}

function _addKorbanFailed(resp){
  return {
    type: types.ADD_KORBAN_FAILED,
    data: resp,
  }
}

function _addKorbanResult(data, idKorban){
  return {
    type: types.ADD_KORBAN_RESULT,
    data: data,
    idKorban: idKorban,
  }
}

function _updateKendaraan(dispatch, accessToken, kendaraan){
  console.log("UPDATE KENDARAAN");
  dispatch(_updateKendaraanStarted(kendaraan));
  Util.showToast("Saving...", Util.LONG);
  LakaService.updateKendaraan(accessToken, kendaraan)
  .then((resp) => {
    //console.log("### UPDATE KENDARAAN RESPONSE ###");
      if (resp.status === 'success'){
        dispatch(_updateKendaraanResult(kendaraan));
        Util.showToast("Data kendaraan berubah", Util.LONG);
        Actions.pop();
      } else {
        dispatch(_updateKendaraanFailed(resp));
        Util.showToast("Data Kendaraaan gagal ditambahkan " + resp.description, Util.LONG);
      }
  })
  .catch((err) => {
    processError(err, dispatch,
								() => _updateKendaranFailed(err),
								() => _updateKendaranFailed(err));
    Util.showToast("GAGAL " + err.cause.error, Util.LONG);
  });
}

export function runUpdateKendaraan(kendaraan, idKendaraan) {
  return (dispatch, getState) => {
    var accessToken = getState().getIn(['currentUser', 'accessToken']);
    _updateKendaraan(dispatch, accessToken, kendaraan);
  }
}

function _updateKendaraanStarted(data){
  return {
    type: types.UPDATE_KENDARAAN_STARTED,
    data: data,
  }
}

function _updateKendaranFailed(resp){
  return {
    type: types.UPDATE_KENDARAAN_FAILED,
    data: resp,
  }
}

function _updateKendaraanResult(data){
  return {
    type: types.UPDATE_KENDARAAN_RESULT,
    data: data,
  }
}

function _editKorban(dispatch, accessToken, korban){
  //console.log("Edit korban", korban);
  dispatch(_editKorbanStarted(korban));
  Util.showToast("Saving...", Util.LONG);
  LakaService.editKorban(accessToken, korban)
  .then((resp) => {
    if (resp.status === 'success'){
      dispatch(_editKorbanResult(korban));
      Util.showToast("Data korban berubah", Util.LONG);
      Actions.pop();
    } else {
      dispatch(_editKorbanFailed(resp));
      Util.showToast("GAGAL EDIT KORBAN " + resp.description, Util.LONG);
    }
  })
  .catch((err) => {
    //masuk kesini kalau error
    processError(err, dispatch,
                () => _editKorbanFailed(korban.idKorbanKecelakaan, err),
                () => _editKorbanFailed(korban.idKorbanKecelakaan, err));
    Util.showToast("GAGAL " + err.cause.error, Util.LONG);
  });
}

export function runEditKorban(korban, idKorban) {
  return (dispatch, getState) => {
    var accessToken = getState().getIn(['currentUser', 'accessToken']);
    _editKorban(dispatch, accessToken, korban)
  }
}

function _editKorbanStarted(data){
  return {
    type: types.EDIT_KORBAN_STARTED,
    data: data,
  }
}

function _editKorbanFailed(resp){
  return {
    type: types.EDIT_KORBAN_FAILED,
    data: resp,
  }
}

function _editKorbanResult(data){
  return {
    type: types.EDIT_KORBAN_RESULT,
    data: data,
  }
}

function _deleteKorban(dispatch, accessToken, idKecelakaan, idKorban){
  console.log("Delete korban", idKorban);
  dispatch(_deleteKorbanStarted(idKorban));
  Util.showToast("Deleting...", Util.LONG);
  LakaService.deleteKorban(accessToken, idKecelakaan, idKorban)
  .then((resp) => {
    if (resp.status === 'success'){
      dispatch(_deleteKorbanResult(idKorban));
      Util.showToast("Data korban dihapus", Util.LONG);
    } else {
      dispatch(_deleteKorbanFailed(resp));
      Util.showToast("GAGAL HAPUS KORBAN " + resp.description, Util.LONG);
    }
  })
  .catch((err) => {
    //masuk kesini kalau error
    processError(err, dispatch,
                () => _deleteKorbanFailed(korban.idKorbanKecelakaan, err),
                () => _deleteKorbanFailed(korban.idKorbanKecelakaan, err));
    Util.showToast("GAGAL " + err.cause.error, Util.LONG);
  });
}

export function runDeleteKorban(idKecelakaan, idKorban) {
  return (dispatch, getState) => {
    var accessToken = getState().getIn(['currentUser', 'accessToken']);
    _deleteKorban(dispatch, accessToken, idKecelakaan, idKorban)
  }
}

function _deleteKorbanStarted(data){
  return {
    type: types.DELETE_KORBAN_STARTED,
    data: data,
  }
}

function _deleteKorbanFailed(resp){
  return {
    type: types.DELETE_KORBAN_FAILED,
    data: resp,
  }
}

function _deleteKorbanResult(data){
  return {
    type: types.DELETE_KORBAN_RESULT,
    data: data,
  }
}

function _deleteKendaraan(dispatch, accessToken, idKendaraan){
  console.log("Delete Kendaraan", idKendaraan);
  dispatch(_deleteKendaraanStarted(idKendaraan));
  Util.showToast("Deleting...", Util.LONG);
  LakaService.deleteKendaraan(accessToken, idKendaraan)
  .then((resp) => {
      if (resp.status === 'success'){
        dispatch(_deleteKendaraanResult(idKendaraan));
        Util.showToast("Data Kendaraan dihapus", Util.LONG);
      } else {
        dispatch(_deleteKendaraanFailed(resp));
        Util.showToast("Data Kendaraaan gagal dihapus " + resp.description, Util.LONG);
      }
  })
  .catch((err) => {
    processError(err, dispatch,
								() => _deleteKendaraanFailed(err),
								() => _deleteKendaraanFailed(err));
    Util.showToast("GAGAL " + err.cause.error, Util.LONG);
  });
}

export function runDeleteKendaraan(idKendaraan) {
  return (dispatch, getState) => {
    var accessToken = getState().getIn(['currentUser', 'accessToken']);
    _deleteKendaraan(dispatch, accessToken, idKendaraan)
  }
}

function _deleteKendaraanStarted(data){
  return {
    type: types.DELETE_KENDARAAN_STARTED,
    data: data,
  }
}

function _deleteKendaraanFailed(resp){
  return {
    type: types.DELETE_KENDARAAN_FAILED,
    data: resp,
  }
}

function _deleteKendaraanResult(data){
  return {
    type: types.DELETE_KENDARAAN_RESULT,
    data: data,
  }
}
