'use-strict'


import CodePush from "react-native-code-push";
import * as types from './ActionTypes';
import { LIMIT_CODEPUSH_CHECK, DEBUG, DEBUG_CODEPUSH, DISABLE_CODEPUSH } from "../config/Config";
import { setFreshInstall } from './StatusAction';


export function syncStarted() {
    return {
        type: types.APP_UPDATE_STARTED,
    };
}

export function syncProgress(msg) {
    return {
        type: types.APP_UPDATE_IN_PROGRESS,
        msg
    };
}

export function syncCompleted(msg) {
    return {
        type: types.APP_UPDATE_COMPLETED,
        msg
    };
}

export function syncFailed(msg) {
    return {
        type: types.APP_UPDATE_FAILED,
        msg
    };
}

export function checkUpdate() {
    return function(dispatch, getState) {
        //get current update:
        //if codepush is disabled then bypass
        if (DISABLE_CODEPUSH) {
          dispatch(syncCompleted("Codepush is disabled."));
          return;
        }

        console.log("checkUpdate()");
        dispatch(syncStarted());

        let shouldCheckUpdate = true;
        if (LIMIT_CODEPUSH_CHECK) {
          let lastUpdate = getState().getIn(['status', 'updateLastCheck']);
          let curDate = new Date().getTime();
          shouldCheckUpdate = curDate > lastUpdate;
        }
        console.log ('Checking Last Update is required: ' + shouldCheckUpdate);

        // if debug in device code push will not be checked unless DEBUG_CODEPUSH=true
        // code push only active when deployed to device via apk from bitrise
        if ((!DEBUG && shouldCheckUpdate) || (DEBUG && DEBUG_CODEPUSH)) {
          console.log("Sync Started");

            // todo add check only sync once a day
            //installMode: CodePush.InstallMode.ON_NEXT_RESUME
            //installMode: codePush.InstallMode.IMMEDIATE
            CodePush.sync({
                    updateDialog: false,
                    installMode: CodePush.InstallMode.IMMEDIATE
                },
                (syncStatus) => {
                    switch (syncStatus) {
                        case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                            dispatch(syncProgress("Checking for update."));
                            break;
                        case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                            dispatch(syncProgress("Downloading package."));
                            break;
                        case CodePush.SyncStatus.AWAITING_USER_ACTION:
                            dispatch(syncProgress("Awaiting user action."));
                            break;
                        case CodePush.SyncStatus.INSTALLING_UPDATE:
                            dispatch(syncProgress("Installing update."));
                            break;
                        case CodePush.SyncStatus.UP_TO_DATE:
                            dispatch(syncCompleted("App is uptodate."));
                            break;
                        case CodePush.SyncStatus.UPDATE_IGNORED:
                            dispatch(syncCompleted("Update cancelled by user."));
                            break;
                        case CodePush.SyncStatus.UPDATE_INSTALLED:
                            dispatch(syncCompleted("Update installed and will be run when the app next resumes."));
                            dispatch(setFreshInstall());
                            break;
                        case CodePush.SyncStatus.UNKNOWN_ERROR:
                            dispatch(syncFailed("An unknown error occurred."));
                            break;
                    }
                },
                (progress) => {
                    console.log("Sync Progress" + progress);
                }
            );
        } else {
          dispatch(syncCompleted("No update is available."));
        }
    }
}
