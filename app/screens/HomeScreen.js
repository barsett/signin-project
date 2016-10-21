/* @flow */
'use strict'
import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    View,
    StyleSheet
} from  'react-native';


var Icon = require('react-native-vector-icons/FontAwesome');
import { connect } from 'react-redux';
import Button from 'react-native-button';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';

import styles from '../styles/style';
import i18n from '../i18n.js';
import { updateReferenceData } from '../actions/ReferenceAction';
import { getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, height, width } from '../api/Common.js';
import SurveyStatisticCard from '../components/SurveyStatisticCard';


class HomeScreen extends React.Component {

  componentDidMount(){
    console.log("Updating Reference Data");
    this.props.updateReferenceData();
  }

  _getMenuSurveyor(){
      return (
        <View style={localStyles.buttonContainer}>
          <Button onPress={Actions.task} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Icon style={localStyles.buttonIcon} name="list-alt" />
              <Text style={localStyles.buttonText}>{ i18n.taskList }</Text>
            </View>
          </Button>
        </View>
      );
  }

  _getMenuOtorisasi(){
      return (
        <View style={localStyles.buttonContainer}>
          <Button onPress={Actions.approvalList} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Icon style={localStyles.buttonIcon} name="medkit" />
              <Text style={localStyles.buttonText}> {i18n.approvalList} </Text>
            </View>
          </Button>
        </View>
      );
  }

  _getSurveyStatus(){
    return (
      <View style={localStyles.buttonContainer}>
        <Button onPress={Actions.statusSurveyor} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
          <View style={{flexDirection: 'column', flex: 1}}>
            <Icon style={localStyles.buttonIcon} name="user" />
            <Text style={localStyles.buttonText}> {i18n.statusSurveyor} </Text>
          </View>
        </Button>
      </View>
    );
  }

  _getMenuStatus(){
    if ( this.props.roles==="OTORISATOR" ){
      return this._getSurveyStatus();
    } else {
      return ;
    }
  }

  _getMenu(){
    if ( this.props.roles==="OTORISATOR" ){
      return this._getMenuOtorisasi();
    } else {
      return this._getMenuSurveyor();
    }
  }

  render() {

      var content = <ScrollView style={localStyles.bg}>
                      <View style={localStyles.header}>
                        <View style={localStyles.headerContent}>
                          <Text style={localStyles.nameHeader}>
                            {this.props.fullname}
                          </Text>
                          <Text style={localStyles.descHeader}>
                            {this.props.roles}
                          </Text>
                          <Text style={localStyles.descHeader}>
                            {this.props.namaKantor}
                          </Text>
                        </View>
                      </View>
                      <View style={{padding: getCorrectShapeSizeForScreen(8)}}>
                        <SurveyStatisticCard/>
                        <View style={localStyles.menuRow}>
                          {this._getMenu()}
                          <View style={localStyles.buttonContainer}>
                            <Button onPress={Actions.lakaSearch} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
                              <View style={{flexDirection: 'column', flex: 1}}>
                                <Icon style={localStyles.buttonIcon} name="file-text-o" />
                                <Text style={localStyles.buttonText}> {i18n.lakaSearch} </Text>
                              </View>
                            </Button>
                          </View>
                          <View style={localStyles.buttonContainer}>
                            <Button onPress={Actions.santunanSearch} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
                              <View style={{flexDirection: 'column', flex: 1}}>
                                <Icon style={localStyles.buttonIcon} name="file-text" />
                                <Text style={localStyles.buttonText}> {i18n.santunanSearch} </Text>
                              </View>
                            </Button>
                          </View>

                        </View>
                        <View style={localStyles.menuRow}>
                          {this._getMenuStatus()}
                          <View style={localStyles.buttonContainer}>
                            <Button onPress={Actions.setting} style={localStyles.buttonText} containerStyle={localStyles.buttonItemMain}>
                              <View style={{flexDirection: 'column', flex: 1}}>
                                <Icon style={localStyles.buttonIcon} name="gear" />
                                <Text style={localStyles.buttonText}> {i18n.setting} </Text>
                              </View>
                            </Button>
                          </View>
                        </View>
                      </View>

                      {/* requested to be removed by JR 12/7/201  6
                        <View style={localStyles.buttonContainer}>
                        <Button onPress={() => Actions.splash({logout: true})} style={localStyles.buttonLogoutText} containerStyle={localStyles.buttonLogout}>
                          <Icon style={localStyles.buttonLogoutIcon} name="power-off" />
                          <Text style={localStyles.buttonLogoutText}> {i18n.logout} </Text>
                        </Button>
                      </View>*/}


                    </ScrollView>

      return content;

      /*
      return (
	     	<View style={styles.bg}>
	     		<Text style={localStyles.welcome}>
	     			Hey There! Welcome, {this.props.roles}
	 			  </Text>
          <Button onPress={Actions.home} style={styles.buttonText} containerStyle={styles.buttonRounded}> {i18n.home} </Button>
          <Button onPress={Actions.task} style={styles.buttonText} containerStyle={styles.buttonRounded}> {i18n.taskList} </Button>
          <Button onPress={Actions.approvalList} style={styles.buttonText} containerStyle={styles.buttonRounded}> {i18n.approvalList} </Button>
          // Add Button for Status Surveyor in Beranda
          <Button onPress={Actions.statusSurveyor} style={styles.buttonText} containerStyle={styles.buttonRounded}> {i18n.statusSurveyor} </Button>
          <Button onPress={Actions.setting} style={styles.buttonText} containerStyle={styles.buttonRounded}> {i18n.setting} </Button>
          <Button onPress={Actions.lakaSearch} style={styles.buttonText} containerStyle={styles.buttonRounded}> {i18n.lakaSearch} </Button>
          <Button onPress={Actions.camera} style={styles.buttonText} containerStyle={styles.buttonRounded}> {i18n.camera} </Button>
          <Button onPress={Actions.logout} style={styles.buttonText} containerStyle={styles.buttonRounded}> {i18n.logout} </Button>
	      </View>
	    );
      */
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
    color: '#24abe2',
    fontSize: getCorrectFontSizeForScreen(40),
    alignSelf: 'center',
    marginBottom: getCorrectFontSizeForScreen(5),
  },
  buttonText: {
    color: '#464646',
    fontFamily: 'Roboto',
    fontSize: getCorrectFontSizeForScreen(12),
  },
  header:{
    backgroundColor: '#0087cd',
    flex: 1,
    flexDirection: 'row',
    padding: getCorrectShapeSizeForScreen(20),
    height: height/3.45,
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
