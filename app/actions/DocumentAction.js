import * as types from './ActionTypes';
import DocumentService from '../api/DocumentService';

import { executeWithRetry, processError } from '../api/Common';

import Util from '../api/Util';

function _fetchDocumentsStarted(kodeSurvey) {
    return {
        type: types.DOC_FETCH_STARTED,
        kodeSurvey,
    };
}

function _fetchDocumentsResult(kodeSurvey, docs) {
    return {
        type: types.DOC_FETCH_RESULT,
        kodeSurvey,
        docs,
    };
}

function _fetchDocumentsFailed(kodeSurvey, message) {
    return {
        type: types.DOC_FETCH_FAILED,
        kodeSurvey,
        message,
    };
}

function _addDocumentStarted(doc) {
    return {
        type: types.DOC_ADD_STARTED,
        doc,
    };
}

function _addDocumentResult(doc) {
    return {
        type: types.DOC_ADD_RESULT,
        doc,
    };
}

function _addDocumentFailed(doc, message) {
    return {
        type: types.DOC_ADD_FAILED,
        doc,
        message,
    };
}

function _addDocumentProgress(doc) {
    return {
        type: types.DOC_ADD_PROGRESS,
        doc,
    };
}

export function markDocument(doc) {
    return {
        type: types.DOC_MARK_TOGGLE,
        doc,
    };
}

function _deleteDocumentStarted(doc) {
    return {
        type: types.DOC_DELETE_STARTED,
        doc,
    };
}

function _deleteDocumentResult(doc) {
    return {
        type: types.DOC_DELETE_RESULT,
        doc,
    };
}

function _deleteDocumentFailed(doc, message) {
    return {
        type: types.DOC_DELETE_FAILED,
        doc,
        message,
    };
}


export function runFetchDocuments(kodeSurvey) {
    return (dispatch, getState) => {
        var accessToken = getState().getIn(['currentUser', 'accessToken']);
        var isLoading = getState().getIn(['documents', 'isLoading', kodeSurvey]);

        if (isLoading !== true) {
            console.log("_fetchDocumentsStarted Started");
            dispatch(_fetchDocumentsStarted(kodeSurvey));

            DocumentService.fetchSurveyDocuments(accessToken, kodeSurvey)
                .then((data) => {
                    console.log("Sending List Docs via Action");
                    dispatch(_fetchDocumentsResult(kodeSurvey,data));

                })
                .catch((err) => {
                  processError(err, dispatch,
                              () => _fetchDocumentsFailed(kodeSurvey, err),
                              () => _fetchDocumentsFailed(kodeSurvey, err));
                  Util.showToast("GAGAL " + err.cause.error, Util.LONG);

                });
        }
    };
}


export function runAddDocument(doc) {


    return (dispatch, getState) => {
        var accessToken = getState().getIn(['currentUser', 'accessToken']);

        console.log("runAddDocument Started");
        dispatch(_addDocumentStarted(doc));

        DocumentService.uploadDocument(accessToken, doc.localBerkas,
          (resp) => {
            //console.log("RESP: ", resp);
            // upload success fetch metadata
            doc.berkas = resp.data;
            doc.localBerkas.status = 'completed';
            doc.localBerkas.progress = 1;
            dispatch(_addDocumentResult(doc));

          },
          (err) => {
            //error during upload
            doc.localBerkas.status = 'failed';

            processError(err, dispatch,
                        () => _addDocumentFailed(doc, err),
                        () => _addDocumentFailed(doc, err));

            Util.showToast("GAGAL " + err.cause.error, Util.LONG);

          },
          (progress) => {
            // receive progress update
            // dispatch progress update
            console.log("Upload Progress: " + progress)
            doc.localBerkas.progress = progress;
            doc.localBerkas.status = 'uploading';

            dispatch (_addDocumentProgress(doc));
          });
    };
}


export function runDeleteDocument(doc) {
    return (dispatch, getState) => {
        var accessToken = getState().getIn(['currentUser', 'accessToken']);

        console.log("runDeleteDocument Started");
        //check if need delete remote
        dispatch(_deleteDocumentStarted(doc));

        if (doc.berkas) {
          console.log("delete local and remote doc ");
          //delete remote
          DocumentService.deleteDocument(accessToken, doc.berkas.idBerkas)
          .then((resp) => {
            dispatch(_deleteDocumentResult(doc));

          })
          .catch ((err) => {
            processError(err, dispatch,
                        () => _deleteDocumentFailed(doc, err),
                        () => _deleteDocumentFailed(doc, err));
            Util.showToast("GAGAL " + err.cause.error, Util.LONG);

          })
        } else {
          //delete localonly
          console.log("delete local doc only");
          dispatch(_deleteDocumentResult(doc));
        }
    };
}

export function runDeleteDocumentBulk(kodeSurvey) {
    return (dispatch, getState) => {
        var accessToken = getState().getIn(['currentUser', 'accessToken']);
        var docs = getState().getIn(['documents', 'dataSources', kodeSurvey]);
        console.log("Delete Bulk");

        docs.map((doc) => {
          console.log("Delete " + doc.get('mark'));
          if (doc.get('mark')) dispatch(runDeleteDocument(doc.toJS()));
        })
    };
}
