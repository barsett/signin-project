'use strict';


import React, { PropTypes, Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableHighlight,
    StyleSheet,
    Image,
    Alert,
} from 'react-native';

var Icon = require('react-native-vector-icons/FontAwesome');
var Actions = require('react-native-router-flux').Actions;
var curDate = new Date();
var styles = require('../styles/style');
import i18n from '../i18n.js';

import { connect } from 'react-redux';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDate, height, width } from '../api/Common.js';


class ControlPanel extends React.Component{

    constructor(props, context){
      super(props);
      this._selectMenu = this._selectMenu.bind(this);
      context.drawer;
    }

    _selectMenu(selectedAction){
      //console.log(this.context);
      var {drawer} = this.context;
      // route to page
      //this.props.close();
      selectedAction();
      drawer.close();
      // close drawer
    }

    _getSurveyorMenu(){
        return (
          <TouchableHighlight
                style={localStyles.menu}
                underlayColor="#e5e5e5"
                onPress={() => this._selectMenu(Actions.task)}>
                <View style={localStyles.row}>
                  <Icon style={localStyles.icon} name="list-alt"/>
                  <Text style={localStyles.text}> {i18n.taskList} </Text>
                </View>
          </TouchableHighlight>
        );
    }

    _getOtorisatorMenu(){
        return (
          <View>
            <TouchableHighlight
                style={localStyles.menu}
                underlayColor="#e5e5e5"
                onPress={() => this._selectMenu(Actions.approvalList)}>
                <View style={localStyles.row}>
                  <Icon style={localStyles.icon} name="check"/>
                  <Text style={localStyles.text}> {i18n.approvalList} </Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight
                style={localStyles.menu}
                underlayColor="#e5e5e5"
                onPress={() => this._selectMenu(Actions.statusSurveyor)}>
                <View style={localStyles.row}>
                  <Icon style={localStyles.icon} name="user"/>
                  <Text style={localStyles.text}> {i18n.statusSurveyor} </Text>
                </View>
            </TouchableHighlight>
          </View>
        );

    }

    _getCommonMenu(){
      return (
        <View>
          <TouchableHighlight
              style={localStyles.menu}
              underlayColor="#e5e5e5"
              onPress={() => this._selectMenu(Actions.lakaSearch)}>
              <View style={localStyles.row}>
                <Icon style={localStyles.icon} name="file-text-o"/>
                <Text style={localStyles.text}> {i18n.lakaSearch} </Text>
              </View>
          </TouchableHighlight>
          <TouchableHighlight
              style={localStyles.menu}
              underlayColor="#e5e5e5"
              onPress={() => this._selectMenu(Actions.santunanSearch)}>
              <View style={localStyles.row}>
                <Icon style={localStyles.icon} name="file-text"/>
                <Text style={localStyles.text}> {i18n.santunanSearch} </Text>
              </View>
          </TouchableHighlight>
          <TouchableHighlight
              style={localStyles.menu}
              underlayColor="#e5e5e5"
              onPress={() => this._selectMenu(Actions.setting)}>
              <View style={localStyles.row}>
                <Icon style={localStyles.icon} name="gear"/>
                <Text style={localStyles.text}> {i18n.setting} </Text>
              </View>
          </TouchableHighlight>
          <TouchableHighlight
              style={localStyles.menu}
              underlayColor="#e5e5e5"
              onPress={() => this._logout()}>
              <View style={localStyles.row}>
                <Icon style={localStyles.icon} name="power-off"/>
                <Text style={localStyles.text}> {i18n.logout} </Text>
              </View>
         </TouchableHighlight>
        </View>
      );
    }

