'use strict';

import React, { Component } from 'react';
import { AppRegistry, AppState, Navigator, DeviceEventEmitter, BackAndroid, StyleSheet,Text,View, Platform, NetInfo } from 'react-native';
import PushNotification from 'react-native-push-notification';

import RNRF, {
  Route,
  Scene,
  TabBar,
  Animations,
  Actions,
  Schema,
} from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info';
import CodePush from "react-native-code-push";
import BackgroundTimer from 'react-native-background-timer';

// component for Auth Check
import { UserAuthWrapper } from './components/AuthWrapper';

// Local Dependency
import SideDrawer from './components/SideDrawer';
import styles from './styles/style';
import Error from './components/Error';
import Util from './api/Util';
import debug from './debug';

// Screens
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import OtorisasiScreen from './screens/OtorisasiScreen';
import OtorisasiDetailScreen from './screens/OtorisasiDetailScreen';
import TaskScreen from './screens/TaskScreen';
import KunjunganEditScreen from './screens/KunjunganEditScreen';
import KunjunganDetailScreen from './screens/KunjunganDetailScreen';
import RSLocationScreen from './screens/RSLocationScreen';
import LakaSearchScreen from './screens/LakaSearchScreen';
import LakaScreen from './screens/LakaScreen';
import SantunanSearchScreen from './screens/SantunanSearchScreen';
import SantunanDetailScreen from './screens/SantunanDetailScreen';
import LakaEditScreen from './screens/LakaEditScreen';
import KendaraanEditScreen from './screens/KendaraanEditScreen';
import KorbanEditScreen from './screens/KorbanEditScreen';
import DocumentListScreen from './screens/DocumentListScreen';
import DocumentScreen from './screens/DocumentScreen';
import SettingScreen from './screens/SettingScreen';
import IconDescriptionScreen from './screens/IconDescriptionScreen';
import AboutScreen from './screens/AboutScreen';
import OverviewScreen from './screens/OverviewScreen';
// Import Screen for StatusSurveyorScreen class
import StatusSurveyorScreen from './screens/StatusSurveyorScreen';
import OnprogressScreen from './screens/OnprogressScreen';

// need to clean up
import MapScreen from './screens/MapScreen';
import CameraScreen from './screens/CameraScreen';
import ErrorPopUp from './screens/ErrorPopUp';
import SortModal from './components/SortModal';
import FilterModal from './components/FilterModal';

import i18n from './i18n.js';
import store, {load} from './stores/AppStore';


// import Actions
import { removeToken, checkToken } from './actions/AuthAction'
import { updateNetworkStatus, setDeviceInfo, saveState, storageLoaded, updateLocation } from './actions/StatusAction'
import { syncPending, startBackgroundTimer, stopBackgroundTimer } from './actions/SyncAction'
import pushOption from './config/PushNotification';

console.log("Language", i18n.getLanguage() );
console.log("Setting language to id", i18n.setLanguage('id'));
console.log('Dev Mode', __DEV__);

import { Provider, connect } from 'react-redux';
const Router = connect()(RNRF.Router);



// listen for event
DeviceEventEmitter.addListener('backgroundTimer', () => {
    // this will be executed every 1 minute based on BG_DELAY settings
    // also when application is running in the background
    console.log('tic');
    store.dispatch(syncPending());

});


const hideNavBar = Platform.OS === 'android'
//const paddingTop = Platform.OS === 'android' ? {paddingTop: 0} : {paddingTop : Navigator.NavigationBar.Styles.General.NavBarHeight};
const paddingTop = Platform.OS === 'android' ? 0 : 64;



