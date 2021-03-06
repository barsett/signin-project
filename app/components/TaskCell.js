'use strict';

import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import type { StyleObj } from 'StyleSheetTypes';
import { getImageSource, getStyleFromScore, getTextFromScore } from '../api/Common';

export default class TaskCell extends Component{
  render() {
    //console.log("render TaskCell", this.props.task.survey.surveyId);
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }

    return (
      <View style={styles.card}>
        <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.row}>
            <View>
              <Icon style={styles.icon} name="user" size={30} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.taskTitle} numberOfLines={2}>
                {this.props.task.survey.victimName}
              </Text>
              <Text style={styles.taskYear} numberOfLines={1}>
                Kode Tugas: {this.props.task.survey.surveyId}
              </Text>
              <Text style={styles.taskYear} numberOfLines={1}>
                Rumah Sakit: {this.props.task.survey.hospital.hospitalName}
              </Text>
            </View>
          </View>
        </TouchableElement>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  taskTitle: {
    color: '#3B3738',
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  taskYear: {
    color: '#3B3738',
    fontSize: 12,
  },
  hospital: {
    color: '#F2EC3A',
    fontSize: 12,
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
  },
  cellImage: {
    backgroundColor: '#dddddd',
    height: 93,
    marginRight: 10,
    width: 60,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: StyleSheet.hairlineWidth,
    marginLeft: 4,
  },
  noScore: {
    color: '#999999',
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    height: 75,
    padding: 5,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  icon: {
    color: '#3B3738',
    textAlign: 'center',
    marginRight: 10,
    width: 30,
  },

});
