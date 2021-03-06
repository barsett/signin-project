'use strict';

// may use keymirror for more efficient writing
// var keyMirror = require('keymirror');
//
// module.exports = keyMirror({
//   APP_LAUNCHED: null,
//   LOGIN_USER: null,
//   LOGOUT_REQUESTED: null,
//   RELOAD_PATH: null,
//   NETWORK_ACTIVITY: null,
//   LAUNCH_ROUTE_PATH: null,
//   NETWORK_ACTIVITY: null,
//   NAVBAR_UPDATE: null,
//   POST_LIST_UPDATED: null,
//   POST_ADDED: null,
//   FOLLOW_LIST_UPDATED: null,
//   TEST_COMPONENT_ROUTE: null,
//   DEBUG_CURRENT_ROUTE_PATH_KEY: null,
// });

// --- availTaskReducer Group ---
export const FETCH_AVAIL_TASK_STARTED = 'FETCH_AVAIL_TASK_STARTED';
export const FETCH_AVAIL_TASK_RESULT = 'FETCH_AVAIL_TASK_RESULT';
export const FETCH_AVAIL_TASK_RESULT_MORE = 'FETCH_AVAIL_TASK_RESULT_MORE';
export const FETCH_AVAIL_TASK_FAILED = 'FETCH_AVAIL_TASK_FAILED';
export const FETCH_AVAIL_TASK_CLEAR = 'FETCH_AVAIL_TASK_CLEAR';

// --- MyTaskReducer Group ---
export const FETCH_MY_TASK_STARTED = 'FETCH_MY_TASK_STARTED';
export const FETCH_MY_TASK_RESULT = 'FETCH_MY_TASK_RESULT';
export const FETCH_MY_TASK_RESULT_MORE = 'FETCH_MY_TASK_RESULT_MORE';
export const FETCH_MY_TASK_FAILED = 'FETCH_MY_TASK_FAILED';
export const FETCH_MY_TASK_CLEAR = 'FETCH_MY_TASK_CLEAR';
export const MY_TASK_ON_FOCUS = 'MY_TASK_ON_FOCUS';



// --- TaskOpsReducer Group ---
export const TASK_ACCEPT_STARTED = 'TASK_ACCEPT_STARTED';
export const TASK_ACCEPT_RESULT = 'TASK_ACCEPT_RESULT';
export const TASK_ACCEPT_FAILED = 'TASK_ACCEPT_FAILED';
export const TASK_ACCEPT_PENDING = 'TASK_ACCEPT_PENDING';
export const TASK_ACCEPT_PENDING_CLEAR = 'TASK_ACCEPT_PENDING_CLEAR';

export const TASK_UPDATE_STARTED = 'TASK_UPDATE_STARTED';
export const TASK_UPDATE_RESULT = 'TASK_UPDATE_RESULT';
export const TASK_UPDATE_FAILED = 'TASK_UPDATE_FAILED';
export const TASK_UPDATE_PENDING = 'TASK_UPDATE_PENDING';
export const TASK_UPDATE_PENDING_CLEAR = 'TASK_UPDATE_PENDING_CLEAR';

export const TASK_SET_KORBAN = 'TASK_SET_KORBAN';
export const TASK_CLEAR_KORBAN = 'TASK_CLEAR_KORBAN';

export const TASK_MAP_LAKA_STARTED = 'TASK_MAP_LAKA_STARTED';
export const TASK_MAP_LAKA_RESULT = 'TASK_MAP_LAKA_RESULT';
export const TASK_MAP_LAKA_FAILED = 'TASK_MAP_LAKA_FAILED';
export const TASK_UNMAP_LAKA_STARTED = 'TASK_UNMAP_LAKA_STARTED';
export const TASK_UNMAP_LAKA_RESULT = 'TASK_UNMAP_LAKA_RESULT';
export const TASK_UNMAP_LAKA_FAILED = 'TASK_UNMAP_LAKA_FAILED';