if (Platform.OS === 'android'){
  BackAndroid.addEventListener('hardwareBackPress', () => {
    try {
      console.log(Actions.currentRouter.currentRoute.name);
      if (Actions.currentRouter.currentRoute.name === 'splash') {
        return true;
      }


      if (Actions.pop() != null) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  });
}

//Initialize AuthWrapper. Just wrap any component that is secure with UserIsAuthenticated
// eg. UserIsAuthenticated(HomeScreen)
const UserIsAuthenticated = UserAuthWrapper({
  authSelector: state => state.get('currentUser').toJS(),
  redirectAction: removeToken,
  failureRedirectPath: 'splash',
  allowRedirectBack: false,
  wrapperDisplayName: 'UserIsAuthenticated',
  predicate: x => (x.expiresOn > new Date().getTime()),
})



export default class JasaRaharjaMobileApp extends Component {
  componentDidMount() {
    console.log("App is Mounted");

    load(store)
        .then((newState) => {
          console.log('Loaded state');
          store.dispatch(storageLoaded());
          // listen to app change state
          AppState.addEventListener('change', this._handleAppStateChange);

          console.log("PUSH", pushOption);
          PushNotification.configure(pushOption);

          NetInfo.isConnected.fetch().done((isConnected) => {
            console.log('Network is ' + (isConnected ? 'online' : 'offline'));
            store.dispatch(updateNetworkStatus(isConnected));
          });

          //listen to network status change
          NetInfo.isConnected.addEventListener(
              'change',
              this._handleConnectionInfoChange
          );


          // get device info
          store.dispatch(setDeviceInfo({
            deviceUniqueId: DeviceInfo.getUniqueID(),
            deviceId: DeviceInfo.getDeviceId(),
            deviceModel: DeviceInfo.getModel(),
            deviceVersion: DeviceInfo.getSystemVersion(),
            bundleId: DeviceInfo.getBundleId(),
            appVersion: DeviceInfo.getReadableVersion(),
            buildNumber: DeviceInfo.getBuildNumber()+'',
            locale: DeviceInfo.getDeviceLocale(),
            deviceOS: Platform.OS,
          }));

          // get code push version
          CodePush.getUpdateMetadata().then((update) => {
              if (update) {
                console.log("CodePush Label:", update.label);
                store.dispatch(setDeviceInfo({
                  codePushRelease: update.label,
                  codePushVersion: update.appVersion,
                }));
              }
          });

          // get initial location when app start
          // store.dispatch(updateLocation());


        })
        .catch((err) => console.log('Failed to load previous state', err));





  }

  componentWillUnmount() {
    console.log("App is Unmounted");
    NetInfo.isConnected.removeEventListener(
        'change',
        this._handleConnectionInfoChange
    );

  }

  _handleAppStateChange(appState) {
      console.log("AppState", appState);
      //Util.showToast('Changing App State to ' + appState , Util.SHORT);

      if (appState === 'background'){
        //trigger state persistence
        store.dispatch(saveState());
        store.dispatch(startBackgroundTimer());

      } else if (appState === 'active'){
        store.dispatch(stopBackgroundTimer());
        store.dispatch(updateLocation())
        .catch((err) => {
          console.log("Error getting Location", err);
        });

        // get state to check if logged in
        if(store.getState().getIn(['currentUser','isLoggedIn'])){
          store.dispatch(checkToken());
        }

      }
  }

  _handleConnectionInfoChange(isConnected) {
    console.log("Connection", isConnected);
    store.dispatch(updateNetworkStatus(isConnected));
    if (isConnected){
      Util.showToast('You are online', Util.SHORT);
      store.dispatch(syncPending());

    } else {
      Util.showToast('You are offline', Util.SHORT);
    }


  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Schema
            name='boot'
            //sceneConfig={Navigator.SceneConfigs.FadeAndroid}
            sceneConfig={Navigator.SceneConfigs.FloatFromBottom}
            hideNavBar={true}
          />
          <Schema
            name='intro'
            sceneConfig={Navigator.SceneConfigs.FloatFromRight}
            hideNavBar={true}
            //type='replace' // to fix error when relogin
          />
          <Schema
            name='main'
            sceneConfig={Navigator.SceneConfigs.FloatFromRight}
            hideNavBar={hideNavBar}
            type='reset'
          />
          <Schema
            name='sub'
            sceneConfig={Navigator.SceneConfigs.FloatFromRight}
            hideNavBar={hideNavBar}
          />
          <Schema name="modal" type="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom} hideNavBar={true}/>

        <Route name="error" schema="modal" component={ErrorPopUp}/>

        <Route name='splash' component={SplashScreen} schema='boot' initial={true}/>
        {/*<Route name='auth'   component={LoginScreen}  schema='intro' type="replace"/>*/}

        <Route name='overview' component={OverviewScreen} schema='intro' />

        <Route name='main' title={i18n.home} hideNavBar={true} type='reset' sceneConfig={Navigator.SceneConfigs.FloatFromRight}>
            <SideDrawer>
              <Router
                sceneStyle={localStyles.routerScene}
                navigationBarStyle={localStyles.navigationBar}
                titleStyle={localStyles.navigationTitle}
                barButtonIconStyle={localStyles.barButtonIcon}
                barButtonTextStyle={localStyles.barButtonText}
                >
                <Route name='home' component={UserIsAuthenticated(HomeScreen)} schema='main' title={i18n.home} />
                <Route name='task' component={UserIsAuthenticated(TaskScreen)} schema='main' title={i18n.taskList} />
                <Route name='taskEdit' component={UserIsAuthenticated(KunjunganEditScreen)} schema='sub' title={i18n.taskEdit} />
                <Route name='taskDetail' component={UserIsAuthenticated(KunjunganDetailScreen)} schema='sub' title={i18n.taskDetail} />
                <Route name='viewRSLocation' component={UserIsAuthenticated(RSLocationScreen)} schema='sub' title={i18n.rsLocation} />
                <Route name='documentList' component={UserIsAuthenticated(DocumentListScreen)} schema='sub' title={i18n.documentList} />
                <Route name='viewDocument' component={UserIsAuthenticated(DocumentScreen)} schema='sub' title={i18n.document} />
                <Route name='lakaSubSearch' component={UserIsAuthenticated(LakaSearchScreen)} schema='sub' title={i18n.lakaSearch} />
                <Route name='lakaSearch' component={UserIsAuthenticated(LakaSearchScreen)} schema='main' title={i18n.lakaSearch} />
                <Route name='lakaDetail' component={UserIsAuthenticated(LakaScreen)} schema='sub' title={i18n.lakaDetail} />
                <Route name='santunanSearch' component={UserIsAuthenticated(SantunanSearchScreen)} schema='main' title={i18n.santunanSearch} />
                <Route name='santunanDetail' component={UserIsAuthenticated(SantunanDetailScreen)} schema='sub' title={i18n.santunanDetail} />
                <Route name='lakaEdit' component={UserIsAuthenticated(LakaEditScreen)} schema='sub' title={i18n.lakaEdit} />
                <Route name='kendaraanEdit' component={UserIsAuthenticated(KendaraanEditScreen)} schema='sub' title={i18n.kendaraanEdit} />
                <Route name='korbanEdit' component={UserIsAuthenticated(KorbanEditScreen)} schema='sub' title={i18n.korbanEdit} />
                <Route name='approvalList' component={UserIsAuthenticated(OtorisasiScreen)} schema='main' title={i18n.approvalList} />
                <Route name='detailOtorisasi' component={UserIsAuthenticated(OtorisasiDetailScreen)} schema='sub' title={i18n.detailOtorisasi} />
                <Route name='statusSurveyor' component={UserIsAuthenticated(StatusSurveyorScreen)} schema='main' title={i18n.statusSurveyor} />
                <Route name='setting' component={UserIsAuthenticated(SettingScreen)} schema='main' title={i18n.setting} />
                <Route name='iconDescription' component={UserIsAuthenticated(IconDescriptionScreen)} schema='sub' title={i18n.iconDescription} />
                <Route name='about' component={UserIsAuthenticated(AboutScreen)} schema='sub' title={i18n.about} />
                <Route name='onProgress' component={UserIsAuthenticated(OnprogressScreen)} schema='main' title={i18n.onProgress} />

              </Router>
            </SideDrawer>
        </Route>

        </Router>
      </Provider>
    );
  }
}

const localStyles = StyleSheet.create({
  //Routing Styles
  routerScene: {
      paddingTop: paddingTop,
  },
  nestedRouterScene: {
      paddingTop: 100,
  },
  navigationBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f75bcff',
    borderBottomColor: 'transparent',
    //borderBottomWidth: 64
  },
  navigationTitle: {
    color: 'white',
  },
  barButtonIcon: {

  },
  barButtonText: {

  },

});
