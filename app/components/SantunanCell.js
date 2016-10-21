'use strict';

/*
This component is used to show Sanutnan List. This will be part of row component in a List
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
import {getCorrectFontSizeForScreen, getCorrectShapeSizeForScreen, formatDateTime, formatData, formatDate, width, height} from '../api/Common';
import i18n from '../i18n.js';

export default class SantunanCell extends React.Component {

  render() {
    //console.log(this.props);
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    //To Do:
    //Check tenggatResponse - curTime < 30 minutes, then show different cell bgColor

    return (
        <TouchableElement
          style={{flex:1, flexDirection: 'column'}}
          onPress={() => this.props.onSelect()}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.row}>
            <View style={styles.itemContainer}>
              <View style={styles.taskTitle}>
                <Text style={styles.name}>
                  {this.props.data.santunan.namaKorban}
                </Text>
              </View>
                <View style={styles.itemLineContainer}>
                  <View style={styles.taskDetail}>
                    <Icon name="calendar-plus-o" style={styles.icon} />
                    </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.detail}>
                      {formatDate(this.props.data.santunan.tglPengajuan)}
                    </Text>
                  </View>
              </View>
              <View style={styles.itemLineContainer}>
                <View style={styles.taskDetail}>
                  <Icon name="calendar" style={styles.icon} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.detail}>
                    {formatDate(this.props.data.santunan.tglKejadian)}
                  </Text>
                </View>
              </View>
              <View style={styles.itemLineContainerLP}>
                <View style={styles.taskDetailLP}>
                  <Icon name="file-text" style={styles.icon} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.detail}>
                    {this.props.data.santunan.noLaporanPolisi}
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

  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#e5e5e5',
    alignSelf: 'center',
    width: width,
    paddingBottom: getCorrectShapeSizeForScreen(2),
  },
  itemContainer: {
    flex: 2.4,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
    paddingLeft: getCorrectShapeSizeForScreen(15),
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
    //flex: 1,
    marginLeft: getCorrectShapeSizeForScreen(3),
    marginBottom: getCorrectShapeSizeForScreen(2),
  },
  itemLineContainerLP: {
    flexDirection: 'row',
    flex: 2,
    marginLeft: getCorrectShapeSizeForScreen(3),
    marginBottom: getCorrectShapeSizeForScreen(2),
  },
  taskDetail: {
    width: getCorrectFontSizeForScreen(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskDetailLP: {
    width: getCorrectFontSizeForScreen(30),
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: getCorrectShapeSizeForScreen(2),
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
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
    flex: 0.6,
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
