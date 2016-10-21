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
  Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import i18n from '../i18n.js';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width} from '../api/Common'


export default class FilterAndSortingBar extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.tab}>
          <TouchableHighlight
            style={styles.button}
            onPress={this.props.onFilterPress}
            underlayColor='#e5e5e5'>
            <Text style={styles.tabText}>{i18n.filter}</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.separator}/>
        <View style={styles.tab}>
          <TouchableHighlight
            style={styles.button}
            onPress={this.props.onSortPress}
            underlayColor='#e5e5e5'>
            <Text style={styles.tabText}>{i18n.sort}</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth: 1,
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
  },
  tab:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: getCorrectShapeSizeForScreen(1),
  },
  button: {
    flexDirection: 'row',
		justifyContent: 'center',
	  alignSelf: 'center',
    width: (width/2)-getCorrectShapeSizeForScreen(8),
    paddingBottom: getCorrectShapeSizeForScreen(5),
    paddingTop: getCorrectShapeSizeForScreen(5),
	},
  tabText: {
    fontSize: getCorrectFontSizeForScreen(12),
    color: '#0087cd',
    alignSelf: "center",
    fontFamily: 'Roboto-Light',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: getCorrectShapeSizeForScreen(200),
  },
  separator: {
    backgroundColor: '#cccccc',
    width: 1,
    height: getCorrectShapeSizeForScreen(15),
  },
});
