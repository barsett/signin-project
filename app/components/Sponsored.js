/* @flow */
'use strict'
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import Swiper from '../../src/index.js';
import Button from 'react-native-button';
var WebIntent = require('react-native-webintent');

import gstyles from '../styles/style';
import i18n from '../i18n.js';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen } from '../api/Common.js';

const { width } = Dimensions.get('window');


export default class BannerScreen2 extends React.Component {

  render() {
    return (
      <View>
        <Swiper style={styles.wrapper} height={150} showsButtons={false} autoplayTimeout={4} autoplay>
          <View style={styles.slide1}>
            <Image style={styles.image} source={require('../img/sponsored.png')} />
          </View>
        </Swiper>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: getCorrectShapeSizeForScreen(4),
  },

  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
