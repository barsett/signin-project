/* @flow */
'use strict'
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen} from '../api/Common'
import gstyles from '../styles/style';
import i18n from '../i18n.js';


class TemplateScreen extends React.Component {
  componentDidMount(){
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Place Content Here</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    padding: 15,
  },
});

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
	}, dispatch);

};

export default connect(null, mapDispatchToProps)(TemplateScreen);
