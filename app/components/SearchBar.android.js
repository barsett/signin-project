'use strict';

import React, {Component} from 'react';
import {
  Image,
  Platform,
  ProgressBarAndroid,
  TextInput,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, width } from '../api/Common.js';

const IS_RIPPLE_EFFECT_SUPPORTED = Platform.Version >= 21;

export default class SearchBar extends Component {

  render() {
    let loadingView;
    if (this.props.isLoading) {
      loadingView = (
        <ProgressBarAndroid
          styleAttr="Large"
          style={styles.spinner}
        />
      );
    } else {
      loadingView = <View style={styles.spinner} />;
    }
    const background = IS_RIPPLE_EFFECT_SUPPORTED ?
      TouchableNativeFeedback.SelectableBackgroundBorderless() :
      TouchableNativeFeedback.SelectableBackground();
    return (
      <View style={styles.searchBar}>
        <TouchableNativeFeedback
            background={background}
            onPress={() => this.refs.input && this.refs.input.focus()}>
          <View>
            <Icon name="search" style={styles.icon}/>
          </View>
        </TouchableNativeFeedback>
        <TextInput
          ref="input"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={true}
          onChange={this.props.onSearchChange}
          placeholder={(this.props.placeholder) ? this.props.placeholder: "Search ..."}
          placeholderTextColor="#919191"
          onFocus={this.props.onFocus}
          style={styles.searchBarInput}
        />
        {loadingView}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: width - getCorrectShapeSizeForScreen(30),
    alignSelf: 'center',
    margin: getCorrectShapeSizeForScreen(10),
    height: getCorrectShapeSizeForScreen(30),
    borderColor: '#24abe2',
    borderWidth: 2,
    justifyContent: 'center',
  },
  searchBarInput: {
    flex: 1,
    fontSize: getCorrectFontSizeForScreen(12),
    color: '#464646',
    height: 50,
    padding: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  spinner: {
    width: 30,
    height: 30,
  },
  icon: {
    fontSize: getCorrectFontSizeForScreen(14),
    justifyContent: 'center',
    marginLeft: getCorrectShapeSizeForScreen(8),
    marginRight: getCorrectShapeSizeForScreen(5),
    color: '#464646',
  },
});
