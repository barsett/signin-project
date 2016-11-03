/* @flow */
'use strict'
import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Switch,
  PixelRatio,
  Dimensions,
  Platform,
} from 'react-native';
//import Spinner from '../components/Spinner';
//import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import dismissKeyboard from 'dismissKeyboard';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CodePush from "react-native-code-push";
import CheckBox from 'react-native-checkbox';

import { MKButton, MKSpinner, MKTextField, MKColor } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from '../styles/style';
import i18n from '../i18n.js';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen} from '../api/Common'

import { verifyCredential, removeToken } from '../actions/AuthAction';
import { checkUpdate } from '../actions/UpdateAction';
import { BYPASS_LOGIN } from '../config/Config';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const pixelRatio = PixelRatio.get();
console.log("WIDTH:" + width);

class LoginScreen extends React.Component {
  // static propTypes = {
  //       title: PropTypes.string.isRequired
  // }

  // ES6 Standard Constructor replacing getInitialState
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }


  componentDidMount(){
    // move to splash screen
    // setTimeout(() => {
    //   this.props.checkUpdate();
    // }, 2000);

    if (this.props.name === "logout"){
      console.log("logging out");
      this.props.removeToken();
    } else {
      // check if token is exist and valid
      // if token is valid then forward to main page
      //this.props.checkToken();
    }


  }

  componentWillReceiveProps(nextProps) {
    console.log("Receiving isLoggedIn ", nextProps.isLoggedIn);
    console.log("Receiving isFreshInstall: ", nextProps.isFreshInstall);
    console.log("Receiving storageLoaded: ", nextProps.storageLoaded);
    this.props = nextProps;
    this.setState({ checked: nextProps.checked});

    if (nextProps.isLoggedIn) {
      Actions.main();
    } else if (nextProps.loginError && this.props.loginError !== nextProps.loginError){
      Actions.error({data: nextProps.loginError});
    }
  }

  // added for testing
  _login = () => {
    if (Platform.OS === 'android') {
      dismissKeyboard();
    }
    console.log("Login using ",this.state.username);

    if (!BYPASS_LOGIN){
      this.props.verifyCredential(this.state.username.toLowerCase(), this.state.password);

    } else {
      Actions.main();
    }
  }

  render() {
//      var progress = (this.props.isLoading) ? <Spinner styleAttr="Normal" /> : i18n.login;
        var progress = (this.props.isLoading) ? <MKSpinner strokeColor='#ff6600' style={styles.spinner} spinnerAniDuration={500}/> : <Icon style={styles.icon} color='white' name="sign-in" size={25}/>;
        var progress2 = <Icon style={styles.icon} color='white' name="sign-up" size={25}/>;

        return (
            <Image
              source={require('../img/login.png')}
              style={localStyles.bgImage}>
              <View style={localStyles.login}>
                <View  style={localStyles.titlecontainer}>
                  <Image source={require('../img/logo.png')}
                  style={localStyles.logo}/>
                </View>
              </View>
              <View style={localStyles.basicContainer}>
                <View style={localStyles.login}>
                  <View style={localStyles.borderPassword}>
                    <TextInput
                      ref="password"
                      style={localStyles.textInput}
                      placeholder={'Password'}
                      onChangeText={text => this.setState({'password':text})}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      onSubmitEditing={this._login}
                      secureTextEntry={true}
                      placeholderTextColor={'#393939'} />
                  </View>
                  <View style={localStyles.seperator}>
                  </View>
                  <MKButton
                    onPress={this._login}
                    //shadowRadius={2}
                    //shadowOffset={{width: 0, height: 2}}
                    //shadowOpacity={.1}
                    style={localStyles.button}
                    cornerRadius={21}
                    >
                    {progress}
                  </MKButton>
                  <View style={localStyles.seperator}>
                  </View>
                  <MKButton
                    onPress={this._login}
                    //shadowRadius={2}
                    //shadowOffset={{width: 0, height: 2}}
                    //shadowOpacity={.1}
                    style={localStyles.button}
                    cornerRadius={21}
                    >
                    {progress2}
                  </MKButton>

                </View>
                <View style={localStyles.footer}>
                  <Text style={localStyles.footerText}>{this.props.updateStatus}</Text>
                  <Text style={localStyles.footerText}>Copyright&copy;2016 v{this.props.appVersion}b{this.props.codePushRelease}</Text>
                </View>
              </View>
            </Image>
        );
    }
}


