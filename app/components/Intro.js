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
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AppIntro from 'react-native-app-intro';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen } from '../api/Common.js';

import { invalidateFreshInstall } from '../actions/StatusAction';
import gstyles from '../styles/style';
import i18n from '../i18n.js';

const windowsWidth = Dimensions.get('window').width;
const windowsHeight = Dimensions.get('window').height;


export default class Intro extends React.Component {

  componentDidMount(){
  }

  onSkipBtnHandle = () => {
  }

  doneBtnHandle = () => {
  }

  nextBtnHandle = () => {
    // Alert.alert('Next');
  }
  onSlideChangeHandle = (index, total) => {

  }

  render() {
    return (
      <AppIntro
        onNextBtnClick={this.nextBtnHandle}
        onDoneBtnClick={this.props.onDone}
        onSkipBtnClick={this.props.onSkip}
        onSlideChange={this.onSlideChangeHandle}
        rightTextColor={'#fff'}
        leftTextColor={'#fff'}
        dotColor={'#bebebe'}
        activeDotColor={'#fff'}
      >

      <View style={[styles.slide,{ backgroundColor: '#0f75bcff' }]}>
        <View style={styles.info}>
          <View><Text style={styles.title}>SIGN IN</Text></View>
          <View><Text style={styles.description}>Welcome to <Text style={styles.boldItalic}>SIGN IN</Text> is a <Text style={styles.italic}>Mobile Application</Text> for managing your professional account</Text></View>
        </View>
        <View style={[styles.header, {width: windowsWidth}]}>
          <View>
            <Image style={styles.pic} source={require('../img/1/1.png')} />
          </View>
        </View>
      </View>

      <View style={[styles.slide, { backgroundColor: '#0f75bcff' }]}>
        <View style={styles.info}>
          <View><Text style={styles.title}>LOGIN</Text></View>
          <View><Text style={styles.description}>For using this application please register first</Text></View>
        </View>
        <View style={[styles.header, {width: windowsWidth}]}>
         <View>
           <Image style={styles.pic} source={require('../img/2/2.png')} />
         </View>
        </View>
      </View>

      <View style={[styles.slide, { backgroundColor: '#0f75bcff' }]}>
        <View style={styles.info}>
          <View><Text style={styles.title}>EMAIL</Text></View>
          <View><Text style={styles.description}>Sign In will serve as your personal email</Text></View>
        </View>
        <View style={[styles.header, {width: windowsWidth}]}>
          <View>
            <Image style={styles.pic} source={require('../img/3/3.png')} />
          </View>
        </View>
      </View>

      <View style={[styles.slide, { backgroundColor: '#0f75bcff' }]}>
        <View style={styles.info}>
          <View><Text style={styles.title2}>Apps Ready!</Text></View>
          <View><Text style={styles.description}><Text style={styles.boldItalic}>SIGN IN</Text>  <Text style={styles.italic}>Mobile Application</Text> have been installed and ready to use</Text></View>
        </View>
        <View style={[styles.header, {width: windowsWidth}]}>
          <View>
            <Image style={styles.pic} source={require('../img/1/1.png')} />
          </View>
        </View>
      </View>
    </AppIntro>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f75bcff',
    padding: 15,
  },
  header: {
    flex: 0.65,
    alignItems: 'center',
  },
  pic: {
    width: (windowsWidth*.7 > 350) ? getCorrectFontSizeForScreen(100) * 4 : getCorrectShapeSizeForScreen(120) * 2,
    height: (windowsWidth*.7 > 350) ? getCorrectFontSizeForScreen(100) * 4 : getCorrectShapeSizeForScreen(120) * 2,
  },
  info: {
    flex: 0.2,
    padding: getCorrectShapeSizeForScreen(20),
  },
  title: {
    color: '#ffffff',
    fontSize: (windowsWidth*.7 > 350) ? getCorrectFontSizeForScreen(72) : getCorrectFontSizeForScreen(52),
    paddingBottom: getCorrectShapeSizeForScreen(10),
    fontFamily: 'Roboto-Light',
  },
  title2: {
    color: '#ffffff',
    fontSize: (windowsWidth*.7 > 350) ? getCorrectFontSizeForScreen(58) : getCorrectFontSizeForScreen(46),
    paddingBottom: getCorrectShapeSizeForScreen(10),
    fontFamily: 'Roboto-Light',
  },
  boldItalic: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  italic: {
    fontStyle: 'italic',
  },
  description: {
    color: '#ffffff',
    marginLeft: getCorrectShapeSizeForScreen(4),
    fontSize: getCorrectFontSizeForScreen(12),
    fontFamily: 'Roboto-Light',
  },
});