// --- StatusSurveyorReducer Group ---
export const FETCH_STATUS_SURVEYOR_STARTED = 'FETCH_STATUS_SURVEYOR_STARTED';
export const FETCH_STATUS_SURVEYOR_RESULT = 'FETCH_STATUS_SURVEYOR_RESULT';
export const FETCH_STATUS_SURVEYOR_RESULT_MORE = 'FETCH_STATUS_SURVEYOR_RESULT_MORE';
export const FETCH_STATUS_SURVEYOR_FAILED = 'FETCH_STATUS_SURVEYOR_FAILED';
export const FETCH_STATUS_SURVEYOR_CLEAR = 'FETCH_STATUS_SURVEYOR_CLEAR';

// --- ApprovalReducer Group ---
export const FETCH_APPROVAL_STARTED = 'FETCH_APPROVAL_STARTED';
export const FETCH_APPROVAL_FAILED = 'FETCH_APPROVAL_FAILED';
export const FETCH_APPROVAL_RESULT = 'FETCH_APPROVAL_RESULT';
export const FETCH_APPROVAL_RESULT_MORE = 'FETCH_APPROVAL_RESULT_MORE';
export const FETCH_APPROVAL_CLEAR = 'FETCH_APPROVAL_CLEAR';
export const APPROVE_AUTHORIZATION_STARTED = 'APPROVE_AUTHORIZATION_STARTED';
export const APPROVE_AUTHORIZATION_FAILED = 'APPROVE_AUTHORIZATION_FAILED';
export const APPROVE_AUTHORIZATION_RESULT = 'APPROVE_AUTHORIZATION_RESULT';

// --- SantunanDetailReducer Group ---
export const FETCH_SANTUNAN_DETAIL_STARTED = 'FETCH_SANTUNAN_DETAIL_STARTED';
export const FETCH_SANTUNAN_DETAIL_RESULT = 'FETCH_SANTUNAN_DETAIL_RESULT';
export const FETCH_SANTUNAN_DETAIL_FAILED = 'FETCH_SANTUNAN_DETAIL_FAILED';
export const FETCH_SANTUNAN_DETAIL_CLEAR = 'FETCH_SANTUNAN_DETAIL_CLEAR';

// --- SantunanDetailReducer Group ---
export const FETCH_SANTUNAN_HISTORY_STARTED = 'FETCH_SANTUNAN_HISTORY_STARTED';
export const FETCH_SANTUNAN_HISTORY_RESULT = 'FETCH_SANTUNAN_HISTORY_RESULT';
export const FETCH_SANTUNAN_HISTORY_FAILED = 'FETCH_SANTUNAN_HISTORY_FAILED';
export const FETCH_SANTUNAN_HISTORY_CLEAR = 'FETCH_SANTUNAN_HISTORY_CLEAR';

// --- SantunanSearchReducer Group ---
export const SEARCH_SANTUNAN_STARTED = 'SEARCH_SANTUNAN_STARTED';
export const SEARCH_SANTUNAN_RESULT = 'SEARCH_SANTUNAN_RESULT';
export const SEARCH_SANTUNAN_FAILED = 'SEARCH_SANTUNAN_FAILED';
export const SEARCH_SANTUNAN_CLEAR = 'SEARCH_SANTUNAN_CLEAR';


// --- DocumentReducer Group ---
export const DOC_FETCH_STARTED = 'DOC_FETCH_STARTED';
export const DOC_FETCH_RESULT = 'DOC_FETCH_RESULT';
export const DOC_FETCH_FAILED = 'DOC_FETCH_FAILED';
export const DOC_FETCH_CLEAR = 'DOC_FETCH_CLEAR';

export const DOC_MARK_TOGGLE = 'DOC_MARK_TOGGLE';
export const DOC_ADD_STARTED = 'DOC_ADD_STARTED';
export const DOC_ADD_RESULT = 'DOC_ADD_RESULT';
export const DOC_ADD_PROGRESS = 'DOC_ADD_PROGRESS';
export const DOC_ADD_FAILED = 'DOC_ADD_FAILED';

export const DOC_DELETE_STARTED = 'DOC_DELETE_STARTED';
export const DOC_DELETE_RESULT = 'DOC_DELETE_RESULT';
export const DOC_DELETE_FAILED = 'DOC_DELETE_FAILED';

