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
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDateTime, formatData, formatDate, width, height} from '../api/Common'
import i18n from '../i18n.js';


export default class LakaCell extends React.Component {

  _formatDate = (dateString) => {
    var dateArr = dateString.split("T");
    dateArr = dateArr[0].split("-");
    var date = new Date(dateArr[0].toString(), dateArr[1].toString(), dateArr[2].toString()).getTime();
    date = formatDate(date);
    return date;
  }

  render() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    //To Do:
    //Check tenggatResponse - curTime < 30 minutes, then show different cell bgColor
    //console.log('### SEARCH RESULT ###');
    //console.log(this.props);
    return (
      <TouchableElement
        style={{flex:1, flexDirection: 'column',}}
        onPress={() => this.props.onSelect()}
        onShowUnderlay={this.props.onHighlight}
        onHideUnderlay={this.props.onUnhighlight}>
        <View style={styles.row}>
          <View style={styles.itemContainer}>
            <View style={styles.taskTitle}>
              <Text style={styles.name}>
                {this.props.data.kecelakaan.namaKorban}
              </Text>
            </View>
            <View style={styles.itemLineContainer}>
              <View style={styles.taskDetail}>
                <Icon name="calendar" style={styles.icon} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.detail}>
                  {formatDate(this.props.data.kecelakaan.tglKejadian)}
                </Text>
              </View>
            </View>
            <View style={styles.itemLineContainer}>
              <View style={styles.taskDetail}>
                <Icon name="calendar-check-o" style={styles.icon} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.detail}>
                  {formatDate(this.props.data.kecelakaan.tglLaporanPolisi)}
                </Text>
              </View>
            </View>
            <View style={styles.itemLineContainer}>
              <View style={styles.taskDetail}>
                <Icon name="institution" style={styles.icon} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.detail}>
                  {this.props.data.kecelakaan.instansi}
                </Text>
              </View>
            </View>
            <View style={styles.itemLineContainer}>
              <View style={styles.taskDetail}>
                <Icon name="file-text-o" style={styles.icon} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.detail}>
                  {this.props.data.kecelakaan.noBerkas}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={styles.detailSquare}>
                <Icon name="file-text-o" style={styles.iconButton}/>
                <Text style={styles.statusText}>Detail</Text>
            </View>
          </View>
        </View>
      </TouchableElement>
    );

    /*
    */
  }
}

const styles = StyleSheet.create({
  searchScreen: {
    padding: 10,
    margin: 10,
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1
  },
  searchField: {
    flex:1,
    flexDirection:'row'
  },
  text: {
    color:'black',
    fontSize:getCorrectFontSizeForScreen(10)
  },
  searchButton: {
    justifyContent:'center',
    alignItems:'center'
  },
  buttonContainer: {
    backgroundColor: '#24abe2',
    width: getCorrectShapeSizeForScreen(50),
    height: getCorrectShapeSizeForScreen(50),
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: getCorrectFontSizeForScreen(10),
    fontFamily: 'Roboto-Medium',
  },
  spinner: {
    alignSelf: 'center',
  },
  buttonRounded: {
    backgroundColor: '#24abe2',
    alignItems: 'center',
    justifyContent: 'center',
    width: 420,
    height: 50,
    borderRadius: 0,
  },

  row: {
    flexDirection: 'row',
    backgroundColor: '#e5e5e5',
    alignSelf: 'center',
    width: width,
    paddingBottom: getCorrectShapeSizeForScreen(2),
  },
  itemContainer: {
    flex: 2,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
    paddingLeft: getCorrectShapeSizeForScreen(20),
    paddingBottom: getCorrectShapeSizeForScreen(10),
    paddingTop: getCorrectShapeSizeForScreen(10),

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
    flexDirection: 'column',
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
  deadline: {
    color: 'red',
    fontSize: getCorrectFontSizeForScreen(12),
    fontWeight: '500',
  },
  icon: {
    color: '#464646',
    fontSize: getCorrectFontSizeForScreen(10),
    justifyContent: 'center',
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingRight: getCorrectShapeSizeForScreen(22),
  },
  iconButton: {
    color: 'white',
    fontSize: getCorrectFontSizeForScreen(21),
    textAlign: 'center',
    marginBottom: -3,
  },
  statusText: {
    color: '#fff',
    alignItems: 'center',
    marginTop: getCorrectShapeSizeForScreen(3),
    fontSize: getCorrectFontSizeForScreen(10),
    fontFamily: 'Roboto',
  },

  detailSquare: {
    backgroundColor: '#24abe2',
    alignSelf: 'flex-end',
    alignItems: 'center',
    width: getCorrectShapeSizeForScreen(55),
    height: getCorrectShapeSizeForScreen(55),
    justifyContent: 'center',
    flexDirection: 'column'
  },
});