    _getUserMenu(){
      if (this.props.currentRole === "OTORISATOR"){
        return this._getOtorisatorMenu();
      } else {
        return this._getSurveyorMenu();
      }
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

    render(){
        return (
          <ScrollView contentContainerStyle={localStyles.contentContainer}>
            <View style={localStyles.container}>
              <View style={localStyles.header}>
                    <Image source={require('../img/header.png')}
                        style={localStyles.bgImage}>
                        <View style={localStyles.upInsideImg}>
                          <Text style={localStyles.dateText}>{formatDate(curDate)}</Text>
                        </View>
                        <View style={localStyles.downInsideImg}>
                          {/* requested by JR on 19 Juli 2016
                            <View style={localStyles.borderUser}>
                              <Icon style={localStyles.iconImg} name="user" />
                            </View>*/}
                          <View style={localStyles.headerTextWrap}>
                              <Text style={localStyles.headerText} >{this.props.currentUser}</Text>
                              <Text style={localStyles.headerTextChild} >{this.props.currentKantor}</Text>
                          </View>
                        </View>
                </Image>
              </View>
              <View style={localStyles.menuList}>
                <TouchableHighlight
                      style={localStyles.menu}
                      underlayColor="#e5e5e5"
                      onPress={() => this._selectMenu(Actions.home)}>
                      <View style={localStyles.row}>
                        <Icon style={localStyles.icon} name="home"/>
                        <Text style={localStyles.text}> {i18n.home} </Text>
                      </View>
                </TouchableHighlight>
                {this._getUserMenu()}
                {this._getCommonMenu()}
              </View>
            </View>
          </ScrollView>
        )
    }
}

ControlPanel.contextTypes = {
   drawer: React.PropTypes.object.isRequired,
};



const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'stretch',
  },
  contentContainer: {
    padding: 0,
  },
  bgImage: {
    flex: 1,
    width: null,
    //height: getCorrectShapeSizeForScreen(240),
    flexDirection: 'column',
  },
  upInsideImg: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: getCorrectShapeSizeForScreen(15),
    marginLeft: getCorrectShapeSizeForScreen(15),
  },
  downInsideImg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: getCorrectShapeSizeForScreen(15),
    marginLeft: getCorrectShapeSizeForScreen(15),
  },
  borderUser: {
    marginTop: getCorrectShapeSizeForScreen(4),
    width: getCorrectShapeSizeForScreen(30),
    height: getCorrectShapeSizeForScreen(30),
    borderRadius: getCorrectShapeSizeForScreen(30)/2,
    backgroundColor: 'white',
    marginRight: getCorrectShapeSizeForScreen(15),
  },
  header: {
    backgroundColor: '#0087cd',
    height: height/2.82,
  },
  headerTextWrap: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: getCorrectFontSizeForScreen(18),
    color: '#ffffff',
    fontFamily: 'Roboto-Medium'
  },
  headerTextChild: {
    fontSize: getCorrectFontSizeForScreen(10),
    color: '#ffffff',
    fontFamily: 'Roboto-Light'
  },
  dateText: {
    fontFamily: 'Roboto',
    color: '#ffffff',
    fontSize: getCorrectFontSizeForScreen(12),
  },
  menuList: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 20,
  },
  menu: {
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  },
  separator: {
    height: 2,
    backgroundColor: '#0f0f0f',
  },
  icon: {
    color: '#999999',
    textAlign: 'center',
    fontSize: getCorrectFontSizeForScreen(16),
    marginLeft: 10,
    marginRight: 20,
    width: 30,
  },
    iconImg: {
      backgroundColor: 'transparent',
      color: '#999999',
      textAlign: 'center',
      fontSize: getCorrectFontSizeForScreen(28),
      marginTop: getCorrectShapeSizeForScreen(2),
    },
  text: {
    flex: 1,
    fontSize:  getCorrectFontSizeForScreen(14),
    color: '#464646',
    fontFamily: 'Roboto',
  },
});


const mapStateToProps = (state) => {
  //console.log("Mapping Page Title", state.get('currentRoute').pageTitle);

  return {
    // ROUTE IS NOT IMMUTABLE
    pageTitle: state.get('currentRoute').pageTitle,
    pageId: state.get('currentRoute').pageId,
    stackSize: state.get('currentRoute').stackSize,
    currentUser: state.getIn(['currentUser','username']),
    currentRole: state.getIn(['currentUser','roles']),
    currentKantor: state.getIn(['currentUser', 'namaKantor']),
  };

};

const mapDispatchToProps = (dispatch) => {
  return {
  };

};

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
