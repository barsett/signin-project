'use strict';

import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';

import i18n from '../i18n.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import type { StyleObj } from 'StyleSheetTypes';
import { getImageSource, getStyleFromScore, getTextFromScore } from '../api/Common';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, width, height } from '../api/Common'

export default class NoData extends Component{
  render() {
    var text = (this.props.isLoading) ? text = i18n.loading : this.props.noDataText;
    console.log(this.props.isLoading);
    return (
      <ScrollView style={styles.bg}
        refreshControl={
          <RefreshControl
            refreshing={this.props.isLoading}
            onRefresh={this.props.onRefresh}
            tintColor="#666699"
            title="Loading..."
            titleColor="#bf0000"
            colors={['#bf0000', '#bf0000', '#bf0000']} // spinning arrow color
            progressBackgroundColor="#ffffcc" //Circle color
          />
        }
        >
        <View style={styles.centerText}>
          <Text style={styles.noDataText}> {text} </Text>
        </View>
      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    //marginTop: getCorrectShapeSizeForScreen(8),
    alignItems: 'center',
    width: width - getCorrectShapeSizeForScreen(16),
    alignSelf: 'center',
    paddingTop: getCorrectShapeSizeForScreen(60),
    backgroundColor: '#fff',
    height: height,
  },
  bg: {
       alignSelf: 'center',
       backgroundColor: 'transparent',
   },
  noDataText: {
    color: '#464646',
    fontSize: getCorrectFontSizeForScreen(16),
    fontFamily: 'Roboto',
  },

});
