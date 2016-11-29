/* @flow */
'use strict'
import React, { Component, PropTypes} from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    View,
    StyleSheet,
    TouchableHighlight,
    Switch,
    Alert,
    Dimensions,
    Image,
} from  'react-native';


var Icon = require('react-native-vector-icons/FontAwesome');
import { connect } from 'react-redux';
import Button from 'react-native-button';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import CheckBox from 'react-native-checkbox';
import FloatLabelTextInput from '../components/FloatingLabel';
import dismissKeyboard from 'dismissKeyboard';
import { MKButton, MKSpinner, MKTextField, MKColor } from 'react-native-material-kit';

import styles from '../styles/style';
import i18n from '../i18n.js';
import { updateReferenceData } from '../actions/ReferenceAction';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width } from '../api/Common.js';
import SurveyStatisticCard from '../components/SurveyStatisticCard';
import Sponsored from '../components/Sponsored';

const _getURL = (action) => {
     var url = '../img/img/';
     switch (action) {
         case "arief@ariefneiriza.com":
             return url + 'arief';
         default:
             return url + 'default';
     }
 }

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      search: '',
    };
  }
  componentDidMount(){
    console.log("Updating Reference Data");
    this.props.updateReferenceData();
  }
  state = {
    trueSwitchIsOn: true,
    falseSwitchIsOn: false,
  };
    _getMenuCategory1(){
    return(
    <View style={{padding: getCorrectShapeSizeForScreen(8)}}>
      <View style={localStyles.menuRow}>
        <View style={localStyles.buttonContainer}>
          <Button onPress={Actions.onProgress} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Icon style={localStyles.buttonIcon} name="group" />
              <Text style={localStyles.buttonText}> {i18n.construction} </Text>
            </View>
          </Button>
        </View>
        <View style={localStyles.buttonContainer}>
          <Button onPress={Actions.onProgress} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Icon style={localStyles.buttonIcon} name="lightbulb-o" />
              <Text style={localStyles.buttonText}> {i18n.creativeIndustry} </Text>
            </View>
          </Button>
        </View>
        <View style={localStyles.buttonContainer}>
          <Button onPress={Actions.onProgress} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Icon style={localStyles.buttonIcon} name="paint-brush" />
              <Text style={localStyles.buttonText}> {i18n.design} </Text>
            </View>
          </Button>
        </View>
        <View style={localStyles.buttonContainer}>
          <Button onPress={Actions.onProgress} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Icon style={localStyles.buttonIcon} name="money" />
              <Text style={localStyles.buttonText}> {i18n.finance} </Text>
            </View>
          </Button>
        </View>
      </View>
      <View style={localStyles.menuRow}>
        <View style={localStyles.buttonContainer}>
          <Button onPress={Actions.onProgress} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Icon style={localStyles.buttonIcon} name="database" />
              <Text style={localStyles.buttonText}> {i18n.it} </Text>
            </View>
          </Button>
        </View>
        <View style={localStyles.buttonContainer}>
          <Button onPress={Actions.onProgress} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Icon style={localStyles.buttonIcon} name="legal" />
              <Text style={localStyles.buttonText}> {i18n.legal} </Text>
            </View>
          </Button>
        </View>
      </View>
    </View>
    );
  }

  _logout(){
    //console.log("### LOGOUT ###");
    Alert.alert(
      i18n.logoutMsgTitle,
      i18n.logoutMsg,
      [
        {
          text: 'OK',
          onPress: () => {
            console.log("Log out through action");
            Actions.splash({logout: true});
          }
        },
        {
          text: 'Cancel',
          onPress: () => {
            console.log("Cancel log out");
          }
        }
      ]
    );
  }

  render() {
      var searchIcon = <Icon style={styles.icon} color='white' name="search" size={25}/>;
      var content = <ScrollView style={localStyles.bg}>
                      <View style={localStyles.header}>
                        <View style={localStyles.headerContent}>
                          <Image style={localStyles.image} source={require('../img/img/default.png')} />
                        </View>
                        <View style={localStyles.headerContent}>
                          <Text style={localStyles.nameHeader}>
                            {this.props.username}
                          </Text>
                        </View>
                      </View>
                      <View style={{padding: getCorrectShapeSizeForScreen(8)}}>
                        <View style={localStyles.wrapper}>
                          <SurveyStatisticCard/>
                        </View>
                        <View style={localStyles.menuRow}>
                          <View style={localStyles.buttonContainer}>
                            <Button onPress={Actions.onProgress} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
                              <View style={{flexDirection: 'column', flex: 1}}>
                                <Icon style={localStyles.buttonIcon} name="inbox" />
                                <Text style={localStyles.buttonText}> {i18n.mail} </Text>
                              </View>
                            </Button>
                          </View>
                          <View style={localStyles.buttonContainer}>
                            <Button onPress={Actions.onProgress} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
                              <View style={{flexDirection: 'column', flex: 1}}>
                                <Icon style={localStyles.buttonIcon} name="cloud-download" />
                                <Text style={localStyles.buttonText}> {i18n.cloud} </Text>
                              </View>
                            </Button>
                          </View>
                          <View style={localStyles.buttonContainer}>
                            <Button onPress={Actions.setting} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
                              <View style={{flexDirection: 'column', flex: 1}}>
                                <Icon style={localStyles.buttonIcon} name="gear" />
                                <Text style={localStyles.buttonText}> {i18n.setting} </Text>
                              </View>
                            </Button>
                          </View>
                          <View style={localStyles.buttonContainer}>
                            <Button onPress={() => this._logout()} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
                              <View style={{flexDirection: 'column', flex: 1}}>
                                <Icon style={localStyles.buttonIcon} name="power-off" />
                                <Text style={localStyles.buttonText}> {i18n.logout} </Text>
                              </View>
                            </Button>
                          </View>
                        </View>
                        <View style={localStyles.wrapper}>
                          <Sponsored/>
                        </View>
                        <View style={localStyles.separator}>
                        </View>
                        <View style={localStyles.borderInput}>
                          <FloatLabelTextInput
                            ref="search"
                            containerStyle={{ margin: getCorrectShapeSizeForScreen(0), paddingTop: getCorrectShapeSizeForScreen(8), backgroundColor: 'transparent'}}
                            inputStyle={localStyles.textInput}
                            floatingStyle={{color:'#24abe2',}}
                            placeholder={"Search"}
                            placeholderTextColor='#82c4e6'
                            selectionColor='#FFFFFF'
                            onChangeTextValue={text => this.setState({'search':text})}
                            noBorder={true}
                            autoCapitalize="none"
                            autoCorrect={false}
                          />
                        </View>
                        <MKButton
                          style={localStyles.button}
                          cornerRadius={21}
                          >
                          {searchIcon}
                        </MKButton>
                        <View style={localStyles.separator}>
                        </View>
                        <View style={localStyles.menuRow}>
                          <Text style={localStyles.text1}>Job Listing </Text>
                          <Switch
                          onValueChange={(value) =>this.setState({falseSwitchIsOn: value})}
                          onTintColor="#0f75bcff"
                          value={this.state.falseSwitchIsOn} />
                        </View>
                        <View style={localStyles.separator}>
                        </View>
                        {this.state.falseSwitchIsOn ? this._getMenuCategory1() : this._getMenuCategory1().hide}
                      </View>
                    </ScrollView>
      return content;
  }
}

