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
import FloatLabelTextInput from '../components/FloatingLabel';
import { MKButton, MKSpinner, MKTextField, MKColor } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from '../styles/style';
import i18n from '../i18n.js';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen} from '../api/Common'

import { verifyCredential, removeToken } from '../actions/AuthAction';
import { checkUpdate } from '../actions/UpdateAction';
import { BYPASS_LOGIN } from '../config/Config';

const width = Dimensions.get('window').width;

class LoginForm extends React.Component {
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
  }

  componentWillReceiveProps(nextProps) {
    console.log("Receiving loginError ", nextProps.loginError);
    //if (nextProps.loginError && this.props.loginError !== nextProps.loginError){
    if (nextProps.loginError){
      Actions.error({data: nextProps.loginError});
    }
  }

  _login = () => {
    if (Platform.OS === 'android') {
      dismissKeyboard();
    }
    console.log("Login using ",this.state.username);

    // added for testing
    if (!BYPASS_LOGIN){
      this.props.verifyCredential(this.state.username.toLowerCase(), this.state.password);
    } else {
      Actions.main();
    }
  }

  render() {
        var progress = (this.props.isLoading) ? <MKSpinner strokeColor='#ffffff' style={styles.spinner} spinnerAniDuration={500}/> : <Text style={localStyles.buttonText}>Log In</Text>;
        var progress2 = <Text style={localStyles.buttonText}>Sign Up</Text>;

        return (
                <View>
                  <View style={localStyles.borderInput}>
                    <FloatLabelTextInput
                      ref="username"
                      containerStyle={{ margin: getCorrectShapeSizeForScreen(0), paddingTop: getCorrectShapeSizeForScreen(8), backgroundColor: 'transparent'}}
                      inputStyle={localStyles.textInput}
                      floatingStyle={{color:'#24abe2',}}
                      placeholder={"Username"}
                      placeholderTextColor='#82c4e6'
                      selectionColor='#FFFFFF'
                      onChangeTextValue={text => this.setState({'username':text})}
                      onSubmitEditing={() => this.refs.password.focus()}
                      noBorder={true}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  <View style={localStyles.borderInput}>
                    <FloatLabelTextInput
                      ref="password"
                      containerStyle={{ margin: getCorrectShapeSizeForScreen(0), paddingTop: getCorrectShapeSizeForScreen(8), backgroundColor: 'transparent'}}
                      inputStyle={localStyles.textInput}
                      floatingStyle={{color:'#24abe2',}}
                      placeholder={"Password"}
                      secureTextEntry={true}
                      placeholderTextColor='#82c4e6'
                      selectionColor='#FFFFFF'
                      onChangeTextValue={text => this.setState({'password':text})}
                      onSubmitEditing={this._login}
                      noBorder={true}
                    />
                  </View>
                  <View style={localStyles.seperator}>
                  </View>
                  <MKButton
                    onPress={this._login}
                    style={localStyles.button}
                    cornerRadius={21}
                    enabled={!this.props.isLoading}
                    >
                    {progress}
                  </MKButton>
                  <View style={localStyles.seperator}>
                  </View>
                  <MKButton
                    onPress={this._register}
                    style={localStyles.button}
                    cornerRadius={21}
                    enabled={!this.props.isLoading}
                    >
                    {progress2}
                  </MKButton>
                </View>
        );
    }
}

const localStyles = StyleSheet.create({
  seperator:{
    height: getCorrectShapeSizeForScreen(30),
  },
	borderInput: {
    paddingBottom: getCorrectShapeSizeForScreen(5),
    borderBottomWidth: 1,
    borderBottomColor: '#82c4e6',
		paddingHorizontal: 0,
		marginRight: 0,
		marginLeft: 0,
    width: (width*.7 > 350) ? 350 : width * .7,
    justifyContent: 'center',
    marginBottom: getCorrectShapeSizeForScreen(10),
	},
  textInput: {
 		height: 45,
 		color: 'white',
 		padding: 0,
 		fontFamily: 'Roboto',
 		textAlignVertical: 'center',
 		fontSize: getCorrectFontSizeForScreen(18),
 	},

  button: {
    backgroundColor: '#24abe2',
    borderRadius: 5,
    alignSelf: 'stretch',
    height: getCorrectShapeSizeForScreen(35) ? getCorrectShapeSizeForScreen(35) : height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: getCorrectFontSizeForScreen(18),
    fontFamily: 'Roboto',
  },

});


const mapStateToProps = (state) => {
  //console.log('mapStateToProps isLoggedIn', state.getIn(['currentUser','isLoggedIn']));

  return {
    isLoggedIn: state.getIn(['currentUser','isLoggedIn']),
    loginError: state.getIn(['currentUser','error']),
    isLoading: state.getIn(['currentUser','isLoading']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
	  verifyCredential,
	}, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
