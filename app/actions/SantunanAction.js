'use strict';
import * as types from './ActionTypes';
import SantunanService from '../api/SantunanService';
import ReferenceService from '../api/ReferenceService';

import { executeWithRetry, processError } from '../api/Common';

import Util from '../api/Util';

export function runSantunanSearch(criteria: Object) {
    return (dispatch, getState) => {
        var accessToken = getState().getIn(['currentUser', 'accessToken']);
        var isLoading = getState().getIn(['santunanSearch', 'isLoading']);

        var namaKantor = getState().getIn(['currentUser', 'namaKantor']);
        var LOKET_CABANG_JR = (namaKantor !== '') ? ReferenceService.findByKeyword('LOKET_CABANG_JR', namaKantor) : [];
        var kodeKantor = LOKET_CABANG_JR[0];
        var kodeWilayah = (kodeKantor !== undefined) ? (kodeKantor.id).substr(0,2) : '';
        console.log("Kode Wilayah Current User: ", kodeWilayah);

        if (isLoading !== true) {
            console.log("_searchSantunanStarted()");
            dispatch(_searchSantunanStarted(criteria));

            SantunanService.searchSantunan(accessToken, criteria, kodeWilayah)
                .then((data) => {
                    console.log("_searchSantunanResultReceived()");
                    dispatch(_searchSantunanResultReceived(criteria,data));

                })
                .catch((err) => {
                  processError(err, dispatch,
                              () => _searchSantunanFailed(criteria, err),
                              () => _searchSantunanFailed(criteria, err));
                  Util.showToast("PENCARIAN GAGAL" + err.cause.error, Util.LONG);

                });
        }
    };
}

//List of Action Creator Function for Santunan Search
function _searchSantunanStarted(criteria) {
	return {
		type: types.SEARCH_SANTUNAN_STARTED,
		criteria,
	};
}

function _searchSantunanFailed (criteria, message) {
	return {
		type: types.SEARCH_SANTUNAN_FAILED,
		criteria,
    message,
	};
}

function _searchSantunanResultReceived(criteria, result) {
	return {
		type: types.SEARCH_SANTUNAN_RESULT,
		criteria,
    result,
	};
}

export function runSantunanDetail(noBerkas) {
    return (dispatch, getState) => {
        var accessToken = getState().getIn(['currentUser', 'accessToken']);
        var isLoading = getState().getIn(['santunanDetail', 'isLoading']);

        if (isLoading !== true) {
            console.log("_fetchSantunanDetailStarted()");
            dispatch(_fetchSantunanDetailStarted(noBerkas));

            SantunanService.fetchSantunanDetail(accessToken, noBerkas)
                .then((data) => {
                    console.log("_fetchSantunanDetailResultReceived()");
                    dispatch(_fetchSantunanDetailResultReceived(data));

                })
                .catch((err) => {
                  processError(err, dispatch,
                              () => _fetchSantunanDetailFailed(err),
                              () => _fetchSantunanDetailFailed(err));
                  Util.showToast("PENCARIAN SANTUNAN DETAIL GAGAL" + err.cause.error, Util.LONG);

                });
        }
    };
}

//List of Action Creator Function for Santunan Detail
function _fetchSantunanDetailStarted(noBerkas) {
	return {
		type: types.FETCH_SANTUNAN_DETAIL_STARTED,
		noBerkas,
	};
}

function _fetchSantunanDetailFailed (message) {
	return {
		type: types.FETCH_SANTUNAN_DETAIL_FAILED,
		message,
	};
}

function _fetchSantunanDetailResultReceived(result) {
	return {
		type: types.FETCH_SANTUNAN_DETAIL_RESULT,
		result
	};
}

export function runSantunanHistory(noBerkas) {
    return (dispatch, getState) => {
        var accessToken = getState().getIn(['currentUser', 'accessToken']);
        var isLoading = getState().getIn(['santunanHistory', 'isLoading']);

        if (isLoading !== true) {
            console.log("_fetchSantunanHistoryStarted()");
            dispatch(_fetchSantunanHistoryStarted(noBerkas));

            SantunanService.fetchSantunanHistory(accessToken, noBerkas)
                .then((data) => {
                    console.log("_fetchSantunanHistoryResultReceived()");
                    dispatch(_fetchSantunanHistoryResultReceived(data));

                })
                .catch((err) => {
                  processError(err, dispatch,
                              () => _fetchSantunanHistoryFailed(err),
                              () => _fetchSantunanHistoryFailed(err));
                  Util.showToast("PENCARIAN SANTUNAN HISTORY GAGAL" + err.cause.error, Util.LONG);

                });
        }
    };
}

//List of Action Creator Function for Santunan History
function _fetchSantunanHistoryStarted(noBerkas) {
	return {
		type: types.FETCH_SANTUNAN_HISTORY_STARTED,
		noBerkas,
	};
}

function _fetchSantunanHistoryFailed (message) {
	return {
		type: types.FETCH_SANTUNAN_HISTORY_FAILED,
		message,
	};
}

function _fetchSantunanHistoryResultReceived(result) {
	return {
		type: types.FETCH_SANTUNAN_HISTORY_RESULT,
		result,
	};
}
