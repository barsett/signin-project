'use strict'
import React, { Component } from 'react';
import {
 View,
 Text,
 StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { width, getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDateTime, formatData, formatDate } from '../api/Common.js';


export default class SurveyStatus extends React.Component {

  _getBelumSurvey(){
      return (
          <View style={styles.statusBelumSurvey}>
                <Icon name="square-o" style={styles.iconButton}/>
                <Text style={styles.statusText}>Belum</Text>
                <Text style={styles.statusText}>Survey</Text>
          </View>
      );
  }

  _getBelumBaca(){
    return (
      <View style={styles.statusBelumBaca}>
            <Icon name="eye-slash" style={styles.iconButton}/>
            <Text style={styles.statusText}>Belum</Text>
            <Text style={styles.statusText}>Dibaca</Text>
      </View>
    );
  }

  _getSudahSurvey(){
      return (
          <View style={styles.statusSudahSurvey}>
                <Icon name="check-square-o" style={styles.iconButton}/>
                <Text style={styles.statusText}>Sudah</Text>
                <Text style={styles.statusText}>Survey</Text>
          </View>
      );
  }

  _getOtorisasi(){
      return (
          <View style={styles.statusOtorisasi}>
                <Icon name="thumbs-up" style={styles.iconButton}/>
                <Text style={styles.statusText}>Otorisasi</Text>
          </View>
      );
  }

  _getStatusItem(){
    if ( this.props.statusJaminan === "0" ){
      return this._getBelumBaca();
    } else if ( this.props.statusJaminan === "F0" ){
      return this._getBelumSurvey();
    } else if ( this.props.statusJaminan === "F1" ){
      return this._getSudahSurvey();
    } else {
      return this._getOtorisasi();
    }
  }

  render() {
    return (
      <View style={styles.statusContainer}>
        {this._getStatusItem()}
      </View>
    );
  }

}


const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingRight: getCorrectShapeSizeForScreen(12),
  },
  iconButton: {
    color: 'white',
    fontSize: getCorrectFontSizeForScreen(21),
    textAlign: 'center',
    marginBottom: -3,
  },
  statusText: {
    color: '#fff',
    alignItems: 'center',
    fontSize: getCorrectFontSizeForScreen(10),
    fontFamily: 'Roboto',
  },

  statusBelumSurvey: {
    backgroundColor: '#bf0000',
    alignSelf: 'flex-end',
    alignItems: 'center',
    width: getCorrectShapeSizeForScreen(55),
    height: getCorrectShapeSizeForScreen(55),
    justifyContent: 'center',
    flexDirection: 'column'
  },
  statusSudahSurvey: {
    backgroundColor: '#ff7e00',
    alignSelf: 'flex-end',
    alignItems: 'center',
    width: getCorrectShapeSizeForScreen(55),
    height: getCorrectShapeSizeForScreen(55),
    justifyContent: 'center',
    flexDirection: 'column'
  },
  statusOtorisasi: {
    backgroundColor: '#66ae1e',
    alignSelf: 'flex-end',
    alignItems: 'center',
    width: getCorrectShapeSizeForScreen(55),
    height: getCorrectShapeSizeForScreen(55),
    justifyContent: 'center',
    flexDirection: 'column'
  },
  statusBelumBaca: {
    backgroundColor: '#cccccc',
    alignSelf: 'flex-end',
    alignItems: 'center',
    width: getCorrectShapeSizeForScreen(55),
    height: getCorrectShapeSizeForScreen(55),
    justifyContent: 'center',
    flexDirection: 'column'
  },
});