const localStyles = StyleSheet.create({
  image: {
    flex: 1,
    width: 70,
    height: 70,
    borderRadius: 60,
    backgroundColor: 'transparent',
    resizeMode: 'contain',
  },
  bg: {
    backgroundColor: '#e5e5e5',
    flex: 1,
  },
  wrapper: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: getCorrectShapeSizeForScreen(4),
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: getCorrectShapeSizeForScreen(8),
  },
  buttonContainer: {
    flexDirection: 'column',
    marginHorizontal: getCorrectShapeSizeForScreen(4),
  },
  buttonItemMain: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    width: (width/4)-getCorrectShapeSizeForScreen(10),
    paddingTop: getCorrectShapeSizeForScreen(20),
    paddingBottom: getCorrectShapeSizeForScreen(20),
  },
  buttonIcon: {
    color: '#0f75bcff',
    fontSize: getCorrectFontSizeForScreen(40),
    alignSelf: 'center',
    marginBottom: getCorrectFontSizeForScreen(5),
  },
  buttonText: {
    color: '#0f75bcff',
    fontFamily: 'Roboto',
    textAlign: 'center',
    fontSize: getCorrectFontSizeForScreen(12),
  },
  button: {
    backgroundColor: '#0f75bcff',
    padding: 5,
    borderWidth: 0,
    borderRadius: 3,
    alignSelf: 'stretch',
    height: 45 ? 45 : height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header:{
    backgroundColor: '#0f75bcff',
    flex: 1,
    flexDirection: 'row',
    padding: getCorrectShapeSizeForScreen(20),
    height: height/7,
  },
  headerContent:{
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  nameHeader: {
    color: '#ffffff',
    fontSize: getCorrectFontSizeForScreen(18),
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    marginBottom: getCorrectShapeSizeForScreen(25),
  },
  descHeader: {
    color: '#ffffff',
    fontFamily: 'Roboto',
    fontSize: getCorrectShapeSizeForScreen(13),
  },
  borderUser: {
    width: getCorrectShapeSizeForScreen(50),
    height: getCorrectShapeSizeForScreen(50),
    borderRadius: getCorrectShapeSizeForScreen(50)/2,
    backgroundColor: 'white',
    marginBottom: getCorrectShapeSizeForScreen(10),
  },
  separator:{
    height: getCorrectShapeSizeForScreen(30),
  },
  text1:{
    color: '#0f75bcff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  borderInput: {
    paddingBottom: getCorrectShapeSizeForScreen(5),
    borderBottomWidth: 1,
    borderBottomColor: '#82c4e6',
		paddingHorizontal: 0,
		marginRight: 0,
		marginLeft: 0,
    justifyContent: 'center',
    marginBottom: getCorrectShapeSizeForScreen(10),
	},
  textInput: {
 		height: 45,
 		color: '#0f75bcff',
 		padding: 0,
 		fontFamily: 'Roboto',
 		textAlignVertical: 'center',
 		fontSize: getCorrectFontSizeForScreen(18),
 	},
  icon: {
    textAlignVertical: 'center',
    justifyContent :'center',
    alignItems : 'center',
  },
});


const mapStateToProps = (state) => {
  //console.log("MappingStateToProps");

  return {
    username: state.getIn(['currentUser','username']),
    fullname: state.getIn(['currentUser','fullname']),
    roles: state.getIn(['currentUser', 'roles']),
    namaKantor: state.getIn(['currentUser', 'namaKantor']),
  };

};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateReferenceData,
	}, dispatch);
};

//module.exports = connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
