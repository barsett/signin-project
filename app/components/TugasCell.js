'use strict';

/*
This component is used to show survey information. This will be part of row component in a List
if the list row have action when press then this component must be wrapped in TouchableHighlight
if the list have actionable button then renderRow should contain this component and button component
*/
import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  Dimensions,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';

//import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { runClaimMyTask } from '../actions/TaskUpdateAction';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDateTime, formatDate, formatData, width, height} from '../api/Common'
import i18n from '../i18n.js';
//import Spinner from './Spinner.js';
import { MKButton, MKSpinner } from 'react-native-material-kit';


const {height:h, width:w} = Dimensions.get('window');

class TugasCell extends React.Component {

  _acceptTask = () => {
    console.log("Accepting Task", this.props.task.survey.kodeSurvey);
    this.props.runClaimMyTask(this.props.task);
  }



  _getButtonIcon(){
    if (this.props.task.mark) {
      return <MKSpinner style={styles.spinner} spinnerAniDuration={500} strokeColor="white"/>;
      //return <Spinner color="white"/>;
    } else {
      return (
        <View  style={{justifyContent: 'center'}}>
          <Icon
            name="angle-double-right"
            style={styles.iconButton}/>
          <Text style={styles.buttonText}>
            {i18n.visitAction}
          </Text>
        </View>
      );
    }
  }


  render() {
    //To Do:
    //Check tenggatResponse - curTime < 30 minutes, then show different cell bgColor
    const bpjsFlag = (this.props.task.survey.tipeId === "BPJSK") ? "BPJS" : "RS";
    //console.log(this.props.task.survey.tipeId);

    return (
      <View style={styles.row}>
        <View style={styles.itemContainer}>
          <View style={styles.taskTitle}>
            <Text style={styles.name}>
              {this.props.task.survey.namaKorban}
            </Text>
          </View>
          <View style={styles.itemLineContainer}>
            <View style={styles.taskDetail}>
              <Icon name="phone" style={styles.icon} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.detail}>
                {formatData(this.props.task.survey.noTelp)}
              </Text>
            </View>
            <View style={styles.taskDetail}>
              <Icon name="calendar" style={styles.icon} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.detail}>
                {formatDate(new Date(this.props.task.survey.tanggalKejadian))}
              </Text>
            </View>
          </View>
          <View style={styles.itemLineContainer}>
            <View style={styles.taskDetail}>
              <Icon name="plus-square" style={styles.icon} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.detail}>
                {this.props.task.survey.namaRs}
              </Text>
            </View>
          </View>
          <View style={styles.itemLineContainer}>
            <View style={styles.taskDetail}>
              <Icon name="bed" style={styles.icon} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.detail}>
                {formatData(this.props.task.survey.ruangan)}
              </Text>
            </View>
          </View>
          <View style={styles.itemLineContainer}>
            <View style={styles.taskDetail}>
              <Icon name="clock-o" style={styles.iconDeadline} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.detailDeadline2}>
                Deadline
              </Text>
              <Text style={styles.detailDeadline1}>
                {formatDateTime(this.props.task.survey.tenggatResponse)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.name}>{bpjsFlag}</Text>
          <MKButton
            onPress={this._acceptTask.bind(this)}
            style={styles.buttonSquare}
            enabled={!this.props.task.mark}
            >
            {this._getButtonIcon()}
          </MKButton>
          {/*<Button
            onPress={this._acceptTask.bind(this)}
            containerStyle={styles.buttonSquare}
            disabled={this.props.task.mark}
            styleDisabled={styles.disabled} >
            {this._getButtonIcon()}
          </Button>*/}
        </View>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingLeft: getCorrectShapeSizeForScreen(8),
    paddingRight: getCorrectShapeSizeForScreen(8),
    backgroundColor: '#e5e5e5',
    alignSelf: 'center',
    width: width,
  },
  itemContainer: {
    flex: 2,
    flexDirection: 'column',
    backgroundColor: 'white',
    alignSelf: 'stretch',
    padding: getCorrectShapeSizeForScreen(8),
  },
  action: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    width: 100,
    padding: 0,
  },
  taskTitle: {
    alignItems: 'flex-start',
    marginLeft: getCorrectShapeSizeForScreen(7),
  },
  itemLineContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginLeft: getCorrectShapeSizeForScreen(3),
    marginBottom: getCorrectShapeSizeForScreen(2),
  },
  taskDetail: {
    width: getCorrectFontSizeForScreen(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  name: {
    color: '#464646',
    fontSize: getCorrectFontSizeForScreen(15),
    fontFamily: 'Roboto-Medium',
    marginBottom: getCorrectShapeSizeForScreen(4),
  },
  detail: {
    color: '#464646',
    fontSize: getCorrectFontSizeForScreen(11),
    fontFamily: 'Roboto',
  },
  detailDeadline1: {
    color: '#bf0000',
    fontSize: getCorrectFontSizeForScreen(11),
    fontFamily: 'Roboto-Medium',
  },
  detailDeadline2: {
    color: '#bf0000',
    fontSize: getCorrectFontSizeForScreen(11),
    fontFamily: 'Roboto-Light',
    marginRight: getCorrectShapeSizeForScreen(5),
  },
  icon: {
    color: '#464646',
    fontSize: getCorrectFontSizeForScreen(10),
    justifyContent: 'center',
  },
  iconDeadline: {
    color: '#bf0000',
    fontSize: getCorrectFontSizeForScreen(10),
    justifyContent: 'center',
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    color: 'white',
    fontSize: getCorrectFontSizeForScreen(22),
    textAlign: 'center',
    marginBottom: -2,
  },
  buttonContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingRight: getCorrectShapeSizeForScreen(8),
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: getCorrectFontSizeForScreen(10),
    fontFamily: 'Roboto',
  },

  disabled: {
    backgroundColor: 'black',
    padding: 10,
    marginRight: 10,
    alignSelf: 'flex-end',
    width: getCorrectShapeSizeForScreen(60),
    height: getCorrectShapeSizeForScreen(60),
    justifyContent: 'center',
  },


  buttonSquare: {
    backgroundColor: '#24abe2',
    padding: 5,
    marginRight: 5,
    alignSelf: 'flex-end',
    width: getCorrectShapeSizeForScreen(55),
    height: getCorrectShapeSizeForScreen(55),
    justifyContent: 'center',
  },

  spinner: {
    alignSelf: 'center',

  }

});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    runClaimMyTask,
  }, dispatch);

};


export default connect(null, mapDispatchToProps)(TugasCell);
