/* @flow */
'use strict';
import React, { Component } from 'react';
import {
    Text,
    TextInput,
    Image,
    View,
    StyleSheet,
    Dimensions,
    PixelRatio,
    Clipboard,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import i18n from '../i18n.js';
import { connect } from 'react-redux';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDateTime, formatData, formatDate} from '../api/Common'
import { clearLocalData } from '../actions/AuthAction';
import Util from '../api/Util';
import Icon from 'react-native-vector-icons/MaterialIcons';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const pixelRatio = PixelRatio.get();
const fontScale = PixelRatio.getFontScale();


class AboutScreen extends React.Component {

  constructor(props) {
    super(props);
    //console.log("### PROPS ###");
    //console.log(props);
  }

  componentDidMount() {
    //console.log("componentDidMount");
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

  componentWillUnmount() {
    //console.log("componentWillUnmount");
  }

  _getPixelRatio(){
    switch(PixelRatio.get()){
      case 1:
        return '160 dpi';
      case 1.5:
        return '240 dpi';
      case 2:
        return '320 dpi';
      case 3:
        return '480 dpi';
      case 3.5:
        return '> 480 dpi';
      default:
        return 'n/a';
    }
  }

  render() {
          return (
            <View style={{flex:1}}>
            <ScrollView pointerEvents="box-none"
              style={styles.scrollView}
              scrollEventThrottle={200}
              contentInset={{top: 0}}>
              <TouchableOpacity>
              <View style={styles.row1}>
                <Text style={styles.rowLabel}>{i18n.appVersion}</Text>
                <Text style={styles.rowValue}>Version {this.props.appVersion}</Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity>
              <View style={styles.row1}>
                <Text style={styles.rowLabel}>{i18n.codePushRelease}</Text>
                <Text style={styles.rowValue}>{(this.props.codePushRelease) ? this.props.codePushRelease : 'n/a'}</Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity>
              <View style={styles.row1}>
                <Text style={styles.rowLabel}>{i18n.codePushVersion}</Text>
                <Text style={styles.rowValue}>{(this.props.codePushVersion) ? this.props.codePushVersion : 'n/a'}</Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity>
              <View style={styles.row1}>
                <Text style={styles.rowLabel}>{i18n.deviceId}</Text>
                <Text style={styles.rowValue}>{this.props.deviceId}</Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity>
              <View style={styles.row1}>
                <Text style={styles.rowLabel}>{i18n.deviceModel}</Text>
                <Text style={styles.rowValue}>{this.props.deviceModel}</Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity>
              <View style={styles.row1}>
                <Text style={styles.rowLabel}>{i18n.deviceOs}</Text>
                <Text style={styles.rowValue}>{this.props.deviceOS}</Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity>
              <View style={styles.row1}>
                <Text style={styles.rowLabel}>{i18n.deviceUniqueId}</Text>
                <Text style={styles.rowValue}>{this.props.deviceUniqueId}</Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity>
              <View style={styles.row1}>
                <Text style={styles.rowLabel}>{i18n.deviceVersion}</Text>
                <Text style={styles.rowValue}>{this.props.deviceVersion}</Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity>
              <View style={styles.row1}>
                <Text style={styles.rowLabel}>{i18n.language}</Text>
                <Text
                  style={styles.rowValue}>{i18n.appLang}
                </Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity>
              <View style={styles.row1}>
                <Text style={styles.rowLabel}>{i18n.pixelRatio}</Text>
                <Text
                  style={styles.rowValue}>{PixelRatio.get()}x  ({this._getPixelRatio()})
                </Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity>
              <View style={styles.row1}>
                <Text style={styles.rowLabel}>{i18n.fontRatio}</Text>
                <Text
                  style={styles.rowValue}>{PixelRatio.getFontScale()}
                </Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity>
              <View style={styles.row1}>
                <Text style={styles.rowLabel}>{i18n.screenSize}</Text>
                <Text
                  style={styles.rowValue}>{width*PixelRatio.get()} x {height*PixelRatio.get()}
                </Text>
              </View>
              </TouchableOpacity>
          </ScrollView>
          </View>
          );
  }
}

const localStyles = StyleSheet.create({
	welcome: {
		color: 'black',
		textAlign: 'center',
		fontSize: 20,
		marginBottom: 20,
		marginTop: 20,
	}
});

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#C5B9C9',
  },
  welcome: {
    fontSize: getCorrectFontSizeForScreen(20),
    textAlign: 'center',
    margin: 15,
    color: 'black',
  },
  categoryLabel: {
    flex:1,
    fontSize: getCorrectFontSizeForScreen(18),
    textAlign: 'left',
    left: 15,
    padding: 5,
    fontWeight:'bold',
    color: '#393939',
    textAlignVertical: 'center',
  },
  categoryIcon: {
    padding: 5,
    right: 10,
    fontSize: getCorrectFontSizeForScreen(22),
    color: '#393939',
    textAlignVertical: 'center',
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row1: {
    //flexDirection: 'row',
    backgroundColor:'white',
    borderRadius: 0,
    borderWidth: 0,
    padding: 10,
    borderTopWidth: 1 / PixelRatio.get(),
    borderColor: '#d6d7da',
    alignItems: 'flex-start'
  },
  row2: {
    flexDirection: 'row',
    backgroundColor:'white',
    borderRadius: 0,
    borderWidth: 0,
    padding: 10,
    borderTopWidth: 1 / PixelRatio.get(),
    borderColor: '#d6d7da',
    alignItems: 'flex-start'
  },
  rowLabel: {
    left:10,
    fontSize: getCorrectFontSizeForScreen(14),
    color: 'black',
  },
  rowValue: {
    left:10,
    fontSize: getCorrectFontSizeForScreen(11),
    flex:1,
    color: 'grey',
  },
});

const mapStateToProps = function(state) {
  return {
    appVersion: state.getIn(['status','appVersion']),
    codePushRelease: state.getIn(['status','codePushRelease']),
    codePushVersion: state.getIn(['status','codePushVersion']),
    deviceId: state.getIn(['status','deviceId']),
    deviceModel: state.getIn(['status','deviceModel']),
    deviceOS: state.getIn(['status','deviceOS']),
    deviceUniqueId: state.getIn(['status','deviceUniqueId']),
    deviceVersion: state.getIn(['status','deviceVersion']),
    locale: state.getIn(['status','locale']),
    language: state.getIn(['setting', 'lang']),
  };
};

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AboutScreen);
