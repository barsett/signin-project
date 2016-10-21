'use-strict'

import * as storage from 'redux-storage';
import merger from 'redux-storage-merger-immutablejs';
import { combineReducers } from 'redux-immutable';

import navigationReducer from './NavigationReducer';
import availTaskReducer from './AvailTaskReducer';
import myTaskReducer from './MyTaskReducer';
import loginReducer from './LoginReducer';
import statusReducer from './StatusReducer';
import settingReducer from './SettingReducer';
import approvalReducer from './ApprovalReducer';
import documentReducer from './DocumentReducer';
import statusSurveyorReducer from './StatusSurveyorReducer.js';

import santunanSearchReducer from './SantunanSearchReducer.js';
import santunanDetailReducer from './SantunanDetailReducer.js';
import santunanHistoryReducer from './SantunanHistoryReducer.js';

import lakaSearchReducer from './LakaSearchReducer';
import lakaDetailReducer from './LakaDetailReducer';

import statisticReducer from './StatisticReducer';

const reducers = {
  currentUser: loginReducer,
  currentRoute: navigationReducer,
  availTasks: availTaskReducer,
  myTasks: myTaskReducer,
  status: statusReducer,
  setting: settingReducer,
  statusSurveyor: statusSurveyorReducer,
  approvals: approvalReducer,
  documents: documentReducer,

  santunanSearch: santunanSearchReducer,
  santunanDetail: santunanDetailReducer,
  santunanHistory: santunanHistoryReducer,

  lakaSearch: lakaSearchReducer,
  lakaDetail: lakaDetailReducer,

  statistic: statisticReducer,
};

const rootReducer = storage.reducer(combineReducers(reducers), merger);

export default rootReducer;
