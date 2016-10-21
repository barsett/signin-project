/* @flow */
'use strict';
import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Switch,
    Slider,
} from 'react-native';
var ProgressBar = require('ProgressBarAndroid');
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import i18n from '../i18n.js';
import { connect } from 'react-redux';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDateTime, formatData, formatDate} from '../api/Common'
import { clearLocalData } from '../actions/AuthAction';
import Util from '../api/Util';
import Icon from 'react-native-vector-icons/FontAwesome';
import { updateReferenceData } from '../actions/ReferenceAction';
import { MKProgress } from 'react-native-material-kit';
import { updateBackdatedDate, updateGpsMode } from '../actions/SettingAction';
import { updateLocation } from '../actions/StatusAction';


class SettingScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isReferenceLoading: this.props.isReferenceLoading, // local state only one way direction
    };
  }

  /*
  async _setClipboardContent(){
    Clipboard.setString(this.props.pushToken);
    try {
      var content = await Clipboard.getString();
      this.setState({content});
    } catch (e) {
      this.setState({content:e.message});
    }
  }
  */


  componentWillReceiveProps(nextProps){

    if (nextProps.isReferenceLoading){
      //console.log("Receive new props");
      this.setState({
        isReferenceLoading: nextProps.isReferenceLoading,
      });
    }

  }

  // shouldComponentUpdate(nextProps, nextState){
  //   console.log("should rerender: ", this.props !== nextProps || this.state !== nextState);
  //   return (this.props !== nextProps || this.state !== nextState);
  // }


  _clearLocalData(){
    Alert.alert(
      i18n.clearData,
      i18n.clearDataDialog,
      [
        {
          text: 'OK',
          onPress: () => {
            console.log("Clear local data through action");
            this.props.clearLocalData();
          }
        },
        {
          text: 'Cancel',
          onPress: () => {
            console.log("Cancel clear data");
          }
        }
      ]
    );

  }

  _changeBackdatedDate(value){
    //this.setState({maxNumberOfBackdatedDate: value});
    this.props.updateBackdatedDate(value);
  }

  _downloadReferenceData() {
    // call updateReferenceData function
    console.log("Download reference data");
    this.props.updateReferenceData(true);
  }


  _testLocation = () => {
    this.props.updateLocation()
    .then((loc) => {
      Util.showToast("Location: " + loc.coords.latitude + ", " + loc.coords.longitude, Util.LONG);
    })
    .catch((err) => {
      console.log("Error getting Location", err);
      Util.showToast("GAGAL " + err, Util.LONG);

    });
  }

  _backAction = () => {
    Actions.pop();
  }

	render() {
          var referenceUpdate;
          if (this.state.isReferenceLoading){

            referenceUpdate = <View style={styles.rowInput}>
                  <MKProgress
                    ref="progBarWithBuffer"
                    style={styles.progress}
                    progress={this.props.referenceLoadingProgress}
                          //buffer={0.3}
                  />
                  <Text style={styles.rowValue}>{this.props.referenceLoadingProgressDescription}</Text>
               </View>;
          }


          return (
            <View style={{flex:1}}>
            <ScrollView pointerEvents="box-none"
              style={styles.scrollView}
              scrollEventThrottle={200}
              contentInset={{top: 0}}>
              <TouchableOpacity onPress={Actions.about}>
                <View style={styles.row2}>
                  <Text style={styles.rowLabel}>{i18n.about}</Text>
                  <Icon name="angle-right" style={styles.categoryIcon}/>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={Actions.iconDescription}>
              <View style={styles.row2}>
                <Text style={styles.rowLabel}>{i18n.iconDescription}</Text>
                <Icon name="angle-right" style={styles.categoryIcon}/>
              </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Actions.overview({onSkip: this._backAction, onDone: this._backAction})}>
              <View style={styles.row2}>
                <Text style={styles.rowLabel}>{i18n.overview}</Text>
                <Icon name="angle-right" style={styles.categoryIcon}/>
              </View>
              </TouchableOpacity>

                <View style={styles.rowWithInput}>
                  <Text style={styles.rowLabel}>{i18n.queryPeriod}</Text>
                </View>
                <View style={styles.rowInput}>
                    <Slider style={{alignSelf: 'stretch'}} onValueChange={(value) => this._changeBackdatedDate(value)} maximumValue={90} minimumValue={7} step={1} value={this.props.maxNumberOfBackdatedDate} />
                    <Text style={styles.rowValue}>{this.props.maxNumberOfBackdatedDate} hari</Text>
                </View>

              <View style={styles.row2}>
                    <Text style={styles.rowLabel}>GPS High Accuracy</Text>
                    <Switch
                      onValueChange={(value) => this.props.updateGpsMode(value)}
                      value={this.props.gpsHighAccuracyMode} />

              </View>

              <TouchableOpacity onPress={this._testLocation}>
                <View style={styles.rowWithInput}>
                  <Text style={styles.rowLabel}>Test GPS</Text>
                  <Icon name="map-marker" style={styles.categoryIcon}/>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={this._downloadReferenceData.bind(this)}>
                <View style={styles.rowWithInput}>
                  <Text style={styles.rowLabel}>{i18n.downloadReference}</Text>
                  <Icon name="cloud-download" style={styles.categoryIcon}/>
                </View>
              </TouchableOpacity>
              {referenceUpdate}

              <TouchableOpacity onPress={this._clearLocalData.bind(this)}>
                <View style={styles.row2}>
                  <Text style={styles.rowLabel}>{i18n.clearData}</Text>
                  <Icon name="trash" style={styles.categoryIcon}/>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.row1}>
                  <Text style={styles.rowLabel}>{i18n.update}</Text>
                  <Text style={styles.rowValue}>{this.props.updateStatus}</Text>
                </View>
              </TouchableOpacity>
          </ScrollView>
          </View>
          );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  categoryIcon: {
    fontSize: getCorrectFontSizeForScreen(20),
    color: '#4F8EF7',
    textAlignVertical: 'center',
    //backgroundColor: 'black',
  },
  row1: {
    //flexDirection: 'row',
    backgroundColor:'white',
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderTopWidth: 1,
    borderColor: '#d6d7da',
    alignItems: 'flex-start'
  },
  row2: {
    flexDirection: 'row',
    //backgroundColor:'red',
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderTopWidth: 1,
    borderColor: '#d6d7da',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowWithInput: {
    flexDirection: 'row',
    //backgroundColor:'red',
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderTopWidth: 1,
    borderColor: '#d6d7da',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowInput: {
    //flexDirection: 'row',
    flex:1,
    //backgroundColor:'blue',
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -5,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    borderTopWidth: 1,
  },
  rowLabel: {
    fontSize: getCorrectFontSizeForScreen(14),
    flex:1,
    color: 'black',
  },
  rowValue: {
    fontSize: getCorrectFontSizeForScreen(11),
    color: 'grey',
    //backgroundColor:'red',
  },
  progress: {
    height: getCorrectFontSizeForScreen(8),
    alignSelf: 'stretch',
    backgroundColor: '#E5E5E5',
  },
});

const mapStateToProps = function(state) {
  return {
    pushToken: state.getIn(['currentUser','pushToken']),
    appVersion: state.getIn(['status','appVersion']),
    updateStatus: state.getIn(['status','updateStatus']),
    isReferenceDownloaded: state.getIn(['setting', 'isReferenceDownloaded']),
    isReferenceLoading: state.getIn(['setting', 'isReferenceLoading']),
    referenceLoadingProgressDescription: state.getIn(['setting', 'referenceLoadingProgressDescription']),
    referenceLoadingProgress: state.getIn(['setting', 'referenceLoadingProgress']),
    maxNumberOfBackdatedDate: state.getIn(['setting', 'maxNumberOfBackdatedDate']),
    gpsHighAccuracyMode: state.getIn(['setting', 'gpsHighAccuracyMode']),
  };
};

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    clearLocalData,
    updateReferenceData,
    updateBackdatedDate,
    updateGpsMode,
    updateLocation,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
