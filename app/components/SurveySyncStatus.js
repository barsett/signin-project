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

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.status}</Text>
      </View>
    );
  }

}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
  },

});
