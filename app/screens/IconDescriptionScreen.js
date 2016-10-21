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
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import i18n from '../i18n.js';
import { connect } from 'react-redux';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDateTime, formatData, formatDate} from '../api/Common'
import SurveyStatus from '../components/SurveyStatus';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const pixelRatio = PixelRatio.get();
const fontScale = PixelRatio.getFontScale();


class IconDescriptionScreen extends React.Component {
  componentDidMount() {
    //console.log("componentDidMount");
  }

  componentWillUnmount() {
    //console.log("componentWillUnmount");
  }

	render() {
          return (
            <View style={{flex:1}}>
            <ScrollView pointerEvents="box-none"
              style={styles.scrollView}
              scrollEventThrottle={200}
              contentInset={{top: 0}}>
              <View style={styles.row}>
                <SurveyStatus statusJaminan="0"></SurveyStatus>
                <Text style={styles.rowLabel}>{i18n.notReadIconDesc}</Text>
              </View>
              <View style={styles.row}>
              <SurveyStatus statusJaminan="F0"></SurveyStatus>
              <Text style={styles.rowLabel}>{i18n.notSurveyedIconDesc}</Text>
              </View>
              <View style={styles.row}>
              <SurveyStatus statusJaminan="F1"></SurveyStatus>
              <Text style={styles.rowLabel}>{i18n.surveyedIconDesc}</Text>
              </View>
              <View style={styles.row}>
              <SurveyStatus statusJaminan="-1"></SurveyStatus>
              <Text style={styles.rowLabel}>{i18n.authorizedIconDesc}</Text>
              </View>
          </ScrollView>
          </View>
          );
  }
}


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
  row: {
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
    flex:1,
    color: 'black',

  },
  rowValue: {
    left:10,
    fontSize: getCorrectFontSizeForScreen(12),
    flex:1,
    color: 'grey',
  },
});

export default IconDescriptionScreen;
