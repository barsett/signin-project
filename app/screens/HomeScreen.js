/* @flow */
'use strict'
import React, { Component, PropTypes} from 'react';
import {
    ScrollView,
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    Switch,
    Alert,
} from  'react-native';


var Icon = require('react-native-vector-icons/FontAwesome');
import { connect } from 'react-redux';
import Button from 'react-native-button';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import CheckBox from 'react-native-checkbox';

import styles from '../styles/style';
import i18n from '../i18n.js';
import { updateReferenceData } from '../actions/ReferenceAction';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width } from '../api/Common.js';
import SurveyStatisticCard from '../components/SurveyStatisticCard';


class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
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
      <View style={localStyles.menuRow}>
        <View style={localStyles.buttonContainer}>
          <Button onPress={Actions.onProgress} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Icon style={localStyles.buttonIcon} name="file-text" />
              <Text style={localStyles.buttonText}> {i18n.construction} </Text>
            </View>
          </Button>
        </View>
        <View style={localStyles.buttonContainer}>
          <Button onPress={Actions.onProgress} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Icon style={localStyles.buttonIcon} name="file-text" />
              <Text style={localStyles.buttonText}> {i18n.creativeIndustry} </Text>
            </View>
          </Button>
        </View>
        <View style={localStyles.buttonContainer}>
          <Button onPress={Actions.onProgress} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Icon style={localStyles.buttonIcon} name="file-text" />
              <Text style={localStyles.buttonText}> {i18n.design} </Text>
            </View>
          </Button>
        </View>
      </View>
    );
  }
  _getMenuCategory2(){
    return(
      <View style={localStyles.menuRow}>
        <View style={localStyles.buttonContainer}>
          <Button onPress={Actions.onProgress} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Icon style={localStyles.buttonIcon} name="file-text" />
              <Text style={localStyles.buttonText}> {i18n.finance} </Text>
            </View>
          </Button>
        </View>
        <View style={localStyles.buttonContainer}>
          <Button onPress={Actions.onProgress} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Icon style={localStyles.buttonIcon} name="file-text" />
              <Text style={localStyles.buttonText}> {i18n.it} </Text>
            </View>
          </Button>
        </View>
        <View style={localStyles.buttonContainer}>
          <Button onPress={Actions.onProgress} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Icon style={localStyles.buttonIcon} name="file-text" />
              <Text style={localStyles.buttonText}> {i18n.legal} </Text>
            </View>
          </Button>
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
      var content = <ScrollView style={localStyles.bg}>
                      <View style={localStyles.header}>
                        <View style={localStyles.headerContent}>
                          <Text style={localStyles.nameHeader}>
                            {this.props.fullname}
                          </Text>
                        </View>
                      </View>
                      <View style={{padding: getCorrectShapeSizeForScreen(8)}}>
                        <SurveyStatisticCard/>
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
                        <View style={localStyles.separator}>
                        </View>
                        <View style={localStyles.menuRow}>
                          <Text style={localStyles.text1}>Job Listing </Text>
                          <Switch
                          onValueChange={(value) =>this.setState({falseSwitchIsOn: value})}
                          value={this.state.falseSwitchIsOn} />
                        </View>
                        <View style={localStyles.separator}>
                        </View>
                        {this.state.falseSwitchIsOn ? this._getMenuCategory1() : this._getMenuCategory1().hide}
                        {this.state.falseSwitchIsOn ? this._getMenuCategory2() : this._getMenuCategory2().hide}
                      </View>
                    </ScrollView>
      return content;
  }
}

const localStyles = StyleSheet.create({
  bg: {
    backgroundColor: '#e5e5e5',
    flex: 1,
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
    backgroundColor: 'white',
    alignItems: 'center',
    width: (width/3)-getCorrectShapeSizeForScreen(10),
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
    fontSize: getCorrectFontSizeForScreen(12),
  },
  header:{
    backgroundColor: '#0f75bcff',
    flex: 1,
    flexDirection: 'row',
    padding: getCorrectShapeSizeForScreen(20),
    height: height/5,
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


{/*<Button onPress={Actions.task} text={i18n.taskList}/>
<Button onPress={Actions.approvalList} text={i18n.approvalList}/>
<Button onPress={Actions.setting} text={i18n.setting}/>
<Button onPress={Actions.map} text={i18n.map}/>
<Button onPress={Actions.camera} text={i18n.camera}/>
<Button onPress={Actions.logout} text={i18n.logout}/>*/}
