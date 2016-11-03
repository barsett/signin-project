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

import gstyles from '../styles/style';
import i18n from '../i18n.js';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen } from '../api/Common.js';

const { width } = Dimensions.get('window');


export default class BannerScreen extends React.Component {

  render() {
    return (
      <View>
        <Swiper style={styles.wrapper} height={120} showsButtons={false} autoplayTimeout={4} autoplay>
          <View style={styles.slide1}>
            <Image style={styles.image} source={require('../img/orca.png')} />
          </View>
          <View style={styles.slide2}>
            <Text style={styles.text}>YOUR ADS GOES HERE</Text>
          </View>
          <View style={styles.slide3}>
            <Text style={styles.text}>YOUR ADS GOES HERE</Text>
          </View>
        </Swiper>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'stretch',
    //margin: getCorrectShapeSizeForScreen(8),
    padding: getCorrectShapeSizeForScreen(4),
  },

  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },

  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },

  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },

  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  image: {
    flex: 1,
    resizeMode: 'cover',
  },
});
