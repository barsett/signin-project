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
  TouchableHighlight,
  TouchableNativeFeedback,
  Text,
  View
} from 'react-native';

import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { width, getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDateTime, formatData, formatDate } from '../api/Common.js';

import i18n from '../i18n.js';
import SurveyStatus from './SurveyStatus';
import SurveySyncStatus from './SurveySyncStatus';

export default class KunjunganCell extends React.Component {
  render() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    //To Do:
    //Check tenggatResponse - curTime < 30 minutes, then show different cell bgColor
    const bpjsFlag = (this.props.task.survey.tipeId === "BPJSK") ? "BPJS" : "RS";

    return (
          <TouchableElement
            style={{flex:1, flexDirection: 'column',}}
            onPress={this.props.onSelect}
            onShowUnderlay={this.props.onHighlight}
            onHideUnderlay={this.props.onUnhighlight}>
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
                  <View style={styles.taskDetail}>
                    <Icon name="sign-in" style={styles.icon} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.detail}>
                      {formatDate(new Date(this.props.task.survey.tanggalMasukRs))}
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
                  <View style={styles.taskDetail}>
                    <Icon name="refresh" style={styles.icon} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.detail}>
                      {this.props.task.sync}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.name}>{bpjsFlag}</Text>
                <SurveyStatus statusJaminan={this.props.task.survey.statusJaminan}/>
              </View>
            </View>
          </TouchableElement>
    );
  }
}

const styles = StyleSheet.create({
  // container: {
  //   backgroundColor: '#e5e5e5',
  // },
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
    backgroundColor: '#ffffff',
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
});
