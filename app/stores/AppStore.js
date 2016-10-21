// Redux stuff is optional
import Immutable from 'immutable';
import { Map, List, Iterable, fromJS } from 'immutable';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';
import immutablejs from 'redux-storage-decorator-immutablejs';
import merger from 'redux-storage-merger-immutablejs';
import filter from 'redux-storage-decorator-filter';
import { Actions } from 'react-native-router-flux';
import { Answers, Crashlytics, Fabric } from 'react-native-fabric';

import * as types from '../actions/ActionTypes';
import {DEBUG, STORAGE_KEY} from '../config/Config';

import rootReducer from '../reducers';

//state is initialize at each reducers

// Create Persistence Engine
const engine = createEngine(STORAGE_KEY);

//enable immutablejs for states
engine = immutablejs(engine, [
  ['currentUser'],
  ['availTasks'],
  ['myTasks'],
  ['status'],
  ['setting'],
]);

// enable only certain state is persisted
engine = filter(engine, [
    'currentUser',
    'availTasks',
    'myTasks',
    'setting',
//    ['availTasks','pendingTask'],
  ], [
    'currentRoute',
    ['currentUser', 'isLoading'],
    ['availTasks', 'isLoading'],
    ['availTasks', 'isLoadingTail'],
    ['myTasks', 'isLoading'],
    ['myTasks', 'isLoadingTail'],
  ]
);


const storageMiddleware = storage.createMiddleware(engine, [], [
  //types.AUTH_SET_TOKEN,
  //types.AUTH_REMOVE_TOKEN,
  //types.TASK_ACCEPT_RESULT,
  //types.APP_UPDATE_COMPLETED,
  //types.FETCH_MY_TASK_RESULT,
  //types.FETCH_MY_TASK_RESULT_MORE,
  types.PUSH_NOTIFICATION_SET_TOKEN,
  types.AUTH_SET_TOKEN,
  types.AUTH_REMOVE_TOKEN,
  types.TASK_ACCEPT_RESULT,
  types.FETCH_MY_TASK_CLEAR,
  types.STATE_FRESH_INSTALL_FALSE,
  types.STATE_FRESH_INSTALL_TRUE,
  types.STATE_SAVE
]);

//define fabric answer logger
const fabricLogger = store => next => action => {
  //console.log('dispatching', action);

  switch (action.type) {
    case Actions.BEFORE_ROUTE:
    case Actions.BEFORE_DISMISS:
    case Actions.BEFORE_POP:
    case Actions.BEFORE_FOCUS:
    case Actions.AFTER_POP:
    case Actions.AFTER_DISMISS:
    case Actions.AFTER_FOCUS:
    break;

    case Actions.AFTER_ROUTE:
      Answers.logContentView(action.route.title, 'Page', action.route.name, {username : store.getState().getIn(['currentUser','username'])});
    break;

    case types.AUTH_SET_TOKEN:
      Answers.logLogin(action.username, true);
      Crashlytics.setUserName(action.username);
      Crashlytics.setString('organization', 'Jasa Raharja');
    break;

    case types.AUTH_LOGIN_ERROR:
      Answers.logLogin(action.username, false);
    break;


    case types.LAKA_SEARCH_STARTED:
      Answers.logSearch("Laka: " + JSON.stringify(action.criteria));
    break;

    case types.SEARCH_SANTUNAN_STARTED:
      Answers.logSearch("Santunan: " + JSON.stringify(action.criteria));
    break;

    case types.APP_SET_DEVICE_INFO:
      Crashlytics.setString("appVersion", action.deviceInfo.appVersion);
      Crashlytics.setString("deviceUniqueId", action.deviceInfo.deviceUniqueId);
      Crashlytics.setString("deviceId", action.deviceInfo.deviceId);
      Crashlytics.setString("bundleId", action.deviceInfo.bundleId);
      Crashlytics.setString("deviceVersion", action.deviceInfo.deviceVersion);
      Crashlytics.setString("buildNumber", action.deviceInfo.buildNumber);
      Crashlytics.setString("deviceModel", action.deviceInfo.deviceModel);
      Crashlytics.setNumber('updateLastCheck', store.getState().getIn(['status','updateLastCheck']));
      Crashlytics.setString('codePushRelease', store.getState().getIn(['status','codePushRelease']));
      Crashlytics.setString('codePushVersion', store.getState().getIn(['status','codePushVersion']));
    break;

    default:
      Answers.logCustom("Action", {
        action: action.type,
        username: store.getState().getIn(['currentUser','username'])
      });
    break;
  }

  return next(action);
}



// Defing Middlewares
const middlewares = [thunk, storageMiddleware, fabricLogger];

if (DEBUG) {
  const stateTransformer = (state) => {
    if (Iterable.isIterable(state)) return state.toJS();
    else return state;
  };

  const logger = createLogger({
      level: 'info',
      duration: true,
      stateTransformer,
  });
  middlewares.push(logger);
}




// Create Redux Store
const store = applyMiddleware(...middlewares)(createStore)(rootReducer);
//var store = applyMiddleware(...middlewares)(createStore)(rootReducer, initialState);

// create loader function from storage
export const load = storage.createLoader(engine);

// Notice that our load function will return a promise that can also be used
// to respond to the restore event.


export default store;