export const DOC_UPDATE_STARTED = 'DOC_UPDATE_STARTED';
export const DOC_UPDATE_RESULT = 'DOC_UPDATE_RESULT';
export const DOC_UPDATE_FAILED = 'DOC_UPDATE_FAILED';

// Laka Group
export const LAKA_SEARCH_STARTED = 'LAKA_SEARCH_STARTED';
export const LAKA_SEARCH_RESULT  = 'LAKA_SEARCH_RESULT';
export const LAKA_SEARCH_FAILED  = 'LAKA_SEARCH_FAILED';

export const LAKA_DETAIL_STARTED = 'LAKA_DETAIL_STARTED';
export const LAKA_DETAIL_RESULT  = 'LAKA_DETAIL_RESULT';
export const LAKA_DETAIL_FAILED  = 'LAKA_DETAIL_FAILED';

export const LAKA_LIST_KORBAN_STARTED = 'LAKA_LIST_KORBAN_STARTED';
export const LAKA_LIST_KORBAN_RESULT  = 'LAKA_LIST_KORBAN_RESULT';
export const LAKA_LIST_KORBAN_FAILED  = 'LAKA_LIST_KORBAN_FAILED';

export const LAKA_LIST_KENDARAAN_STARTED = 'LAKA_LIST_KENDARAAN_STARTED';
export const LAKA_LIST_KENDARAAN_RESULT  = 'LAKA_LIST_KENDARAAN_RESULT';
export const LAKA_LIST_KENDARAAN_FAILED  = 'LAKA_LIST_KENDARAAN_FAILED';

export const UPDATE_LAKA_STARTED = 'UPDATE_LAKA_STARTED';
export const UPDATE_LAKA_RESULT = 'UPDATE_LAKA_RESULT';
export const UPDATE_LAKA_FAILED = 'UPDATE_LAKA_FAILED';

export const ADD_KENDARAAN_STARTED = 'ADD_KENDARAAN_STARTED';
export const ADD_KENDARAAN_RESULT = 'ADD_KENDARAAN_RESULT';
export const ADD_KENDARAAN_FAILED = 'ADD_KENDARAAN_FAILED';

export const UPDATE_KENDARAAN_STARTED = 'UPDATE_KENDARAAN_STARTED';
export const UPDATE_KENDARAAN_RESULT = 'UPDATE_KENDARAAN_RESULT';
export const UPDATE_KENDARAAN_FAILED = 'UPDATE_KENDARAAN_FAILED';

export const DELETE_KENDARAAN_STARTED = 'DELETE_KENDARAAN_STARTED';
export const DELETE_KENDARAAN_RESULT = 'DELETE_KENDARAAN_RESULT';
export const DELETE_KENDARAAN_FAILED = 'DELETE_KENDARAAN_FAILED';

export const ADD_KORBAN_STARTED = 'ADD_KORBAN_STARTED';
export const ADD_KORBAN_RESULT = 'ADD_KORBAN_RESULT';
export const ADD_KORBAN_FAILED = 'ADD_KORBAN_FAILED';

export const EDIT_KORBAN_STARTED = 'EDIT_KORBAN_STARTED';
export const EDIT_KORBAN_RESULT = 'EDIT_KORBAN_RESULT';
export const EDIT_KORBAN_FAILED = 'EDIT_KORBAN_FAILED';

export const DELETE_KORBAN_STARTED = 'DELETE_KORBAN_STARTED';
export const DELETE_KORBAN_RESULT = 'DELETE_KORBAN_RESULT';
export const DELETE_KORBAN_FAILED = 'DELETE_KORBAN_FAILED';

// -- Other Reducers ---
// Authentication ACTION Symbol(`auth.set_token`);
export const AUTH_LOGIN_ERROR = 'AUTH_LOGIN_ERROR';
export const AUTH_SET_TOKEN = 'AUTH_SET_TOKEN';
export const AUTH_SET_INFO = 'AUTH_SET_INFO';
export const AUTH_REMOVE_TOKEN = 'AUTH_REMOVE_TOKEN';
export const AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED';
export const AUTH_TOKEN_VERIFIED = 'AUTH_TOKEN_VERIFIED';
export const AUTH_TOKEN_FAILED = 'AUTH_TOKEN_FAILED';
export const PUSH_NOTIFICATION_SET_TOKEN = 'PUSH_NOTIFICATION_SET_TOKEN';