const localStyles = StyleSheet.create({
	bg : {
    backgroundColor: '#0f75bcff',
		flex: 1,
    flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
  bgImage: {
    flex: 1,
    backgroundColor: '#0f75bcff',
    justifyContent: 'center',
    //resizeMode: 'stretch', // or 'stretch'
    alignItems: 'center',
    //width,
    //height: null,
  },
  basicContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    padding: 0,
    //width: width > 400 ? 400 : width,
  },
  logo: {
		alignSelf: 'center',
	},
  username: {
    paddingLeft: 15,
    height: 60,
    backgroundColor: 'transparent',
    fontFamily: 'Roboto',
    fontSize: 18,
    color: '#3B3738',
    position: 'relative',
    //flexDirection: 'row',
    textAlignVertical: 'center',
    //flex: 0.5,
  },

  titlecontainer: {
    marginBottom: 5,
    backgroundColor: 'transparent',
  },


  login: {
    backgroundColor: 'transparent',
    padding: 0,
    borderRadius: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
		//resizeMode: 'stretch'
	},

  title: {
    alignSelf: 'center',
    fontSize: getCorrectFontSizeForScreen(18),
    color: '#ffffff',
    fontFamily: 'Roboto',
    //resizeMode: 'stretch'
  },

  switch: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  seperator:{
    height: 10,
  },
	borderUsername: {
    borderWidth: 1,
    borderColor: '#cceeff',
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
		//marginTop: 10,
		marginRight: 0,
		marginLeft: 0,
    height: 45 ,
    width: (width*.7 > 300) ? 300 : width * .7,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
	},
  borderPassword: {
    borderWidth: 1,
    borderColor: '#cceeff',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
		//marginTop: 10,
		marginRight: 0,
		marginLeft: 0,
    height: 45 ,
    width: (width*.7 > 300) ? 300 : width * .7,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
	},
  textInput: {
		height: 45 ,
		color: '#3B3738',
		padding: 5,
		fontFamily: 'Roboto',
		textAlignVertical: 'center',
		fontSize: 18,
    borderRadius: 3,
	},

  footer: {
    backgroundColor: 'transparent',
    height: 40,
    flexDirection: 'column',
    alignItems: 'center',
	  marginBottom: 10,
  },
  footerText: {
	color: '#ffffff',
	fontFamily: 'Roboto-Light',
    //backgroundColor: '#00FF00'
  },

  button: {
    backgroundColor: 'rgba(180,180,180,0.6)',
    padding: 5,
    borderWidth: 0,
    borderRadius: 3,
    alignSelf: 'stretch',
    height: 45 ? 45 : height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    textAlignVertical: 'center',
    justifyContent :'center',
    alignItems : 'center',
  },
  buttonText: {
    color: '#3498db',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontFamily: 'Roboto',
  },




});


const mapStateToProps = (state) => {
  //console.log('mapStateToProps isLoggedIn', state.getIn(['currentUser','isLoggedIn']));

  return {
    isLoggedIn: state.getIn(['currentUser','isLoggedIn']),
    loginError: state.getIn(['currentUser','error']),
    isLoading: state.getIn(['currentUser','isLoading']),
    updateStatus: state.getIn(['status','updateStatus']),
    appVersion: state.getIn(['status','appVersion']),
    codePushRelease: state.getIn(['status','codePushRelease']),
    isFreshInstall: state.getIn(['status','isFreshInstall']),
    storageLoaded: state.getIn(['status','storageLoaded']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
	  verifyCredential,
    removeToken,
	}, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
