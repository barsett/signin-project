'use strict';

/*
This component is used to show Sanutnan List. This will be part of row component in a List
if the list row have action when press then this component must be wrapped in TouchableHighlight
if the list have actionable button then renderRow should contain this component and button component
*/
import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableHighlight,
  TouchableNativeFeedback,
  Text,
  View
} from 'react-native';

import Button from 'react-native-button';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDateTime, formatData, formatDate} from '../api/Common';
import i18n from '../i18n.js';

export default class SantunanHistoryCell extends React.Component {

  render() {
    console.log("History Cell Render",this.props.data);
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    //To Do:
    //Check tenggatResponse - curTime < 30 minutes, then show different cell bgColor

    return (
        <View style={styles.container}>
          <TouchableElement
            style={{flex:1}}
            //onPress={this.props.onSelect}
            onShowUnderlay={this.props.onHighlight}
            onHideUnderlay={this.props.onUnhighlight}>
            <View style={styles.columnContainer}>
              <View style={styles.column}>
                <View style={styles.row}>
                  <Text style={styles.label}>
                    Nomor Berkas
                  </Text>
                  <Text style={styles.input}>
                    {this.props.data.noBerkas}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>
                    Diajukan Di
                  </Text>
                  <Text style={styles.input}>
                    {this.props.data.diajukan}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>
                    Tanggal Pengajuan
                  </Text>
                  <Text style={styles.input}>
                    {formatDate(this.props.data.tglPengajuan)}
                  </Text>
                </View>
              </View>
              <View style={styles.column}>
                <View style={styles.row}>
                  <Text style={styles.label}>
                    Status & Posisi Berkas
                  </Text>
                  <Text style={styles.input}>
                    {this.props.data.statusProsesDesc}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>
                    Penyelesaian
                  </Text>
                  <Text style={styles.input}>
                    {this.props.data.penyelesaianHistory.toString().replace("<br />","")}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>
                    Tanggal Penyelesaian
                  </Text>
                  <Text style={styles.input}>
                    {formatDate(this.props.data.tglPenyelesaian)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableElement>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: getCorrectShapeSizeForScreen(5),
    borderColor: '#e5e5e5',
    borderBottomWidth: 3,
  },
  columnContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  column: {
    flexDirection: 'column',
    flex: 0.5,
  },
  row: {
    flexDirection: 'column',
    padding: getCorrectShapeSizeForScreen(5),
  },
  label: {
    flexDirection: 'row',
    color: '#464646',
    fontFamily: 'Roboto-Light',
    fontSize: getCorrectFontSizeForScreen(10),
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    color: '#464646',
    fontFamily: 'Roboto',
    fontSize: getCorrectFontSizeForScreen(12),
  },
});
