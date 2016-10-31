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


class OnprogressScreen extends React.Component {

  constructor(props) {
    super(props);
    //console.log("### PROPS ###");
    //console.log(props);
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
                <Text style={styles.rowLabel}>{i18n.onProgress}</Text>
                <Text style={styles.rowValue}>Page currently on progress</Text>
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

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapDispatchToProps)(OnprogressScreen);
