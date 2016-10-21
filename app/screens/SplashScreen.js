/* @flow */
'use strict'
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  Image,
  Platform,
  UIManager,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AImage from '../components/ImageAnimation';

import gstyles from '../styles/style';
import i18n from '../i18n.js';
import LoginForm from '../components/LoginForm';
import Intro from '../components/Intro';

import { checkUpdate } from '../actions/UpdateAction';
import { invalidateFreshInstall } from '../actions/StatusAction';
import { removeToken } from '../actions/AuthAction';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, width, height} from '../api/Common';


const animationImages = [
        require('../img/1.png'),
        require('../img/2.png'),
        require('../img/3.png'),
        require('../img/4.png'),
        require('../img/5.png'),
        require('../img/6.png'),
    ];


class SplashScreen extends React.Component {
  constructor(props){
    super(props);

    if (props.logout) {
      this.state = {
        updateCount: 1,
        show: 'login',
      };

    } else {
      this.state = {
        updateCount: 0,
        show: 'splash',
      };
    }
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount(){
    console.log("Splash Mounted. " + this.props.logout);
    if (this.props.logout){
      console.log("logging out");
      this.props.removeToken();
    }

  }

  componentWillReceiveProps(nextProps) {

      // console.log("Receiving isLoggedIn: ", nextProps.isLoggedIn);
      // console.log("Receiving isFreshInstall: ", nextProps.isFreshInstall);
      // console.log("Receiving storageLoaded: ", nextProps.storageLoaded);
      // console.log("Receiving updateIsLoading: ", nextProps.updateIsLoading);



      // wait for local storage to be loaded
      if (nextProps.storageLoaded || this.props.storageLoaded){
        if (!this.props.updateIsLoading && this.state.updateCount < 1){
          this.setState({updateCount: 1});
          this.props.checkUpdate();
          this.setState({show: 'splash'});
        } else if (!nextProps.updateIsLoading){
          // if storage is loaded and checkupdate once
          console.log("storage is loaded and update is done");
          if (nextProps.isFreshInstall){
            console.log("Show Intro Screen");
            //LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            this.setState({show: 'intro'});
            //Actions.intro();
          } else if (nextProps.isLoggedIn) {
            if (Platform.OS === 'android') {
              UIManager.setLayoutAnimationEnabledExperimental(false);
            }

            Actions.main();
          } else {
            //Actions.auth();
            if (this.state.show === 'splash'){
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            }


            this.setState({show: 'login'});

          }
        }
      }



  }

  _getLoginForm(){
    if (this.state.show == 'login'){
      return <View  style={styles.titlecontainer}>
          <Image source={require('../img/logo.png')}
          style={styles.logo}/>
          <LoginForm/>
        </View>;
    } else {
      return <AImage
                resizeMode='contain'
                animationRepeatCount= {0}
                animationDuration={400}
                animationImages={animationImages}
                style={styles.image}
              />;

    }
  }

  _onIntroDone = () => {
    this.props.invalidateFreshInstall();
    this.setState({show: 'login'});
  }

  render() {
    if (this.state.show === 'intro'){
      return <Intro onSkip={this._onIntroDone} onDone={this._onIntroDone}/>;
    } else {
      return (
        <View style={styles.basicContainer}>
          <View style={styles.login}>
            {this._getLoginForm()}
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>{this.props.updateStatus}</Text>
            <Text style={styles.footerText}>Copyright&copy;2016 v{this.props.appVersion}</Text>
          </View>
        </View>

      );
    }

  }
}

const styles = StyleSheet.create({
  bgImage: {
    //flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    //resizeMode: 'stretch', // or 'stretch'
    alignItems: 'center',
    //width: 100,
    //height: 100,
  },
  basicContainer: {
    flex:1,
    backgroundColor: '#0087cd',
    // flex: 1,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    padding: 0,
    width: width > getCorrectShapeSizeForScreen(400) ? getCorrectShapeSizeForScreen(400) : width,
  },
  login: {
    padding: 0,
    borderRadius: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
	},
  logo: {
		alignSelf: 'center',
    //backgroundColor: 'green',
    width: width > getCorrectShapeSizeForScreen(230) ? getCorrectShapeSizeForScreen(230) : width,
    height:  getCorrectShapeSizeForScreen(74),
    marginBottom: getCorrectShapeSizeForScreen(10),
	},

  titlecontainer: {
    paddingVertical: getCorrectShapeSizeForScreen(20),
    justifyContent: 'center',
    flexDirection: 'column',
  },
  footer: {
    backgroundColor: 'transparent',
    height: getCorrectShapeSizeForScreen(30),
    flexDirection: 'column',
    alignItems: 'center',
	  marginBottom: getCorrectShapeSizeForScreen(10),
  },
  footerText: {
	color: '#ffffff',
	fontFamily: 'Roboto-Light',
  fontSize: getCorrectFontSizeForScreen(10),
  },
  image: {
      width:getCorrectShapeSizeForScreen(131),
      height:getCorrectShapeSizeForScreen(91),
  },
});



const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.getIn(['currentUser','isLoggedIn']),
    isFreshInstall: state.getIn(['setting','isFreshInstall']),
    storageLoaded: state.getIn(['status','storageLoaded']),
    updateStatus: state.getIn(['status','updateStatus']),
    updateIsLoading: state.getIn(['status','updateIsLoading']),
    appVersion: state.getIn(['status','appVersion']),
    codePushRelease: state.getIn(['status','codePushRelease']),

  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    checkUpdate,
    removeToken,
    invalidateFreshInstall,
	}, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