export const STATUS_NETWORK_UPDATE = 'STATUS_NETWORK_UPDATE';

export const APP_UPDATE_STARTED = 'APP_UPDATE_STARTED';
export const APP_UPDATE_IN_PROGRESS = 'APP_UPDATE_IN_PROGRESS';
export const APP_UPDATE_COMPLETED = 'APP_UPDATE_COMPLETED';
export const APP_UPDATE_FAILED = 'APP_UPDATE_FAILED';

export const REF_UPDATE_STARTED = 'REF_DOWNLOAD_STARTED';
export const REF_UPDATE_PROGRESS = 'REF_DOWNLOAD_PROGRESS';
export const REF_UPDATE_RESULT = 'REF_DOWNLOAD_RESULT';
export const REF_UPDATE_FAILED ='REF_DOWNLOAD_FAILED';


export const APP_SET_DEVICE_INFO = 'APP_SET_DEVICE_INFO';

export const SYNC_PENDING_STARTED = 'SYNC_PENDING_STARTED';
export const SYNC_PENDING_COMPLETED = 'SYNC_PENDING_COMPLETED';
export const SYNC_PENDING_ERROR = 'SYNC_PENDING_ERROR';

export const STATE_SAVE = 'STATE_SAVE';
export const STATE_FRESH_INSTALL_FALSE = 'STATE_FRESH_INSTALL_FALSE';
export const STATE_FRESH_INSTALL_TRUE  = 'STATE_FRESH_INSTALL_TRUE';
export const STORAGE_LOADED = 'STORAGE_LOADED';

export const GPS_LOCATION_UPDATE_STARTED = 'GPS_LOCATION_UPDATE_STARTED';
export const GPS_LOCATION_UPDATE_RESULT = 'GPS_LOCATION_UPDATE_RESULT';
export const GPS_LOCATION_UPDATE_FAILED = 'GPS_LOCATION_UPDATE_FAILED';

export const STAT_GET_STARTED = 'STAT_GET_STARTED';
export const STAT_GET_RESULT = 'STAT_GET_RESULT';
export const STAT_GET_FAILED = 'STAT_GET_FAILED';

// --- Setting Reducer ---
export const UPDATE_BACKDATED_DATE = 'UPDATE_BACKEND_DATE';
export const UPDATE_GPS_MODE = 'UPDATE_GPS_MODE';

// -- Obsoletes
// export const SEARCH_TASK_STARTED = 'SEARCH_TASK_STARTED';
// export const SEARCH_TASK_RESULT = 'SEARCH_TASK_RESULT';
// export const MY_TASK_RESULT = 'MY_TASK_RESULT';
// export const SEARCH_TASK_FAILED = 'SEARCH_TASK_FAILED';
// export const MORE_SEARCH_TASK_RESULT = 'MORE_SEARCH_TASK_RESULT';
// export const NEW_SEARCH_TASK = 'REFRESH_SEARCH_TASK'
//
// export const TASK_ACCEPT = 'TASK_ACCEPT';
//
//
// export const TASK_REJECT = 'TASK_REJECT';
// export const TASK_REJECT_STARTED = 'TASK_REJECT_STARTED';
// export const TASK_REJECT_RESULT = 'TASK_REJECT_RESULT';
// export const TASK_REJECT_FAILED = 'TASK_REJECT_FAILED';
//
// export const TASK_VIEW_DETAIL = 'TASK_VIEW_DETAIL';
// export const TASK_EDIT = 'TASK_EDIT';
// export const TASK_SAVE = 'TASK_SAVE';
//
// export const TASK_SUBMIT = 'TASK_SUBMIT';
// export const TASK_SUBMIT_STARTED = 'TASK_SUBMIT_STARTED';
// export const TASK_SUBMIT_RESULT = 'TASK_SUBMIT_RESULT';
// export const TASK_SUBMIT_FAILED = 'TASK_SUBMIT_FAILED';
