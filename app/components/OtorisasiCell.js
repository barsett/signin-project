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
import { Actions } from 'react-native-router-flux';

import { runApproveAuthorization } from '../actions/ApprovalAction';
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDateTime, formatData, formatDate, width, height} from '../api/Common'
import i18n from '../i18n.js';
import SurveyStatus from './SurveyStatus';
import PhoneNumber from './PhoneNumber';
//import Spinner from './Spinner.js';
import { MKButton, MKSpinner } from 'react-native-material-kit';


const {height:h, width:w} = Dimensions.get('window');

class OtorisasiCell extends React.Component {


  _approveAuthorization = () => {
    console.log("Approve authorization");
    //this.props.runApproveAuthorization(this.props.task);
    Actions.detailOtorisasi({data: this.props.task});
  }




  _getButtonIcon(){
    if (this.props.task.mark) {
      return <MKSpinner style={styles.spinner} spinnerAniDuration={500} strokeColor="white"/>;
      //return <Spinner color="white"/>;
    } else {
      return (
        <View  style={{justifyContent: 'center'}}>
          <Icon
            name="medkit"
            style={styles.iconButton}/>
          <Text style={styles.buttonText}>
            {i18n.otorisasiAction}
          </Text>
        </View>
      );
    }
  }


  render() {
    //To Do:
    //Check tenggatResponse - curTime < 30 minutes, then show different cell bgColor
    const bpjsFlag = (this.props.task.survey.tipeId === "BPJSK") ? "BPJS" : "RS";
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
              <Icon name="calendar" style={styles.icon}/>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.detail}>
                {formatDateTime(this.props.task.survey.tanggalKejadian)}
              </Text>
            </View>
          </View>

          <View style={styles.itemLineContainer}>
            <View style={styles.taskDetail}>
              <Icon name="location-arrow" style={styles.icon}/>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.detail}>
                {formatData(this.props.task.survey.alamat)}
              </Text>
            </View>
          </View>

          <View style={styles.itemLineContainer}>
            <View style={styles.taskDetail}>
              <Icon name="plus-square" style={styles.icon}/>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.detail}>
                {formatData(this.props.task.survey.namaRs)}
              </Text>
            </View>
          </View>

          <View style={styles.itemLineContainer}>
            <View style={styles.taskDetail}>
              <Icon name="bed" style={styles.icon}/>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.detail}>
                {formatData(this.props.task.survey.ruangan)}
              </Text>
            </View>
            <View style={styles.taskDetail}>
              <Icon name="user-md" style={styles.icon}/>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.detail}>
                {formatData(this.props.task.survey.dokterBerwenang)}
              </Text>
            </View>
          </View>

          <View style={styles.itemLineContainer}>
            <View style={styles.taskDetail}>
              <Icon name="pencil-square-o" style={styles.icon}/>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.detail}>
                {formatData(this.props.task.survey.namaSurveyor)}
              </Text>
            </View>
          </View>

          <View style={styles.itemLineContainer}>
            <View style={styles.taskDetail}>
              <Icon name="phone" style={styles.icon}/>
            </View>
            <View style={styles.textContainer}>
              <PhoneNumber style={styles.phone} number={formatData(this.props.task.survey.noTelpSurveyor)}/>
            </View>
          </View>

          <View style={styles.itemLineContainer}>
            <View style={styles.taskDetail}>
              <Icon name="clock-o" style={styles.iconDeadline}/>
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
        {/*<SurveyStatus statusJaminan={this.props.task.survey.statusJaminan} />*/}
        <View style={styles.buttonContainer}>
          <Text style={styles.name}>{bpjsFlag}</Text>
          <MKButton
            onPress={this._approveAuthorization.bind(this)}
            //onPress={Actions.detailOtorisasi({data: this.props.task})
            style={styles.buttonSquare}
            enabled={!this.props.task.mark}
            >
            {this._getButtonIcon()}
          </MKButton>
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
    paddingBottom: getCorrectShapeSizeForScreen(2),
    bottom: getCorrectShapeSizeForScreen(8),
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
    backgroundColor: 'white',
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
  phone: {
    color: '#464646',
    fontSize: getCorrectFontSizeForScreen(13),
    fontFamily: 'Roboto',
    textDecorationLine: 'underline',
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
    backgroundColor: '#66ae1e',
    padding: 5,
    marginRight: 5,
    borderColor: '#66ae1e',
    borderWidth:0,
    borderBottomColor: '#66ae1e',
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
    runApproveAuthorization,
  }, dispatch);

};


export default connect(null, mapDispatchToProps)(OtorisasiCell);
