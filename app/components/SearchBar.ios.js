'use strict';

import React, {Component} from 'react';
import {
  ActivityIndicator,
  TextInput,
  StyleSheet,
  View,
} from 'react-native';

export default class SearchBar extends Component {
  render() {
    return (
      <View style={styles.searchBar}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChange={this.props.onSearchChange}
          placeholder={(this.props.placeholder) ? this.props.placeholder: "Search ..."}
          onFocus={this.props.onFocus}
          style={styles.searchBarInput}
        />
        <ActivityIndicator
          animating={this.props.isLoading}
          style={styles.spinner}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchBar: {
    //marginTop: 64,
    padding: 3,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarInput: {
    fontSize: 15,
    flex: 1,
    height: 30,
  },
  spinner: {
    width: 30,
  },
});
