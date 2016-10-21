'use strict';

import React, { Component } from 'react';
import {
  Linking,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';

import Util from '../api/Util';

export default class PhoneNumber extends Component{

  _call = () => {
    const url = "tel:" + this.props.number;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Util.showToast('Gagal membuka ' + url, Util.SHORT);
      }
    });
  }

  render() {
    return (
      <TouchableHighlight
        onPress={this._call} style={this.props.containerStyle}>
          <Text {...this.props}>{this.props.number}</Text>
      </TouchableHighlight>

    );
  }
}
